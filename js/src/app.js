import * as d3 from 'd3';
import MultilineChart from './multiline-chart.js';
import MultilineChart2 from './multiline-chart2.js';



window.addEventListener('load', function(e){
	console.log(window.data);


	const horseRaceChart = new MultilineChart({
		container: document.querySelector('#horse-race'),
		data: window.data, // seperate the rows into year groups
        innerMargins:{ top:7,right:0,bottom:40,left:40 }
	});

	const standingsSpark = new MultilineChart2({
		container: document.querySelector('#standings-chart'),
		data: window.data, // seperate the rows into year groups
        innerMargins:{ top:10,right:0,bottom:10,left:30 }
	});
})