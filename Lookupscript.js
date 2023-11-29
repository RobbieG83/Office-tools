document.addEventListener('DOMContentLoaded', function() {
  const lookupValues = document.getElementById('lookupValues');
  const comparisonSheet = document.getElementById('comparisonSheet');
  const downloadButton = document.getElementById('downloadButton');

  downloadButton.addEventListener('click', function() {
      const values = lookupValues.value.split(',');
      console.log('Lookup values:', values); // Debug line

      const file = comparisonSheet.files[0];
      if (!file) {
          alert('Please select a file!');
          return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
          const contents = e.target.result;
          const lines = contents.split('\n');
          console.log('CSV lines:', lines); // Debug line

          const results = lines.filter(line => values.includes(line.split(',')[0]));
          console.log('Results:', results); // Debug line

          if (results.length === 0) {
              alert('No matching values found!');
              return;
          }

          const blob = new Blob([results.join('\n')], {type: 'text/csv'});
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = 'results.csv';
          link.click();

          URL.revokeObjectURL(url);
      };
      reader.readAsText(file);
  });
});