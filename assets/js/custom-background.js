export function addCustomBackground(area) {
    const background = document.createElement('div');

    background.classList.add('background');
    background.classList.add('fill-area');

    background.style.zIndex = '-1';
    background.style.position = 'absolute';
    background.style.top = '0';
    background.style.left = '0';
    background.style.width = '100%';
    background.style.height = '100%';
    background.style.pointerEvents = 'none';
    background.style.backgroundSize = '50px 50px';
    background.style.backgroundImage = 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)';
    background.style.backgroundColor = 'white';

    area.area.content.add(background);
}
