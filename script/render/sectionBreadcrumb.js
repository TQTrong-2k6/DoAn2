function sectionBreadcrumb(){
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');

    const sectionBreadcrumb = {
        pcGaming: 'PC GAMING',
        pcMini: 'PC MINI',
        pcWorkstation: 'PC WORKSTATION 2D 3D',
        pcAI: 'PC AI - TRÍ TUỆ NHÂN TẠO',
        pcOffice: 'PC VĂN PHÒNG',
        computerComponents: 'Linh kiện máy tính',
        screen: 'Màn hình máy tính',
        gaminggear: 'Gaming Gear',
        laptop: 'LAPTOP'
    }
    const routingLink = `
        <div class="container">
            <ol class="routing-link">
                <li><a href="./index.html">Trang chủ</a></li>
                <li><a href="$./index.html">${sectionBreadcrumb[table]}</a></li>
            </ol>
        </div>
    `
    document.querySelector('.section-breadcrumb').innerHTML = routingLink
}

export default sectionBreadcrumb