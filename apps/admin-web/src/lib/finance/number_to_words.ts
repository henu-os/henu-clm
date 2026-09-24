/**
 * HENU OS CLM — Number to Words Converter
 * Converts numeric financial values into formal written words (Indian numbering system & Western currency).
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertTwoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return (TENS[ten] + (one ? ' ' + ONES[one] : '')).trim();
}

function convertThreeDigits(n: number): string {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  let str = '';
  if (hundred) {
    str += ONES[hundred] + ' Hundred';
    if (rest) str += ' ';
  }
  if (rest) {
    str += convertTwoDigits(rest);
  }
  return str.trim();
}

/**
 * Converts numbers into Indian Currency Words (Lakhs & Crores)
 * e.g. 11800.50 -> "Eleven Thousand Eight Hundred Rupees and Fifty Paise Only"
 */
export function numberToWordsIndian(amount: number, currencyPrefix = ''): string {
  if (amount === 0) return currencyPrefix ? `${currencyPrefix} Zero Only` : 'Zero Rupees Only';

  const absolute = Math.abs(amount);
  const integerPart = Math.floor(absolute);
  const fractionalPart = Math.round((absolute - integerPart) * 100);

  let num = integerPart;
  const parts: string[] = [];

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundredPart = num;

  if (crore) {
    parts.push(`${convertThreeDigits(crore)} Crore`);
  }
  if (lakh) {
    parts.push(`${convertTwoDigits(lakh)} Lakh`);
  }
  if (thousand) {
    parts.push(`${convertTwoDigits(thousand)} Thousand`);
  }
  if (hundredPart) {
    parts.push(convertThreeDigits(hundredPart));
  }

  const words = parts.join(' ').trim();
  let result = currencyPrefix ? `${currencyPrefix} ${words}` : `${words} Rupees`;

  if (fractionalPart > 0) {
    result += ` and ${convertTwoDigits(fractionalPart)} Paise`;
  }

  return `${result} Only`.trim();
}

/**
 * Converts numbers into Western Currency Words (Millions & Billions)
 * e.g. 1250000 -> "One Million Two Hundred Fifty Thousand Dollars Only"
 */
export function numberToWordsWestern(amount: number, currencyPrefix = ''): string {
  if (amount === 0) return currencyPrefix ? `${currencyPrefix} Zero Only` : 'Zero Dollars Only';

  const absolute = Math.abs(amount);
  const integerPart = Math.floor(absolute);
  const fractionalPart = Math.round((absolute - integerPart) * 100);

  let num = integerPart;
  const parts: string[] = [];

  const billion = Math.floor(num / 1000000000);
  num %= 1000000000;

  const million = Math.floor(num / 1000000);
  num %= 1000000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const remainder = num;

  if (billion) {
    parts.push(`${convertThreeDigits(billion)} Billion`);
  }
  if (million) {
    parts.push(`${convertThreeDigits(million)} Million`);
  }
  if (thousand) {
    parts.push(`${convertThreeDigits(thousand)} Thousand`);
  }
  if (remainder) {
    parts.push(convertThreeDigits(remainder));
  }

  const words = parts.join(' ').trim();
  let result = currencyPrefix ? `${currencyPrefix} ${words}` : `${words} Dollars`;

  if (fractionalPart > 0) {
    result += ` and ${convertTwoDigits(fractionalPart)} Cents`;
  }

  return `${result} Only`.trim();
}

/**
 * Universal number to words helper
 */
export function numberToWords(amount: number, currency = 'INR'): string {
  const curr = currency.toUpperCase();
  if (curr === 'INR' || curr === 'RS' || curr === 'RUPEES') {
    return numberToWordsIndian(amount);
  }
  return numberToWordsWestern(amount);
}

/**
 * Formal Header Prefix format
 * e.g. "Indian Rupee Eleven Thousand Eight Hundred and Seventy Five Paise Only"
 */
export function formatCurrencyWords(amount: number, currency = 'INR'): string {
  const curr = currency.toUpperCase();
  if (curr === 'INR' || curr === 'RS' || curr === 'RUPEES') {
    return numberToWordsIndian(amount, 'Indian Rupee');
  }
  return numberToWordsWestern(amount, 'US Dollar');
}
