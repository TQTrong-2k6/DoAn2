import html from "../core.js";
import { connect } from "../store.js";
import pcGaming from "./product.js";


function mainProduct(products){
    return html`
    <div class="category-box">
        <div class="header-category">
            <h2><span>PC GAMING</span></h2>
            <ul>
                <li><a href="./index.html">PC GAMING GIÁ RẺ</a></li>
                <li><a href="./index.html">PC STREAM GAME</a></li>
                <li><a href="./index.html">PC GAMING PREMIUM</a></li>
                <li><a href="./index.html">PC Core Ultra</a></li>
                <li><a href="./index.html">PC GAMING CAO CẤP</a></li>
            </ul>
            <a href="./index.html">Xem tất cả <i class="fa-solid fa-angles-right"></i></a>
        </div>
        <div class="product-category">
            <div class="swiper swiper-collection-product swiper-initialized swiper-horizontal swiper-pointer-events">
                <div class="swiper-wrapper">
                    ${(products.pc || []).filter(value => value.category === 'pcGaming')
                            .slice(0, 10)
                            .map(value => pcGaming(value))}
                </div>
                <div class="swiper-button-next  swiper-custom-btn"></div>
                <div class="swiper-button-prev  swiper-custom-btn"></div>
            </div>
        </div>
    </div>
    <div class="category-box">
        <div class="header-category">
            <h2><span>PC MINI</span></h2>
            <a href="./index.html">Xem tất cả <i class="fa-solid fa-angles-right"></i></a>
        </div>
        <div class="product-category">
            <div class="swiper swiper-collection-product swiper-initialized swiper-horizontal swiper-pointer-events">
                <div class="swiper-wrapper">
                    ${(products.pc || []).filter(value => value.category === 'mini')
                        .slice(0, 10)
                        .map(value => pcGaming(value))}
                </div>
                <div class="swiper-button-next  swiper-custom-btn"></div>
                <div class="swiper-button-prev  swiper-custom-btn"></div>
            </div>
        </div>
    </div>
    <div class="category-box">
        <div class="header-category">
            <h2><span>PC WORKSTATION 2D 3D</span></h2>
            <a href="./index.html">Xem tất cả <i class="fa-solid fa-angles-right"></i></a>
        </div>
        <div class="product-category">
            <div class="swiper swiper-collection-product swiper-initialized swiper-horizontal swiper-pointer-events">
                <div class="swiper-wrapper">
                    ${(products.pc || []).filter(value => value.category === 'pcWorkstation')
                        .slice(0, 10)
                        .map(value => pcGaming(value))}
                </div>
                <div class="swiper-button-next  swiper-custom-btn"></div>
                <div class="swiper-button-prev  swiper-custom-btn"></div>
            </div>
        </div>
    </div>
    <div class="category-box">
        <div class="header-category">
            <h2><span>PC VĂN PHÒNG</span></h2>
            <a href="./index.html">Xem tất cả <i class="fa-solid fa-angles-right"></i></a>
        </div>
        <div class="product-category">
            <div class="swiper swiper-collection-product swiper-initialized swiper-horizontal swiper-pointer-events">
                <div class="swiper-wrapper">
                    ${(products.pc || []).filter(value => value.category === 'pcOffice')
                        .slice(0, 10)
                        .map(value => pcGaming(value))}
                </div>
                <div class="swiper-button-next  swiper-custom-btn"></div>
                <div class="swiper-button-prev  swiper-custom-btn"></div>
            </div>
        </div>
    </div>
    <div class="category-box">
        <div class="header-category">
            <h2><span>Màn hình máy tính</span></h2>
            <a href="./index.html">Xem tất cả <i class="fa-solid fa-angles-right"></i></a>
        </div>
        <div class="product-category">
            <div class="swiper swiper-collection-product swiper-initialized swiper-horizontal swiper-pointer-events">
                <div class="swiper-wrapper">
                    ${(products.screen || []).slice(0, 10)
                        .map(value => pcGaming(value))}
                </div>
                <div class="swiper-button-next  swiper-custom-btn"></div>
                <div class="swiper-button-prev  swiper-custom-btn"></div>
            </div>
        </div>
    </div>
    <div class="category-box">
        <div class="header-category">
            <h2><span>Linh kiện máy tính</span></h2>
            <a href="./index.html">Xem tất cả <i class="fa-solid fa-angles-right"></i></a>
        </div>
        <div class="product-category">
            <div class="swiper swiper-collection-product swiper-initialized swiper-horizontal swiper-pointer-events">
                <div class="swiper-wrapper">
                    ${(products.computerComponents || []).slice(0, 10)
                        .map(value => pcGaming(value))}
                </div>
                <div class="swiper-button-next  swiper-custom-btn"></div>
                <div class="swiper-button-prev  swiper-custom-btn"></div>
            </div>
        </div>
    </div>
    <div class="category-box">
        <div class="header-category">
            <h2><span>LAPTOP</span></h2>
            <a href="./index.html">Xem tất cả <i class="fa-solid fa-angles-right"></i></a>
        </div>
        <div class="product-category">
            <div class="swiper swiper-collection-product swiper-initialized swiper-horizontal swiper-pointer-events">
                <div class="swiper-wrapper">
                    ${(products.laptop || []).slice(0, 10)
                        .map(value => pcGaming(value))}
                </div>
                <div class="swiper-button-next  swiper-custom-btn"></div>
                <div class="swiper-button-prev  swiper-custom-btn"></div>
            </div>
        </div>
    </div>
    `
}

export default connect(state => state.products)(mainProduct)