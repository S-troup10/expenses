import { Account, Budget, Category, Transaction } from "../domain/types";

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function isInCurrentMonth(date: string) {
  return new Date(date) >= startOfMonth();
}

export function calculateAccountBalance(account: Account, transactions: Transaction[]) {
  return transactions.reduce((balance, transaction) => {
    const amount = transaction.amountBase;

    if (transaction.type === "expense" && transaction.accountId === account.id) {
      return balance - amount;
    }

    if (transaction.type === "income" && transaction.accountId === account.id) {
      return balance + amount;
    }

    if (
      (transaction.type === "transfer" || transaction.type === "credit_card_payment") &&
      transaction.accountId === account.id
    ) {
      return balance - amount;
    }

    if (
      (transaction.type === "transfer" || transaction.type === "credit_card_payment") &&
      transaction.destinationAccountId === account.id
    ) {
      return balance + amount;
    }

    return balance;
  }, account.openingBalance);
}

export function getMonthExpenseTotal(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === "expense" && isInCurrentMonth(transaction.date))
    .reduce((sum, transaction) => sum + transaction.amountBase, 0);
}

export function getMonthIncomeTotal(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === "income" && isInCurrentMonth(transaction.date))
    .reduce((sum, transaction) => sum + transaction.amountBase, 0);
}

export function getDailyExpenseSeries(transactions: Transaction[], days = 7) {
  const baseDates = Array.from({ length: days }, (_, index) => {
    const value = new Date();
    value.setDate(value.getDate() - (days - index - 1));
    value.setHours(0, 0, 0, 0);
    return value;
  });

  return baseDates.map((date) => {
    const total = transactions
      .filter((transaction) => transaction.type === "expense")
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.toDateString() === date.toDateString();
      })
      .reduce((sum, transaction) => sum + transaction.amountBase, 0);

    return {
      label: new Intl.DateTimeFormat("en-AU", { weekday: "short" }).format(date),
      total
    };
  });
}

export function getCategorySpend(
  transactions: Transaction[],
  categories: Category[],
  limit = 5
) {
  return categories
    .filter((category) => category.kind === "expense")
    .map((category) => ({
      ...category,
      total: transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.categoryId === category.id &&
            isInCurrentMonth(transaction.date)
        )
        .reduce((sum, transaction) => sum + transaction.amountBase, 0)
    }))
    .filter((category) => category.total > 0)
    .sort((left, right) => right.total - left.total)
    .slice(0, limit);
}

export function getBudgetOverview(
  budgets: Budget[],
  transactions: Transaction[],
  categories: Category[]
) {
  return budgets.map((budget) => {
    const category = categories.find((item) => item.id === budget.categoryId);
    const spent = transactions
      .filter((transaction) => transaction.type === "expense" && isInCurrentMonth(transaction.date))
      .filter((transaction) =>
        budget.categoryId ? transaction.categoryId === budget.categoryId : true
      )
      .reduce((sum, transaction) => sum + transaction.amountBase, 0);

    return {
      ...budget,
      categoryName: category?.name ?? "All spending",
      spent,
      remaining: budget.amount - spent,
      progress: budget.amount ? Math.min((spent / budget.amount) * 100, 100) : 0
    };
  });
}

export function getRecentMerchantSuggestions(transactions: Transaction[]) {
  const seen = new Set<string>();

  return transactions
    .filter((transaction) => Boolean(transaction.merchant))
    .filter((transaction) => {
      const key = transaction.merchant!.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}

export function getInsightSummary(
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[]
) {
  const monthlySpent = getMonthExpenseTotal(transactions);
  const monthlyIncome = getMonthIncomeTotal(transactions);
  const totalBudget = budgets.find((budget) => !budget.categoryId)?.amount ?? 0;
  const topCategory = getCategorySpend(transactions, categories, 1)[0];

  if (monthlySpent === 0) {
    return "You have not logged any expenses this month yet. The fastest path now is to use quick add for the next few transactions.";
  }

  if (totalBudget > 0 && monthlySpent > totalBudget) {
    return `You are over your monthly target by ${formatCompactCurrency(
      monthlySpent - totalBudget
    )}. ${topCategory ? `${topCategory.name} is the biggest pressure point.` : ""}`.trim();
  }

  if (monthlyIncome > 0 && monthlySpent / monthlyIncome > 0.65) {
    return `You have already spent ${Math.round(
      (monthlySpent / monthlyIncome) * 100
    )}% of this month's income. ${topCategory ? `${topCategory.name} is leading spend.` : ""}`.trim();
  }

  return topCategory
    ? `${topCategory.name} is your largest category this month at ${formatCompactCurrency(
        topCategory.total
      )}. Capture looks healthy and the dashboard has enough data to start learning patterns.`
    : "Capture looks healthy and the dashboard has enough data to start learning patterns.";
}

function formatCompactCurrency(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(amount);
}
