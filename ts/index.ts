const dropZone = document.getElementById('drop-zone');
const tags = document.getElementById('tags');

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

function parseTSV (tsvText : string) {
    const rows = tsvText.split('\n');
    const parsedData = rows.map(row => row.split('\t'));
    const objs : any[] = [];
    let obj : any;
    for (let i = 1; i < parsedData.length; i++) {
        obj = {};
        for (let x = 0; x < parsedData[i].length; x++) {
            obj[(parsedData[0][x] + '').trim().replace(/\"/g, "")] = parsedData[i][x].trim();
        }
        objs.push(obj);
    }
    return objs;
}

function displayTag (row : any) {
    const tag : HTMLElement = document.createElement('div');
    const artist : HTMLElement = document.createElement('div');
    const title : HTMLElement = document.createElement('div');
    const date : HTMLElement = document.createElement('div');
    const medium : HTMLElement = document.createElement('div');
    const price : HTMLElement = document.createElement('div');
    
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

    tags.appendChild(tag);
}

function displayTags (rows : any[]) {
    document.getElementById('dnd').classList.add('hide');
    document.getElementById('display').classList.remove('hide');

    for (let row of rows) {
        console.dir(row)
        displayTag(row);
    }
}