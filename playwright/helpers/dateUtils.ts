export function expirySecondsFromNow(days: number): number {
  return (Date.now() / 1000) + (days * 24 * 60 * 60);
}

export function isWithinTolerance(
  actualSeconds: number,
  expectedSeconds: number,
  toleranceSeconds: number = 30
): boolean {
  return Math.abs(actualSeconds - expectedSeconds) <= toleranceSeconds;
}