window.addEventListener('DOMContentLoaded', () => {
    info();

    const list = getList(storageName);
    const listContainer = document.querySelector('#list');
    listContainer.innerHTML = ''; // Clear any existing content

    list.forEach(function (obj) {
        const label = document.createElement('label');
        label.className = 'switch-group';
        label.dataset.width = obj.width;
        label.dataset.height = obj.height;
        if (typeof obj.left === 'number') label.dataset.left = obj.left;
        if (typeof obj.top === 'number') label.dataset.top = obj.top;

        const switchDiv = document.createElement('div');
        switchDiv.className = 'switch';

        const span = document.createElement('span');
        span.className = 'label';
        span.textContent = formatItem(obj);

        switchDiv.appendChild(span);
        label.appendChild(switchDiv);
        listContainer.appendChild(label);
    });

    document.body.style.display = 'block';

    document.querySelectorAll('.switch-group').forEach(function (ele) {
        ele.addEventListener('click', function () {
            const w = parseInt(this.getAttribute('data-width'), 10);
            const h = parseInt(this.getAttribute('data-height'), 10);
            const updateOptions = {
                width: w,
                height: h,
                state: 'normal'
            };
            const leftVal = this.getAttribute('data-left');
            const topVal = this.getAttribute('data-top');
            if (leftVal !== null && leftVal !== '') {
                updateOptions.left = parseInt(leftVal, 10);
            }
            if (topVal !== null && topVal !== '') {
                updateOptions.top = parseInt(topVal, 10);
            }
            chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, updateOptions, function () {
                window.close();
            });
        });
    });

    document.querySelector('#options').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
        window.close();
    });
});

function info() {
    chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, function (win) {
        const windowDiv = document.querySelector('#window');
        windowDiv.textContent = `${win.width}x${win.height}`;
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const viewportDiv = document.querySelector('#viewport');
        viewportDiv.textContent = `${tabs[0].width}x${tabs[0].height}`;
    });
}
