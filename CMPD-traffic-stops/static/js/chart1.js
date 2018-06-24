//
// the file contains the logic used for rendering of the bar chart with user selected fields 
//

// the function renders the bar chart with the user selected fields
function renderChart1() {
    // make an API call with parameters in GET HTTP request
    var chart1_p = "&param=" + chart1_param + "&param_category=" + chart1_param_category;
    Plotly.d3.json("/data_chart1" + getCurrentFilterParams() + chart1_p, function (error, response) {

        // generate arrays of labels for data 
        var data_entries = unpack(response, 0)
        var data_category = unpack(response, 1)
        var data_counts = unpack(response, 2)

        var curr_category = "";
        var trace_labels = [];
        var trace_counts = [];
        var data = [];
        var trace = {};
        var layout = {};

        //create an array with unique category values on the second user selected field 
        var categories = data_category.filter(function (item, pos) {
            return data_category.indexOf(item) == pos;
        });

        //generate trace objects for the stacked bar chart, for each unique value of a category field
        for (var i = 0; i < categories.length; i++) {
            curr_category = categories[i];
            trace_labels = [];
            trace_counts = [];

            //generate labels and counts for the current trace
            for (var k = 0; k < data_category.length; k++) {
                if (data_category[k] == curr_category) {
                    trace_labels.push(data_entries[k]);
                    trace_counts.push(data_counts[k]);
                }
            }
            //create trace object
            trace = {
                x: trace_labels,
                y: trace_counts,
                text: trace_labels,
                name: curr_category,
                type: 'bar'
            };
            //add the trace to the array used below for the bar chart
            data.push(trace);
        }

        layout = {
            barmode: 'stack',
            margin: {
                l: 50,
                r: 0,
                b: 100,
                t: 30
            },
            font: chart_label_style,
            textfont: chart_label_style,
            insidetextfont: chart_label_style
        };
        // render the bar chart
        Plotly.newPlot('chart1', data, layout);
    });
}