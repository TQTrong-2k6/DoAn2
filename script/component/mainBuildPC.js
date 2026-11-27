import html from "../core.js";
import { connect } from "../store.js";
import { countMatch} from "../util/filter.js";

const fmt = n => Math.round(n).toLocaleString('vi-VN');

function renderCheckboxAttribute(list, filters, name, title, values){
    if (values.length === 0) return '';
    const checked = filters[name] || [];

    return `
        <div class="filter-item brand-filter">
            <p class="filter-name">${title}</p>
            <div class="filter-list-holder">
                ${values.map(v => {
                    const isChecked = checked.includes(v);
                    return `
                        <label>
                            <input type="checkbox" data-filter-name="${name}" value="${v}" ${isChecked ? 'checked' : ''}>
                            ${v} ${isChecked ? '(Xóa)' : ` (${countMatch(list, name, v)})`}
                        </label>`;
                }).join('')}
            </div>
        </div>`;
}

function renderBrandsFilter(list, filters, name, brands){
    if (brands.length === 0) return '';
    const checked = filters[name] || [];

    return `
        <div class="filter-item brand-filter">
            <p class="filter-name">Hãng sản xuất</p>
            <div class="filter-list-holder">
                ${brands.map(v => {
                    const isChecked = checked.includes(v);
                    return `
                        <label>
                            <input type="checkbox" data-filter-name="${name}" value="${v}" ${isChecked ? 'checked' : ''}>
                            <span class="value-filter">${v} ${isChecked ? '(Xóa)' : ` (${countMatch(list, name, v)})`}</span>
                        </label>`;
                }).join('')}
            </div>
        </div>`;
}

function renderPriceFilter(list, filters){
    const prices = list.map(p => p.price).filter(p => typeof p === 'number');
    if (prices.length === 0) return '';

    const max = Math.max(...prices);
    const step = 5000000;
    const checked = filters.price || [];
    const items = [];

    for (let min = 0; min < max; min += step) {
        const value = `${min}-${min + step}`;
        const count = countMatch(list, 'price', value);
        if (count === 0) continue;   // khoảng không có SP thì bỏ
        const isChecked = checked.includes(value);

        items.push(`
            <li>
                <label>
                    <input type="checkbox" data-filter-name="price" value="${value}" ${isChecked ? 'checked' : ''}>
                    ${min / 1000000} - ${(min + step) / 1000000} triệu
                    ${isChecked ? '(Xóa)' : ` (${count})`}
                </label>
            </li>`);
    }

    if (items.length === 0) return '';

    return `
        <div class="category-filter__price mb-[10px]">
            <h3 class="header-filter mb-[10px] text-[14px] font-bold">KHOẢNG GIÁ</h3>
            <div class="nav-filter"><ul class="price-products">${items.join('')}</ul></div>
        </div>`;
}

function products(list){
    return list.map(value => `
        <div class="p-item">
            <a href="./productDetails.html?table=${value.table}&id=${value.id}" class="item-img"><img src="${value.imageList[0]}" alt=""></a>
            <div class="item-text">
                <a href="../productDetails.html?table=${value.table}&id=${value.id}" class="item-name">${value.name}</a>
                <p class="item-info"><span>Mã SP:</span><b> ${value.id}</b></p>
                <p class="item-info"><span>Bảo hành:</span><b> ${value.guarantee} Tháng</b></p>
                <p class="item-info"><span>Kho hàng:</span><b style="color: green;"> Còn hàng</b></p>
                <p class="p-price">${fmt(value.price + value.price*value.sale)} VNĐ</p>
            </div>
            <button class="btn-buy js-select-product" data-id="${value.id}" data-table="${value.table}">Thêm vào cấu hình <i class="fa-solid fa-angle-right"></i></button>
        </div>`
      ).join('')
}

function productBuildPC(data){
    const list = data?.filtered ?? []; // toàn bộ SP của danh mục -> dùng tạo bộ lọc
    const filters = data?.filters ?? {};

    const allBrands = [...new Set(list.filter(p => p.brand).map(p => p.brand))];
    const brands = [
        ...allBrands.filter(v => v !== 'Khác'),
        ...allBrands.filter(v => v === 'Khác')
    ];
    const brandBlock = renderBrandsFilter(list, filters, 'brand', brands);
    const priceBlock = renderPriceFilter(list, filters);

    const attributeKeys = [...new Set(list.flatMap(p => p.attributes ? Object.keys(p.attributes) : []))];
    const attributeBlocks = attributeKeys.map(key => {
        const values = [...new Set(list.filter(p => p.attributes?.[key]).map(p => p.attributes[key]))];
        return renderCheckboxAttribute(list, filters, key, key, values);
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


export function addProductToConfig(product){
    console.log(product)
    return html`
        <div class="contain-item-drive js-item-drive">
            <a href="" class="item-img">
                <img src="${product.imageList[0]}" alt="" width="80">
            </a>
            <div class="item-text">
                <div class="item-left">
                    <a href="" class="item-name">${product.name}</a>
                    <p>- Kho hàng: <b style="color: #00a400;">Còn hàng</b></p>
                    <p>- Mã SP: <b style="color: #d91605">${product.id}</b></p>
                    <p>- Bảo hành: <b style="color: #d91605">${product.guarantee} tháng</b></p>
                </div>
                <div class="item-right">
                    <div class="item-quantity-group mr-[10px]">
                        <b class="js-item-price">${fmt(product.price + product.price*product.sale)} VNĐ</b>
                        <span class="p-[0_5px] text-center">x</span>
                        <span class="item-quantity-change relative inline-block m-[0_5px] text-center">
                            <a class="fa-solid fa-minus rounded-[4px_0_0_4px] absolute bg-[#ddd] p-[9px_0] w-[25px] text-[12px] top-0"></a>
                            <input type="number" value="1" class="item-quantity js-item-quantity">
                            <a class="fa-solid fa-plus rounded-[0_4px_4px_0] absolute bg-[#ddd] p-[9px_0] w-[25px] text-[12px] top-0 right-0"></a>
                        </span>
                        <span class="p-[0_5px] text-center">=</span>
                        <b class="item-price js-item-total-price inline-block text-right text-[#f71400] min-w-[97px]">${fmt(product.price + product.price*product.sale)} đ</b>
                    </div>
                    <div class="item-button-group">
                        <button class="btn-action_seclect show-popup_select fa fa-edit js-edit-item text-[#1d7be5] text-[14px] ml-[9px]" category="CPU"></button>
                        <button class="btn-action_seclect show-popup_select fa fa-trash remove-item text-[#d91605] text-[14px] ml-[9px]"></button>
                    </div>
                </div>
            </div>
        </div>
    `
}