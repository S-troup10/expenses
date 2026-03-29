import { useLiveQuery } from "dexie-react-hooks";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { db } from "../data/db";
import { formatCurrency } from "../lib/format";
import { calculateAccountBalance } from "../lib/finance";
import { humanizeToken } from "../lib/text";

export function AccountsPage() {
  const accounts = useLiveQuery(() => db.accounts.toArray(), []);
  const transactions = useLiveQuery(() => db.transactions.toArray(), []);
  const liveAccounts =
    accounts?.map((account) => ({
      ...account,
      liveBalance: calculateAccountBalance(account, transactions ?? [])
    })) ?? [];
  const totalCashPosition = liveAccounts.reduce((sum, account) => sum + account.liveBalance, 0);
  const negativeAccounts = liveAccounts.filter((account) => account.liveBalance < 0).length;

  return (
    <div className="page-grid">
      <section className="panel">
        <SectionHeader
          eyebrow="Accounts"
          title="Balances and payment rails"
          description="This is the money map behind every expense, income event, and transfer."
        />
        <div className="summary-grid">
          <div className="summary-card">
            <span>Total position</span>
            <strong>{formatCurrency(totalCashPosition)}</strong>
          </div>
          <div className="summary-card">
            <span>Live accounts</span>
            <strong>{liveAccounts.length}</strong>
          </div>
          <div className="summary-card">
            <span>Liability accounts</span>
            <strong>{negativeAccounts}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <SectionHeader
          eyebrow="Account list"
          title="Where money lives right now"
          description="Balances update from your local transaction history, so this screen should always feel current."
        />
        {liveAccounts.length ? (
          <div className="card-grid">
            {liveAccounts.map((account) => (
              <article className="account-card polished-card" key={account.id}>
                <div className="account-header">
                  <div>
                    <strong>{account.name}</strong>
                    <span>{humanizeToken(account.type)}</span>
                  </div>
                  <p>{account.currency}</p>
                </div>
                <h2>{formatCurrency(account.liveBalance, account.currency)}</h2>
                <div className="account-meta">
                  <span>Opening {formatCurrency(account.openingBalance, account.currency)}</span>
                  <span>{account.institution ?? "Manual account"}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No accounts yet"
            description="Once you add your first account, balances, transfers, and spending views will have somewhere to anchor."
            tips={["Bank account", "Cash wallet", "Travel card"]}
          />
        )}
      </section>
    </div>
  );
}
