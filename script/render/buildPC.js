import BASE_URL from '../config.js';
import getData from "../fetch.js";
import { attach } from "../store.js";
import productBuildPC from "../component/mainBuildPC.js";

let listApi = ["computerComponents", "screen"];
const pageSize = 20
const params = new URLSearchParams(location.search);
const page = Math.max(1, Number(params.get('page')) || 1);

let productData = [];

getData(BASE_URL, ...listApi).then(data => {
    productData = data;
})//call api

document.addEventListener('click', e => {
    const viewport = document.querySelector('.fancybox__viewport');
    const popup = document.querySelector('.buildpc-popup');

    if (!popup.contains(e.target)) {
        viewport.classList.add('hidden');
    }

    const btn = e.target.closest('.js-open-selection');
    if (!btn) return;
    e.preventDefault();

    const allProducts = Object.entries(productData).flatMap(([table, items]) =>
        items.map(item => ({ ...item, table }))
    );

    const category = btn.getAttribute('category');
    const page = Math.max(1, Number(params.get('page')) || 1);


    const list = category === 'screen' ? allProducts.filter(p => p.table === category) : allProducts.filter(p => p.category === category);

    const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageItems = list.slice((safePage - 1) * pageSize, safePage * pageSize);

    dispatch('addProducts', { products: pageItems});
    attach(productBuildPC, ".buildpc-popup");
    viewport.classList.remove('hidden');
})