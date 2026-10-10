import BASE_URL from '../config.js'
import getData from '../fetch.js'
import { attach } from '../store.js';
import flashSale from '../component/flashSale.js';
import mainProduct from '../component/mainProduct.js';

const listApi = ['pcGaming', 'pcMini', 'pcWorkstation', 'pcOffice', 'computerComponents', 'screen', 'laptop'];

function loadData(data){
    dispatch('addProducts', data);
    attach(flashSale, "#flashSale")
    attach(mainProduct, '.section-category')
    
    const width = window.innerWidth;
    let quantity;
    if(width >= 1200)
        quantity = 5;
    else if(width < 1200 && width > 720)
        quantity = 3;
    else
        quantity = 2;
    new Swiper('.swiper-collection-product', {
        slidesPerView: quantity,
        spaceBetween: 10,
        rewind: true,                // tới slide cuối thì trượt ngược về slide đầu
        speed: 600,                 // thời gian chuyển slide (ms)
        
        autoplay: {
            delay: 3000,            // tự chuyển sau 3 giây
            disableOnInteraction: false,  // vẫn tự chạy sau khi người dùng kéo/bấm
            pauseOnMouseEnter: true,      // dừng khi rê chuột vào
        },

        navigation: {
            nextEl: '.swiper-collection-product .swiper-button-next',
            prevEl: '.swiper-collection-product .swiper-button-prev',
        }
    });
};
getData(BASE_URL, ...listApi).then(data => loadData(data))