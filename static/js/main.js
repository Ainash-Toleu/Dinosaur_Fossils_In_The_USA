// Show that we've loaded the JavaScript file
console.log("Loaded main.js");

// Query the endpoint that returns a JSON ...
d3.json("/dendogram").then(function (data) {

    // ... and dump that JSON to the console for inspection
    setHighCharts(data);

});

// "Chocolate-cake" recipe courtesy of highcharts.com [https://www.highcharts.com/demo/network-graph]
// Add the nodes option through an event call. We want to start with the parent
// item and apply separate colors to each child element, then the same color to
// grandchildren.
function setHighCharts(data){
    console.log("=============================");
    console.log(data);
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
                e.options.id === 'pg-tree'
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
            id: 'pg-tree',
            data: data
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
    };

	var config = {responsive: true}

    // Create the plot
    Plotly.newPlot("pychart", data, layout, config); 
});

//Leaflet Map
var centerUSA = [39.50, -98.35, "Center of the United States"]
var mymap = L.map('mapid').setView(centerUSA, 5);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery ?? <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWZyaWVzZW5tbiIsImEiOiJja29nMGUxaXUwbHNkMm9qeG1xd3FxZmN3In0.4ONYEDC3k_RbS32CeGUeSA'
}).addTo(mymap);

d3.json("/leafmap").then(function (data){
	for (const [coords, site] of Object.entries(data)){
		var marker = L.marker([site.lat, site.lng]).addTo(mymap);
		var popuptext = "<h4>"+site.lat+", "+ site.lng+"</h4><h5>"+ site.count + " bones found</h5>"
		marker.bindPopup(popuptext);
		marker.on('click',function(e){
			console.log(e);
			var deschtmlstring = "<h4>"+site.lat+", "+ site.lng+"</h4><h5>"+ site.count + " bones found</h5>";
			site.specimens.forEach(function(bone){
				deschtmlstring = deschtmlstring + "<h5>"+bone.specimen_no+"</h5><ul><li>Name: "+bone.specimen_name+"</li>";
				deschtmlstring = deschtmlstring + "<li> ID: "+bone.specimen_id+"</li><li>Phylum: "+bone.specimen_phylum+"</li>";
				deschtmlstring = deschtmlstring + "<li> Class: "+bone.specimen_class+"</li><li> Family: "+bone.specimen_family+"</li>";
				deschtmlstring = deschtmlstring + "<li> Part: "+bone.specimen_part+"</li></ul>";
			})
			document.getElementById("mapdescription").innerHTML = deschtmlstring;
		})
	}	
});

// Query the endpoint that returns a JSON ...
d3.json("/dino_db").then(function tableFromJson(data) {
    
    // ... and dump that JSON to the console for inspection
    console.log(data); 
    
    // Extract value from table header. 
    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // Create a table.
    $("#showTable").click(function(){
        
        var table = document.createElement("table");
        table.setAttribute('id', 'cooltable');
        table.setAttribute('class', 'table table-striped table-bordered');
        $('#cooltable').DataTable();

        // Create table header row using the extracted headers above.
        var tr = table.insertRow(-1);                   // table row.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // table header.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // add json data to the table as rows.
        for (var i = 0; i < data.length; i++) {
            tr = table.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = data[i][col[j]];
            }
        }
        
        // Now, add the newly created table with json data, to a container.
        var divShowData = document.getElementById('showData');
        divShowData.innerHTML = "";
        divShowData.appendChild(table);
    }); 

});