define(['domReady', 'v'], function (doc, v) {

    var tooltip = Backbone.View.extend({
        tagName: 'div', className: 'l-tooltip',

        initialize: initialize,

        render: render
    })

    var width = 80,
        height = 80,
        margin = {t:15,l:15,r:15,b:15}
        margin2 = {t:10,l:5,r:5,b:10}
        arrow = 10

    var color2 = v.color.copy().domain([0,9]),
        colorData = d3.range(10).map(function(d){return color2(d)})
        xB = d3.scale.ordinal()
            .domain(d3.range(10))
            .rangeBands([0,width],0,0),
        x = d3.scale.linear()
            .range([3,width-3])

    //FUNCTIONS

    function initialize () {
        // this.$el.hide()

        x.domain([0,this.collection.max])

        var top = 0
            left = 0
    
        var div = d3.select(this.el)
            .style({top: top, left: left})

        var svg = div.append("svg")
            .attr({
                width:width+margin.r+margin.l+margin2.r+margin2.l, 
                height:height+margin.t+margin.b+margin2.t+margin2.b
            })
        var g = svg.append("g")
            .attr("transform","translate("+ margin.l + ","+ margin.t +")")

        g.append("path")
            .attr('class', 'box')
            .attr("d", 
                "M"+ -margin2.l +" "+ -margin2.t +"H"+ (width+margin2.r)
                +" V"+ height +" H"+ (width/2+arrow) 
                +" l"+ -arrow +" "+ arrow 
                +" l"+ -arrow +" "+ -arrow
                +" H"+ -margin2.l +" Z")
       

        g.append("text")
            .attr({
                'class': 'text-steps',
                x:width/2,y:height/2-11,dy:".35em"
            })
            .text(100)

        g.append("text")
            .attr({
                'class': 'text-string',
                x:width/2,y:height/2+13,dy:".35em"
            })
            .style("fill", "hsl(0,0%,60%)")
            .text('teste')

        g.selectAll(".color").data(colorData)
            .enter().append("rect")
            .attr({
                'class': 'color',
                x:function(d,i){return xB(i)}, y:-margin2.t+6,
                width: xB.rangeBand(), height: 10+margin2.t
            })
            .style({stroke:"none",
                fill:function(d,i){return color2(i)}})

        g.append("path")
            .attr('class', 'arrow arrow2')
            .attr("d", "M"+ 0 +" 0 l-9 -9 h18 Z")
            .attr('transform', 'translate(2,2)')
        g.append("path")
            .attr('class', 'arrow')
            .attr("d", "M"+ 0 +" 0 l-9 -9 h18 Z")
    }

    function render (state, element, d) {

        x.domain([0,this.collection.max])

        var divB = this.container.getBoundingClientRect()
            rectB = element.getBoundingClientRect()

        var top = rectB.top-divB.top-height-margin.t-margin.b +"px"
            left = rectB.width/2+rectB.left-divB.left-(width+margin.l+margin.r)/2 +"px"

        var div = d3.select(this.el)
            .style({top: top, left: left})


        div.select('.text-steps')
            .text(d.steps.round().format())

        div.select('.text-string')
            .text(d.text)

        div.selectAll(".arrow")
            .attr("d", "M"+ x(d.steps) +" 0 l-9 -9 h18 Z")

    }

    return tooltip
})