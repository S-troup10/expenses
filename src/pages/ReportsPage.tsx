import { useLiveQuery } from "dexie-react-hooks";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { db } from "../data/db";
import { formatCurrency } from "../lib/format";
import { getCategorySpend } from "../lib/finance";

export function ReportsPage() {
  const transactions = useLiveQuery(() => db.transactions.toArray(), []);
  const categories = useLiveQuery(() => db.categories.toArray(), []);

  const expenseByCategory =
    transactions && categories ? getCategorySpend(transactions, categories, 12) : [];
  const reportTotal = expenseByCategory.reduce((sum, category) => sum + category.total, 0);
  const reportLeader = expenseByCategory[0];

  return (
    <div className="page-grid">
      <section className="panel">
        <SectionHeader
          eyebrow="Reports"
          title="Where the money is going"
          description="This page should answer the obvious question fast: what categories are actually driving spend?"
        />
        <div className="summary-grid">
          <div className="summary-card">
            <span>Tracked category spend</span>
            <strong>{formatCurrency(reportTotal)}</strong>
          </div>
          <div className="summary-card">
            <span>Largest category</span>
            <strong>{reportLeader?.name ?? "None yet"}</strong>
          </div>
          <div className="summary-card">
            <span>Active categories</span>
            <strong>{expenseByCategory.length}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <SectionHeader
          eyebrow="Breakdown"
          title="Category leaderboard"
          description="Higher-spend categories rise to the top so the picture is immediately legible."
        />
        {expenseByCategory.length ? (
          <div className="list-stack">
            {expenseByCategory.map((category) => (
              <div className="report-row polished-row" key={category.id}>
                <div className="report-title">
                  <span className="color-dot" style={{ backgroundColor: category.color }} />
                  <strong>{category.name}</strong>
                </div>
                <strong>{formatCurrency(category.total)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No report data yet"
            description="Log a few expenses and this page will turn into a live category leaderboard."
            tips={["18 coffee", "42 groceries", "26 taxi"]}
          />
        )}
      </section>
    </div>
  );
}
