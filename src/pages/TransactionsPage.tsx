import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { db } from "../data/db";
import { parseQuickAdd } from "../domain/quickAdd";
import { joinMeta } from "../lib/display";
import { formatCurrency, formatShortDate } from "../lib/format";
import { getRecentMerchantSuggestions } from "../lib/finance";
import { humanizeTransactionType } from "../lib/text";
import { addLedgerTransaction } from "../lib/transactions";

export function TransactionsPage() {
  const transactions = useLiveQuery(() => db.transactions.orderBy("date").reverse().toArray(), []);
  const categories = useLiveQuery(() => db.categories.toArray(), []);
  const accounts = useLiveQuery(() => db.accounts.toArray(), []);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const [feedback, setFeedback] = useState("You only need amount and what it was. Everything else can be inferred.");

  const inferredDraft = useMemo(
    () =>
      amount && merchant && accounts && categories
        ? parseQuickAdd(`${amount} ${merchant}`, accounts, categories, "AUD")
        : null,
    [accounts, amount, categories, merchant]
  );
  const suggestedCategoryId = categoryId || inferredDraft?.categoryId || "";
  const recentSuggestions = transactions ? getRecentMerchantSuggestions(transactions) : [];
  const filteredTransactions = transactions?.filter((transaction) =>
    filter === "all" ? true : transaction.type === filter
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!numericAmount || !merchant.trim()) {
      setFeedback("Add an amount and a short label like lunch, salary, or uber.");
      return;
    }

    await addLedgerTransaction({
      type,
      amount: numericAmount,
      merchant,
      categoryId: type === "expense" ? suggestedCategoryId || undefined : undefined,
      source: "manual"
    });

    setAmount("");
    setMerchant("");
    setCategoryId("");
    setFeedback("Saved. The app kept the form light and inferred the rest.");
  }

  return (
    <div className="page-grid two-columns">
      <section className="panel">
        <SectionHeader
          eyebrow="Smart composer"
          title="Add a transaction without bookkeeping"
          description="Amount and what it was should usually be enough."
        />

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="segmented-control">
            {[
              { value: "expense", label: "Expense" },
              { value: "income", label: "Income" }
            ].map((item) => (
              <button
                className={type === item.value ? "segment-active" : "segment"}
                key={item.value}
                onClick={() => setType(item.value as typeof type)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="split-fields">
            <label>
              Amount
              <input
                inputMode="decimal"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="18.50"
                value={amount}
              />
            </label>

            <label>
              {type === "income" ? "What was it?" : "What was it?"}
              <input
                onChange={(event) => setMerchant(event.target.value)}
                placeholder={
                  type === "income" ? "Salary, refund, freelance" : "Lunch, coffee, uber"
                }
                value={merchant}
              />
            </label>
          </div>

          <div className="chip-row">
            {["12", "18.5", "42", "90"].map((value) => (
              <button className="chip-button" key={value} onClick={() => setAmount(value)} type="button">
                {value}
              </button>
            ))}
          </div>

          {recentSuggestions.length ? (
            <div className="suggestion-row">
              <span className="helper-label">Recent merchants</span>
              {recentSuggestions.map((suggestion) => (
                <button
                  className="ghost-chip"
                  key={suggestion.id}
                  onClick={() => {
                    setMerchant(suggestion.merchant ?? "");
                    setAmount(String(suggestion.amountOriginal));
                    setType(suggestion.type === "income" ? "income" : "expense");
                  }}
                  type="button"
                >
                  {suggestion.merchant}
                </button>
              ))}
            </div>
          ) : null}

          {suggestedCategoryId && type === "expense" ? (
            <div className="preview-strip">
              <span>{categories?.find((category) => category.id === suggestedCategoryId)?.name}</span>
            </div>
          ) : null}

          <button
            className="text-button"
            onClick={() => setShowAdvanced((current) => !current)}
            type="button"
          >
            {showAdvanced ? "Hide details" : "Show details only if needed"}
          </button>

          {showAdvanced ? (
            <div className="advanced-grid single-column-grid">
              {type === "expense" ? (
                <label>
                  Category
                  <select
                    onChange={(event) => setCategoryId(event.target.value)}
                    value={suggestedCategoryId}
                  >
                    <option value="">Auto-detect</option>
                    {categories
                      ?.filter((category) => category.kind === "expense")
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </label>
              ) : null}
            </div>
          ) : null}

          <button className="primary-button" type="submit">
            Save transaction
          </button>
          <p className="helper-text">{feedback}</p>
        </form>
      </section>

      <section className="panel">
        <SectionHeader
          eyebrow="Feed"
          title="All transactions"
          description="Use the filter chips to keep the running feed readable."
          aside={<div className="segmented-control compact-segments">
            {[
              { value: "all", label: "All" },
              { value: "expense", label: "Expenses" },
              { value: "income", label: "Income" }
            ].map((item) => (
              <button
                className={filter === item.value ? "segment-active" : "segment"}
                key={item.value}
                onClick={() => setFilter(item.value as typeof filter)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>}
        />
        {filteredTransactions?.length ? (
          <div className="list-stack">
            {filteredTransactions.map((transaction) => (
              <div className="list-row polished-row" key={transaction.id}>
                <div>
                  <strong>{transaction.merchant ?? transaction.type}</strong>
                  <span>
                    {joinMeta([
                      formatShortDate(transaction.date),
                      humanizeTransactionType(transaction.type),
                      transaction.categoryId
                        ? categories?.find((category) => category.id === transaction.categoryId)?.name
                        : undefined
                    ])}
                  </span>
                </div>
                <strong
                  className={
                    transaction.type === "income" ? "positive-amount" : "negative-amount"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amountOriginal, transaction.currencyOriginal)}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No transactions in this view"
            description="Once you save a few items, the feed will become the timeline of your money."
            tips={["18 coffee", "5200 salary", "45 taxi"]}
          />
        )}
      </section>
    </div>
  );
}
