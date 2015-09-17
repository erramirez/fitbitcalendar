define(['d3'], function () {
    
    var v = {}

    v.cellSize = 16
    v.barSize = v.cellSize*5

    v.day = d3.time.format("%w"),
    v.week = d3.time.format("%U"),
    v.format = d3.format(""),
    v.date = d3.time.format("%d/%m/%y")

    v.color = d3.scale.linear()
        .domain([0,0])
        .range(["hsl(62,100%,90%)", "hsl(228,30%,20%)"])
        .interpolate(d3.interpolateHcl)

    return v
})