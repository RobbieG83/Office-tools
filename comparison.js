function compareFiles() {
    // Get the files and column name from the form
    let file1 = document.getElementById('file1').files[0];
    let file2 = document.getElementById('file2').files[0];
    let column = document.getElementById('column').value;

    // Use FileReader to read the files
    let reader1 = new FileReader();
    let reader2 = new FileReader();

    reader1.onload = function(e) {
        let data1 = new Uint8Array(e.target.result);
        let workbook1 = XLSX.read(data1, {type: 'array'});

        reader2.onload = function(e) {
            let data2 = new Uint8Array(e.target.result);
            let workbook2 = XLSX.read(data2, {type: 'array'});

            // Convert the first sheet of each workbook to JSON
            let sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
            let sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
            let json1 = XLSX.utils.sheet_to_json(sheet1);
            let json2 = XLSX.utils.sheet_to_json(sheet2);

            // Find matching and non-matching data
            let matching, nonMatching1, nonMatching2;
            if (column.toLowerCase() === 'all') {
                // Compare all columns
                matching = json1.filter(item1 => json2.some(item2 => JSON.stringify(item1) === JSON.stringify(item2)));
                nonMatching1 = json1.filter(item1 => !json2.some(item2 => JSON.stringify(item1) === JSON.stringify(item2)));
                nonMatching2 = json2.filter(item2 => !json1.some(item1 => JSON.stringify(item2) === JSON.stringify(item1)));
            } else {
                // Compare the specified column
                matching = json1.filter(item1 => json2.some(item2 => item1[column] === item2[column]));
                nonMatching1 = json1.filter(item1 => !json2.some(item2 => item1[column] === item2[column]));
                nonMatching2 = json2.filter(item2 => !json1.some(item1 => item2[column] === item1[column]));
            }
            let nonMatching = nonMatching1.concat(nonMatching2);

            // Create a new workbook
            let newWorkbook = XLSX.utils.book_new();

            // Convert the matching and non-matching data to worksheets and add them to the workbook
            let matchingSheet = XLSX.utils.json_to_sheet(matching);
            XLSX.utils.book_append_sheet(newWorkbook, matchingSheet, 'Matching');
            let nonMatchingSheet = XLSX.utils.json_to_sheet(nonMatching);
            XLSX.utils.book_append_sheet(newWorkbook, nonMatchingSheet, 'Non-Matching');

            // Write the workbook to a new file
            XLSX.writeFile(newWorkbook, 'comparisonResults.xlsx');
        };

        reader2.readAsArrayBuffer(file2);
    };

    reader1.readAsArrayBuffer(file1);
}