export default function clampQuantity(value, input) {
    const min = Number(input.min) || 1;
    const max = Number(input.max) || 999;
    let n = parseInt(value, 10);
    if (isNaN(n)) n = min;
    return Math.min(Math.max(n, min), max);
}