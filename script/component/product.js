import html from "../core.js"

const toNumber = str => Number(String(str).replace(/[^\d]/g, ''));
const fmt = n => Math.round(n).toLocaleString('vi-VN') + ' VNĐ';

function product(product){
    const price = toNumber(product.price);
    const salePrice = price * (1 - product.sale);

    return html`
        <div class="swiper-slide product" data-id="${product.id}">
            <div class="p-item">
                <a href="" class="p-image">
                    <img src="${product.imageList[0]}" alt="">
                </a>
                <a href="">
                    <h3 class="p-name line-clamp-2">
                        ${product.name}
                    </h3>
                </a>
                <div class="p-price">
                    <div class="p-price-wrapper">
                        ${product.sale > 0 ?
                        `<p class="p-price-sale">${fmt(salePrice)}</p>
                        <del class="p-price-market">${fmt(price)}</del>`
                        : `<p class="p-price-sale">${fmt(price)}</p>`}
                    </div>
                    <div class="p-price-off">-${product.sale * 100}%</div>
                </div>
                <div class="p-bottom">
                    <button class="p-buy">
                        <p class="p-buy-inner">
                            <span class="p-buy-icon"><i class="fa-solid fa-cart-shopping"></i></span>
                            THÊM VÀO GIỎ
                        </p>
                    </button>
                    <p class="p-status">Còn hàng</p>
                </div>
            </div>
        </div>`
}

export default product