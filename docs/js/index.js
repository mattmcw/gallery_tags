var dropZone = document.getElementById('drop-zone');
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
    console.log('drop');
    console.dir(event.dataTransfer.files.length);
    if (event.dataTransfer.files.length > 0) {
        if (event.dataTransfer.files[0].type === 'text/csv') {
            var reader = new FileReader();
            reader.onload = function (e) {
                var content = e.target.result;
                var parsedData = parseCSV(content);
                console.dir(parsedData);
            };
            reader.readAsText(event.dataTransfer.files[0]);
        }
        else {
            alert('Please drop a CSV file.');
        }
    }
});
function parseCSV(csvText) {
    var rows = csvText.split('\n');
    var parsedData = rows.map(function (row) { return row.split(','); });
    return parsedData;
}
