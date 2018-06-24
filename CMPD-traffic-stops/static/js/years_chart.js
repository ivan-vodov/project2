//
// the file contains the logic used for rendering the years chart 
//

function renderYearsChart(data) {
  // generate arrays of values and counts from the JSON response segment passed to this function
  var years = unpack(data, 0);
  var years_counts = unpack(data, 1);

  //populate the color array, if filter value is selected, or color string if no filter valule seleted
  var item_colors = []
  if (year_filter) {
    item_colors = years.map(function (entry) {
      var item_color = control_chart_inact;
      if (entry == year_filter) item_color = control_chart_act;
      return item_color;
    });
  } else {
    item_colors = years.map(function (entry) {
      return control_chart_act;
    });
  }


  var data = [{
    labels: years,
    values: years_counts,
    marker: { colors: item_colors,
      line: {color: "white", width:1}},
    type: "pie",
    text: years,
    textinfo: 'label',
    hoverinfo: 'value+percent',
    showlegend: false
  }];



  var layout = {
    showlegend: false,
    font: chart_label_style,
    height: 90,
    margin: {
      l: 30,
      r: 30,
      b: 0,
      t: 0
    }
  };



  Plotly.newPlot("years_chart", data, layout)


  // set the onclick event handler for chart bars
  var myPlot = document.getElementById('years_chart')
  myPlot.on('plotly_click', function (data) {
    var item_clicked = data.points[0].text;

    //if the "active" bar clicked again, the filter gets reset, otherwise the filter is set to the bar clicked 
    if (item_clicked == year_filter) year_filter = "";
    else year_filter = String(item_clicked);

    //redraw all charts
    renderAllCharts();
  });


}
