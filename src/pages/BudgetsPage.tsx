import { useLiveQuery } from "dexie-react-hooks";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { db } from "../data/db";
import { formatCurrency } from "../lib/format";
import { getBudgetOverview } from "../lib/finance";

export function BudgetsPage() {
  const budgets = useLiveQuery(() => db.budgets.toArray(), []);
  const categories = useLiveQuery(() => db.categories.toArray(), []);
  const transactions = useLiveQuery(() => db.transactions.toArray(), []);
  const budgetOverview =
    budgets && transactions && categories ? getBudgetOverview(budgets, transactions, categories) : [];
  const totalBudget = budgetOverview.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgetOverview.reduce((sum, budget) => sum + budget.spent, 0);
  const stressedBudgets = budgetOverview.filter((budget) => budget.progress >= 80).length;

  return (
    <div className="page-grid">
      <section className="panel">
        <SectionHeader
          eyebrow="Budgets"
          title="Monthly guardrails"
          description="Budgets should feel like a calm set of rails, not like punishment."
        />
        <div className="summary-grid">
          <div className="summary-card">
            <span>Total budgeted</span>
            <strong>{formatCurrency(totalBudget)}</strong>
          </div>
          <div className="summary-card">
            <span>Total tracked</span>
            <strong>{formatCurrency(totalSpent)}</strong>
          </div>
          <div className="summary-card">
            <span>Needs attention</span>
            <strong>{stressedBudgets}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <SectionHeader
          eyebrow="Budget detail"
          title="How each budget is tracking"
          description="Anything drifting close to the edge should be obvious immediately."
        />
        {budgetOverview.length ? (
          <div className="list-stack">
            {budgetOverview.map((budget) => (
              <div className="budget-row polished-row" key={budget.id}>
                <div className="budget-headline">
                  <div>
                    <strong>{budget.name}</strong>
                    <span>{budget.categoryName}</span>
                  </div>
                  <strong>
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount, budget.currency)}
                  </strong>
                </div>
                <div className="budget-bar">
                  <div className="budget-fill" style={{ width: `${budget.progress}%` }} />
                </div>
                <div className="budget-footer">
                  <span>{formatCurrency(budget.remaining)} remaining</span>
                  <span>{Math.round(budget.progress)}% used</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No budgets yet"
            description="Once you add monthly targets, this screen will show how close each category is to the edge."
            tips={["Overall monthly budget", "Food budget", "Travel budget"]}
          />
        )}
      </section>
    </div>
  );
}
