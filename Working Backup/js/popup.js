window.addEventListener('DOMContentLoaded', (e) => {
    info();

    var list = getList(storageName);
    var listStr = '';
    list.forEach(function (obj) {
        var str =
            `<label class="switch-group" data-width="${obj.width}" data-height="${obj.height}" data-left="${(typeof obj.left === 'number') ? obj.left : ''}" data-top="${(typeof obj.top === 'number') ? obj.top : ''}">
                <div class="switch">
                    <span class="label">${formatItem(obj)}</span>
                </div>
            </label>`;
        listStr += str;
    });
    document.querySelector('#list').innerHTML = listStr;
    document.querySelector('body').style.display = 'block';

    document.querySelectorAll('.switch-group').forEach(function (ele) {
        ele.addEventListener('click', function () {
            var w = parseInt(this.getAttribute('data-width'), 10);
            var h = parseInt(this.getAttribute('data-height'), 10);
            var updateOptions = {
                width: w,
                height: h,
                state: 'normal'
            };
            var leftVal = this.getAttribute('data-left');
            var topVal = this.getAttribute('data-top');
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
        document.querySelector('#window').innerHTML = win.width + 'x' + win.height;
    });
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        document.querySelector('#viewport').innerHTML = tabs[0].width + 'x' + tabs[0].height;
    });
}
