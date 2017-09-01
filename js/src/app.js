import * as d3 from 'd3';
import MultilineChart from './multiline-chart.js';



window.addEventListener('load', function(e){
	console.log(window.data);


	const horseRaceChart = new MultilineChart({
		container: document.querySelector('#horse-race'),
		data: window.data, // seperate the rows into year groups
        innerMargins:{ top:7,right:0,bottom:40,left:40 }
	});
})