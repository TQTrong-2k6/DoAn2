import getData from "../fetch.js";
import { attach } from "../store.js";
import mainProductCategories from "../component/mainProductCategories.js"
import sectionBreadcrumb from "./sectionBreadcrumb.js";

const api = 'http://localhost:3000/';
let listApi = [];
const params = new URLSearchParams(window.location.search);
const table = params.get('table');

if (!table) {
    console.error('Không có table trên URL');
}else{
    listApi.push(table)
    sectionBreadcrumb()
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
    attach(mainProductCategories,'.category-products')
    
}

getData(api, ...listApi).then(data => loadData(data))