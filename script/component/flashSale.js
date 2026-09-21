import html from "../core.js";
import { connect } from "../store.js";
import flashSaleProduct from './flashSaleProduct.js'

function flashSale(products){
    console.log(products)
    return html`
    <div class="swiper-wrapper">
        ${(products.products.pc || []).filter(v => v.sale > 0)
                    .map((value) => flashSaleProduct(value))}
    </div>
    <div class="swiper-button-next  swiper-custom-btn"></div>
    <div class="swiper-button-prev  swiper-custom-btn"></div>
    `
    
}

export default connect()(flashSale)