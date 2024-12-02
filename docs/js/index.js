var dropZone = document.getElementById('drop-zone');
var tags = document.getElementById('tags');
dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZone.style.backgroundColor = '#e0f7fa';
    console.log('dragover');
});
dropZone.addEventListener('dragenter', function (event) {
    event.preventDefault();
    dropZone.style.backgroundColor = '#e0f7fa';
    console.log('dragenter');
});
dropZone.addEventListener('drop', function (event) {
    event.preventDefault();
    dropZone.style.backgroundColor = '#f9f9f9';
    if (event.dataTransfer.files.length > 0) {
        if (event.dataTransfer.files[0].type === 'text/tab-separated-values') {
            var reader = new FileReader();
            reader.onload = function (e) {
                var content = e.target.result;
                var parsedData = parseTSV(content);
                displayTags(parsedData);
            };
            reader.readAsText(event.dataTransfer.files[0]);
        }
        else {
            console.dir(event.dataTransfer.files[0].type);
            alert('Please drop a TSV file.');
        }
    }
});
function parseTSV(tsvText) {
    var rows = tsvText.split('\n');
    var parsedData = rows.map(function (row) { return row.split('\t'); });
    var objs = [];
    var obj;
    for (var i = 1; i < parsedData.length; i++) {
        obj = {};
        for (var x = 0; x < parsedData[i].length; x++) {
            obj[(parsedData[0][x] + '').trim().replace(/\"/g, "")] = parsedData[i][x].trim();
        }
        objs.push(obj);
    }
    objs.sort(sortRows);
    return objs;
}
function displayTag(row, i) {
    var tag = document.createElement('div');
    var artist = document.createElement('div');
    var title = document.createElement('div');
    var date = document.createElement('div');
    var medium = document.createElement('div');
    var price = document.createElement('div');
    var qr;
    var hasQR = false;
    tag.classList.add('tag');
    artist.classList.add('artist');
    artist.innerHTML = row.Artist;
    title.classList.add('title');
    title.innerHTML = row.Title;
    date.classList.add('date');
    date.innerHTML = row.Date;
    medium.classList.add('medium');
    medium.innerHTML = row.Medium;
    price.classList.add('price');
    price.innerHTML = row.Price;
    tag.appendChild(artist);
    tag.appendChild(title);
    tag.appendChild(date);
    tag.appendChild(medium);
    tag.appendChild(price);
    if (typeof row.QR !== 'undefined' && row.QR !== null && row.QR.trim() !== '') {
        qr = document.createElement('div');
        qr.classList.add('qr');
        qr.classList.add("qr_tag_".concat(i));
        tag.appendChild(qr);
        hasQR = true;
        console.log(row.QR);
    }
    tags.appendChild(tag);
    if (hasQR) {
        new QRCode(document.querySelector(".qr_tag_".concat(i)), {
            text: row.QR,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L
        });
    }
}
function scoreRow(row) {
    var score = 0;
    var keys = Object.keys(row);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        score += row[key].length;
    }
    return score;
}
function sortRows(a, b) {
    return scoreRow(b) - scoreRow(a);
}
function displayTags(rows) {
    document.getElementById('dnd').classList.add('hide');
    document.getElementById('display').classList.remove('hide');
    var i = 0;
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        console.dir(row);
        displayTag(row, i);
        i++;
    }
}
