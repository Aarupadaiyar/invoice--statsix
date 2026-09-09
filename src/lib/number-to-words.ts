const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const CURRENCY_NAMES: Record<string, { major: string; minor: string }> = {
  USD: { major: "Dollars", minor: "Cents" },
  EUR: { major: "Euros", minor: "Cents" },
  GBP: { major: "Pounds", minor: "Pence" },
  INR: { major: "Rupees", minor: "Paise" },
  AUD: { major: "Australian Dollars", minor: "Cents" },
  CAD: { major: "Canadian Dollars", minor: "Cents" },
  JPY: { major: "Yen", minor: "Sen" },
  SGD: { major: "Singapore Dollars", minor: "Cents" },
  AED: { major: "Dirhams", minor: "Fils" },
};

function threeDigitsToWords(n: number): string {
  const parts: string[] = [];
  if (n >= 100) {
    parts.push(`${ONES[Math.floor(n / 100)]} Hundred`);
    n %= 100;
  }
  if (n >= 20) {
    parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10].toLowerCase()}` : ""));
  } else if (n > 0) {
    parts.push(ONES[n]);
  }
  return parts.join(" ");
}

function integerToWords(n: number): string {
  if (n === 0) return "Zero";

  const groups: [number, string][] = [
    [1_000_000_000, "Billion"],
    [1_000_000, "Million"],
    [1_000, "Thousand"],
    [1, ""],
  ];

  const parts: string[] = [];
  let remaining = n;
  for (const [value, label] of groups) {
    if (remaining >= value) {
      const count = Math.floor(remaining / value);
      remaining %= value;
      const words = threeDigitsToWords(count);
      parts.push(label ? `${words} ${label}` : words);
    }
  }
  return parts.join(" ").trim();
}

/** Converts an amount to words, e.g. 3214.5 + "INR" -> "Three Thousand Two Hundred Fourteen Rupees and Fifty Paise". */
export function amountToWords(amount: number, currencyCode: string): string {
  const safeAmount = Number.isFinite(amount) ? Math.abs(amount) : 0;
  const names = CURRENCY_NAMES[currencyCode] ?? { major: currencyCode, minor: "Cents" };

  const wholePart = Math.floor(safeAmount);
  const fractionPart = Math.round((safeAmount - wholePart) * 100);

  const wholeWords = `${integerToWords(wholePart)} ${names.major}`;
  if (fractionPart === 0) return `${wholeWords} Only`;

  const fractionWords = `${integerToWords(fractionPart)} ${names.minor}`;
  return `${wholeWords} and ${fractionWords} Only`;
}
