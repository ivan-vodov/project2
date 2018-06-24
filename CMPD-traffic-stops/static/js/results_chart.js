//
// the file contains the logic used for rendering the results chart 
//

function renderResultsChart(data) {
  // generate arrays of values and counts from the JSON response segment passed to this function
  var data_entries = unpack(data, 0);
  var data_counts = unpack(data, 1);



  //populate the color array, if filter value is selected, or color string if no filter valule seleted
  if (result_filter) {
    var item_colors = data_entries.map(function (entry) {
      var item_color = control_chart_inact
      if (entry == result_filter) item_color = control_chart_act;
      return item_color;
    });
  } else { var item_colors = control_chart_act; }



  var trace1 = {
    y: data_counts,
    x: data_entries,
    text: data_counts,
    textposition: 'auto',
    hoverinfo: 'none',
    marker: {
      color: item_colors
    },
    type: 'bar'
  };



  var data = [trace1];


  var layout = {
    font: chart_label_style,
    height: 190,
    margin: {
      l: 0,
      r: 60,
      b: 100,
      t: 0
    }
  }

  Plotly.newPlot('results_chart', data, layout);

  var resultsPlot = document.getElementById('results_chart')
  resultsPlot.on('plotly_click', function (data) {
    var item_clicked = data.points[0].x;

    //if the "active" bar clicked again, the filter gets reset, otherwise the filter is set to the bar clicked 
    if (item_clicked == result_filter) result_filter = ""
    else result_filter = item_clicked;

    //redraw all charts
    renderAllCharts();
  });
}