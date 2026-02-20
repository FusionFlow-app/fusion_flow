export function addCustomBackground(area) {
    const background = document.createElement('div');

    background.classList.add('background');
    background.classList.add('fill-area');
    background.classList.add('rete-bg-grid');

    background.style.zIndex = '-1';
    background.style.position = 'absolute';
    background.style.top = '0';
    background.style.left = '0';
    background.style.width = '100%';
    background.style.height = '100%';
    background.style.pointerEvents = 'none';

    area.area.content.add(background);
}
