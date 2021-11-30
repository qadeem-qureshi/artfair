// Adjust modulo to return correct value for negative inputs
export const modulo = (m: number, n: number): number => ((m % n) + n) % n;
