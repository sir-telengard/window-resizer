var resolution = [{
    "name": "",
    "width": 800,
    "height": 600
}, {
    "name": "",
    "width": 1024,
    "height": 768
}, {
    "name": "HD/720p",
    "width": 1280,
    "height": 720
}, {
    "name": "",
    "width": 1366,
    "height": 768
}, {
    "name": "",
    "width": 1440,
    "height": 900
}, {
    "name": "HD+/HD Plus/900p",
    "width": 1600,
    "height": 900
}, {
    "name": "FHD/Full HD/1080p",
    "width": 1920,
    "height": 1080
}, {
    "name": "QHD/WQHD/1440p",
    "width": 2560,
    "height": 1440
}, {
    "name": "4K UHD/Ultra HD/UHD",
    "width": 3840,
    "height": 2160
}, {
    "name": "DCI 4K/Digital Cinema Initiatives 4K",
    "width": 4096,
    "height": 2160
}];

var storageName = 'listV2';
var previousStorageName = 'list';

function migratePreviousStorage() {
    if (localStorage.hasOwnProperty(previousStorageName)) {
        var previousList = getList(previousStorageName);
        var newList = [];
        previousList.forEach(function (obj) {
            newList.push({
                "name": "",
                "width": obj.width,
                "height": obj.height
            });
        });
        resolution.forEach(function (obj) {
            newList.push(obj);
        });
        setList(storageName, newList);
        localStorage.removeItem(previousStorageName);
    }
    if (!localStorage.hasOwnProperty(storageName)) {
        setList(storageName, resolution);
    }
}
migratePreviousStorage();

function validate(obj) {
    if (obj != undefined && obj != null && typeof obj == 'object' &&
        obj.hasOwnProperty('name') && typeof obj.name == 'string' &&
        obj.hasOwnProperty('width') && typeof obj.width == 'number' && obj.width > 0 &&
        obj.hasOwnProperty('height') && typeof obj.height == 'number' && obj.height > 0) {
        
        var validObj = {
            name: obj.name,
            width: obj.width,
            height: obj.height
        };
        if (obj.hasOwnProperty('left') && typeof obj.left === 'number') {
            validObj.left = obj.left;
        }
        if (obj.hasOwnProperty('top') && typeof obj.top === 'number') {
            validObj.top = obj.top;
        }
        return validObj;
    } else {
        return {
            "name": "",
            "width": 1,
            "height": 1
        };
    }
}

function getList(key) {
    var list = localStorage.getItem(key);
    if (list) {
        list = JSON.parse(list);
    } else {
        list = [];
    }
    var validatedList = [];
    list.forEach(function (obj) {
        validatedList.push(validate(obj));
    });
    return validatedList;
}

function setList(key, list) {
    var validatedList = [];
    list.forEach(function (obj) {
        validatedList.push(validate(obj));
    });
    localStorage.setItem(key, JSON.stringify(validatedList));
}

function deleteList(key, index) {
    var list = getList(key);
    list.splice(index, 1);
    setList(key, list);
}

function moveList(key, index, newIndex) {
    var list = getList(key);
    setList(key, moveIndex(list, index, newIndex));
}

function reloadPage() {
    window.location.reload();
}

function moveIndex(arr, oldIndex, newIndex) {
    if (oldIndex < 0 || oldIndex >= arr.length || newIndex < 0 || newIndex >= arr.length) {
        return arr;
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
};

function formatItem(item) {
    var label = item.name + (item.name.length > 0 ? ' ' : '') + item.width + 'x' + item.height;
    if (typeof item.left === 'number' && typeof item.top === 'number') {
       label += ' @ ' + item.left + ',' + item.top;
    }
    return label;
}

function formatDate(date, formatStr) {
    var str = formatStr;
    var Week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    str = str.replace(/yyyy|YYYY/, date.getFullYear());
    str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));

    date.setMonth(date.getMonth() + 1);
    str = str.replace(/MM/, date.getMonth() > 9 ? date.getMonth().toString() : '0' + date.getMonth());
    str = str.replace(/M/g, date.getMonth());

    str = str.replace(/w|W/g, Week[date.getDay()]);

    str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
    str = str.replace(/d|D/g, date.getDate());

    str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
    str = str.replace(/h|H/g, date.getHours());
    str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
    str = str.replace(/m/g, date.getMinutes());

    str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
    str = str.replace(/s|S/g, date.getSeconds());

    return str;
};

function downloadFile(fileName, content) {
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}
