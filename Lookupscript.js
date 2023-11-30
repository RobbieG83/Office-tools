document.getElementById('downloadButton').addEventListener('click', function() {
    var lookupValues = document.getElementById('lookupValues').value.split(',').map(function(value) {
        return value.trim();
    });
    var fileInput = document.getElementById('comparisonSheet');
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var contents = e.target.result;
        var lines = contents.split('\n');
        var results = [];

        for (var i = 0; i < lines.length; i++) {
            var cells = lines[i].split(',');
            for (var j = 0; j < lookupValues.length; j++) {
                if (cells.includes(lookupValues[j])) {
                    results.push(lines[i]);
                    break;
                }
            }
        }

        var blob = new Blob([results.join('\n')], {type: 'text/csv'});
        var url = URL.createObjectURL(blob);

        var link = document.createElement('a');
        link.href = url;
        link.download = 'results.csv';
        link.click();
    };

    reader.readAsText(file);
});
