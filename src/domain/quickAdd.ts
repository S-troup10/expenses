import { Account, Category, QuickAddDraft, TransactionType } from "./types";

const accountHints: Record<string, string> = {
  cash: "cash",
  wallet: "cash",
  visa: "card",
  card: "card",
  debit: "bank",
  bank: "bank"
};

const currencyMap: Record<string, string> = {
  aud: "AUD",
  usd: "USD",
  vnd: "VND",
  idr: "IDR",
  jpy: "JPY"
};

const categoryKeywordMap: Record<string, string[]> = {
  Food: ["coffee", "lunch", "dinner", "breakfast", "pho", "ramen", "snack", "cafe"],
  Transport: ["uber", "grab", "taxi", "train", "bus", "metro", "fuel"],
  Groceries: ["market", "groceries", "coles", "woolworths", "aldi"],
  Travel: ["flight", "hotel", "airbnb", "airport", "trip"]
};

function matchAccount(text: string, accounts: Account[]) {
  const lower = text.toLowerCase();

  for (const account of accounts) {
    if (lower.includes(account.name.toLowerCase())) {
      return account;
    }
  }

  for (const [hint, type] of Object.entries(accountHints)) {
    if (lower.includes(hint)) {
      return accounts.find((account) => account.type.includes(type));
    }
  }

  return accounts[0];
}

function matchCategory(text: string, categories: Category[]) {
  const lower = text.toLowerCase();
  const directMatch = categories.find((category) =>
    lower.includes(category.name.toLowerCase())
  );

  if (directMatch) {
    return directMatch;
  }

  return categories.find((category) =>
    (categoryKeywordMap[category.name] ?? []).some((keyword) => lower.includes(keyword))
  );
}

function inferType(text: string): TransactionType {
  const lower = text.toLowerCase();

  if (lower.includes("salary") || lower.includes("income") || lower.includes("refund")) {
    return "income";
  }

  if (lower.includes("transfer")) {
    return "transfer";
  }

  return "expense";
}

export function parseQuickAdd(
  input: string,
  accounts: Account[],
  categories: Category[],
  baseCurrency: string
): QuickAddDraft | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const amountMatch = trimmed.match(/(\d+(?:[.,]\d+)?)(?:k)?/i);

  if (!amountMatch) {
    return null;
  }

  const rawNumber = Number(amountMatch[1].replace(",", "."));
  const usesK = amountMatch[0].toLowerCase().endsWith("k");
  const amount = usesK ? rawNumber * 1000 : rawNumber;
  const type = inferType(trimmed);
  const currencyToken = Object.keys(currencyMap).find((code) =>
    trimmed.toLowerCase().includes(code)
  );
  const currency = currencyToken ? currencyMap[currencyToken] : baseCurrency;
  const account = matchAccount(trimmed, accounts);
  const category = matchCategory(trimmed, categories);
  const yesterday = trimmed.toLowerCase().includes("yesterday");
  const transferTargetMatch = trimmed.match(/\bto\s+([a-z0-9 ]+)$/i);
  const destinationAccount = transferTargetMatch
    ? accounts.find((item) =>
        transferTargetMatch[1].toLowerCase().includes(item.name.toLowerCase())
      )
    : accounts[1];
  const merchant = trimmed
    .replace(amountMatch[0], "")
    .replace(
      /\b(today|yesterday|cash|card|bank|visa|salary|income|transfer|aud|usd|vnd|idr|jpy)\b/gi,
      ""
    )
    .replace(/\bto\s+[a-z0-9 ]+$/i, "")
    .trim();

  return {
    amount,
    type,
    currency,
    accountId: account?.id,
    categoryId: category?.id,
    merchant: merchant || undefined,
    date: yesterday
      ? new Date(Date.now() - 86400000).toISOString()
      : new Date().toISOString(),
    destinationAccountId:
      type === "transfer" || type === "credit_card_payment"
        ? destinationAccount?.id ?? accounts[1]?.id ?? accounts[0]?.id
        : undefined
  };
}
