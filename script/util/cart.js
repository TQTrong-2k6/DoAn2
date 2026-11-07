import storage from "./storage.js";
import BASE_URL from "../config.js";

const observer = new MutationObserver(() => {
    if (document.querySelector('.js-header-cart-amount')) {
        isEmpty();
        observer.disconnect();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

export function getCartCount(){
    return (storage.get('cart') || []).length;
}

export function isEmpty(){
    const total = getCartCount();
    document.querySelectorAll('.js-header-cart-amount').forEach(el => {
        el.textContent = total;
        el.classList.toggle('is-empty', total > 0);
    });
}

export function addToCart(table, product, quantity = 1){
    const cart = storage.get('cart') || [];

    const existing = cart.find(item => item.id === product.id && item.table === table);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            table,
            id: product.id,
            name: product.name,
            image: product.imageList?.[0] ?? '',
            price: product.price * (1 - product.sale),
            guarantee: product.guarantee,
            quantity
        });
    }

    storage.set('cart', cart);

    isEmpty();
}

// Listener bắt click nút "THÊM VÀO GIỎ"
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;

    const { table, id } = btn.dataset;

    // Trang chi tiết: lấy số lượng từ ô input; card sản phẩm: mặc định 1
    const qtyInput = btn.closest('.detail-top__right')?.querySelector('.js-quantity-buy');
    const quantity = Math.max(1, Number(qtyInput?.value) || 1);

    try {
        const res = await fetch(`${BASE_URL}${table}/${id}`);
        if (!res.ok) throw new Error(`Không tìm thấy sản phẩm (${res.status})`);

        const product = await res.json();
        addToCart(table, product, quantity);
    } catch (err) {
        console.error('Thêm giỏ hàng thất bại:', err);
    }
});