import { useLiveQuery } from "dexie-react-hooks";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { db } from "../data/db";
import { joinMeta } from "../lib/display";
import { formatCurrency, formatShortDate } from "../lib/format";
import { humanizeTransactionType } from "../lib/text";
import { QuickAddBar } from "../transactions/QuickAddBar";

export function LogPage() {
  const transactions = useLiveQuery(() => db.transactions.orderBy("date").reverse().limit(8).toArray(), []);

  return (
    <div className="page-grid">
      <section className="panel log-panel">
        <SectionHeader
          eyebrow="Log"
          title="Type it and save it"
          description="This page opens straight into logging. Add the amount and what it was."
        />
        <QuickAddBar />
      </section>

      <section className="panel">
        <SectionHeader
          eyebrow="Recent saves"
          title="What you just logged"
          description="This keeps the logging page grounded so you can quickly check what went in."
        />
        {transactions?.length ? (
          <div className="list-stack">
            {transactions.map((transaction) => (
              <div className="list-row polished-row" key={transaction.id}>
                <div>
                  <strong>{transaction.merchant ?? transaction.type}</strong>
                  <span>
                    {joinMeta([
                      formatShortDate(transaction.date),
                      humanizeTransactionType(transaction.type)
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
            title="Nothing logged yet"
            description="Your first few entries will show up here so the page feels like a live inbox, not an empty form."
            tips={["18 lunch", "12 coffee", "5200 salary"]}
          />
        )}
      </section>
    </div>
  );
}
