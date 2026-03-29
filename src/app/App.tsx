import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./AppShell";
import { PinLock } from "./PinLock";
import { ensureSeedData } from "../data/seed";
import { useAppStore } from "../store/appStore";

export function App() {
  const isUnlocked = useAppStore((state) => state.isUnlocked);

  useEffect(() => {
    void ensureSeedData();
  }, []);

  return (
    <BrowserRouter>
      {isUnlocked ? <AppShell /> : <PinLock />}
    </BrowserRouter>
  );
}
