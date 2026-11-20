function initSpecimen(root) {
    if (!root) return;

    const stage = root.querySelector('.specimen-stage');
    const picker = root.querySelector('.view-picker');
    const slider = root.querySelector('input[type="range"]');

    function updateView() {
        const view = picker.querySelector('input:checked');
        const angle = view.parentElement.textContent.trim();
        stage.dataset.view = view.value;
        stage.setAttribute('aria-label', `${angle}正交渲染对比：左侧为剪前波浪长发，右侧为剪后短发`);
    }

    function updateSplit() {
        stage.style.setProperty('--split', `${slider.value}%`);
        slider.setAttribute('aria-valuetext', `剪前占 ${slider.value}%`);
    }

    function dragSplit(event) {
        const bounds = stage.getBoundingClientRect();
        slider.value = Math.round((event.clientX - bounds.left) / bounds.width * 100);
        updateSplit();
    }

    picker.addEventListener('change', updateView);
    slider.addEventListener('input', updateSplit);
    stage.addEventListener('pointerdown', (event) => {
        if (!event.isPrimary || event.button !== 0) return;
        stage.setPointerCapture(event.pointerId);
        dragSplit(event);
    });
    stage.addEventListener('pointermove', (event) => {
        if (stage.hasPointerCapture(event.pointerId)) dragSplit(event);
    });
    stage.classList.add('is-interactive');
    updateView();
    updateSplit();
    picker.hidden = false;
    slider.parentElement.hidden = false;
}

function initDemoSwitcher(root) {
    if (!root) return;

    const figures = [...root.querySelectorAll('figure')];
    if (figures.length < 2) return;

    const tabs = document.createElement('div');
    tabs.className = 'demo-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', '剪发视频');

    const buttons = figures.map((figure, index) => {
        const button = document.createElement('button');
        const order = document.createElement('span');
        order.textContent = String(index + 1).padStart(2, '0');
        order.setAttribute('aria-hidden', 'true');
        button.type = 'button';
        button.id = `${figure.id}-tab`;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', figure.id);
        button.append(order, figure.querySelector('figcaption strong').textContent);
        button.addEventListener('click', () => selectDemo(index));
        figure.setAttribute('role', 'tabpanel');
        figure.setAttribute('aria-labelledby', button.id);
        tabs.append(button);
        return button;
    });

    function selectDemo(active) {
        buttons.forEach((button, index) => {
            const selected = index === active;
            button.setAttribute('aria-selected', String(selected));
            button.tabIndex = selected ? 0 : -1;
            figures[index].hidden = !selected;
            if (!selected) figures[index].querySelector('video').pause();
        });
    }

    tabs.addEventListener('keydown', (event) => {
        const current = buttons.indexOf(event.target);
        if (current < 0) return;
        let next;
        switch (event.key) {
            case 'ArrowLeft': next = (current + buttons.length - 1) % buttons.length; break;
            case 'ArrowRight': next = (current + 1) % buttons.length; break;
            case 'Home': next = 0; break;
            case 'End': next = buttons.length - 1; break;
            default: return;
        }
        event.preventDefault();
        selectDemo(next);
        buttons[next].focus();
    });

    root.prepend(tabs);
    root.classList.add('has-switcher');
    selectDemo(0);
}
