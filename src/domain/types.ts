export type CurrencyCode = string;

export type AccountType = "bank" | "cash" | "credit_card" | "e_wallet";
export type TransactionType =
  | "expense"
  | "income"
  | "transfer"
  | "credit_card_payment";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  currency: CurrencyCode;
  institution?: string;
  openingBalance: number;
  currentBalance: number;
  createdAt: string;
};

export type CategoryKind = "expense" | "income";

export type Category = {
  id: string;
  name: string;
  kind: CategoryKind;
  color: string;
};

export type Budget = {
  id: string;
  categoryId?: string;
  name: string;
  amount: number;
  currency: CurrencyCode;
  period: "monthly";
};

export type Receipt = {
  id: string;
  name: string;
  merchant?: string;
  amount?: number;
  currency?: CurrencyCode;
  transactionId?: string;
  createdAt: string;
};

export type RecurringRule = {
  id: string;
  title: string;
  amount: number;
  currency: CurrencyCode;
  cadence: "weekly" | "monthly";
  nextDueOn: string;
  type: TransactionType;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amountOriginal: number;
  currencyOriginal: CurrencyCode;
  amountBase: number;
  baseCurrency: CurrencyCode;
  date: string;
  accountId: string;
  destinationAccountId?: string;
  merchant?: string;
  categoryId?: string;
  notes?: string;
  source: "manual" | "quick_add" | "receipt" | "recurring";
  createdAt: string;
};

export type QuickAddDraft = {
  amount: number;
  type: TransactionType;
  merchant?: string;
  accountId?: string;
  destinationAccountId?: string;
  categoryId?: string;
  currency: CurrencyCode;
  date: string;
  notes?: string;
};
