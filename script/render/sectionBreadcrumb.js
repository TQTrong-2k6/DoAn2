function sectionBreadcrumb(steps){

    const items = steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return isLast
            ? `<li>${step.label}</li>`
            : `<li><a href="${step.href}">${step.label}</a></li>`;
    }).join('');

    const routingLink = `
        <div class="container">
            <ol class="routing-link">
                <li><a href="./index.html">Trang chủ</a></li>
                ${items}
            </ol>
        </div>
    `;

    document.querySelector('.section-breadcrumb').innerHTML = routingLink;
}

export default sectionBreadcrumb