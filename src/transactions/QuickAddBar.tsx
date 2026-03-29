import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../data/db";
import { parseQuickAdd } from "../domain/quickAdd";
import { formatCurrency } from "../lib/format";
import { getRecentMerchantSuggestions } from "../lib/finance";
import { addLedgerTransaction } from "../lib/transactions";

export function QuickAddBar() {
  const accounts = useLiveQuery(() => db.accounts.toArray(), []);
  const categories = useLiveQuery(() => db.categories.toArray(), []);
  const recentTransactions = useLiveQuery(
    () => db.transactions.orderBy("date").reverse().limit(12).toArray(),
    []
  );
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("Examples: 18 coffee, 42 groceries, 5200 salary");
  const inputRef = useRef<HTMLInputElement>(null);

  const ready = useMemo(
    () => Boolean(accounts?.length && categories?.length),
    [accounts, categories]
  );
  const parsed = useMemo(
    () =>
      ready && accounts && categories
        ? parseQuickAdd(input, accounts, categories, "AUD")
        : null,
    [accounts, categories, input, ready]
  );
  const suggestions = useMemo(
    () =>
      recentTransactions
        ? getRecentMerchantSuggestions(recentTransactions).map((item) => item.merchant!)
        : [],
    [recentTransactions]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!ready || !accounts || !categories) {
      return;
    }

    if (!parsed || !parsed.accountId) {
      setMessage("Could not understand that. Try something like 12 coffee or 5200 salary.");
      return;
    }

    await addLedgerTransaction({
      type: parsed.type,
      amount: parsed.amount,
      currency: parsed.currency,
      accountId: parsed.accountId,
      destinationAccountId: parsed.destinationAccountId,
      merchant: parsed.merchant,
      categoryId: parsed.categoryId,
      notes: parsed.notes,
      source: "quick_add",
      date: parsed.date
    });

    setInput("");
    setMessage("Saved instantly. Keep typing to log the next one.");
  }

  return (
    <div className="quick-add-card quick-add-card-full">
      <div className="quick-add-header">
        <div>
          <p className="eyebrow">Fast add</p>
          <h3>Type the amount and what it was</h3>
        </div>
        <span className="soft-pill">One-line entry</span>
      </div>
      <form className="quick-add-form" onSubmit={handleSubmit}>
        <div className="quick-add-icon">
          <Sparkles size={18} />
        </div>
        <input
          className="quick-add-input"
          ref={inputRef}
          onChange={(event) => setInput(event.target.value)}
          placeholder="18 coffee"
          value={input}
        />
        <button className="primary-button" type="submit">
          Save
        </button>
      </form>
      <div className="chip-row">
        <button className="chip-button" onClick={() => setInput("18 coffee")} type="button">
          18 coffee
        </button>
        <button className="chip-button" onClick={() => setInput("42 groceries")} type="button">
          42 groceries
        </button>
        <button className="chip-button" onClick={() => setInput("5200 salary")} type="button">
          5200 salary
        </button>
      </div>
      {parsed ? (
        <div className="preview-strip">
          <span>{parsed.type}</span>
          <span>{formatCurrency(parsed.amount, parsed.currency)}</span>
          {parsed.categoryId ? (
            <span>{categories?.find((category) => category.id === parsed.categoryId)?.name}</span>
          ) : null}
          {parsed.merchant ? <span>{parsed.merchant}</span> : null}
        </div>
      ) : null}
      {suggestions.length ? (
        <div className="suggestion-row">
          <span className="helper-label">Repeat</span>
          {suggestions.map((suggestion) => (
            <button
              className="ghost-chip"
              key={suggestion}
              onClick={() => setInput(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
      <p className="helper-text">{message}</p>
    </div>
  );
}
