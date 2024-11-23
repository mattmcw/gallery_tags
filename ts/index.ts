const dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#e0f7fa';
    console.log('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#f9f9f9';
    console.log('drop');
    console.dir(event.dataTransfer.files)
    if (event.dataTransfer.files.length > 0) {
        if (event.dataTransfer.files[0].type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const parsedData = parseCSV(content);
                console.dir(parsedData);
            };
            reader.readAsText(event.dataTransfer.files[0]);
        } else {
            alert('Please drop a CSV file.');
        }
    }
});

function parseCSV(csvText) {
    const rows = csvText.split('\n');
    const parsedData = rows.map(row => row.split(','));
    return parsedData;
}