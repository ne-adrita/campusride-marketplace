// Currency conversion and formatting utility
export const USD_TO_BDT = 120;

export function usdToBdt(usdAmount) {
  return Math.round(usdAmount * USD_TO_BDT);
}

export function formatBDT(amount) {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPrice(usdAmount) {
  const bdtAmount = usdToBdt(usdAmount);
  return formatBDT(bdtAmount);
}
