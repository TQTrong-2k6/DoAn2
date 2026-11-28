import { attach } from '../store.js';
import shoppingCart from "../component/mainShoppingCart.js"
import storage from '../util/storage.js';
import clampQuantity from "../util/clampQuantity.js"

const fmt = n => Math.round(n).toLocaleString('vi-VN');

function loadData(){
    attach(shoppingCart, '.cart-page')
}

loadData()

const getCart = () => storage.get('cart') || [];

function saveCart(cart){
    if (cart.length) {
        storage.set('cart', cart);
    } else {
        localStorage.removeItem('cart');
    }
}

const cartTotal = cart => cart.reduce((a, v) => a + v.price * v.quantity, 0);

// Chỉ cập nhật các ô TỔNG TIỀN, không đụng vào giá từng dòng
function updateTotals(cart){
    const total = fmt(cartTotal(cart));
    document.querySelectorAll('.js-total-cart-price, .js-total-cart-price-temp')
        .forEach(v => v.textContent = total);
}

function renderEmpty(){
    const page = document.querySelector('.cart-page');
    if (page) page.innerHTML = `
        <div class="text-center p-[90px_0]">
            <p class="text-[20px] font-bold mb-[20px]"> Không có sản phẩm nào trong giỏ hàng, vui lòng quay lại </p>
            <a href="./index.html" class="text-[16px] text-red-600 font-semibold"><i class="fa-solid fa-arrow-left"></i> Quay lại trang chủ</a>  
        </div>`;
}

const isSame = (v, id, table) =>
    String(v.id) === String(id) && String(v.table) === String(table);

document.addEventListener('click', (e) => {
    // Xóa toàn bộ giỏ hàng
    if (e.target.closest('.js-clear-all-cart')) {
        if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
        localStorage.removeItem('cart');
        renderEmpty();
        return;
    }

    // Xóa 1 sản phẩm
    const remove = e.target.closest('.remove-product');
    if (remove) {
        const row = remove.closest('tr');
        if (row) removeProduct(row);
        return;
    }

    // Tăng / giảm số lượng
    const plus = e.target.closest('.js-qty-plus');
    const minus = e.target.closest('.js-qty-minus');
    if (!plus && !minus) return;

    const control = (plus || minus).closest('.unit-detail-amount-control');
    const input = control?.querySelector('.js-quantity-buy');
    if (!input) return;

    input.value = clampQuantity(clampQuantity(input.value, input) + (plus ? 1 : -1), input);
    changeQuantity(input);
});

document.addEventListener('change', (e) => {
    const input = e.target.closest('.js-quantity-buy');
    if (!input) return;
    input.value = clampQuantity(input.value, input);
    changeQuantity(input);
});

function changeQuantity(input){
    const control = input.closest('.unit-detail-amount-control');
    const row = input.closest('tr');
    if (!control || !row) return;

    const { id, table } = control.dataset;
    const quantity = Number(input.value);

    const cart = getCart().map(v =>
        isSame(v, id, table) ? { ...v, quantity } : v
    );
    saveCart(cart);

    // cập nhật giá của đúng dòng này (các .js-total-item-price nằm trong <tr> đó)
    const item = cart.find(v => isSame(v, id, table));
    if (item) {
        row.querySelectorAll('.js-total-item-price')
            .forEach(el => el.textContent = fmt(item.price * item.quantity));
    }
    updateTotals(cart);
}

function removeProduct(row){
    const control = row.querySelector('.unit-detail-amount-control');
    if (!control) return;
    const { id, table } = control.dataset;

    const cart = getCart().filter(v => !isSame(v, id, table));
    saveCart(cart);      // rỗng thì tự xóa 'cart' khỏi localStorage

    row.remove();        // xóa dòng khỏi giao diện

    if (cart.length === 0) {
        renderEmpty();
    } else {
        updateTotals(cart);
    }
}