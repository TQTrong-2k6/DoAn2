import html from "../core.js";
import { connect } from "../store.js";

const href = window.location.href;


function renderChild(data){
    return data.map( value => 
        `<li><a class="hover-color" href="${href + `&category=${value}`}"><i class="fa-solid fa-angles-right"></i> ${value}</a></li>`
    ).join('')
}

function filterProducts(data){
    const products = Object.values(data).find(v => Array.isArray(v)) || [];
    const child = [...new Set(products.filter(value => value.category).map(value => value.category))];
    const category = new URLSearchParams(window.location.search).get('category') || '';

    return html`
        <div class="category-filter__heading">
            <h2>
                LỌC SẢN PHẨM
            </h2>
        </div>
        ${child.length ? (category ? '' : `
            <div class="category-filter__child">
                <h3 class="header-filter">
                    PC GAMING
                </h3>
                <ul>
                    ${renderChild(child)}
                </ul>
            </div>`) : ''}
        <div class="category-filter__price">
            <h3 class="header-filter">
                KHOẢNG GIÁ
            </h3>
            <ul class="price-products">
                <li>
                    <label>
                        <input type="checkbox" name="" id="">
                        10 triệu - 15 triệu (10)
                    </label>
                </li>
                <li>
                    <label>
                        <input type="checkbox" name="" id="">
                        10 triệu - 15 triệu (10)
                    </label>
                </li>
                <li>
                    <label>
                        <input type="checkbox" name="" id="">
                        10 triệu - 15 triệu (10)
                    </label>
                </li>
            </ul>
        </div>
        <div class="category-filter__brand">
            <h3 class="header-filter">
                THƯƠNG HIỆU
            </h3>
            <ul class="filter-products">
                <li>
                    <label>
                        <input type="checkbox" name="" id="">
                        ASUS
                    </label>
                </li>
                <li>
                    <label>
                        <input type="checkbox" name="other" id="">
                        Khác
                    </label>
                </li>
            </ul>
        </div>
        <div class="category-filter__attribute">
            <h3 class="header-filter">
                LỌC SẢN PHẨM
            </h3>
            <div class="parts-categories">
                <div class="parts-categories__filter">
                    <h4 class="parts-categories__filter--title">
                        Dòng CPU
                    </h4>
                    <ul>
                        <li>
                            <label>
                                <input type="checkbox" name="" id="">
                                ADM Ryzen 7
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" name="other" id="">
                                ADM Ryzen 9
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="parts-categories__filter">
                    <h4 class="parts-categories__filter--title">
                        Dung lượng RAM
                    </h4>
                    <ul>
                        <li>
                            <label>
                                <input type="checkbox" name="" id="">
                                8GB
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" name="other" id="">
                                16GB
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="parts-categories__filter">
                    <h4 class="parts-categories__filter--title">
                        GPU
                    </h4>
                    <ul>
                        <li>
                            <label>
                                <input type="checkbox" name="" id="">
                                ADM RX 9070 XT 16GB
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="checkbox" name="other" id="">
                                ADM RX 9060 XT 16GB
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="parts-categories__filter">
                    <h4 class="parts-categories__filter--title">
                        Ổ cứng
                    </h4>
                    <ul>
                        <li>
                            <label>
                                <input type="checkbox" name="" id="">
                                SSD
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `
}
export default connect(state => state.products)(filterProducts)