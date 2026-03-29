export function humanizeToken(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function humanizeTransactionType(value: string) {
  if (value === "income") {
    return "Income";
  }

  if (value === "expense") {
    return "Expense";
  }

  if (value === "credit_card_payment") {
    return "Credit card payment";
  }

  return humanizeToken(value);
}
