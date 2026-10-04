import html from "../core.js";
import { connect } from "../store.js";
import product from './product.js'

function flashSale({...products}){
    const allProducts = Object.entries(products).flatMap(([table, items]) =>
        items.map(item => ({ ...item, table }))
    );

    const topSale = allProducts
        .filter(v => v.sale > 0)
        .sort((a, b) => b.sale - a.sale)
        .slice(0, 10);

    return html`
    <div class="swiper-wrapper">
        ${topSale.map(v => product(v))}
    </div>
    <div class="swiper-button-next  swiper-custom-btn"></div>
    <div class="swiper-button-prev  swiper-custom-btn"></div>
    `
    
}

export default connect(state => state.products)(flashSale)