import html from "../core.js";
import { connect } from "../store.js";
import product from "./product.js";

function mainProductCategories(products){
    const items = Object.values(products)[0] || [];
    
    if (items.length === 0) {
        return `<div class="category-sort">
                    <div style="font-weight: 600; font-size: 14px;">
                        Tìm thấy
                        <span class="quantity" style="color: rgb(0 144 208);">0</span>
                        sản phẩm
                    </div>
                    <select class="sotting-product">
                        <option value="">Sắp xếp theo</option>
                        <option value="">Mới nhất</option>
                        <option value="">Giá tăng dần</option>
                        <option value="">Giá giảm dần</option>
                        <option value="">Tên A<i class="fa-solid fa-arrow-right-long"></i>Z</option>
                    </select>
                </div>
                <div class="category-products__list"><p class="no-products-available">Sản phẩm đang cập nhật...</p></div>`;
    }

    return html `
        <div class="category-sort">
            <div style="font-weight: 600; font-size: 14px;">
                Tìm thấy
                <span class="quantity" style="color: rgb(0 144 208);">${items.length}</span>
                sản phẩm
            </div>
            <select class="sotting-product">
                <option value="">Sắp xếp theo</option>
                <option value="">Mới nhất</option>
                <option value="">Giá tăng dần</option>
                <option value="">Giá giảm dần</option>
                <option value="">Tên A<i class="fa-solid fa-arrow-right-long"></i>Z</option>
            </select>
        </div>
        <div class="category-products__list">${items.map(value => product(value))}</div>
        <div class="category-products__paging"></div>
        
    `
}

export default connect(state => state.products)(mainProductCategories)