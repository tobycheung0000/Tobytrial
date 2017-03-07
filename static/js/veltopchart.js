// ----- CODE to draw the comfort zone on a chart with operative Temp on the x-axis and Air speed on the y-axis -----
// ----- time out section for testing the change from rh to velocity

var vc = new function() {

    // set up viewport
    this.margin = 60
    this.rbmargin = 40
    this.width = 580
    this.height = 500
    this.db_min = 10
    this.db_max = 34


    this.db_extent = [this.db_min, this.db_max]
    this.db_scale = d3.scale.linear()
        .range([this.margin, this.width - this.rbmargin])
        .domain(this.db_extent)


    this.db_extent_F = [util.CtoF(this.db_min), util.CtoF(this.db_max)]
    this.db_scale_F = d3.scale.linear()
        .range([this.margin, this.width - this.rbmargin])
        .domain(this.db_extent_F)

    this.vel_extent = [0, 1.6]
    this.vel_scale = d3.scale.linear()
        .range([this.height - this.margin, this.rbmargin])
        .domain(this.vel_extent)

    this.vel_extent_fpm = [0, 315]
    this.vel_scale_fpm = d3.scale.linear()
        .range([this.height - this.margin, this.rbmargin])
        .domain(this.vel_extent_fpm)

    // defining a poliline
    this.pline = d3.svg.line()
        .x(function(d) {
        return this.db_scale(d.db)
    })
        .y(function(d) {
        return this.vel_scale(d.vel)
    })

    this.drawChart = function() {

        var db_axis = d3.svg.axis().scale(vc.db_scale)
        var db_axis_F = d3.svg.axis().scale(vc.db_scale_F)
        var vel_axis = d3.svg.axis().scale(vc.vel_scale).orient("left")
        var vel_axis_fpm = d3.svg.axis().scale(vc.vel_scale_fpm).orient("left")

        var line = d3.svg.line()
            .x(function(d) {
            return vc.db_scale(d.db)
        })
            .y(function(d) {
            return vc.vel_scale(d.vel)
        })
            .interpolate('cardinal')

        // drawing svg
        d3.select("#veltopchart-div")
            .append("svg")
            .attr("class", "svg-veltop").attr("id", "svg-veltop")
            .attr("width", vc.width)
            .attr("height", vc.height)

		vc.svg = d3.select(".svg-veltop")

        // ClipPath
          vc.svg
            .append("defs")
            .append("clipPath")
            .attr("id", "clip_vt")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", vc.width - vc.margin - vc.rbmargin)
            .attr("height", vc.height - vc.margin - vc.rbmargin)
            .attr("transform", "translate(" + vc.margin + "," + vc.rbmargin + ")")

        // Drawing the axes
          vc.svg
            .append("g")
            .attr("class", "db axis")
            .attr("id", "db-axis-C-veltop")
            .attr("transform", "translate(0," + (vc.height - vc.margin) + ")")
            .call(db_axis.tickSubdivide(0).tickSize(-(vc.height - vc.margin - vc.rbmargin), 0).tickPadding(5))

          vc.svg
            .append("g")
            .attr("class", "db axis")
            .attr("id", "db-axis-F-veltop")
            .attr("opacity", "0")
            .attr("transform", "translate(0," + (vc.height - vc.margin) + ")")
            .call(db_axis_F.tickSubdivide(0).tickSize(-(vc.height - vc.margin - vc.rbmargin), 0).tickPadding(5))

          vc.svg
            .append("g")
            .attr("class", "vel axis")
            .attr("id", "vel-text-vt")
            .attr("transform", "translate(" + (vc.margin) + ",0)")
            .call(vel_axis.tickSubdivide(0).tickSize(-(vc.width - vc.margin - vc.rbmargin), 0).tickPadding(5))

          vc.svg
            .append("g")
            .attr("class", "vel axis")
            .attr("id", "vel-text-vt-fpm")
            .attr("opacity", "0")
            .attr("transform", "translate(" + (vc.margin) + ",0)")
            .call(vel_axis_fpm.tickSubdivide(0).tickSize(-(vc.width - vc.margin - vc.rbmargin), 0).tickPadding(5))


        // giving labels to the axes

        d3.select("#db-axis-C-veltop")
            .append("text")
            .text("Operative Temperature [°C]")
            .attr("class", "db-unit")
            .attr("x", (vc.width / 2) - 50)
            .attr("y", vc.margin / 1.6)


        d3.select("#db-axis-F-veltop")
            .append("text")
            .text("Operative Temperature [°F]")
            .attr("class", "db-unit")
            .attr("x", (vc.width / 2) - 50)
            .attr("y", vc.margin / 1.6)


        d3.select("#vel-text-vt")
            .append("text")
            .text("Air Speed [m/s]")
            .attr("transform", "rotate (-90, -45, -10) translate(-350)")

        d3.select("#vel-text-vt-fpm")
            .append("text")
            .text("Air Speed [fpm]")
            .attr("transform", "rotate (-90, -45, -10) translate(-350)");

    }


    this.drawComfortRegion = function(data) {

        d3.select(".svg-veltop")
            .append("path")
            .attr("clip-path", "url(#clip_vt)")
            .attr("d", vc.pline(data) + "Z")
            .attr("class", "comfortzone-veltop").attr("id", "veltop-comfortzone")
            .on("mouseover", function() {
            d3.select(this).attr("class", "comfortzoneover");
        })
            .on("mouseout", function() {
            d3.select(this).attr("class", "comfortzone-veltop");
        });

    }

    this.redrawComfortRegion = function(data) {

        d3.select(".comfortzone-veltop")
            .transition()
            .attr("d", vc.pline(data) + "Z")
    }

    this.drawPoint = function() {

          vc.svg
            .append("circle")
            .attr("class", "outer")
			.attr("clip-path", "url(#clip_vt)")
            .attr("r", 12)

          vc.svg
            .append("circle")
			.attr("clip-path", "url(#clip_vt)")
            .attr("class", "inner")
            .attr("r", 2)

        d3.selectAll("circle")
            .attr("cx", vc.db_scale(d.ta))
            .attr("cy", vc.vel_scale(d.vel))

    }

    this.redrawPoint = function() {

        d3.selectAll("circle")
            .transition()
            .attr("cx", vc.db_scale(d.ta))
            .attr("cy", vc.vel_scale(d.vel))

    }

//    this.getHumRatio = function(db, vel) {
//        return psy.humratio(psy.PROP.Patm, vel * psy.satpress(db) / 100)
//    }

    this.findComfortBoundary = function(d, pmvlimit) {
        var boundary = []

        function solve(vel, target) {
            var epsilon = 0.001
            var a = 0
            var b = 5
            var fn = function(db) {
                return (comf.pmvElevatedAirspeed(db, d.tr, vel, d.rh, d.met, d.clo, d.wme).pmv - target)
            }
            //t = util.bisect(a, b, fn, epsilon, target)
            t = util.secant(a, b, fn, epsilon)
            return {
                "db": t,
                "vel": vel
            }
        }

        for (vel = 0.09; vel <= 1.99; vel += 0.1) {
//        for (vel = 0; vel <= 2; vel += 0.1) {
            boundary.push(solve(vel, -pmvlimit))
        }

        for (vel = 1.99; vel >= 0.05; vel -= 0.1) {
//        for (vel = 2; vel >= 0; vel -= 0.1) {
            boundary.push(solve(vel, pmvlimit))
        }

//        for (db = 10; db <=36; db +=5) {
//            boundary.push({
//            "db": db,
//            "vel": 0.1})
//        }

        return boundary
    }

    this.toggleUnits = function(isCelsius) {

        if (isCelsius) {
            d3.select("#db-axis-C-veltop").attr("opacity", "100")
            d3.select("#db-axis-F-veltop").attr("opacity", "0")
            d3.select("#vel-text-vt").attr("opacity", "100")
            d3.select("#vel-text-vt-fpm").attr("opacity", "0")
        } else {
            d3.select("#db-axis-C-veltop").attr("opacity", "0")
            d3.select("#db-axis-F-veltop").attr("opacity", "100")
            d3.select("#vel-text-vt").attr("opacity", "0")
            d3.select("#vel-text-vt-fpm").attr("opacity", "100")
        }

    }

}
