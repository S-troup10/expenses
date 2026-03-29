import { useLiveQuery } from "dexie-react-hooks";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { db } from "../data/db";
import { joinMeta } from "../lib/display";
import { formatCurrency, formatShortDate } from "../lib/format";

export function ReceiptsPage() {
  const receipts = useLiveQuery(() => db.receipts.orderBy("createdAt").reverse().toArray(), []);
  const linkedReceipts = receipts?.filter((receipt) => receipt.transactionId).length ?? 0;

  return (
    <div className="page-grid">
      <section className="panel">
        <SectionHeader
          eyebrow="Receipts"
          title="OCR-ready inbox"
          description="This is where scanned proof and merchant extraction will live once the upload flow is fully wired."
        />
        <div className="summary-grid">
          <div className="summary-card">
            <span>Total receipts</span>
            <strong>{receipts?.length ?? 0}</strong>
          </div>
          <div className="summary-card">
            <span>Linked to transactions</span>
            <strong>{linkedReceipts}</strong>
          </div>
          <div className="summary-card">
            <span>Awaiting extraction</span>
            <strong>{(receipts?.length ?? 0) - linkedReceipts}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <SectionHeader
          eyebrow="Inbox"
          title="Captured receipts"
          description="Receipts should never leave the user wondering whether something was attached or extracted."
        />
        {receipts?.length ? (
          <div className="list-stack">
            {receipts.map((receipt) => (
              <div className="list-row polished-row" key={receipt.id}>
                <div>
                  <strong>{receipt.name}</strong>
                  <span>
                    {joinMeta([
                      receipt.merchant ?? "Awaiting extraction",
                      formatShortDate(receipt.createdAt)
                    ])}
                  </span>
                </div>
                <strong>
                  {receipt.amount ? formatCurrency(receipt.amount, receipt.currency ?? "AUD") : "Pending"}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No receipts yet"
            description="Once receipt capture is used, this inbox will become the source of truth for OCR and attachment status."
            tips={["Cafe receipt", "Groceries invoice", "Hotel bill"]}
          />
        )}
      </section>
    </div>
  );
}
