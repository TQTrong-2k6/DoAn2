import html from "../core.js";
import { connect } from "../store.js";
import product from "./product.js";

function buildSortUrl(sortValue){
    const url = new URL(window.location.href);
    if (sortValue) {
        url.searchParams.set('sort', sortValue);
    } else {
        url.searchParams.delete('sort');
    }
    return url.toString();
}

function mainProductCategories(data){
    const products = Object.values(data)[0] || [];

    const currentSort = new URLSearchParams(window.location.search).get('sort') || '';

    const sortOptionsConfig = [
        { value: '', label: 'Sắp xếp theo' },
        { value: 'newest', label: 'Mới nhất' },
        { value: 'price-asc', label: 'Giá tăng dần' },
        { value: 'price-desc', label: 'Giá giảm dần' },
        { value: 'name-asc', label: 'Tên A➜Z' }
    ];

    const sortOptions = `
        <select class="sotting-product" onchange="location.href = this.value">
            ${sortOptionsConfig.map(opt => `
                <option value="${buildSortUrl(opt.value)}" ${opt.value === currentSort ? 'selected' : ''}>
                    ${opt.label}
                </option>
            `).join('')}
        </select>
    `;

    if (products.length === 0) {
        return `<div class="category-sort">
                    <div style="font-weight: 600; font-size: 14px;">
                        Tìm thấy
                        <span class="quantity" style="color: rgb(0 144 208);">0</span>
                        sản phẩm
                    </div>
                    ${sortOptions}
                </div>
                <div class="category-products__list"><p class="no-products-available">Sản phẩm đang cập nhật...</p></div>`;
    }

    return html `
        <div class="category-sort">
            <div style="font-weight: 600; font-size: 14px;">
                Tìm thấy
                <span class="quantity" style="color: rgb(0 144 208);">${products.length}</span>
                sản phẩm
            </div>
            ${sortOptions}
        </div>
        <div class="category-products__list">
        ${products.map(value => product(value))}</div>
        <div class="category-products__paging"></div>
    `
}

export default connect(state => state.products)(mainProductCategories)