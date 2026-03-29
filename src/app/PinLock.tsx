import { FormEvent, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useAppStore } from "../store/appStore";

const DEFAULT_PIN = "1234";

export function PinLock() {
  const unlock = useAppStore((state) => state.unlock);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const pin = useMemo(() => localStorage.getItem("ledgerflow.pin") ?? DEFAULT_PIN, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (value === pin) {
      unlock();
      setValue("");
      setError("");
      return;
    }

    setError("That PIN does not match. Default PIN is 1234 until you change it.");
  };

  return (
    <div className="lock-screen">
      <div className="lock-card">
        <div className="hero-icon">
          <ShieldCheck />
        </div>
        <p className="eyebrow">Personal mode</p>
        <h1>Unlock Ledger Flow</h1>
        <p className="muted">
          Your app starts local-first with a simple PIN. Once cloud sync is added, this
          will still be your fast daily unlock flow.
        </p>

        <form className="pin-form" onSubmit={handleSubmit}>
          <input
            autoFocus
            className="pin-input"
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter PIN"
            type="password"
            value={value}
          />
          <button className="primary-button" type="submit">
            Unlock
          </button>
        </form>

        {error ? <p className="error-text">{error}</p> : null}
      </div>
    </div>
  );
}
