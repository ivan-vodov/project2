//
// the file contains the logic used for rendering the divisions map 
//


// Creating map object
var map = L.map("map", {
  center: [35.27, -80.8],
  zoom: 9.5
});

var geo_json_data = {};

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYXJrZWdhcmlzZTAyMDkiLCJhIjoiY2ppMGh3NGMwMThjZjNxbzYzMjB5YjUzcCJ9.wXz2mBU55LS-P_rvb9kmlw").addTo(map);

var link = "https://clt-charlotte.opendata.arcgis.com/datasets/47167ee6d69248acbd825f2859c68dbf_5.geojson";


// Function that will determine the color of a division based on the DNAME
function chooseColor(DNAME) {
  // exception catcing needed for geo data (divisions) not represented in the data (Airport Division)
  try {
    var number = parent.map_shades[DNAME];
    if (parent.division_filter) { // if a division is chosen currently, all others will lbe in in active fil color
      if (DNAME == parent.division_filter) color_str = 'rgba(55,128,191,' + number.toString() + ')';
      else color_str = 'rgba(125,125,125,' + number.toString() + ')';
    }
    else color_str = 'rgba(55,128,191,' + number.toString() + ')';
    return color_str;
  }
  catch (err) {
    return 'rgba(55,128,191,0)';
  }
}


function renderMap() {
  map.eachLayer(function (layer) {
    // delete layers which are not the map - presence or _url property is used to distinguish
    try {
      if (!layer._url) map.removeLayer(layer)
    } catch (err) { console.log("ignorinng unloaded layers exception") }
  });

  L.geoJson(geo_json_data, {
    // Style each feature (in this case a division)
    style: function (features) {
      return {
        color: "grey",
        // Call the chooseColor function to decide which color to color our division (color based on DNAME)
        fillColor: chooseColor(features.properties.DNAME),
        fillOpacity: 0.75,
        weight: 1.5
      };
    },
    // event handling, on each feature
    onEachFeature: function (features, layer) {
      // Set mouse events to change map styling
      layer.on({
        mouseover: function (event) {
          event.target.openPopup();
          setTimeout(function () { event.target.closePopup(); }, 1000);
        },

        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function (event) {
          event.target.closePopup();
        },
        // When a feature (division) is clicked, the parent window filter parameter is set and filter is applied to all charts
        click: function (event) {
          item = event.target.feature.properties.DNAME;
          if (parent.division_filter == item) parent.division_filter = "";
          else parent.division_filter = item;
          parent.renderAllCharts();

        }
      });


      var dname = features.properties.DNAME
      var dcount = 0

      // Giving each feature a pop-up amd a permanent tooltip with information pertinent to it. try-catch for divisions not represented in the data
      try {
        dcount = parent.map_counts[features.properties.DNAME];
        layer.bindPopup(features.properties.DNAME + ": " + dcount);
        layer.bindTooltip(dcount.toString(), { permanent: true, opacity: 0.5, direction: 'right' })
      }
      catch (err) { console.log('ignoring missing key exception'); }

    }
  }).addTo(map);
}

// Grabbing our GeoJSON data..
d3.json(link, function (data) {
  // Creating a geoJSON layer with the retrieved data
  geo_json_data = data;
  renderMap();
});




