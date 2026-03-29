import { useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { AppShell } from "./AppShell";
import { PinLock } from "./PinLock";
import { ensureSeedData } from "../data/seed";
import { useAppStore } from "../store/appStore";

const PIN_DISABLED_KEY = "ledgerflow.pin.disabled";

export function App() {
  const isUnlocked = useAppStore((state) => state.isUnlocked);
  const unlock = useAppStore((state) => state.unlock);

  useEffect(() => {
    void ensureSeedData();
  }, []);

  useEffect(() => {
    if (localStorage.getItem(PIN_DISABLED_KEY) === "true") {
      unlock();
    }
  }, [unlock]);

  return (
    <HashRouter>
      {isUnlocked ? <AppShell /> : <PinLock />}
    </HashRouter>
  );
}
