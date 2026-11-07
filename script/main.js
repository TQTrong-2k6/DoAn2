function tooggleActive(el){
    const element = document.querySelector(el);
    element.classList.toggle('active');
}

function tooggleActiveSupport(header){
    const navFilter = header.nextElementSibling;
    const isCurrentlyActive = navFilter.classList.contains('active');

    document.querySelectorAll('.nav-filter.active')
        .forEach(el => el.classList.remove('active'));

    if (!isCurrentlyActive) {
        navFilter.classList.add('active');
    }
}

document.addEventListener('click', (e) => {
    // Bất kỳ khối nào có header-filter + nav-filter kế tiếp đều được coi là "vùng filter"
    const isInsideFilter = e.target.closest('.header-filter, .nav-filter');
    if (isInsideFilter) return;

    document.querySelectorAll('.nav-filter.active')
        .forEach(el => el.classList.remove('active'));
});

window.addEventListener('scroll', () => {
    const width = window.innerWidth;

    const mobileSearch = document.querySelector('.mobile-seach')
    const headerMobile = document.querySelector('.header-mobile')
    
    if(width >= 1200){
        const px = 450;
        const stickyHeader = document.querySelector('.sticky-header');

        window.scrollY > px ? stickyHeader.style.display = 'flex' : stickyHeader.style.display = 'none'
    }else if(width < 1200){
        
        if (window.scrollY >= 80) {
            mobileSearch.classList.add('show');
            headerMobile.classList.remove('active');

        } else {
            mobileSearch.classList.remove('show');
            headerMobile.classList.add('active');
        }
    }
});
document.querySelector('.global-menu').addEventListener('click', (e) => {
    const trigger = e.target.closest('.js-global-menu-child-click');
    if (!trigger) return;

    const subItem = trigger.closest('.global-menu__sub-item');
    subItem.classList.toggle('active');
});
