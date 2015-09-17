define(['domReady', 'v'], function(doc, v){
	var calendarView = Backbone.View.extend({

		render: function render () {
			var view = this

			var margin = {t:2,b:2,l:35,r:2},
				width = v.cellSize*53,
				height = v.cellSize*7

			var svg = d3.select(this.el)
				.attr({
					width: width+margin.l+margin.r,
					height: height+margin.t+margin.b
				})

			var g = svg
				.append("g")
				.attr({transform: "translate(" + margin.l + "," + margin.t + ")"})
				.datum(this.model)

			g.append("text")
				.attr({
					transform: "translate(" + -(v.cellSize*1) + "," + v.cellSize*3.5 + ")rotate(-90)"
				})
				.style({
					"dy":".35em", "text-anchor":"middle",
					"font-size": "19px"
				})
				.text(function(d,i){return d.get('year')})

			var days = g.selectAll(".day")
				.data(function(d,i){return d.get('data')})
				.enter().append("rect")
				.attr({
					"class": "day",
					"width": v.cellSize, "height": v.cellSize,
					"x": function(d) { 
						return v.week(d.date) * v.cellSize
					},
					"y": function(d) { return v.day(d.date) * v.cellSize }
				})
				.style("fill", function(d){ return v.color(d.steps)} )

			// console.log(days.node())
			// var f = this.model.get('data').first()
			// view.trigger('tooltip', true, days.node(), {steps:f.steps, text:f.date.format('{dd}/{MM}/{yy}')})
			
			days.on("mouseover", function(d){

				view.trigger('tooltip',true, this, {steps:d.steps, text:d.date.format('{dd}/{MM}/{yy}'), week:v.week(d.date)})

				g.append("rect")
					.attr({
						"class": "dayHover",
						"width": v.cellSize, "height": v.cellSize,
						"x": v.week(d.date) * v.cellSize,
						"y": v.day(d.date) * v.cellSize
					})
			})
			days.on("mouseout", function(d){
				g.selectAll(".dayHover").remove()
				view.trigger('tooltip', false)
			})

			var monthsData = d3.time.months(new Date(+this.model.get('year'), 0, 1), new Date(+this.model.get('year') + 1, 0, 1))

			g.selectAll(".month")
				.data(monthsData)
				.enter().append("path")
				.attr("class", "month")
				.attr("d", monthPath)
			g.selectAll(".month3")
				.data(monthsData)
				.enter().insert("path", ":first-child")
				.attr("class", "month3")
				.attr("d", monthPath)

			function monthPath(t0) {
			  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
			      d0 = +v.day(t0), w0 = +v.week(t0),
			      d1 = +v.day(t1), w1 = +v.week(t1);
			  return "M" + (w0 + 1) * v.cellSize + "," + d0 * v.cellSize
			      + "H" + w0 * v.cellSize + "V" + 7 * v.cellSize
			      + "H" + w1 * v.cellSize + "V" + (d1 + 1) * v.cellSize
			      + "H" + (w1 + 1) * v.cellSize + "V" + 0
			      + "H" + (w0 + 1) * v.cellSize + "Z";
			}
			

			
		}

	})

	

	return calendarView
})