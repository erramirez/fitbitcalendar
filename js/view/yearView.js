define(['domReady!', 'view/calendarView', 'view/dow', 'view/weekView', 'view/tooltip'], function (doc, calendarView, dowView, weekView, tooltip) {
	
	var yearView = Backbone.View.extend({
		tagName: 'div', className: 'yearView',

		initialize: function () {
			//Create SubViews
			this.calendarView = new calendarView({
				model: this.model, collection: this.collection
			})
			this.dowView = new dowView({
				model: this.model, collection: this.collection
			})
			this.weekView = new weekView({
				model: this.model, collection: this.collection
			})
			this.tooltip = new tooltip({
				model: this.model, collection: this.collection
			})

			//ListenTo
			this.listenTo(this.calendarView, 'tooltip', this.renderTooltip)
			this.listenTo(this.dowView, 'tooltip', this.renderTooltip)
			this.listenTo(this.weekView, 'tooltip', this.renderTooltip)
		},

		render: function () {
			this.$el.html(this.template())

			this.calendarView.setElement(this.$('.calendarView'))
			this.calendarView.render()

			this.dowView.setElement(this.$('.dowView'))
			this.dowView.render()

			this.weekView.setElement(this.$('.weekView'))
			this.weekView.render()

			this.tooltip.container = this.el
			this.$el.append(this.tooltip.el)

			return this
		},

		template: _.template( $('#t-yearView').text() ),

		renderTooltip: function (state, element, d) {
			if (state){
				this.tooltip.$el.animate({opacity:1, translateY: '0px'},100)
				this.tooltip.render(state, element, d)
			} else {
				this.tooltip.$el.animate({opacity:0, translateY: '-20px'},100)
			}

		}
	})

	return yearView
})