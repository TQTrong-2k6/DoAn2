import html from "../core.js";
import { connect } from "../store.js";
import product from './product.js'

function flashSale({...products}){
    return html`
    <div class="swiper-wrapper">
        ${(products.pc || []).filter(v => v.sale > 0)
                    .slice(0, 10)
                    .map((value) => product(value))}
    </div>
    <div class="swiper-button-next  swiper-custom-btn"></div>
    <div class="swiper-button-prev  swiper-custom-btn"></div>
    `
    
}

export default connect(state => state.products)(flashSale)