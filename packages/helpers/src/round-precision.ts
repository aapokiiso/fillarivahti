export const roundPrecision = (value: number, precision: number): number => {
    const base = 10;
    const coefficient = Math.pow(base, precision);

    return Math.round(value * coefficient) / coefficient;
};
