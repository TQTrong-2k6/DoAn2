import html from "../core.js";
import { connect } from "../store.js";
import product from "./product.js";

const fmt = n => Math.round(n).toLocaleString('vi-VN') + ' đ';

const CATEGORY_LABELS = { // label danh mục
    pcGaming: 'PC GAMING',
    pcMini: 'PC MINI',
    pcWorkstation: 'PC WORKSTATION 2D 3D',
    pcAi: 'PC AI - TRÍ TUỆ NHÂN TẠO',
    pcOffice: 'PC VĂN PHÒNG',
    computerComponents: 'Linh kiện máy tính',
    screen: 'Màn hình máy tính',
    gaminggear: 'Gaming Gear',
    laptop: 'LAPTOP'
};
function galleryThumbs(imageList){
    return imageList ? imageList.length > 1 ? imageList.map(value =>`
            <div class="swiper-slide">
                <div class="si-wrapper">
                    <div class="si-block">
                        <img class="si-content" src="${value}" alt="" width="100">
                    </div>
                </div>
            </div>
        `).join('') : '' : ''
}
function swiperWrapper(imageList){
    return imageList ? imageList.map(value =>`
            <div class="swiper-slide" style="width: 582px;">
                <a href="" class="main-image">
                    <img class="si-content" src="${value}" alt="" width="582">
                </a>
            </div>
        `).join('') : ''
}
function describe(arr){
    return arr ? 
        arr.map(value =>`
            <li class="product-summary__child">
                <i class="fa-solid fa-circle-check"></i>
                <span class="product-summary__content">
                    ${value}
                </span>
            </li>
        `).join('') : ''
}
function offer(arr){
    return arr ?
        arr.map(key =>`
            <li class="flex items-start gap-[8px] mb-[6px]">
                <i class="fa-solid fa-gift" style="color: #ff0000;"></i>
                <div class="flex-1">
                    <p>
                        <strong>
                            <span class="text-[#e03e2d]">
                                <span class="text-[#000]">Upgrade lên </span>
                                ${Object.keys(key)}
                                <span class="text-[#000]">thêm </span>
                                ${fmt(Object.values(key)).replaceAll(" ", "")}
                            </span>
                        </strong>
                    </p>
                </div>
            </li>
        `).join('') : ''
}
function renderSpecificationsPC(key, values, index){
    return `
        <tr class="text-center">
            <td>${index}</td>
            <td>${key}</td>
            <td>${values[0]}</td>
            <td>${values[1]}</td>
        </tr>
    `
}
function renderSpecificationsOther(key, values){
    
    if(typeof values !== 'string')
        return `
            <tr class="">
                <td rowspan="${values.length}">${key}</td>
                <td>${values[0]}</td>
            </tr>
            ${values.map((v, i) => {
                if(i > 0)
                return`
                    <tr class="">
                        <td>${v}</td>
                    </tr>
                `}).join('')}
        ` 
    return `
        <tr class="">
            <td>${key}</td>
            <td>${values}</td>
        </tr>
    `
}
function mainProductDetails(data){
    const products = Object.values(data).find(v => Array.isArray(v)) || [];

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const id = params.get('id');

    const productTarget = products.find(v => v.id === id);
    
    const price = productTarget.price;
    const salePrice = price * (1 - productTarget.sale);
    
    const monthlyPayment = price => Math.round(price * 0.7 * (1 + 0.015 * 12) / 12);

    const pc = ['pcGaming', 'pcMini', 'pcWorkstation', 'pcOffice', 'laptop'];

    let specifications;
    if(pc.includes(table)){
        const getSpecifications = productTarget.specifications ?? {};

        const render = Object.entries(getSpecifications)
        .map(([key, values], index) => {
            return renderSpecificationsPC(key, values, index + 1);
        })
        .join('');

        specifications = `
            <table dir="ltr" style="margin-left: auto; margin-right: auto; border: 1px solid #e5e7eb;" cellspacing="0" cellpadding="0">
                <colgroup>
                    <col width = 100>
                    <col width = 770>
                    <col width = 100>
                    <col width = 100>
                </colgroup>
                <tbody>
                    <tr class="text-center">
                        <td>STT</td>
                        <td>Mô tả thiết bị</td>
                        <td>SL</td>
                        <td>BH</td>
                    </tr>
                    ${render}
                </tbody>
            </table>
        `
    }else{
        const getSpecifications = productTarget.specifications ?? {};

        const render = Object.entries(getSpecifications)
        .map(([key, values], index) => {
            return renderSpecificationsOther(key, values);
        })
        .join('');
        console.log(render)
        specifications = `
            <table dir="ltr" style="margin-left: auto; margin-right: auto; border: 1px solid #e5e7eb;" cellspacing="0" cellpadding="0">
                <colgroup>
                    <col width = 100>
                    <col width = 170>
                </colgroup>
                <tbody>
                    ${render}
                </tbody>
            </table>
        `
    }
    
    
    return html`
        <div class="detail-top">
            <div class="detail-top__left">
                <div class="detail-gallery__top">
                    <div class="swiper gallery-top swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden">
                        <div class="swiper-wrapper" id="swiper-wrapper">
                            ${swiperWrapper(productTarget.imageList)}
                        </div>
                        <div class="swiper-button-next swiper-custom-btn"></div>
                        <div class="swiper-button-prev swiper-custom-btn"></div>
                    </div>
                </div>
                <div class="detail-gallery__bottom" style="margin-top: 12px;">
                    <div class="pro-gallery-thumbs">
                        <div class="swiper gallery-thumbs">
                            <div class="swiper-wrapper">
                                ${galleryThumbs(productTarget.imageList)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="detail-top__right">
                <h1 class="product-name">PC TTG DESIGNER -3D RENDER - EDIT VIDEO ULTRA 7 265KF - RTX 5060 Ti 8GB (All NEW - Bảo hành 36 tháng) (Cấu hình gốc)</h1>
                <div class="product-box">
                    <div class="product-price">
                        <p class="product-price-sale">
                            ${fmt(salePrice)}
                        </p>
                        <del class="product-price-market">
                            ${fmt(price)}
                        </del>
                        <p class="product-price-discount">
                            Tiết kiệm <span class="js-variant-discount-num">${fmt(price - salePrice).replaceAll("đ", "").trim()}</span>Đ
                        </p>
                    </div>
                    <div class="product-support">
                        <span class="product-wantary">
                            Bảo hành: ${productTarget.guarantee} Tháng
                        </span>
                        <a href="/" class="product-call-support">
                            <i class="fa-solid fa-share-nodes"></i> TƯ VẤN NÂNG CẤP
                        </a>
                    </div>
                </div>
                <div class="product-summary">
                    <p class="product-summary__header">Mô tả sản phẩm</p>
                    <ul class="product-summary__list">
                        ${describe(productTarget.describe)}
                    </ul>
                </div>
                ${pc.includes(table) ? `
                    <div class="product-offer my-[16px] border border-[#E3E3E3] rounded-[4px] overflow-hidden">
                        <p class="flex items-center gap-[6px] font-bold text-[#E40000] px-[9px] py-[12px] bg-[#F4F4F4] border-b border-b-[#E4E4E4]">
                            <i class="fa-solid fa-gift"></i>
                            KHUYẾN MÃI
                        </p>
                        <div class="px-[10px] pt-[14px] pb-[6px]">
                            <ul class="text-[13px] lengding-[20px]">
                                ${offer(productTarget.offer)}
                                <li class="flex items-start gap-[8px] mb-[6px]">
                                    <i class="fa-solid fa-gift" style="color: #ff0000;"></i>
                                    <div class="flex-1">
                                        <p>
                                            <span style="color: #ff0000; font-size: 12pt;">
                                                <strong>
                                                    <span class="text-[#000]">***</span>
                                                    <span class="text-[#000]">Lưu ý về hệ điều hành:</span>
                                                    Máy ráp sẵn tại APEX PC đã bao gồm
                                                    <span style="color: #000000;">Windows 10/11</span>
                                                    bản dùng thử trong 30 ngày.
                                                </strong>
                                            </span>
                                        </p>
                                    </div>
                                </li>
                                <li class="flex items-start gap-[8px] mb-[6px]">
                                    <i class="fa-solid fa-gift" style="color: #ff0000;"></i>
                                    <div class="flex-1">
                                        <p>
                                            <span style="color: #ff0000; font-size: 12pt;">
                                                <strong>
                                                    Bộ PC này đã áp dụng CTKM SHOCK nên sẽ không được Áp dụng CTKM Chung
                                                </strong>
                                            </span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                ` : ''}
                <div class="product-quantity flex items-center gap-[12px] my-[16px]">
                    <p class="font-bold">Số lượng</p>
                    <div class="flex border border-[#E3E3E3] rounded-[4px] overflow-hidden">
                        <input class="w-[50px] h-[50px] border-r border-r-[#E3E3E3] text-[16px] text-center lengding-[22px] p-[13px_5px] js-quantity-buy js-quantity-change" type="text" aria-label="Số lượng" value="1" min="1" max="999">
                        <div class="top-[1px] right-0 bottom-[0] w-[45px]">
                            <button class="flex items-center justify-center w-full h-[24px] hover:text-[var(--color-primary)]"><span class="text-[14px] w-[18px] h-[18px] !font-normal"><i class="fa-solid fa-plus"></i></span></button>
                            <div class="border-b w-full border-b-[#E3E3E3]"></div>
                            <button class="flex items-center justify-center w-full h-[24px] hover:text-[var(--color-primary)]"><span class="text-[14px] w-[18px] h-[18px] !font-normal"><i class="fa-solid fa-minus"></i></span></button>
                        </div>
                    </div>
                </div>
                <div class="product-buy grid grid-cols-2 gap-[12px] my-[16px]">
                    <button class="col-span-2 h-[56px] text-white text-[18px] leading-[56px] font-bold bg-[#ff0000] rounded-[4px] hover:bg-[#ea3511]" type="button">
                        ĐẶT HÀNG
                    </button>
                    <button class="h-[56px] text-[var(--color-primary)] text-[16px] leading-[56px] font-bold border border-[var(--color-primary)] rounded-[4px] hover:bg-[var(--color-primary)] hover:text-white">
                        THÊM VÀO GIỎ 
                    </button>
                    <button class="h-[56px] text-white font-bold bg-[#1877f2] rounded-[4px] hover:bg-[#1169db]">
                        <p class="header-btn">TRẢ GÓP QUA HỒ SƠ</p>
                        <p class="text-[13px] font-normal">
                            Chỉ từ ${fmt(monthlyPayment(salePrice)).replaceAll("đ", "")} VND/tháng
                        </p>
                    </button>
                </div>
                <div class="bk-btn">
                    <div class="bk-btn-box">
                        <button class="bk-btn-installment inline-block w-[287px] bg-[#288ad6] text-[#fff] p-[4px_10px] rounded-[4px] mb-[10px]">
                            <strong>TRẢ GÓP QUA THẺ</strong>
                            <br>
                            <span class="text-[13px]">Visa, Master, JCB</span>
                        </button>
                        <button class="bk-btn-installment inline-block w-[287px] bg-[#f1eb1f] text-[#235d97] p-[4px_10px] rounded-[4px]  mb-[10px]">
                            <strong>TRẢ GÓP QUA THẺ</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail-main my-[20px]">
            <div class="detail-info flex gap-[12px]">
                <div class="detail-spec flex-1 sticky top-[12px] h-max p-[18px_12px_15px] bg-white rounded-[8px]" data-limit="500">
                    <h2 class="text-[20px] font-semibold leading-[24px] pb-[12px] border-b border-b-[#E3E3E3]">THÔNG SỐ KỸ THUẬT</h2>
                    <div class="static-html condensed [&_table]:w-full [&_td]:p-[10px] [&_td[rowspan]]:!bg-white [&_tr:nth-child(2n+1)]:bg-[#F7F7F7]">
                        ${specifications}
                    </div>
                    <div class="mt-[4px] text-center">
                        <a href="" class="inline-flex items-center text-[var(--color-primary)] font-medium">
                            Xem thêm
                            <i class="fa-solid fa-angles-down" style="font-weight: 600; width: 16px; height: 16px; font-size: 12px; margin-top: 2px;"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="detail-similar p-[18px_12px_15px] my-[20px] bg-white rounded-[8px]">
                <div class="flex items-center justify-between pb-[12px] mb-[15px] border-b border-b-[#E3E3E3]">
                    <h3 class="text-[20px] font-semibold leading-[24px]">SẢN PHẨM TƯƠNG TỰ</h3>
                    <a href="./productCategories.html?table=${table}" class="group text-[13px] font-semibold text-[#004147] pt-[4px] hover:text-[var(--color-primary)]">
                        Xem tất cả
                        <i class="fa-solid fa-angles-right"></i>
                    </a>
                </div>
                <div class="swiper swiper-detail-similar-slider swiper-initialized swiper-horizontal swiper-pointer-events">
                    <div class="swiper-wrapper">
                        ${products.filter(v => v.id !== id).slice(0, 10).map( v => product(v, table))}
                    </div>
                    <div class="swiper-button-next swiper-custom-btn"></div>
                    <div class="swiper-button-prev swiper-custom-btn"></div>
                </div>
            </div>
        </div>
    `
}

export default connect(state => state.products)(mainProductDetails)