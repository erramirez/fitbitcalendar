define(["domReady", 'v'], function (doc, v) {
var dowView = Backbone.View.extend({
	render: function () {
		var view = this

		var weekNames = ["sun","mon","tue","wed","thu","fri","sat"]

		var margin = {t:2,b:2,l:35,r:0},
			width = v.barSize,
			height = v.cellSize*7

		var x = d3.scale.linear()
			.range([0,width])
			.domain([0,this.collection.max])

		var y = d3.scale.ordinal()
			.rangeBands([0,height],.2,0)
			.domain(d3.range(7))

		var svg = d3.select(this.el)
			.attr({
				width: width+margin.l+margin.r,
				height: height+margin.t+margin.b
			})

		var g = svg
			.append("g")
			.attr({transform: "translate(" + margin.l + "," + margin.t + ")"})


		var bars = g.selectAll(".bars").data(this.model.get('dow'))
			.enter().append("rect")
			.attr({
				"class": "bars",
				x:0, y:function(d){return d.key * v.cellSize + .1*v.cellSize},
				height: v.cellSize - .2*v.cellSize, 
				width: 0
			})
			.style({
				"fill": function(d){return v.color(d.value)}
			})
		
		bars.on("mouseover", function barMouseover(d){

				// renderTooltip(this, {steps:d.values, text:"average", week:53})
				view.trigger('tooltip',true, this, {steps:d.value, text:"average"})

				d3.select(this)
					.attr('class', 'linkColor')
					.style('fill', '')

				var g = d3.select(this.parentNode.parentNode.parentNode.parentNode).select(".svgCalendar g")
				
				var dayHover = {
						"class": "dayHover",
						"width": v.cellSize*53, "height": v.cellSize,
						"y": d.key * v.cellSize,
						"x": 0
					}

				g.append("rect")
					.attr(dayHover)
					.style({
						fill:"gray", stroke:"none", 
						"stroke-width":4,
						"pointer-events":"none", opacity:.5
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
				d3.selectAll(".dayHover").remove()
				d3.select(this)
					.attr('class', '')
					.style("fill", function(d){return v.color(d.value)})
				view.trigger('tooltip', false)
			})

		bars.transition()
			.delay(53*5)
			.attr({
				width: function(d){return x(d.value)}
			})

		g.append("path")
			.attr({
				d:"M0,0v"+height,
				"class": "whiteLine"
			})
		g.append("path")
			.attr({
				d:"M0,0v"+height,
				"class": "blackLine"
			})

		g.selectAll("weekLabel1").data(this.model.get('dow'))
			.enter().append("text")
			.attr({
				x:-margin.l*.65,
				y:function(d,i){
					return i*v.cellSize+v.cellSize/2
				},
				"text-anchor":"middle", dy:".35em"
			})
			// .style("fill", function(d){return color(d.values)})
			.text(function(d,i){return weekNames[i]})	
	}
})

return dowView

})