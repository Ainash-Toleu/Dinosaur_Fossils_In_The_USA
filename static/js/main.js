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

	                if (link[0] === 'Saurischia') {
	                    nodes['Saurischia'] = {
	                        id: 'Saurischia',
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
	        text: 'Phylogenetic Tree'
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
