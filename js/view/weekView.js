define(['domReady', 'v'], function (doc, v) {
	
var weekView = Backbone.View.extend({
	render: render
})

function render (){
	var view = this

	var margin = {t:0,b:30,l:35,r:2},
		width = v.cellSize*53,
		height = v.barSize,
		monthNames = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]

	var y = d3.scale.linear()
		.range([height,0])
		.domain([0,this.collection.max])
	
	var monthS = d3.scale.ordinal()
		.rangeBands([0,width],0)
		.domain(d3.range(12))

	var svg = d3.select(this.el)

	var g = svg
		.attr({
			width: width+margin.l+margin.r,
			height: height+margin.t+margin.b
		})
		.append("g")
		.attr({transform: "translate(" + margin.l + "," + margin.t + ")"})


	var bars = g.selectAll(".bars").data(this.model.get('week'))
		.enter().append("rect")
		.attr({
			"class": "bars",
			x: function(d){return d.key * v.cellSize + .1*v.cellSize }, 
			width: function(d){return v.cellSize - .2*v.cellSize},
			y: height,
			height: 0, 
		})
		.style("fill", function(d){return v.color(d.value)})
	
	bars.on("mouseover", function barMouseover(d){

			// renderTooltip(this, {steps:d.value, text:"average", week:d.key})
			view.trigger('tooltip',true, this, {steps:d.value, text:"average", week:d.key})

			d3.select(this)
				.attr('class', 'linkColor')
				.style('fill', '')

			var g = d3.select(this.parentNode.parentNode.parentNode.parentNode).select(".calendarView g")
			
			var dayHover = {
					"class": "dayHover",
					"width": v.cellSize, "height": v.cellSize*7,
					"x": d.key * v.cellSize,
					"y": 0
				}

			g.append("rect")
				.attr(dayHover)
				.style({
					fill:"gray", stroke:"none", 
					"stroke-width":4,
					"pointer-events":"none", opacity:.8
				})
			g.append("rect")
				.attr(dayHover)
				.style({
					fill:"none", stroke:"none", 
					"stroke-width":2,
					"pointer-events":"none"
				})					

		})
	
	bars.on("mouseout", function(d){
			g.selectAll(".dayHover").remove()
			d3.select(this)
				.attr('class', '')
				.style("fill", function(d){return v.color(d.value)})
			view.trigger('tooltip', false)
		})


	bars.transition()
		.delay(function(d){return d.key*5})
		.attr({
			y: function(d){return y(d.value)},
			height: function(d){return height-y(d.value)}
		})

	// g.append("path")
	// 	.attr({
	// 		"class": "whiteLine",
	// 		"d": drawMonthLine(this.model)
	// 	})
	// g.append("path")
	// 	.attr({
	// 		"class": "blackLine",
	// 		"d": drawMonthLine(this.model)
	// 	})

	g.selectAll(".months").data(this.model.get('month'))
		.enter().append("text")
		.attr({
			x: monthXPosition,
			y: height+margin.b/2,
			fill: function(d){
				return "black"
				return color(d.values.steps)
			},
			dy:".50em", //"font-weight":"bold"
		})
		// .style("fill", function(d){
		// 	if (!d.values.steps) return "white"
		// 	return color(d.values.steps)
		// })
		.text(function(d){return monthNames[+d.key]})

	function monthXPosition(d){
		var w0 = v.week(d.values.date)*v.cellSize,
			w1 = v.week(d.values.date.clone().endOfMonth())*v.cellSize
		return (w1-w0)/2 + w0
	}
		
	function drawMonthLine(d){
		return "M"+ (d.get('week').first().key*v.cellSize+v.cellSize*.05)
			+","+ height +"h"+  (d.get('week').last().key*v.cellSize-d.get('week').first().key*v.cellSize+v.cellSize-v.cellSize*.05)
	}
}

return weekView

})