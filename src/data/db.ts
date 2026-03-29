import Dexie, { type EntityTable } from "dexie";
import { Account, Budget, Category, Receipt, RecurringRule, Transaction } from "../domain/types";

export class LedgerFlowDB extends Dexie {
  accounts!: EntityTable<Account, "id">;
  budgets!: EntityTable<Budget, "id">;
  categories!: EntityTable<Category, "id">;
  receipts!: EntityTable<Receipt, "id">;
  recurringRules!: EntityTable<RecurringRule, "id">;
  transactions!: EntityTable<Transaction, "id">;

  constructor() {
    super("ledger-flow-db");
    this.version(1).stores({
      accounts: "id, name, type, currency",
      budgets: "id, name, categoryId",
      categories: "id, name, kind",
      receipts: "id, transactionId, createdAt",
      recurringRules: "id, nextDueOn, type",
      transactions: "id, type, date, accountId, categoryId, merchant"
    });
  }
}

export const db = new LedgerFlowDB();
