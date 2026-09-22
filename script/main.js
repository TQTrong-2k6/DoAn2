window.addEventListener('scroll', () => {
    const width = window.innerWidth;

    if(width >= 1200){
        const px = 450;
        const stickyHeader = document.querySelector('.sticky-header');

        window.scrollY > px ? stickyHeader.style.display = 'flex' : stickyHeader.style.display = 'none'
    }
})
function addActive(el){
    const getElement = document.querySelector(el);
    getElement.classList.add('active');
}
function removeActive(el){
    const getElement = document.querySelector(el);
    getElement.classList.remove('active');
}

document.querySelector('.global-menu').addEventListener('click', (e) => {
    const trigger = e.target.closest('.js-global-menu-child-click');
    if (!trigger) return;

    const subItem = trigger.closest('.global-menu__sub-item');
    subItem.classList.toggle('active');
});