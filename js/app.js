var app = {};

// A holder for lots of app-related functionality
define(["processing", "common", "./trees/treeEvo", "./boids/boidEvo", "./customEvo/evoSim", "./bees/beeEvo"], function(_processing, common, TreeEvo, BoidEvo, CustomEvo, BeeEvo) {
    'use strict';

    // A little time object to keep track of the current time,
    //   how long its been since the last frame we drew,
    //   and how long the app has been running
    app.time = {
        date : Date.now(),
        start : Date.now(),
        total : 0,
        elapsed : .1,
        frames : 0,
        updateTime : function() {
            var last = this.date;
            this.date = Date.now();
            this.total = (this.date - this.start) / 1000;
            this.elapsed = (this.date - last) / 1000;
            if (this.elapsed < .01)
                this.elapsed = .01;
            if (this.elapsed > .1)
                this.elapsed = .1;

            this.frames++;
        }
    };

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),

        init : function() {

            app.graphs = [];

            // Get the canvas element
            // Note that this is the jquery selector, and not the DOM element (which we need)
            // myJQuerySelector.get(0) will return the canvas element to pass to processing
            var canvas = $("#processingCanvas");

            var processingInstance = new Processing(canvas.get(0), function(g) {

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.dimensions.setTo(w, h);

                // TODO switch between BoidEvo and CustomEvo here
                //app.evolution = new BoidEvo();
                app.evolution1 = new TreeEvo();
				app.evolution2 = new BeeEvo(app.evolution1);

                g.size(w, h);

                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);

                // Create the canvas

                g.background(.12, .04, .8);
                // Move to the center of the canvas

                g.draw = function() {
                    g.fill(.55, .1, 1, 1);
                    g.rect(0, 0, w, h);

                    // Update time
                    app.time.updateTime();
                    app.evolution1.update(app.time);
					app.evolution2.update(app.time);


                    g.pushMatrix();
                    g.translate(w / 2, h / 2);
                    app.evolution1.draw(g);
					app.evolution2.draw(g);

                    g.popMatrix();
                };
            });
            this.initUI();
        },

        initUI : function() {

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);

                switch(key) {
                case ' ':
                    app.paused = !app.paused;
                    break;

                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
            });

            $("#processingview").click(function(e) {
                var parentOffset = $(this).offset();
                //or $(this).offset(); if you really just want the current element's offset
                var relX = e.pageX - parentOffset.left - app.dimensions.x / 2;
                var relY = e.pageY - parentOffset.top - app.dimensions.y / 2;

                app.evolution1.selectAt(new Vector(relX, relY), app.evolution2);
            });

            $("#replant").click(function() {
                app.evolution1.respawnAll();
				app.evolution2.respawnAll();
            });
            
            $("#debug").click(function() {
                app.showDebugInfo = !app.showDebugInfo;
            });

            $("#evolve").click(function() {
                //     app.evolution.setMode("evolve");
            });
            $("#evolveAll").click(function() {
                //    app.evolution.setMode("evolveAll");
            });

        }
    });

});
