import { useMemo } from "react";
import {
  ArrowLeftRight,
  ChartColumnIncreasing,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  RefreshCcw,
  Settings2
} from "lucide-react";
import { NavLink, Route, Routes } from "react-router-dom";
import { BudgetsPage } from "../pages/BudgetsPage";
import { HomePage } from "../pages/HomePage";
import { LogPage } from "../pages/LogPage";
import { ReceiptsPage } from "../pages/ReceiptsPage";
import { RecurringPage } from "../pages/RecurringPage";
import { ReportsPage } from "../pages/ReportsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { TransactionsPage } from "../pages/TransactionsPage";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/log", label: "Log", icon: PlusCircle },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/budgets", label: "Budgets", icon: ChartColumnIncreasing },
  { to: "/reports", label: "Reports", icon: ChartColumnIncreasing },
  { to: "/receipts", label: "Receipts", icon: Receipt },
  { to: "/recurring", label: "Recurring", icon: RefreshCcw },
  { to: "/settings", label: "Settings", icon: Settings2 }
];

const mobileNavigation = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/log", label: "Log", icon: PlusCircle },
  { to: "/transactions", label: "Activity", icon: ArrowLeftRight },
  { to: "/reports", label: "Reports", icon: ChartColumnIncreasing },
  { to: "/settings", label: "Settings", icon: Settings2 }
];

export function AppShell() {
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }).format(new Date()),
    []
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-badge">LF</div>
            <div>
              <p>Ledger Flow</p>
              <span>Personal finance cockpit</span>
            </div>
          </div>
          <nav className="nav-list">
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                className={({ isActive }) =>
                  isActive ? "nav-item nav-item-active" : "nav-item"
                }
                to={to}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-card">
          <p>Offline first</p>
          <span>Everything saves locally first so quick entry stays instant.</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-copy">
            <p className="eyebrow">Today</p>
            <h1>{todayLabel}</h1>
            <span className="muted">
              Add in one line, review the trends, and only open details when you need them.
            </span>
          </div>
        </header>

        <div className="mobile-summary-strip">
          <div className="brand brand-inline">
            <div className="brand-badge">LF</div>
            <div>
              <p>Ledger Flow</p>
              <span>Fast personal finance</span>
            </div>
          </div>
          <NavLink className="mobile-add-button" to="/log">
            <PlusCircle size={18} />
            <span>Log</span>
          </NavLink>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/receipts" element={<ReceiptsPage />} />
          <Route path="/recurring" element={<RecurringPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      <nav className="mobile-nav">
        {mobileNavigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            className={({ isActive }) =>
              isActive ? "mobile-nav-item mobile-nav-item-active" : "mobile-nav-item"
            }
            to={to}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
