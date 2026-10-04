import getData from "../fetch.js";
import { attach } from "../store.js";
import mainProductCategories from "../component/mainProductCategories.js"

const api = 'http://localhost:3000/';
let listApi = [];
const params = new URLSearchParams(window.location.search);
const table = params.get('table');

if (!table) {
    console.error('Không có table trên URL');
}else{
    listApi.push(table)
}

function loadData(data){
    dispatch('addProducts', data);
    attach(mainProductCategories,'.category-products')
    
}

getData(api, ...listApi).then(data => loadData(data))