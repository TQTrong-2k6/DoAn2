import BASE_URL from '../config.js'
import getData from "../fetch.js";
import { attach } from "../store.js";
import mainProductDetails from "../component/mainProductDetails.js"
import sectionBreadcrumb from "./sectionBreadcrumb.js";

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

document.addEventListener('click', (e) => {
    // Mở modal khi bấm "Xem thêm"
    if (e.target.closest('.spec-open-btn')) {
        document.querySelector('.spec-modal-overlay')?.classList.add('active');
        return;
    }

    // Đóng khi bấm nút X
    if (e.target.closest('.spec-modal-close')) {
        document.querySelector('.spec-modal-overlay')?.classList.remove('active');
        return;
    }

    // Đóng khi click ra NGOÀI .spec-modal (nhưng vẫn trong overlay)
    if (e.target.classList.contains('spec-modal-overlay')) {
        e.target.classList.remove('active');
    }
});