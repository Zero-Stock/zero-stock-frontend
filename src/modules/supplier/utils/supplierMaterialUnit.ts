function normalizeDecimalString(value: string) {
  const [integerPart, decimalPart = ''] = value.trim().split('.');
  const integer = integerPart.replace(/^0+(?=\d)/, '') || '0';
  const decimal = decimalPart.replace(/0+$/, '');

  return decimal ? `${integer}.${decimal}` : integer;
}

function moveDecimal(value: string, places: number) {
  const trimmed = value.trim();

  if (!trimmed) {
    return trimmed;
  }

  const isNegative = trimmed.startsWith('-');
  const unsigned = isNegative ? trimmed.slice(1) : trimmed;
  const [integerPart, decimalPart = ''] = unsigned.split('.');
  const digits = `${integerPart || '0'}${decimalPart}`;
  const decimalIndex = integerPart.length + places;

  let result: string;

  if (decimalIndex <= 0) {
    result = `0.${'0'.repeat(Math.abs(decimalIndex))}${digits}`;
  } else if (decimalIndex >= digits.length) {
    result = `${digits}${'0'.repeat(decimalIndex - digits.length)}`;
  } else {
    result = `${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
  }

  return `${isNegative ? '-' : ''}${normalizeDecimalString(result)}`;
}

export function gramsToKg(value?: string | null) {
  if (value == null) {
    return undefined;
  }

  return moveDecimal(value, -3);
}

export function kgToGrams(value?: string | null) {
  if (value == null) {
    return undefined;
  }

  return moveDecimal(value, 3);
}
