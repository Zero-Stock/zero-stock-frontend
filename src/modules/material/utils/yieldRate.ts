type YieldRateValue = string | number | null | undefined;

const MAX_FRACTION_DIGITS = 8;

function normalizeNumber(value: number) {
  return Number(value.toFixed(MAX_FRACTION_DIGITS)).toString();
}

export function decimalYieldRateToPercent(value: YieldRateValue) {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '0';
  }

  return normalizeNumber(numericValue * 100);
}

export function percentYieldRateToDecimal(value: YieldRateValue) {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '0';
  }

  return normalizeNumber(numericValue / 100);
}

export function isValidYieldRatePercent(value: YieldRateValue) {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  const numericValue = Number(value);

  return (
    Number.isFinite(numericValue) && numericValue >= 0 && numericValue <= 100
  );
}
