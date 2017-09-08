
import * as d3 from 'd3';

class MultilineChart{
	constructor(options){
		const 	app = this;
		app.options = options;
		app.data = options.data;
		app._container = options.container;
		app.mobileLayoutBreakpoint = 600;
		app.isMobile = window.innerWidth < app.mobileLayoutBreakpoint ? true : false;

		app.teamColors = {
			reds:'#C6011F',
			pirates:'#000',
			cubs:'#0e3386',
			brewers:'#D0AC78',
			cardinals:'#B72126'
		}

		// console.log(app.teamColors)
		MultilineChart.initChart(app);
	}
	
	static initChart(app){
		
		// ----------------------------------
		// GET TO KNOW THE CONTAINER
		// ----------------------------------

		const 	data = app.data,
				container = d3.select(app._container),
				bbox = app._container.getBoundingClientRect();
				// scrubberHeight = 30;

				let width= bbox.width;

		const	height = bbox.height,
				margin = app.options.innerMargins,
				innerHeight = height - margin.top - margin.bottom,
				innerWidth = width - margin.right - margin.left
		
	
		// ----------------------------------
		// start working with the SVG
		// ----------------------------------

		const svg = container
			.append('svg')
			.attr('width', width)
			.attr('height', height);


		// ----------------------------------
		// MAKE SOME SCALES
		// ----------------------------------
		

		// Find the largest any team has been over .500 and the lowest and team has been below .500
		const maxGamesForEachTeam = [];
		data.forEach(d => {
			maxGamesForEachTeam.push(d3.max(d['history'], g => (g.record.wins - g.record.losses)));
		});

		const minGamesForEachTeam = [];
		data.forEach(d => {
			minGamesForEachTeam.push(d3.min(d['history'], g => (g.record.wins - g.record.losses)));
		});


		const 	yMax = d3.max(maxGamesForEachTeam),
				yMin = d3.min(minGamesForEachTeam);
		
		const yScale = d3.scaleLinear()
			.domain([yMin, yMax])
			.nice()
			.range([innerHeight, 0]);

		const yAxisFunc = d3.axisLeft(yScale);

		const xScale = d3.scaleLinear()
			.range([0,innerWidth])
			.domain([1,162]);

		const xAxisFunc = d3.axisBottom(xScale)


		// ----------------------------------
		// APPEND AXES
		// ----------------------------------

		const yAxis = svg
			.append('g')
			.attr('class', 'y axis')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)
			.call(yAxisFunc);

		yAxis.selectAll('.tick line')
			.attr('x2', innerWidth)
			.style('stroke', '#ddd');

		yAxis.select('.domain').remove();


		const xAxis = svg
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(${margin.left}, ${margin.top + innerHeight})`)
			.call(xAxisFunc)
			.select('.domain')
			.remove();

			// TODO: ADD SOLID BLACK BASELINE


		const chartInner = svg
			.append('g')
			.classed('chart-inner', true)
			.attr('width', innerWidth)
			.attr('height', innerHeight)
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const labels = svg
			.append('g')
			.classed('labels', true)
			.style('font-family','Arial, sans-serif')
			.style('font-size','13px')
			.style('font-weight','bold')
			.style('line-height', '1.3em')
			.attr('text-anchor', 'middle')
			.attr('dy', '1em');

		chartInner.append('line')
			.attr('x0',0)
			.attr('y0',0)
			.attr('x1',innerWidth)
			.attr('y1',0)
			.attr('transform', `translate(0,${yScale(0)})`)
			.style('stroke', 'black')
			.style('stroke-width', 3)

		data.forEach(team => {
			
			const 	teamData = team.history,
					teamName = team.team_name,
					lineColor = app.teamColors[teamName];
			let lineWeight;

			
			const line = d3.line()
			    .x(d => xScale(d['game_number']))
			    .y(d => yScale(d.record.wins - d.record.losses));
			
			// These are the mobile styling variants;
			if (app.isMobile){
				line.curve(d3.curveMonotoneX);
				lineWeight = team.team_name == "cubs" ? 2 : 1;
			} else {
				lineWeight = team.team_name == "cubs" ? 4 : 2;
			}

			chartInner.append("path")
				.datum(teamData)
				.attr("class", `line line--${teamName}`)
				.attr("d", line)
				.style('stroke-linejoin','round')
				.attr('stroke', lineColor)
				.attr('stroke-width', lineWeight)
				.attr('fill', 'transparent')
				.attr('stroke-linecap', 'round');
		});


		labels.append('text')
			.classed('chart-labels__xAxisLabel', true)
			.text(`Game number`)
			.attr('x', margin.left + (innerWidth / 2))
			.attr('y', height)
			.attr('dy', '-.3em')
						.style('font-family','Arial, sans-serif')
			.style('font-size','13px')
			.style('font-weight','bold');
			
	
		labels.append('text')
			.classed('chart-labels__yAxisLabel', true)
			.text('Games above/below .500')
			.attr('x', 0)
			.attr('y', margin.top + (innerHeight / 2))
			.attr('transform', `rotate(-90, 0, ${margin.top + (innerHeight / 2)})`)
			.attr('dy', '1em')
						.style('font-family','Arial, sans-serif')
			.style('font-size','13px')
			.style('font-weight','bold');

	}


}

module.exports = MultilineChart;