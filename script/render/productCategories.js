import getData from "../fetch.js";
import { attach } from "../store.js";
import mainProductCategories from "../component/mainProductCategories.js"
import sectionBreadcrumb from "./sectionBreadcrumb.js";

const api = 'http://localhost:3000/';
let listApi = [];
const params = new URLSearchParams(window.location.search);
const table = params.get('table');
const category = params.get('category');
const sort = params.get('sort') || ''; 

const sortting ={
    newest: '?_sort=-id',
    'price-asc': '/?_sort=price',
    'price-desc': '/?_sort=-price',
    'name-asc': '/?_sort=name'
}

const CATEGORY_LABELS = { // label danh mục
    pcGaming: 'PC GAMING',
    mini: 'PC MINI',
    pcWorkstation: 'PC WORKSTATION 2D 3D',
    pcAi: 'PC AI - TRÍ TUỆ NHÂN TẠO',
    pcOffice: 'PC VĂN PHÒNG',
    computerComponents: 'Linh kiện máy tính',
    screen: 'Màn hình máy tính',
    gaminggear: 'Gaming Gear',
    laptop: 'LAPTOP'
};

if (!table) {
    console.error('Không có table trên URL');
}else{
    listApi.push(sortting[sort] ? table + sortting[sort] : table)
}

const breadcrumbSteps = category ? [//Mục đường dẫn tự động
    {label: CATEGORY_LABELS[table] || table, href: `./productCategories.html?table=${table}`},
    {label: category}
] : [
    {label: CATEGORY_LABELS[table] || table}
]

sectionBreadcrumb(breadcrumbSteps);

const titleWebsite = {
    computerComponents: 'Linh kiện máy tính',
    screen: 'Màn hình máy tính',
    laptop: 'LAPTOP',
    gaminggear: 'Gaming Gear',
    pcAI: 'PC AI - TRÍ TUỆ NHÂN TẠO',
}

titleWebsite[table] && (document.title = titleWebsite[table]);

function loadData(data){
    let items = Object.values(data)[0] || [];

    if (category) {
        items = items.filter(p => p.category === category);
    }

    dispatch('addProducts', { [table]: items });
    attach(mainProductCategories,'.category-products')//render
}

getData(api, ...listApi).then(data => loadData(data))//call api