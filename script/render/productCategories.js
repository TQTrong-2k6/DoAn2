import BASE_URL from '../config.js'
import getData from "../fetch.js";
import { attach } from "../store.js";
import mainProductCategories from "../component/mainProductCategories.js"
import sectionBreadcrumb from "./sectionBreadcrumb.js";
import filterProducts from "../component/filterProducts.js";

let listApi = [];
const params = new URLSearchParams(window.location.search);
const table = params.get('table');
const category = params.get('category');
const categoryChild = params.get('categoryChild')
const sort = params.get('sort') || ''; 
const page = Math.max(1, Number(params.get('page')) || 1);
const pageSize = 60

const sortting ={
    newest: '?_sort=-id',
    'price-asc': '?_sort=price',
    'price-desc': '?_sort=-price',
    'name-asc': '?_sort=name'
}

const CATEGORY_LABELS = { // label danh mục
    pcGaming: 'PC GAMING',
    pcMini: 'PC MINI',
    pcWorkstation: 'PC WORKSTATION 2D 3D',
    pcAi: 'PC AI - TRÍ TUỆ NHÂN TẠO',
    pcOffice: 'PC VĂN PHÒNG',
    computerComponents: 'Linh kiện máy tính',
    screen: 'Màn hình máy tính',
    gaminggear: 'Gaming Gear',
    laptop: 'LAPTOP'
};

if (!table) {
    console.error('Không có table trên URL');
}else{
    listApi.push(sortting[sort] ? table + sortting[sort] : table)
}

const breadcrumbSteps = categoryChild ? 
[
    {label: CATEGORY_LABELS[table] || table, href: `./productCategories.html?table=${table}`},
    {label: category, href: `./productCategories.html?table=${table}&category=${category}`},
    {label: categoryChild}
] : (
    category ? [//Mục đường dẫn tự động
    {label: CATEGORY_LABELS[table] || table, href: `./productCategories.html?table=${table}`},
    {label: category}
] : [{label: CATEGORY_LABELS[table] || table}])

sectionBreadcrumb(breadcrumbSteps);

const titleWebsite = {
    computerComponents: 'Linh kiện máy tính',
    screen: 'Màn hình máy tính',
    laptop: 'LAPTOP',
    gaminggear: 'Gaming Gear',
    pcAI: 'PC AI - TRÍ TUỆ NHÂN TẠO',
}

titleWebsite[table] && (document.title = titleWebsite[table]);

function matchPriceRange(price, ranges){
    if (ranges.length === 0) return true;
    return ranges.some(range => {
        const [min, max] = range.split('-').map(Number);
        return price >= min && price < max;
    });
}

function loadData(data){
    let items = Object.values(data)[0] || [];

    if (category) items = items.filter(p => p.category === category);
    if (categoryChild) items = items.filter(p => p.categoryChild === categoryChild);

    const SYSTEM_KEYS = new Set(['table', 'category', 'categoryChild', 'sort', 'page']);
    
    for (const [key, value] of params.entries()) {
        if (SYSTEM_KEYS.has(key)) continue;

        const selected = value.split(',').filter(Boolean);
        if (selected.length === 0) continue;

        if (key === 'price') {
            items = items.filter(p => matchPriceRange(p.price, selected));
        } else if (key === 'brand') {
            items = items.filter(p => selected.includes(p.brand));
        } else {
            items = items.filter(p => selected.includes(p.attributes?.[key]));
        }
    }


    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(page, totalPages);

    const startIndex = (safePage - 1) * pageSize;
    const pageItems = items.slice(startIndex, startIndex + pageSize);

    dispatch('addProducts', { [table]: pageItems,
        meta: { totalItems, totalPages, currentPage: safePage }});
    attach(mainProductCategories,'.category-products')//render
    attach(filterProducts, '.category-filter')
}

getData(BASE_URL, ...listApi).then(data => loadData(data))//call api

document.addEventListener('change', (e) => {
    if (!e.target.matches('input[data-filter-name]')) return;

    const name = e.target.dataset.filterName;
    const value = e.target.value;
    const isChecked = e.target.checked;

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

    window.location.href = url.toString();
});