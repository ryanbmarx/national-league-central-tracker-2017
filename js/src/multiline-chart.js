// import getTribColor from '../utils/getTribColors.js';
import * as d3 from 'd3';
// import filter from 'lodash.filter';
// import orderBy from 'lodash.orderby';
// import monthFormatter from '../utils/month-formatter.js';

// function leapYear(year) {
// 	// returns true if supplied year is a leap year
//   return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
// }

// function getLastDate(data, years){
// 	let lastYear = [];
// 	years.forEach(y => {
// 		lastYear.push(parseInt(y));
// 	})
// 	lastYear = lastYear.sort().reverse()[0];
	
// 	const 	l = data[lastYear].length,
// 			lastDate = data[lastYear][l-1];

// 	return new Date(lastDate['YEAR'], lastDate['MONTH'] - 1, lastDate['DAY'],0,0,0,0);
// }

// function monthAxis(month){
// 	return monthFormatter(month.getMonth());
// }



class MultilineChart{
	constructor(options){
		const 	app = this;
		app.options = options;
		app.data = options.data;
		app._container = options.container;
		app.mobileLayoutBreakpoint = 600;
		app.isMobile = window.innerWidth < 850 ? true : true;

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
	
	// highlightDay(date, years, data, xScale, yScale, innerHeight, innerWidth){
	// 	const 	app = this, 
	// 			table = d3.select("#cumulative-table"),
	// 			bisectDate = d3.bisector(d => {
	// 				return new Date(d['YEAR'], (d['MONTH'] - 1), d['DAY'],0,0,0,0);
	// 			}).right;


	// 	// Update the date on the highlight
	// 	const dateString = `${monthFormatter(date.getMonth(), 'ap')} ${date.getDate()}`;
	// 	d3.select('#cumulative-label').html(dateString);
		

	// 	// Clear the existing rows, so they can be updated.
	// 	table.selectAll('*').remove();

	// 	// Prime the table to accept new data points
	// 	const 	yearsRow = table.append('thead').append('tr'),
	// 			shootingsRow = table.append('tbody').append('tr');

		
	// 	// For each year, in descending order, append a row with two cells to the table.
	// 	years.sort().forEach(year => {
			
	// 		// To avoid discrepancies in time, create a search date 
	// 		// that is set to midnight for the desired date
	// 		let searchDate = new Date(year, date.getMonth(), date.getDate(),0,0,0,0);

	// 		// Account for the leap year;
	// 		if (date.getMonth() == 1 && date.getDate() == 29 && !leapYear(year)) {
	// 			// If Feb. 29 is the selected date and the current year is NOT a leap year, 
	// 			// then switch to Feb. 28 so everything makes sense.
	// 			searchDate = new Date(year, date.getMonth(), 28,0,0,0,0);
	// 		}

	// 		// We're going to cycle through the years, one by one, starting with the oldest.
	// 		const tempData = orderBy(data[year], d => parseInt(d.ID));

	// 		let i = bisectDate(tempData, searchDate) - 1,
	// 			d = tempData[i];

	// 		// First, add the year to the thead row, which should be two-digit format if on mobile
	// 		if (window.innerWidth < app.mobileLayoutBreakpoint){
	// 			// If on mobile, we want a two-digit year.
	// 			yearsRow.append('th')
	// 				.html(`&rsquo;${year.slice(2)}`);

	// 		} else {
	// 			// If not on mobile, we want a four-digit year.
	// 			yearsRow.append('th')
	// 				.html(year);				
	// 		}


	// 		// Then, add the shootings cumulative total to the tbody 
	// 		// Test if the search date has occurred
	// 		if (searchDate <= app.lastDate){

	// 			// Other cell gets the cumulative shootings
	// 			shootingsRow.append('td')
	// 				.html(`${d3.format(',')(d['CUMULATIVE_SUM'])}`);

	// 			// Only if we have a valid data point, move the highlight circles 
	// 			// to where they need to be. If there isn't one, then make one.

	// 			d3.select(`.highlight-circle--${year}`)
	// 				// .transition()
	// 				// .duration(100)
	// 				.style('opacity', 1)
	// 				.attr('cx', xScale(date))	
	// 				.attr('cy', yScale(d['CUMULATIVE_SUM']));

	// 		} else {
	// 			// If the search date has not occurred in the current year then skip with a "n/a"
	// 			d3.select(`.highlight-circle--${app.lastYear}`).style('opacity', 0);
	// 			shootingsRow.append('td')
	// 				.html(`n/a`);
	// 		}
	// 	})

	// 	// Migrate the vertical highlight line to the mouse position
	// 	d3.select('.highlight-line')
	// 		.attr('x2',xScale(date))
	// 		.attr('x1',xScale(date))
		
	// 	// Make the table/data label visible
	// 	d3.select('.highlight')
	// 		.style('opacity', 1);
	// }

	static initChart(app){
		
		// ----------------------------------
		// GET THE KNOW THE CONTAINER
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

		// if (app.isMobile){
		// 	app.keepAnimatingArrow = true;

		// 	const scrubber = svg.append('g')
		// 		.classed('scrubber', true)
		// 		.attr('transform', `translate(${margin.left},${margin.top + margin.bottom + innerHeight + (.5 * scrubberHeight)})`);
	
		// 	scrubber.append('rect')
		// 		.classed('scrubber__container', true) 
		// 		.attr('width', innerWidth)
		// 		.attr('height', scrubberHeight)
		// 		.attr('rx', 8)
		// 		.attr('ry', 8)
		// 		.style('fill', '#eee');

		// 	const scrubberAssembly = scrubber.append('g')
		// 		.classed('draggable', true)
		// 		.style('cursor', 'move');


		// 	scrubberAssembly.append('rect')
		// 		.classed('scrubber__box', true) 
		// 		.attr('width', scrubberHeight)
		// 		.attr('height', scrubberHeight)
		// 		.attr('rx', 8)
		// 		.attr('ry', 8)
		// 		.style('fill', 'black')
				
		// 	scrubberAssembly
		// 		.append('image')
		// 		.classed('scrubber__arrow', true) 
		// 		.attr('xlink:href', `http://${window.ROOT_URL}/img/arrow-double.svg`)
		// 		.attr('width', .64 * scrubberHeight)
		// 		.attr('height', .5 * scrubberHeight)
		// 		.attr('x', scrubberHeight * 0.18)
		// 		.attr('y', scrubberHeight * .25)
		// 		.call(repeatAnimation);

		// 	d3.selectAll('.draggable')
		// 		.call(d3.drag()
		// 	        .on("drag", dragged));

		// 	function repeatAnimation(){
		// 		// Lifted this from https://bl.ocks.org/d3noob/bf44061b1d443f455b3f857f82721372
		// 		// This animates the little arrow on the srubber
				
		// 		const animateDuration = 1500;

		// 		d3.select('.scrubber__arrow')
		// 			.transition()
		// 			.duration(animateDuration)
		// 			.attr('transform', `translate(-2, 0)`)
		// 			.transition()
		// 			.duration(animateDuration)
		// 			.attr('transform', `translate(2, 0)`)
		// 			.on('end', function(){
		// 				if (app.keepAnimatingArrow) repeatAnimation();
		// 			})
		// 	}
			
		// 	function dragged(d) {
		// 		app.keepAnimatingArrow = false;
		// 		d3.select('.scrubber__arrow')
		// 			.attr('transform', `translate(0, 0)`);

		// 		let newX;

		// 		if (d3.event.x < 0){
		// 			newX = 0;
		// 		} else if(d3.event.x > (innerWidth - scrubberHeight)){
		// 			newX = innerWidth - scrubberHeight;
		// 		} else {
		// 			newX = d3.event.x;
		// 		}
		// 		d3.select(this).attr('transform', `translate(${newX}, 0)`);

		// 		const 	xx = d3.event.x / (innerWidth - scrubberHeight);
		// 		let xDate;
		// 		if(innerWidth * xx > innerWidth){
		// 		xDate = innerWidth;
		// 		} else if(innerWidth * xx < 0){
		// 			xDate = 0;
		// 		} else {
		// 			xDate = innerWidth * xx;
		// 		}

		// 		const 	date = xScale.invert(xDate);
	        	
		// 		app.highlightDay(date, years, data, xScale, yScale, innerHeight, innerWidth);
		// 	}
		// }

			// .attr('width', width)
			// .attr('height', innerHeight)
			// .attr('transform', `translate(${margin.left}, ${margin.top})`);


		// const chartHighlights = svg
		// 	.append('g')
		// 	.classed('chart-highlights', true)
		// 	.attr('width', innerWidth)
		// 	.attr('height', innerHeight)
		// 	.attr('transform', `translate(${margin.left}, ${margin.top})`);

		// // This vertical line will accent the point in time the user is hovering.
		// chartHighlights.append('line')
		// 	.classed('highlight-line', true)
		// 	.attr('stroke', 'black')
		// 	.attr('stroke-width', 2)
		// 	.attr('x1', width + 10)
		// 	.attr('x2', width + 10)
		// 	.attr('y1', 0)
		// 	.attr('y2', innerHeight);

		// // This path will connect the vertical highlight line to the highlight box
		// chartHighlights.append('path')
		// 	.classed('highlight-path', true)
		// 	.attr('stroke', 'black')
		// 	.attr('stroke-width', 2);


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
					lineColor = app.teamColors[teamName],
					lineWeight = team.team_name == "cubs" ? 4 : 2;
			const line = d3.line()
				// .curve(d3.curveBasisOpen)
			    .x(d => xScale(d['game_number']))
			    .y(d => yScale(d.record.wins - d.record.losses));
			

			chartInner.append("path")
				.datum(teamData)
				.attr("class", `line line--${teamName}`)
				.attr("d", line)
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

/*
		years.forEach(year => {

			const 	lineColor = year == app.lastYear ? app.options.currentColor : app.options.otherColor,
					lineWeight = year == app.lastYear ? 4 : 2;

			const line = d3.line()
				.curve(d3.curveBasisOpen)
			    .x(d => xScale(new Date(useYear, d['MONTH'] - 1, d['DAY'],0,0,0,0)))
			    .y(d => yScale(d['CUMULATIVE_SUM']));

			chartInner.append("path")
				.datum(data[year])
				.attr("class", `line line--${year}`)
				.attr("d", line)
				.attr('stroke', lineColor)
				.attr('stroke-width', lineWeight)
				.attr('fill', 'transparent')
				.attr('stroke-linecap', 'round');

			// Append a highlight circle for each year
			if (year == app.lastYear){
				// The circle for current year needs a little special style.
				chartHighlights.append('circle')
					.classed(`highlight-circle--${year}`, true)
					.classed(`highlight-circle`, true)
					.attr('cx', width + 10)	
					.attr('cy', innerHeight)
					.attr('r', 6)
					.attr('fill', 'white')
					.attr('stroke', 'black')
					.attr('stroke-width', 3);

			} else {
				chartHighlights.append('circle')
					.classed(`highlight-circle--${year}`, true)
					.classed(`highlight-circle`, true)
					.attr('cx', width + 10)	
					.attr('cy', innerHeight)
					.attr('r', 5)
					.attr('fill', 'black');
				}
		});
		if (!app.isMobile){
			chartInner.append('rect')
				.attr('height', innerHeight)
				.attr('width', innerWidth)
				.attr('fill', 'transparent')
				.on('mousemove', function(){
					const 	date = xScale.invert(d3.mouse(this)[0]);
					app.highlightDay(date, years, data, xScale, yScale, innerHeight, innerWidth);
		    	});
		}

		app.highlightDay(app.lastDate, years, data, xScale, yScale, innerHeight, innerWidth);
				*/
	}


}

module.exports = MultilineChart;