// Show that we've loaded the JavaScript file
console.log("Loaded main.js");

// Query the endpoint that returns a JSON ...
d3.json("/dino_db").then(function (data) {
    // ... and dump that JSON to the console for inspection
    console.log(data); 

});

// Query the endpoint that returns a JSON ...
d3.json("/dendogram").then(function (data) {

    // ... and dump that JSON to the console for inspection
//    console.log(data); 
    setHighCharts(data);

});

// Add the nodes option through an event call. We want to start with the parent
// item and apply separate colors to each child element, then the same color to
// grandchildren.
function setHighCharts(responseData){
    console.log("=============================");
    console.log(responseData);
    console.log("=============================");

    Highcharts.addEvent(
        Highcharts.Series,
        'afterSetOptions',
        function (e) {
            var colors = Highcharts.getOptions().colors,
                i = 0,
                nodes = {};

            if (
                this instanceof Highcharts.seriesTypes.networkgraph &&
                e.options.id === 'lang-tree'
            ) {
                e.options.data.forEach(function (link) {

                    if (link[0] === 'Chordata') {
                        nodes['Chordata'] = {
                            id: 'Chordata',
                            marker: {
                                radius: 20
                            }
                        };
                        nodes[link[1]] = {
                            id: link[1],
                            marker: {
                                radius: 10
                            },
                            color: colors[i++]
                        };
                    } else if (nodes[link[0]] && nodes[link[0]].color) {
                        nodes[link[1]] = {
                            id: link[1],
                            color: nodes[link[0]].color
                        };
                    }
                });

                e.options.nodes = Object.keys(nodes).map(function (id) {
                    return nodes[id];
                });
            }
        }
    );

    Highcharts.chart('container', {
        chart: {
            type: 'networkgraph',
            height: '100%'
        },
        title: {
            text: 'Dendogram: Evolutionary Relationships of the Fossils'
        },
        plotOptions: {
            networkgraph: {
                keys: ['from', 'to'],
                layoutAlgorithm: {
                    enableSimulation: true,
                    friction: -0.9
                }
            }
        },
        series: [{
            dataLabels: {
                enabled: true,
                linkFormat: ''
            },
            id: 'lang-tree',
            data: responseData
        }]
    });

}

// Query the endpoint that returns a JSON ...
d3.json("/plotly").then(function (data) {

    // ... and dump that JSON to the console for inspection
    console.log(data);

    // Next, pull out the keys and the values for graphing
    keys = Object.keys(data);
    values = Object.values(data);
	
    // Create the trace
    var trace = {
        x: values,
        y: keys,
        type: "bar",
		orientation: 'h',
		text: values.map(String),
  		textposition: 'outside',
  		hoverinfo: 'text',
  		marker: {
    		color: 'rgb(158,202,225)',
    		opacity: 0.6,
    		line: {
      			color: 'rgb(8,48,107)',
      			width: 1.5
    		}
  		}  
    };

    // Put the trace into an array 
    var data = [trace];

    // Define a layout object
    var layout = {
        title: "Bar Chart: Fossil Specimens by Bone Type",
        xaxis: { title: "Count"},
        yaxis: { 
			title: "Bone type",
			automargin: true
		},
        autosize: false,
        width:600,
    //    paper_bgcolor: 'rgba(0,0,0,0)',
    //    plot_bgcolor: 'rgba(0,0,0,0)'      
        
    };

	var config = {responsive: true}

    // Create the plot
    Plotly.newPlot("plotly", data, layout, config); 
});

// Query the endpoint that returns a JSON ...
d3.json("/pychart").then(function (data) {

    // ... and dump that JSON to the console for inspection
    console.log(data);

    // Next, pull out the keys and the values for graphing
    keys = Object.keys(data);
    values = Object.values(data);
	
    // Create the trace
    var trace = {
        values: values,
        labels: keys,
        hole:.4,
        type: "pie",
		text: keys,
  		textposition: 'inside',
  		hoverinfo: 'text',
  		marker: {
    		color: 'rgb(158,202,225)',
    		opacity: 0.6,
    		line: {
      			color: 'rgb(8,48,107)',
      			width: 1.5
    		}
  		}

    };

    // Put the trace into an array 
    var data = [trace];

    // Define a layout object
    var layout = {
        legend : {
            orientation: 'h',
            xanchor:"center",
            yanchor:"top",
            y:-0.3, // play with it
            x:0.5   // play with it
        },
        title: "Pie Chart: Fossil Specimens by Bone Type",
        xaxis: { title: "Count"},
        yaxis: { 
			title: "Bone type",
			automargin: true
		},
        autosize: false,
        width: 600,
    //    paper_bgcolor: 'rgba(0,0,0,0)',
    //   plot_bgcolor: 'rgba(0,0,0,0)'
    };

	var config = {responsive: true}

    // Create the plot
    Plotly.newPlot("pychart", data, layout, config); 
});

//Leaflet Map
var centerUSA = [39.50, -98.35, "Center of the United States"]
var mymap = L.map('mapid').setView(centerUSA, 3);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWZyaWVzZW5tbiIsImEiOiJja29nMGUxaXUwbHNkMm9qeG1xd3FxZmN3In0.4ONYEDC3k_RbS32CeGUeSA'
}).addTo(mymap);
var marker = L.marker(centerUSA).addTo(mymap)

d3.json("/leafmap").then(function (data){
	data.forEach(function(entry){
		var marker = L.marker([entry.lat, entry.lng]).addTo(mymap);
	})	
});

