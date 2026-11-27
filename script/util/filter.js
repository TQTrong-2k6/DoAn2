export function matchOne(p, name, value) {
    if (name === 'brand') return p.brand === value;
    if (name === 'price') {
        const [min, max] = value.split('-').map(Number);
        return p.price >= min && p.price < max;
    }
    return p.attributes?.[name] === value;
}

export function applyFilters(list, filters) {
    return list.filter(p =>
        Object.entries(filters).every(([name, values]) =>
            values.length === 0 || values.some(v => matchOne(p, name, v))
        )
    );
}

export function countMatch(list, name, value) {
    return list.filter(p => matchOne(p, name, value)).length;
}