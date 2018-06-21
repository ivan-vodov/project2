function renderYearsChart(data) {


  var years = unpack(data, 0);
  var years_counts = unpack(data, 1);

  var data = [{
    labels: years,
    values: years_counts,
    type: "pie",
    text: years,
    textinfo: 'label',
    hoverinfo: 'value+percent',
    showlegend: false
  }];



  var layout = {
    showlegend: false,
   // autosize: false,
   // width: 350,
    //height: 350,
    margin: {
      l: 50,
      r: 50,
      b: 0,
      t: 0
    }
  };


  var $PIE = document.getElementById("years_chart");
  Plotly.newPlot($PIE, data, layout)


}
