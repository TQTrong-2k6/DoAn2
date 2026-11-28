import BASE_URL from '../config.js';
import getData from "../fetch.js";
import { attach } from "../store.js";
import productBuildPC, {addProductToConfig} from "../component/mainBuildPC.js";
import {applyFilters} from "../util/filter.js";
import clampQuantity from "../util/clampQuantity.js"

let listApi = ["computerComponents", "screen"];
const pageSize = 20
let baseList = [];   // SP của danh mục đang mở
let filters = {};    // các checkbox đang được tick
let page = 1;
let category;
let itemDriveInfo; // Thẻ chứa loại linh kiện đang được target
let btn; // thẻ btn cần ẩn khi chọn linh kiện
let itemChange; // thẻ chứa linh kiện cần đổi
const MULTI_CATEGORIES = ['Ổ Cứng (SSD, HDD)', 'Tản nhiệt', 'screen'];

const fmt = n => Math.round(n).toLocaleString('vi-VN');
 
let productData = []; // mảng chứa sản phẩm

const data = await getData(BASE_URL, ...listApi);

productData = Object.entries(data).flatMap(([table, items]) =>
    items.map(item => ({ ...item, table }))
);

function updateTotals(){
    let sum = 0;

    document.querySelectorAll('.js-item-drive').forEach(row => {
        const unit = Number(row.dataset.unitPrice) || 0;
        const qty = Number(row.querySelector('.js-item-quantity').value) || 0;
        const total = unit * qty;

        row.querySelector('.js-item-total-price').textContent = `${fmt(total)} đ`;
        sum += total;
    });

    document.querySelector('.js-config-summary').textContent = fmt(sum);
    document.querySelector('.total-price-config').textContent = fmt(sum);
}

function hidden(e){
    document.querySelector(e).classList.add('hidden');
}

function getParent(element, selector){ // hàm lấy parentElement cần tìm ngược
    do{
        if(element.parentElement.matches(selector)){
            return element.parentElement;
        }
        element = element.parentElement;
    }while(element.parentElement);
}

function resetAddConfig(info){ // sau khi xóa linh kiện
    const btn = info.querySelector('.js-open-selection');

    if (!MULTI_CATEGORIES.includes(btn.getAttribute('category')))
        return btn.classList.remove('!hidden');

    if (info.querySelector('.js-item-drive')) return;   // còn linh kiện thì giữ nguyên

    btn.style.marginLeft = '';                           // về bên trái
    const label = btn.querySelector('.add-more');
    if (label?.dataset.origin) label.textContent = label.dataset.origin;
}

function removeProduct(target){
    const info = getParent(target, '.js-item-drive-info');
    target.closest('.js-item-drive').remove();           // xóa đúng linh kiện được bấm
    resetAddConfig(info);
    updateTotals();
}

function checkAddConfig(btn){ // sau khi thêm linh kiện
    if (!MULTI_CATEGORIES.includes(btn.getAttribute('category')))
        return btn.classList.add('!hidden');

    btn.style.marginLeft = 'auto';
    const label = btn.querySelector('.add-more');
    label.dataset.origin ??= label.textContent;   // lưu chữ gốc ("Chọn Ổ Cứng"...)
    label.textContent = 'Chọn thêm';
}

function findProduct(table, id){ // hàm tìm kiếm sản phẩm theo id và danh mục
    return productData.find(p => p.table === table && String(p.id) === String(id));
}

function renderProduct(){ // hàm render sản phẩm
    const filtered = applyFilters(baseList, filters);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(page, totalPages);
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    dispatch('addProducts', { products: pageItems, filtered, filters });
    document.querySelector('.fancybox__viewport').classList.remove('hidden');
}

document.addEventListener('input', (e) => {
    const input = e.target.closest('.js-item-quantity');
    if (!input) return;
    input.value = input.value.replace(/\D/g, '');   // bỏ ký tự không phải số
    updateTotals();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpecModal();
});

document.addEventListener('click', e => {
    const popup = document.querySelector('.buildpc-popup');
    
    if (!popup.contains(e.target)) hidden('.fancybox__viewport') // ẩn giao diện lựa chọn linh kiện khi click ra ngoài

    if (e.target.closest('.remove-item')) return removeProduct(e.target); // xóa linh kiện khỏi cấu hình khi client nhấn xóa
    // thêm linh kiện đã chọn vào cấu hình cấu hình 
    
    if (e.target.closest('.btn-buy')) {
        const { id, table } = e.target.closest('.btn-buy').dataset;
        const product = findProduct(table, id);
        if (!product) return;

        if (itemChange) {
            // đang sửa: chèn linh kiện mới ngay vị trí cũ rồi xóa linh kiện cũ
            itemChange.insertAdjacentHTML('afterend', addProductToConfig(product));
            itemChange.remove();
            itemChange = null;
        } else {
            // thêm mới
            itemDriveInfo.querySelector('.js-item-row')
                .insertAdjacentHTML('beforeend', addProductToConfig(product));// innerHTML linh kiện vào cấu hình
            checkAddConfig(itemDriveInfo.querySelector('.js-open-selection'));
        }

        updateTotals();
        return hidden('.fancybox__viewport');
    }

    if (e.target.closest('.btn-clear-pc')) { // xóa tất cả lựa chọn lọc
        e.preventDefault();
        filters = {};
        page = 1;
        return renderProduct();
    }

    //tăng, giảm số lượng linh kiện
    const plus = e.target.closest('.js-qty-plus');
    const minus = e.target.closest('.js-qty-minus');
    if (plus || minus){
        const input = (plus || minus).closest('.js-item-drive')
            .querySelector('.js-item-quantity');
        if (!input) return;

        const current = clampQuantity(input.value, input);
        input.value = clampQuantity(current + (plus ? 1 : -1), input);
        updateTotals();
        return;
    }
    
    // nếu không phải nút sửa linh kiện hay nút thêm linh kiện thì ngừng hành động
    if (!e.target.closest('.js-open-selection') && !e.target.closest('.js-edit-item')) return; 
    e.preventDefault();

    btn = e.target.closest('.js-open-selection');
    
    if(e.target.closest('.js-edit-item')) // nếu người dùng nhấn sửa thì lưu linh kiện người dùng chọn để đổi linh kiện
        itemChange = e.target.closest('.js-edit-item')? e.target.closest('.js-item-drive') : null;

    itemDriveInfo = getParent(e.target, '.item-drive');

    category = e.target.hasAttribute('category') ? e.target.getAttribute('category') : getParent(e.target, '.js-open-selection').getAttribute('category');
    baseList = category === 'screen'
        ? productData.filter(p => p.table === category)
        : productData.filter(p => p.category === category);
    filters = {};   // mở danh mục mới thì reset bộ lọc
    page = 1;
    renderProduct();
    attach(productBuildPC, ".buildpc-popup");
})

document.addEventListener('change', (e) => {
    const input = e.target.closest('.js-item-quantity');
    if (input){
        input.value = clampQuantity(input.value, input); // rỗng/0/quá lớn thì đưa về hợp lệ
        updateTotals();
        return
    }

    // nếu không thay đổi lựa chọn lọc thì return
    if (!e.target.matches('input[data-filter-name]')) return;

    const name = e.target.dataset.filterName;
    const set = new Set(filters[name] || []);
    e.target.checked ? set.add(e.target.value) : set.delete(e.target.value);

    filters[name] = [...set];
    page = 1;   // lọc xong về trang 1
    renderProduct();
});