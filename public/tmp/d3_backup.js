		/*
		var w = 500,
			h = 300,
		    padding = 30;

		var xScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) {
							     return d[0];
							 })])
							 .range([padding, w - padding*2]);

		var yScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) {
							     return d[1];
							 })])
							 .range([h - padding, padding]);

		var rScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) {
							     return d[1];
							 })])
							 .range([2, 5]);

		var xAxis = d3.svg.axis()
						  .scale(xScale)
						  .orient('bottom')
						  .ticks(5);

		var yAxis = d3.svg.axis()
						  .scale(yScale)
						  .orient('left')
						  .ticks(5);

		var svg = d3.select(this.el)
					.select('.myd3-line-chart')
					.append('svg')
					.attr({
						width: w,
						height: h
					});

			svg.selectAll('circle')
			   .data(data)
			   .enter()
			   .append('circle')
			   .attr({
			       cx: function(d) {	
			           return xScale(d[0]);	
			       }, 
			       cy: function(d) {	
			           return yScale(d[1]);	
			       }, 
			       r: function(d) {			
			           return rScale(d[1]);
			       }
			   });

			svg.selectAll('text')
			   .data(data)
			   .enter()
			   .append('text')
			   .text(function(d) {
			       return d[0] + ',' + d[1];	
			   })
			   .attr({
			       x: function(d) {
			           return xScale(d[0]);
			       },
			       y: function(d) {
			           return yScale(d[1]);
			       },
			       'font-family': 'sans-serif',
			       'font-size': '12px',
			       'fill': 'green'
			   });

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0,  '+(h - padding)+')')
			.call(xAxis);

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate('+padding+', 0)')
			.call(yAxis);
		*/