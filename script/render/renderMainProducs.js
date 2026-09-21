import getData from '../fetch.js'
import { attach } from '../store.js';
import flashSale from '../component/flashSale.js';

const api = 'http://localhost:3000/';
const listApi = ['pc', 'computerComponents', 'screen', 'gaminggear', 'laptop']

function loadData(data){
    dispatch('addProducts', data);
    attach(flashSale, "#flashSale")

    new Swiper('.swiper-collection-product', {
        slidesPerView: 5,
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
}
getData(api, ...listApi).then(data => loadData(data))
