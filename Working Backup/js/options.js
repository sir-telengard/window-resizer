
document.querySelector('#add').addEventListener('click', function () {
    var name = document.querySelector('#name').value;
    var width = document.querySelector('#width').value;
    var height = document.querySelector('#height').value;
    var left = document.querySelector('#left').value;
    var top = document.querySelector('#top').value;
    if (width && height) {
        width = parseInt(width, 10);
        height = parseInt(height, 10);
        width = width <= 0 ? 1 : width;
        height = height <= 0 ? 1 : height;
        var newItem = {
            name: name,
            width: width,
            height: height
        };
        if (left) {
            newItem.left = parseInt(left, 10);
        }
        if (top) {
            newItem.top = parseInt(top, 10);
        }
        var list = getList(storageName);
        list.push(newItem);
        setList(storageName, list);
        reloadPage();
    } else {
        alert('Please fill in the width and height!');
    }
});

function renderPresets() {
    const listEl = document.getElementById("list");
    let listStr = '';
    const list = getList(storageName);

    list.forEach(function (obj, index) {
        listStr += `<div class="item draggable" data-index="${index}">
            <button class="delete" data-index="${index}">delete</button>
            <button class="edit" data-index="${index}">edit</button>
            ${formatItem(obj)}
        </div>`;
    });

    listEl.innerHTML = listStr;

    document.querySelectorAll('.delete').forEach(function (ele) {
        ele.addEventListener('click', function () {
            var index = parseInt(this.getAttribute('data-index'), 10);
            var item = getList(storageName)[index];
            if (confirm('Confirm to delete "' + formatItem(item) + '" ?')) {
                deleteList(storageName, index);
                reloadPage();
            }
        });
    });

    document.querySelectorAll('.edit').forEach(function (ele) {
        ele.addEventListener('click', function () {
            var update = document.querySelector('#update');
            update.querySelectorAll('[disabled]').forEach(function (ele) {
                ele.removeAttribute('disabled');
            });
            var index = parseInt(this.getAttribute('data-index'), 10);
            var item = getList(storageName)[index];
            var indexEle = update.querySelector('.index');
            var nameEle = update.querySelector('.name');
            var widthEle = update.querySelector('.width');
            var heightEle = update.querySelector('.height');
            var leftEle = update.querySelector('.left');
            var topEle = update.querySelector('.top');
            var saveEle = update.querySelector('.save');
            indexEle.value = index;
            nameEle.value = item.name;
            widthEle.value = item.width;
            heightEle.value = item.height;
            leftEle.value = (typeof item.left === 'number') ? item.left : '';
            topEle.value = (typeof item.top === 'number') ? item.top : '';
            saveEle.addEventListener('click', function () {
                var index = parseInt(indexEle.value, 10);
                var name = nameEle.value;
                var width = widthEle.value;
                var height = heightEle.value;
                var left = leftEle.value;
                var top = topEle.value;
                if (width && height) {
                    width = parseInt(width, 10);
                    height = parseInt(height, 10);
                    width = width <= 0 ? 1 : width;
                    height = height <= 0 ? 1 : height;
                    var newItem = {
                        name: name,
                        width: width,
                        height: height
                    };
                    if (left) {
                        newItem.left = parseInt(left, 10);
                    }
                    if (top) {
                        newItem.top = parseInt(top, 10);
                    }
                    var list = getList(storageName);
                    list[index] = newItem;
                    setList(storageName, list);
                    reloadPage();
                } else {
                    alert('Please fill in the width and height!');
                }
            });
        });
    });

    Sortable.create(listEl, {
        animation: 150,
        onEnd: function (evt) {
            const from = evt.oldIndex;
            const to = evt.newIndex;
            if (from !== to) {
                moveList(storageName, from, to);
                reloadPage();
            }
        }
    });
}

(function () {
    var resetBtn = document.getElementById('reset');
    var exportBtn = document.getElementById('export');
    var importBtn = document.getElementById('import');
    resetBtn.addEventListener('click', function () {
        if (confirm('Confirm to restore the default settings? This will delete all custom resolution items.')) {
            setList(storageName, resolution);
            reloadPage();
        }
    });
    exportBtn.addEventListener('click', function () {
        var exportObj = {
            window_resizer: getList(storageName)
        };
        downloadFile('window_resizer-' + formatDate(new Date(), 'yyyy_MM_dd_HH_mm_ss') + '.json', JSON.stringify(exportObj));
    });
    importBtn.addEventListener('click', function () {
        var fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', function (e) {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var content = reader.result;
                var obj = JSON.parse(content);
                setList(storageName, obj.window_resizer);
                alert('Import successful!');
                reloadPage();
            }
            reader.readAsText(file);
        });
        fileInput.click();
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    renderPresets();
});
document.querySelector('#useCurrent').addEventListener('click', function () {
    chrome.windows.getCurrent({ populate: false }, function (win) {
        if (!win) return;

        const timestamp = new Date().toLocaleTimeString();
        const newItem = {
            name: `Window @ ${timestamp}`,
            width: win.width,
            height: win.height,
            left: win.left,
            top: win.top
        };

        var list = getList(storageName);
        list.push(newItem);
        setList(storageName, list);
        reloadPage();
    });
});
