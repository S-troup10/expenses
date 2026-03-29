import { db } from "../data/db";
import { TransactionType } from "../domain/types";

type AddLedgerTransactionInput = {
  type: TransactionType;
  amount: number;
  accountId?: string;
  destinationAccountId?: string;
  merchant?: string;
  categoryId?: string;
  currency?: string;
  notes?: string;
  source: "manual" | "quick_add" | "receipt" | "recurring";
  date?: string;
};

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

async function getOrCreateDefaultAccount() {
  const existing = await db.accounts.toCollection().first();

  if (existing) {
    return existing;
  }

  const account = {
    id: id("account"),
    name: "Default",
    type: "bank" as const,
    currency: "AUD",
    openingBalance: 0,
    currentBalance: 0,
    createdAt: new Date().toISOString()
  };

  await db.accounts.add(account);
  return account;
}

export async function addLedgerTransaction(input: AddLedgerTransactionInput) {
  const normalizedMerchant = input.merchant?.trim() || undefined;
  const defaultAccount = await getOrCreateDefaultAccount();

  await db.transactions.add({
    id: id("transaction"),
    type: input.type,
    amountOriginal: input.amount,
    currencyOriginal: input.currency ?? "AUD",
    amountBase: input.amount,
    baseCurrency: "AUD",
    date: input.date ?? new Date().toISOString(),
    accountId: input.accountId ?? defaultAccount.id,
    destinationAccountId: input.destinationAccountId,
    merchant: normalizedMerchant,
    categoryId: input.categoryId,
    notes: input.notes,
    source: input.source,
    createdAt: new Date().toISOString()
  });
}
