import BASE_URL from '../config.js'
import getData from "../fetch.js";
import { attach } from "../store.js";
import mainProductDetails from "../component/mainProductDetails.js"

const listApi = [];
const params = new URLSearchParams(window.location.search);
const table = params.get('table');

if (!table) {
    console.error('Không có table trên URL');
}else{
    listApi.push(table)
}

const titleWebsite = {
    computerComponents: 'Linh kiện máy tính',
    screen: 'Màn hình máy tính',
    laptop: 'LAPTOP',
    gaminggear: 'Gaming Gear',
    pcAI: 'PC AI - TRÍ TUỆ NHÂN TẠO',
}

titleWebsite[table] && (document.title = titleWebsite[table]);

function loadData(data){
    dispatch('addProducts', data);
    attach(mainProductDetails, ".product-detail__content")

    const galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 5,
        freeMode: true,
        watchSlidesProgress: true,
        speed: 1000,
    });

    const galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 12,
        speed: 1000,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: galleryThumbs,
        },
    });

    const width = window.innerWidth;
    let quantity;
    if(width >= 1200)
        quantity = 5;
    else if(width < 1200 && width > 720)
        quantity = 3;
    else
        quantity = 2;
    new Swiper('.swiper-detail-similar-slider', {
        slidesPerView: quantity,
        spaceBetween: 10,
        rewind: true,                // tới slide cuối thì trượt ngược về slide đầu
        speed: 1000,                 // thời gian chuyển slide (ms)
        
        autoplay: {
            delay: 3000,            // tự chuyển sau 3 giây
            disableOnInteraction: false,  // vẫn tự chạy sau khi người dùng kéo/bấm
            pauseOnMouseEnter: true,      // dừng khi rê chuột vào
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
}

getData(BASE_URL, ...listApi).then(data => loadData(data))//call api

const fancybox = document.querySelector('.fancybox-container');

function openSpecModal() {
    const source = document.querySelector('.detail-spec .static-html.condensed');
    const target = document.querySelector('.fancybox-content .static-html');
    if (!source || !target) return;

    target.innerHTML = source.innerHTML;
    fancybox.classList.add('is-open');
    document.body.classList.add('no-scroll');
}

function closeSpecModal() {
    fancybox.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.see-more')) {
        e.preventDefault();
        openSpecModal();
        return;
    }

    // Click ra ngoài .fancybox-content thì đóng
    if ((fancybox.classList.contains('is-open') && !e.target.closest('.fancybox-content')) || e.target.closest('.fancybox-close__btn')) {
        closeSpecModal();
    }

    const plus = e.target.closest('.js-qty-plus');
    const minus = e.target.closest('.js-qty-minus');
    if (!plus && !minus) return;

    const input = document.querySelector('.js-quantity-buy');
    if (!input) return;

    const current = clampQuantity(input.value, input);
    input.value = clampQuantity(current + (plus ? 1 : -1), input);
});

document.addEventListener('input', (e) => {
    const input = e.target.closest('.js-quantity-buy');
    if (!input) return;
    input.value = input.value.replace(/\D/g, '');   // bỏ ký tự không phải số
});

document.addEventListener('change', (e) => {
    const input = e.target.closest('.js-quantity-buy');
    if (!input) return;
    input.value = clampQuantity(input.value, input); // rỗng/0/quá lớn thì đưa về hợp lệ
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpecModal();
});

function clampQuantity(value, input) {
    const min = Number(input.min) || 1;
    const max = Number(input.max) || 999;
    let n = parseInt(value, 10);
    if (isNaN(n)) n = min;
    return Math.min(Math.max(n, min), max);
}
