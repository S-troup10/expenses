import { useLiveQuery } from "dexie-react-hooks";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { db } from "../data/db";
import { joinMeta } from "../lib/display";
import { formatCurrency, formatShortDate } from "../lib/format";
import { humanizeToken } from "../lib/text";

export function RecurringPage() {
  const recurringRules = useLiveQuery(() => db.recurringRules.orderBy("nextDueOn").toArray(), []);
  const monthlyRecurring =
    recurringRules
      ?.filter((rule) => rule.cadence === "monthly")
      .reduce((sum, rule) => sum + rule.amount, 0) ?? 0;

  return (
    <div className="page-grid">
      <section className="panel">
        <SectionHeader
          eyebrow="Recurring"
          title="Upcoming scheduled items"
          description="Recurring costs should be visible before they hit so the dashboard never feels reactive."
        />
        <div className="summary-grid">
          <div className="summary-card">
            <span>Recurring rules</span>
            <strong>{recurringRules?.length ?? 0}</strong>
          </div>
          <div className="summary-card">
            <span>Monthly recurring total</span>
            <strong>{formatCurrency(monthlyRecurring)}</strong>
          </div>
          <div className="summary-card">
            <span>Next due</span>
            <strong>
              {recurringRules?.[0] ? formatShortDate(recurringRules[0].nextDueOn) : "None"}
            </strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <SectionHeader
          eyebrow="Schedule"
          title="Upcoming flow"
          description="Each recurring item should be easy to scan and easy to trust."
        />
        {recurringRules?.length ? (
          <div className="list-stack">
            {recurringRules.map((rule) => (
              <div className="list-row polished-row" key={rule.id}>
                <div>
                  <strong>{rule.title}</strong>
                  <span>
                    {joinMeta([humanizeToken(rule.cadence), `Next ${formatShortDate(rule.nextDueOn)}`])}
                  </span>
                </div>
                <strong>{formatCurrency(rule.amount, rule.currency)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recurring items yet"
            description="Once subscriptions, rent, and other repeating items are added, they will appear here before they land."
            tips={["Rent", "Spotify", "Phone plan"]}
          />
        )}
      </section>
    </div>
  );
}
