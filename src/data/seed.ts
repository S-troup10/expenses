import { db } from "./db";

const BOOTSTRAP_KEY = "ledgerflow.bootstrap";

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export async function ensureSeedData() {
  if (localStorage.getItem(BOOTSTRAP_KEY)) {
    return;
  }

  const accountCount = await db.accounts.count();

  if (accountCount > 0) {
    localStorage.setItem(BOOTSTRAP_KEY, "existing-data");
    return;
  }

  const now = new Date().toISOString();

  const defaultAccountId = id("account");

  const categoryIds = {
    food: id("category"),
    transport: id("category"),
    groceries: id("category"),
    salary: id("category"),
    travel: id("category")
  };

  await db.accounts.bulkAdd([
    {
      id: defaultAccountId,
      name: "Default",
      type: "bank",
      currency: "AUD",
      institution: "Hidden default",
      openingBalance: 0,
      currentBalance: 0,
      createdAt: now
    }
  ]);

  await db.categories.bulkAdd([
    { id: categoryIds.food, name: "Food", kind: "expense", color: "#F97316" },
    { id: categoryIds.transport, name: "Transport", kind: "expense", color: "#0EA5E9" },
    { id: categoryIds.groceries, name: "Groceries", kind: "expense", color: "#22C55E" },
    { id: categoryIds.salary, name: "Salary", kind: "income", color: "#8B5CF6" },
    { id: categoryIds.travel, name: "Travel", kind: "expense", color: "#EF4444" }
  ]);

  await db.budgets.bulkAdd([
    {
      id: id("budget"),
      name: "Monthly total",
      amount: 3200,
      currency: "AUD",
      period: "monthly"
    },
    {
      id: id("budget"),
      name: "Food budget",
      amount: 700,
      currency: "AUD",
      period: "monthly",
      categoryId: categoryIds.food
    },
    {
      id: id("budget"),
      name: "Travel budget",
      amount: 400,
      currency: "AUD",
      period: "monthly",
      categoryId: categoryIds.travel
    }
  ]);

  await db.transactions.bulkAdd([
    {
      id: id("transaction"),
      type: "expense",
      amountOriginal: 18.5,
      currencyOriginal: "AUD",
      amountBase: 18.5,
      baseCurrency: "AUD",
      date: new Date().toISOString(),
      accountId: defaultAccountId,
      merchant: "Corner Coffee",
      categoryId: categoryIds.food,
      source: "quick_add",
      createdAt: now
    },
    {
      id: id("transaction"),
      type: "expense",
      amountOriginal: 42,
      currencyOriginal: "AUD",
      amountBase: 42,
      baseCurrency: "AUD",
      date: new Date(Date.now() - 86400000).toISOString(),
      accountId: defaultAccountId,
      merchant: "Market Hall",
      categoryId: categoryIds.groceries,
      source: "manual",
      createdAt: now
    },
    {
      id: id("transaction"),
      type: "income",
      amountOriginal: 5200,
      currencyOriginal: "AUD",
      amountBase: 5200,
      baseCurrency: "AUD",
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      accountId: defaultAccountId,
      merchant: "Monthly Salary",
      categoryId: categoryIds.salary,
      source: "manual",
      createdAt: now
    }
  ]);

  await db.recurringRules.bulkAdd([
    {
      id: id("recurring"),
      title: "Rent",
      amount: 1800,
      currency: "AUD",
      cadence: "monthly",
      nextDueOn: new Date(Date.now() + 3 * 86400000).toISOString(),
      type: "expense"
    },
    {
      id: id("recurring"),
      title: "Spotify",
      amount: 16.99,
      currency: "AUD",
      cadence: "monthly",
      nextDueOn: new Date(Date.now() + 6 * 86400000).toISOString(),
      type: "expense"
    }
  ]);

  await db.receipts.bulkAdd([
    {
      id: id("receipt"),
      name: "corner-coffee.jpg",
      merchant: "Corner Coffee",
      amount: 18.5,
      currency: "AUD",
      createdAt: now
    }
  ]);

  localStorage.setItem(BOOTSTRAP_KEY, "seeded-demo");
}

export async function clearAllLocalFinanceData() {
  await db.transaction(
    "rw",
    [db.accounts, db.budgets, db.categories, db.receipts, db.recurringRules, db.transactions],
    async () => {
      await db.transactions.clear();
      await db.receipts.clear();
      await db.recurringRules.clear();
      await db.budgets.clear();
      await db.categories.clear();
      await db.accounts.clear();
    }
  );

  localStorage.setItem(BOOTSTRAP_KEY, "cleared-empty");
}
