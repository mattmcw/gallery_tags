interface Tag {
    [key: string] : string;
    Artist? : string;
    Title? : string;
    Date? : string;
    Medium? : string;
    Price? : string;
    QR? : string;
}

const dropZone : HTMLElement = document.getElementById('drop-zone');
const tags : HTMLElement = document.getElementById('tags');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#e0f7fa';
    console.log('dragover');
});

dropZone.addEventListener('dragenter', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#e0f7fa';
    console.log('dragenter');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#f9f9f9';
    if (event.dataTransfer.files.length > 0) {
        if (event.dataTransfer.files[0].type === 'text/tab-separated-values') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const parsedData = parseTSV(content as string);
                displayTags(parsedData);
            };
            reader.readAsText(event.dataTransfer.files[0]);
        } else {
            console.dir(event.dataTransfer.files[0].type);
            alert('Please drop a TSV file.');
        }
    }
});

function parseTSV (tsvText : string) : Tag[] {
    const rows : string[] = tsvText.split('\n');
    const parsedData : string[][] = rows.map(row => row.split('\t'));
    const objs : Tag[] = [];
    let obj : Tag;
    for (let i = 1; i < parsedData.length; i++) {
        obj = {};
        for (let x = 0; x < parsedData[i].length; x++) {
            obj[(parsedData[0][x] + '').trim().replace(/\"/g, "")] = parsedData[i][x].trim();
        }
        objs.push(obj);
    }
    objs.sort(sortRows);
    return objs;
}

function displayTag (row : Tag, i : number) {
    const tag : HTMLElement = document.createElement('div');
    const artist : HTMLElement = document.createElement('div');
    const title : HTMLElement = document.createElement('div');
    const date : HTMLElement = document.createElement('div');
    const medium : HTMLElement = document.createElement('div');
    const price : HTMLElement = document.createElement('div');
    let qr : HTMLElement;
    let hasQR : boolean = false;
    
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
        qr.classList.add(`qr_tag_${i}`);
        tag.appendChild(qr);
        hasQR = true;
        console.log(row.QR)
    }

    tags.appendChild(tag);
    if (hasQR) {
        //@ts-ignore
        new QRCode(document.querySelector(`.qr_tag_${i}`), {
            text: row.QR,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            //@ts-ignore
            correctLevel : QRCode.CorrectLevel.L
        });
    }
}

function scoreRow (row : Tag) : number {
    let score : number = 0;
    let keys : string[] = Object.keys(row);
    for (let key of keys) {
        score += row[key].length;
    }
    return score;
}

function sortRows (a : Tag, b : Tag) {
    return scoreRow(b) - scoreRow(a);
}

function displayTags (rows : Tag[]) {
    document.getElementById('dnd').classList.add('hide');
    document.getElementById('display').classList.remove('hide');

    let i : number = 0;
    for (let row of rows) {
        console.dir(row)
        displayTag(row, i);
        i++;
    }
}