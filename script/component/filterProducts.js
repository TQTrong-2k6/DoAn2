import html from "../core.js";
import { connect } from "../store.js";

const href = window.location.href;

const CATEGORY_LABELS = { // label danh mục
    pcGaming: 'PC GAMING',
    mini: 'PC MINI',
    pcWorkstation: 'PC WORKSTATION 2D 3D',
    pcAi: 'PC AI - TRÍ TUỆ NHÂN TẠO',
    pcOffice: 'PC VĂN PHÒNG',
    computerComponents: 'Linh kiện máy tính',
    screen: 'Màn hình máy tính',
    gaminggear: 'Gaming Gear',
    laptop: 'LAPTOP'
};

function countMatch(products, name, value){
    if (name === 'brand') {
        return products.filter(p => p.brand === value).length;
    }
    return products.filter(p => p.attributes?.[name] === value).length;
}

function getCheckedValues(name){
    const params = new URLSearchParams(window.location.search);
    return (params.get(name) || '').split(',').filter(Boolean);
}

function buildFilterUrl(name, value, isChecked){
    const url = new URL(window.location.href);
    const current = (url.searchParams.get(name) || '').split(',').filter(Boolean);

    const next = isChecked
        ? [...new Set([...current, value])]
        : current.filter(v => v !== value);

    if (next.length) {
        url.searchParams.set(name, next.join(','));
    } else {
        url.searchParams.delete(name);
    }
    url.searchParams.delete('page');
    return url.toString();
}

function renderCheckboxAttribute(product, name, title, values){
    if (values.length === 0) return '';
    const checked = getCheckedValues(name);

    return `
        <div class="parts-categories__filter">
            <h4 class="parts-categories__filter--title">${title}</h4>
            <ul>
                ${values.map(v => {
                    const isChecked = checked.includes(v);
                    const count = countMatch(product, name, v);
                    return `
                        <li>
                            <label>
                                <input type="checkbox" data-filter-name="${name}" value="${v}" ${isChecked ? 'checked' : ''}>
                                ${v} ${isChecked ? '(Xóa)' : ` (${count})`}
                            </label>
                        </li>
                    `;
                }).join('')}
            </ul>
        </div>
    `;
}

function renderPriceFilter(products){
    if (products.length === 0) return '';

    const prices = products.map(p => p.price).filter(p => typeof p === 'number');
    if (prices.length === 0) return '';

    const max = Math.max(...prices);
    const ranges = [];
    const step = 5000000;   // chia mốc 5 triệu/khoảng

    for (let min = 0; min < max; min += step) {
        const upper = min + step;
        const count = prices.filter(p => p >= min && p < upper).length;
        if (count > 0) {
            ranges.push({ min, max: upper, count });
        }
    }

    const checked = getCheckedValues('price');

    return `
        <div class="category-filter__price">
            <h3 class="header-filter">KHOẢNG GIÁ</h3>
            <ul class="price-products">
               ${ranges.map(r => {
                    const value = `${r.min}-${r.max}`;
                    const isChecked = checked.includes(value);
                    return `
                        <li>
                            <label>
                                <input type="checkbox" data-filter-name="price" value="${value}" ${isChecked ? 'checked' : ''}>
                                ${(r.min / 1000000).toFixed(0)} - ${(r.max / 1000000).toFixed(0)} triệu
                                ${isChecked ? '(Xóa)' : ` (${r.count})`}
                            </label>
                        </li>
                    `;
                }).join('')}
            </ul>
        </div>
    `;
}

function renderBrandsFilter(products, name, title, brands){
    if(brands.length === 0) return ''

    const checked = getCheckedValues(name);
    return `
        <div class="category-filter__brand">
            <h3 class="header-filter">${title}</h3>
            <ul class="filter-products">
                ${brands.map(v => {
                    const isChecked = checked.includes(v);
                    const count = countMatch(products, name, v);
                    return `
                        <li>
                            <label>
                                <input type="checkbox" data-filter-name="${name}" value="${v}" ${isChecked ? 'checked' : ''}>
                                ${v} ${isChecked ? '(Xóa)' : ` (${count})`}
                            </label>
                        </li>
                    `;
                }).join('')}
                <li>
                    <label>
                        <input type="checkbox" data-filter-name="${name}" value="Khác">
                        khác
                    </label>
                </li>
            </ul>
        </div>
    `;
}

function filterProducts(data){
    const products = Object.values(data).find(v => Array.isArray(v)) || [];

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const category = params.get('category') || '';
    const categoryChild = params.get('categoryChild') || '';

    let categoryBlock = '';
    if (!categoryChild) {
        if (category) {
            const children = [...new Set(products.filter(p => p.category === category && p.categoryChild).map(p => p.categoryChild))];
            if (children.length) {
                categoryBlock = `
                    <div class="category-filter__child">
                        <h3 class="header-filter">${category}</h3>
                        <ul>
                            ${children.map(v => `<li><a class="hover-color" href="${buildFilterUrl('categoryChild', v, true)}"><i class="fa-solid fa-angles-right"></i> ${v}</a></li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        } else {
            const categories = [...new Set(products.filter(p => p.category).map(p => p.category))];
            if (categories.length) {
                categoryBlock = `
                    <div class="category-filter__child">
                        <h3 class="header-filter">${CATEGORY_LABELS[table] || table}</h3>
                        <ul>
                            ${categories.map(v => `<li><a class="hover-color" href="${buildFilterUrl('category', v, true)}"><i class="fa-solid fa-angles-right"></i> ${v}</a></li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        }
    }

    // --- Brand: tự lấy giá trị duy nhất từ products ---
    const brands = [...new Set(products.filter(p => p.brand).map(p => p.brand))];
    const brandBlock = renderBrandsFilter(products, 'brand', 'THƯƠNG HIỆU', brands);

    // --- Price: tự tính range theo data thật ---
    const priceBlock = renderPriceFilter(products);

    // --- Attributes: tự dò mọi field bên trong product.attributes ---
    const attributeKeys = [...new Set(
        products.flatMap(p => p.attributes ? Object.keys(p.attributes) : [])
    )];

    const attributeBlocks = attributeKeys.map(key => {
        const values = [...new Set(
            products.filter(p => p.attributes?.[key]).map(p => p.attributes[key])
        )];
        return renderCheckboxAttribute(products, key, key, values);
    }).join('');

    return html`
        <div class="category-filter__heading">
            <h2>LỌC SẢN PHẨM</h2>
        </div>
        ${categoryBlock}
        ${priceBlock}
        ${brandBlock}
        ${attributeBlocks.length > 0 ?  `
            <div class="category-filter__attribute">
                <h3 class="header-filter">
                    LỌC SẢN PHẨM
                </h3>
                <div class="parts-categories">
                    ${attributeBlocks}
                </div>
            </div>` : ''}
    `
}

export default connect(state => state.products)(filterProducts)