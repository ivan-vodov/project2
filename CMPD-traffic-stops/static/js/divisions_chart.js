//
// the file contains the logic used for rendering the divisions map 
//


//the function generates somme of the data for and calls the functionn inn the map frame which updates layers
function renderDivisionsChart(data) {
  // generate arrays of values and counts from the JSON response segment passed to this function
  var data_entries = unpack(data, 0);
  var data_counts = unpack(data, 1);

  //find the max value in the array of stop counts: create a copy and sort the copy
  var max_count = data_counts.slice().sort(function (a, b) { return b - a })[0];

  //generate dictionaries - layer opacity (0-1) and counts for each division 
  for (var i = 0; i < data_entries.length; i++) {
    map_shades[data_entries[i]] = data_counts[i] / max_count;
    map_counts[data_entries[i]] = data_counts[i];
  }

  // update the layers on the map. When the page load first time there will be no map yet, the functionn to render layers is called in the frame itself
  try {
    document.getElementById('mapper').contentWindow.renderMap();
  }
  catch (err) {
    console.log('Ignoring the unloaded map exception');
  }

}
