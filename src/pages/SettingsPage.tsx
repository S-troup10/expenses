import { FormEvent, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { clearAllLocalFinanceData } from "../data/seed";
import { useAppStore } from "../store/appStore";

const PIN_DISABLED_KEY = "ledgerflow.pin.disabled";

export function SettingsPage() {
  const lock = useAppStore((state) => state.lock);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState(
    localStorage.getItem(PIN_DISABLED_KEY) === "true"
      ? "PIN is currently disabled."
      : "Default PIN is 1234."
  );
  const [isClearing, setIsClearing] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (pin.length < 4) {
      setMessage("Use at least 4 digits for the PIN.");
      return;
    }

    localStorage.setItem("ledgerflow.pin", pin);
    localStorage.setItem(PIN_DISABLED_KEY, "false");
    setPin("");
    setMessage("PIN updated locally for this browser.");
  }

  function handleRemovePin() {
    const confirmed = window.confirm(
      "Remove the PIN entirely? The app will open without locking on this device."
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("ledgerflow.pin");
    localStorage.setItem(PIN_DISABLED_KEY, "true");
    setPin("");
    setMessage("PIN removed. The app will now open without locking.");
  }

  async function handleClearData() {
    const confirmed = window.confirm(
      "Clear all local finance data from this device? This removes transactions, accounts, budgets, receipts, and recurring items."
    );

    if (!confirmed) {
      return;
    }

    setIsClearing(true);

    try {
      await clearAllLocalFinanceData();
      setMessage("All local finance data was cleared. Reloading into an empty app.");
      window.location.reload();
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <SectionHeader
          eyebrow="Settings"
          title="Security and app defaults"
          description="Keep the day-to-day experience simple, but make reset and lock actions obvious."
        />

        <form className="form-grid compact-form settings-form" onSubmit={handleSubmit}>
          <label>
            App PIN
            <input
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setPin(event.target.value)}
              placeholder="New PIN"
              type="password"
              value={pin}
            />
          </label>
          <div className="action-row">
            <button className="primary-button" type="submit">
              Save PIN
            </button>
            <button className="secondary-button" onClick={handleRemovePin} type="button">
              Remove PIN
            </button>
            <button className="secondary-button" onClick={lock} type="button">
              Lock app
            </button>
          </div>
        </form>

        <p className="helper-text">{message}</p>
      </section>

      <section className="panel">
        <SectionHeader
          eyebrow="Danger zone"
          title="Clear local data"
          description="This is the hard reset for the financial data on this device. It keeps the PIN, but removes the working data."
        />
        <div className="danger-zone">
          <div className="danger-copy">
            <span className="soft-pill">
              Deletes accounts, transactions, budgets, receipts, and recurring items
            </span>
          </div>
          <button className="danger-button" disabled={isClearing} onClick={handleClearData} type="button">
            {isClearing ? "Clearing..." : "Clear all data"}
          </button>
        </div>
      </section>
    </div>
  );
}
