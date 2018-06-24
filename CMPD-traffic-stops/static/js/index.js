//
// main javascript file 
//


// the function extracts values of a given field (by index) from JSON reponse objects/records into an array
function unpack(rows, index) {
    return rows.map(function (row) {
        return row[index];
    });
}

// the function creates a string with current filter parameters to be used in GET requests to JSON API
function getCurrentFilterParams() {
    var param_string = "";
    param_string += "?division=" + division_filter + "&reason=" + reason_filter + "&result=" + result_filter + "&year=" + year_filter;
    return param_string;
}

// the function renders Division, Reason. Result and Year charts, as well as stats
function renderControlCharts() {
    Plotly.d3.json("/data" + getCurrentFilterParams(), function (error, response) {
        renderDivisionsChart(response.division_data);
        renderReasonsChart(response.reason_data);
        renderResultsChart(response.result_data);
        renderYearsChart(response.year_data);
        renderStats(response.count);
    });
}

// Dataset filter parameters
var division_filter = "";
var reason_filter = "";
var result_filter = "";
var year_filter = "";

//dictionaries used for rendering layers and counts on the map
var map_shades = {};
var map_counts = {};

// parameters for the bar chart with user sellected fields 
var chart1_param = "Month_Num"
var chart1_param_category = "Year"

// the function renders all charts, will be called on each choice made on control charts (Division, Reason, Result and Year charts)
function renderAllCharts() {
    renderControlCharts();
    renderChart1();
}

// Charts styling parameters
var chart_label_style = {
    family: 'Arial, sans-serif',
    size: 12,
    color: '#555555'
};
 

var control_chart_act = 'rgba(55,128,191,0.6)';
var control_chart_inact = 'rgba(191,191,191,0.6)';

//render charts on first page load
renderAllCharts();
