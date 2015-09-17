require.config({
	paths: {
		zepto: 'lib/zepto',
		underscore: 'lib/underscore',
		backbone: 'lib/backbone',
		localstorage: 'lib/backbone.localStorage',
		d3: 'lib/d3.v3',
		sugar: 'lib/sugar.min',
		domReady: 'lib/domReady'
	},
	shim: {
		sugar:{
			init: function () {
				// Object.extend()
			}
		},
		backbone:{
			deps:['underscore', 'zepto'],
			// exports: 'Backbone'
		},
		d3:{
			deps:['backbone', 'sugar']
		},
		domReady: {
			deps:['d3', 'backbone', 'sugar']
		}
	}
})

///////////////////

require( ['domReady!', 'v', 'view/yearView'], function(doc, v, yearView) {

	var dataModel = Backbone.Model.extend({
		defaults: {
			date: Date.create(),
			steps: 0
		},
		parse: function(d){
			d.date = Date.create(d.date)
			d.steps = +d.steps
			return Object.reject(d,'distance')
		},
		validate: function(d){
			if (d.steps == 0) return "invalidate"
		}
	})

	var dataCollection = Backbone.Collection.extend({
		model: dataModel,
		initialize:function () {
			this.listenTo(this, 'reset', this.calculate)
		},
		sync: function (method, model, options) {
			if (method=='read') {
				d3.csv('fitbit2.csv', function(d){
					options.success(model,d, options)
					model.trigger('sync', model, d, options)
				})            
			}
		},
		calculate: function () {
			this.max = d3.max(this.models, function(d,i){return d.get('steps')})
			this.mean = d3.mean(this.models, function(d,i){return d.get('steps')}).round()
		}
	})
	var dataCollection = new dataCollection

	var YearModel = Backbone.Model.extend({
		defaults: {
			year: 2012,
			data: [{date:Date.create(), steps:0}],
			dow: [{key:0, value:0}],
			week: [{key:0, value:0}]
		},
		parse: function (d) {
			var dayFormatter = this.dayFormatter
			var weekFormatter = this.weekFormatter
			var dow = d3.nest()
				.key(function(d){
					return dayFormatter(d.date)
				})
				// .sortKeys(comparator)
				.rollup(function(d){
					return d.average("steps").round()
				})
				.entries(d.values)
				.map(function(d,i){return {key: +d.key, value: d.values}})
			var week = d3.nest()
				.key(function(d){return weekFormatter(d.date)})
				// .sortKeys(comparator)
				.rollup(function(d){
					return d.average("steps").round()
				})
				.entries(d.values)
				.map(function(d,i){return {key: +d.key, value: d.values}})
			var month = d3.nest()
				.key(function(d){return d.date.getMonth()})
				// .sortKeys(comparator)
				.rollup(function(d){
					return {
						steps: d.exclude({steps:0}).average("steps"),
						date: d.first().date
					}
				})
				.entries(d.values)

			return {
				year: d.key, 
				data: d.values,
				dow: dow,
				week: week,
				month: month
			}
		},
		dayFormatter: d3.time.format("%w"),
		weekFormatter: d3.time.format("%U")
	})

	var yearCollection = Backbone.Collection.extend({
		model: YearModel,
		initialize: function () {
			// this.listenTo(dataCollection, 'reset', this.createData)
		}
	})
	yearCollection = new yearCollection


	var appView = Backbone.View.extend({
		collection: dataCollection,
		el: ".mainBody",
		initialize: function () {
		},
		render: function () {
			var max = this.collection.max.abbr()
			var mean = this.collection.mean.abbr()

			var html = _.template( $('#t-maxMean').text() )
			this.$(".maxMean").html(html({max:max,mean:mean}))

			return this
		},
		addYearView: function (collection) {
			this.$("#yearsContainer").empty()
			collection.each(function (model) {
				var view = new yearView({model:model, collection:dataCollection})
				this.$("#yearsContainer").append(view.render().el)
			})
		}
	})
	appView = new appView

	var controller = _.extend({
		initialize: function () {

			this.listenTo(dataCollection, 'reset', this.dataCollectionReset)

			dataCollection.fetch({validate:true, parse:true})
		},
		dataCollectionReset: function (collection, options) {

			var data = dataCollection.toJSON()
			var years = d3.nest()
				.key(function(d){return d.date.getFullYear()})
				.entries(data)

			yearCollection.reset(years, {parse:true})

			v.color.domain([0,dataCollection.max])

			appView.render()
			appView.addYearView(yearCollection)

		}
	}, Backbone.Events)

	controller.initialize()

	d3.select('#mainBt')
		.on('mouseover', function(d,i){
			d3.select(this).text('soon')
		})
		.on('mouseout', function(d,i){
			d3.select(this).text('Visualize your Data')
		})

})










