import { useLiveQuery } from "dexie-react-hooks";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { ArrowDownRight, ArrowUpRight, ReceiptText, Wallet, Zap } from "lucide-react";
import { db } from "../data/db";
import { joinMeta } from "../lib/display";
import { formatCurrency, formatShortDate } from "../lib/format";
import {
  getBudgetOverview,
  getCategorySpend,
  getDailyExpenseSeries,
  getInsightSummary,
  getMonthExpenseTotal,
  getMonthIncomeTotal
} from "../lib/finance";

export function HomePage() {
  const transactions = useLiveQuery(() => db.transactions.orderBy("date").reverse().toArray(), []);
  const budgets = useLiveQuery(() => db.budgets.toArray(), []);
  const categories = useLiveQuery(() => db.categories.toArray(), []);

  const monthExpenses = transactions ? getMonthExpenseTotal(transactions) : 0;
  const monthIncome = transactions ? getMonthIncomeTotal(transactions) : 0;
  const totalBudget = budgets?.find((budget) => !budget.categoryId)?.amount ?? 0;
  const remaining = totalBudget - monthExpenses;
  const trend = transactions ? getDailyExpenseSeries(transactions, 8) : [];
  const topCategories =
    transactions && categories ? getCategorySpend(transactions, categories, 5) : [];
  const budgetOverview =
    transactions && budgets && categories ? getBudgetOverview(budgets, transactions, categories) : [];
  const transactionCount = transactions?.length ?? 0;
  const averageDailySpend = trend.length
    ? trend.reduce((sum, item) => sum + item.total, 0) / trend.length
    : 0;
  const insightSummary =
    transactions && budgets && categories
      ? getInsightSummary(transactions, budgets, categories)
      : "Loading your monthly picture.";
  const maxTrendValue = Math.max(...trend.map((item) => item.total), 1);
  const totalTopCategorySpend = topCategories.reduce((sum, category) => sum + category.total, 0);
  const pieStops = topCategories.length
    ? (() => {
        let running = 0;
        return topCategories
          .map((category) => {
            const start = running;
            const slice = (category.total / Math.max(totalTopCategorySpend, 1)) * 100;
            running += slice;
            return `${category.color} ${start}% ${running}%`;
          })
          .join(", ");
      })()
    : "#334155 0 100%";

  return (
    <div className="page-grid">
      <section className="hero-card hero-card-large">
        <div className="hero-copy">
          <p className="eyebrow">Live spending picture</p>
          <h2>{formatCurrency(monthExpenses)}</h2>
          <p className="muted">
            Spent this month. {formatCurrency(remaining)} left against your target of{" "}
            {formatCurrency(totalBudget)}.
          </p>
          <div className="hero-insight">
            <Zap size={18} />
            <span>{insightSummary}</span>
          </div>
        </div>
        <div className="metric-grid">
          <div className="metric-card accent-orange">
            <ArrowUpRight size={18} />
            <span>Income this month</span>
            <strong>{formatCurrency(monthIncome)}</strong>
          </div>
          <div className="metric-card accent-rose">
            <ArrowDownRight size={18} />
            <span>Daily average spend</span>
            <strong>{formatCurrency(averageDailySpend)}</strong>
          </div>
          <div className="metric-card accent-blue">
            <ReceiptText size={18} />
            <span>Items logged</span>
            <strong>{transactionCount}</strong>
          </div>
          <div className="metric-card accent-green">
            <Wallet size={18} />
            <span>Budget status</span>
            <strong>{remaining >= 0 ? "On track" : "Over target"}</strong>
          </div>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <SectionHeader
            eyebrow="Momentum"
            title="Last 8 days of spending"
            description="Short-term movement should be readable at a glance."
            aside={<span className="soft-pill">Auto-updates from local data</span>}
          />
          {trend.some((point) => point.total > 0) ? (
            <div className="mini-bar-chart">
              {trend.map((point) => (
                <div className="mini-bar-column" key={point.label}>
                  <span className="mini-bar-value">
                    {point.total > 0 ? formatCurrency(point.total) : ""}
                  </span>
                  <div
                    className="mini-bar-fill"
                    style={{ height: `${Math.max((point.total / maxTrendValue) * 100, 8)}%` }}
                  />
                  <strong>{point.label}</strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No spend trend yet"
              description="Add a few expenses and the short-term chart will start to show your weekly rhythm."
              tips={["18 lunch", "42 groceries", "12 train"]}
            />
          )}
        </section>

        <section className="panel">
          <SectionHeader
            eyebrow="Budget health"
            title="Where you are tightest"
            description="The most pressured budgets should float to the top."
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
                    <strong>{Math.round(budget.progress)}%</strong>
                  </div>
                  <div className="budget-bar">
                    <div className="budget-fill" style={{ width: `${budget.progress}%` }} />
                  </div>
                  <div className="budget-footer">
                    <span>{formatCurrency(budget.spent)} spent</span>
                    <span>{formatCurrency(budget.remaining)} left</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No budget data yet"
              description="Set a monthly target and this card turns into a live pressure gauge."
              tips={["Monthly total", "Food budget", "Travel budget"]}
            />
          )}
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <SectionHeader
            eyebrow="Top categories"
            title="Where this month is going"
            description="Higher-spend categories should never hide."
          />
          {topCategories.length ? (
            <div className="list-stack">
              {topCategories.map((category) => (
                <div className="category-row polished-row" key={category.id}>
                  <div className="report-title">
                    <span className="color-dot" style={{ backgroundColor: category.color }} />
                    <strong>{category.name}</strong>
                  </div>
                  <div className="category-value">
                    <strong>{formatCurrency(category.total)}</strong>
                    <div className="category-track">
                      <div
                        className="category-fill"
                        style={{
                          width: `${Math.max(
                            (category.total / Math.max(topCategories[0]?.total ?? 1, 1)) * 100,
                            14
                          )}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No category leaders yet"
              description="The category leaderboard appears once a few expenses have been captured."
              tips={["Coffee", "Groceries", "Transport"]}
            />
          )}
        </section>

        <section className="panel">
          <SectionHeader
            eyebrow="Spend mix"
            title="This month by category"
            description="The pie view makes the balance of your month easy to read."
          />
          {topCategories.length ? (
            <div className="pie-layout">
              <div
                aria-label="Category spending pie chart"
                className="pie-chart"
                role="img"
                style={{ background: `conic-gradient(${pieStops})` }}
              >
                <div className="pie-hole">
                  <strong>{formatCurrency(totalTopCategorySpend)}</strong>
                  <span>tracked</span>
                </div>
              </div>
              <div className="list-stack compact-list">
                {topCategories.map((category) => {
                  const share = totalTopCategorySpend
                    ? Math.round((category.total / totalTopCategorySpend) * 100)
                    : 0;

                  return (
                    <div className="report-row compact-row polished-row" key={category.id}>
                      <div className="report-title">
                        <span className="color-dot" style={{ backgroundColor: category.color }} />
                        <strong>{category.name}</strong>
                      </div>
                      <span>
                        {share}% · {formatCurrency(category.total)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No pie chart yet"
              description="As soon as the app has category spend for this month, the mix chart will appear here."
              tips={["Add a coffee", "Add groceries", "Add transport"]}
            />
          )}
        </section>

        <section className="panel">
          <SectionHeader
            eyebrow="Recent transactions"
            title="Latest activity"
            description="The feed should stay readable and never feel collapsed."
          />
          {transactions?.length ? (
            <div className="list-stack">
              {transactions.slice(0, 6).map((transaction) => (
                <div className="list-row polished-row" key={transaction.id}>
                  <div>
                    <strong>{transaction.merchant ?? transaction.type}</strong>
                    <span>
                      {joinMeta([formatShortDate(transaction.date), transaction.currencyOriginal])}
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
              title="No activity yet"
              description="This feed will fill in as soon as you start capturing transactions."
              tips={["18 lunch", "5200 salary", "42 groceries"]}
            />
          )}
        </section>
      </div>

    </div>
  );
}
