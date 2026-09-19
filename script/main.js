//import {attach, connect} from './store.js'
//import html from './core.js';

// const withProducts = connect(state => state)

// const productList = withProducts(({ products }) => {
//     if (!products || products.length === 0) {
//         return html`<p>Đang tải dữ liệu...</p>`;
//     }
// });

//attach(productList, document.querySelector('.content'));

window.addEventListener('scroll', () => {
    const px = 450;
    const stickyHeader = document.querySelector('.sticky-header');

    window.scrollY > px ? stickyHeader.style.display = 'flex' : stickyHeader.style.display = 'none'
})