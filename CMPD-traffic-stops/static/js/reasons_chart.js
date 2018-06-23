
function renderReasonsChart(data) {
  var $reasonsDiv = document.getElementById("reasons_chart")

  var data_entries = unpack(data, 0);
  var data_counts = unpack(data, 1);


  //populate the color array, if filter value is selected, or color string if no filter valule seleted
  if (reason_filter) {
    var item_colors = data_entries.map(function (entry) {
      var item_color = control_chart_inact
      if (entry == reason_filter) item_color = control_chart_act;
      return item_color;
    });
  } else { var item_colors = control_chart_act; }


  var trace1 = {
    y: data_counts,
    x: data_entries,
    text: data_entries,
    hoverinfo: 'value',
    marker: {
      color: item_colors,
      width: 0.4
    },
    type: 'bar'
  };


  // var trace1 = {
  //   y: data_counts,
  //   x: data_entries,
  //   text: data_entries,
  //   textposition: 'outside',
  //   hoverinfo: 'none',
  //   marker: {
  //     color: item_colors,
  //     width: 1
  //   },
  //   type: 'bar'
  // };



  var data = [trace1];


  // var layout = {
  //   // autosize: false,
  //   // width: 350,
  //   height: 200,
  //   textangle: 90,
  //   titlefont: chart_title_style,
  //   font: chart_label_style,

  // };



  var layout = {
    font:chart_label_style,
    height: 150,
        margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 0
    }
    }

     


  Plotly.newPlot('reasons_chart', data, layout);



  // set the onclick event handler for chart bars
  var myPlot = document.getElementById('reasons_chart')
  myPlot.on('plotly_click', function (data) {
    var item_clicked = data.points[0].text;

    //if the "active" bar clicked again, the filter gets reset, otherwise the filter is set to the bar clicked 
    if (item_clicked == reason_filter) reason_filter = ""
    else reason_filter = item_clicked;

    //redraw all charts
    renderAllCharts();
  });
}


