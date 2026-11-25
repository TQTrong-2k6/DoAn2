import html from "../core.js";
import { connect } from "../store.js";

const fmt = n => Math.round(n).toLocaleString('vi-VN');

function getCheckedValues(name){
    const params = new URLSearchParams(window.location.search);
    return (params.get(name) || '').split(',').filter(Boolean);
}

function countMatch(products, name, value){
    if (name === 'brand') {
        return products.filter(p => p.brand === value).length;
    }
    return products.filter(p => p.attributes?.[name] === value).length;
}

function renderCheckboxAttribute(product, name, title, values){
    if (values.length === 0) return '';
    const checked = getCheckedValues(name);

    return `
        <div class="filter-item brand-filter">
            <p class="filter-name">${title}</p>
            <div class="filter-list-holder">
                ${values.map(v => {
                    const isChecked = checked.includes(v);
                    const count = countMatch(product, name, v);
                    return `
                        <label>
                                <input type="checkbox" data-filter-name="${name}" value="${v}" ${isChecked ? 'checked' : ''}>
                                ${v} ${isChecked ? '(Xóa)' : ` (${count})`}
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function products(list){

    console.log(list)

    return list.map(value => `
        <div class="p-item">
            <a href="../productDetails.html?table=${value.table}&id=${value.id}" class="item-img"><img src="${value.imageList[0]}" alt=""></a>
            <div class="item-text">
                <a href="../productDetails.html?table=${value.table}&id=${value.id}" class="item-name">${value.name}</a>
                <p class="item-info"><span>Mã SP:</span><b> ${value.id}</b></p>
                <p class="item-info"><span>Bảo hành:</span><b> ${value.guarantee} Tháng</b></p>
                <p class="item-info"><span>Kho hàng:</span><b style="color: green;"> Còn hàng</b></p>
                <p class="p-price">${fmt(value.price + value.price*value.sale)} VNĐ</p>
            </div>
            <button class="btn-buy js-select-product">Thêm vào cấu hình <i class="fa-solid fa-angle-right"></i></button>
        </div>`
      ).join('')
}

function renderBrandsFilter(products, name, brands){
    if(brands.length === 0) return ''

    const checked = getCheckedValues(name);
    return `
        <div class="filter-item brand-filter">
            <p class="filter-name">Hãng sản xuất</p>
            <div class="filter-list-holder">
                ${brands.map(v => {
                    const isChecked = checked.includes(v);
                    const count = countMatch(products, name, v);
                    return `
                        <label>
                            <input type="checkbox" data-filter-name="${name}" value="${v}" ${isChecked ? 'checked' : ''}>
                            <span class="value-filter">${v} ${isChecked ? '(Xóa)' : ` (${count})`}</span>
                        </label>
                    `;
                }).join('')}
            </div>
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
        <div class="category-filter__price mb-[10px]">
            <h3 class="header-filter mb-[10px] text-[14px] font-bold" onclick="tooggleActiveSupport(this)">
                KHOẢNG GIÁ 
            </h3>
            <div class="nav-filter">
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
        </div>
    `;
}

function productBuildPC(data){
    console.log(data)

    const list = data?.products ?? [];

    // --- Brand: tự lấy giá trị duy nhất từ products ---
    const allBrands = [...new Set(list.filter(p => p.brand).map(p => p.brand))];
    const brands = [
        ...allBrands.filter(v => v !== 'Khác'),
        ...allBrands.filter(v => v === 'Khác')
    ];
    const brandBlock = renderBrandsFilter(list, 'brand', brands);

    // --- Price: tự tính range theo data thật ---
    const priceBlock = renderPriceFilter(list);

    // --- Attributes: tự dò mọi field bên trong product.attributes ---
    const attributeKeys = [...new Set(
        list.flatMap(p => p.attributes ? Object.keys(p.attributes) : [])
    )];

    const attributeBlocks = attributeKeys.map(key => {
        const values = [...new Set(
            list.filter(p => p.attributes?.[key]).map(p => p.attributes[key])
        )];
        return renderCheckboxAttribute(list, key, key, values);
    }).join('');

    return html`
        <div class="popup-select">
            <div class="popup-header">
                <p class="font-bold uppercase text-[20px]">Chọn linh kiện</p>
                <form action="" class="popup-search-holder w-[600px] flex item-center bg-[#fff] justify-space-between rounded-[3px] overflow-hidden text-[#000]">
                    <input type="text" name="" id="js-buildpc-search-keyword" placeholder="Bạn cần tìm linh kiện gì?" class="input-search w-[calc(100%-40px)] h-[34px] p-[0_12px] outline-none">
                    <button class="btn-search fa-solid fa-magnifying-glass w-[40px] h-[34px] text-[16px]"></button>
                </form>
            </div>
            <div class="popup-main">
                <div class="popup-filter-group max-[1199px]:hidden">
                    <p class="group-titlle">Lọc sản phẩm theo </p>
                    <div class="popup-filter-holder">
                        ${brandBlock}
                        ${priceBlock}
                        <div id="js-attr-list">
                            ${attributeBlocks}
                        </div>
                    </div>
                </div>
                <div class="popup-content-group">
                    <div class="sort-paging-group">
                        <div class="sort-block">
                            <div class="sort-wrapper">
                                <span>Sắp xếp: </span>
                                <select id="js-sort-holder" class="sort-select">
                                    <option value="">Tùy chọn</option>
                                    <option value="">Mới nhất</option>
                                    <option value="">Giá tăng dần</option>
                                    <option value="">Giá giảm dần</option>
                                    <option value="">Tên A->Z</option>
                                </select>
                            </div>
                            <div class="sort-other">
                                <button class="sort-btn btn-stock">Còn hàng</button>
                                <button class="sort-btn btn-clear btn-clear-pc">Xóa bộ lọc</button>
                            </div>
                        </div>
                        <div class="popup-paging js-paging"></div>
                    </div>
                    <div class="popup-product-list" id="js-holder-p_item">
                        ${products(data.products)}
                    </div>
                </div>
            </div>
        </div>
    `
}


export default connect(state => state.products)(productBuildPC)