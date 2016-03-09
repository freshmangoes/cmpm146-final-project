define(["inheritance", "common"], function(_inheritance, common) {
    'use strict';
    var particleCount = 0;


    var Particle = Vector.extend({
        init : function(p) {
            this._super(p);

            // give this particle a unique id
            this.id = particleCount;
            particleCount++;

            this.lastPos = new Vector();
            this.totalForce = new Vector();
            this.velocity = new Vector();
            this.radius = 10;
            this.mass = this.radius / 10;

            this.forces = [];
        },

        updateForces : function(time) {

            // reset the forces
            this.totalForce.mult(0);

            // Move to the center if it gets too far off
            var d = this.magnitude();
            var range = 100;
            if (d > range) {
                this.totalForce.addMultiple(this, -.2 * Math.pow(d - range, 1.52) / d);
            }

            // Wander force
            var r = 300;

            var theta = 10 * utilities.noise(this.id + .07 * time.total);
            this.totalForce.addPolar(r, theta);
        },

        // Figure out the forces on the particle, how to change the velocity,
        updatePosition : function(time) {

            this.lastPos.setTo(this);

            this.velocity.addMultiple(this.totalForce, time.elapsed / this.mass);
         
            this.addMultiple(this.velocity, time.elapsed);

        },

        // Draw the particle to the screen.  'g' is the processing drawing object
        //  You might use: 'g.ellipse(x, y, radiusW, radiusH)', or 'g.rect(x, y, radiusW, radiusH)'
        //  Remember to also set the fill and stroke, or remove them if you dont want them
        //  You could also use a 'for' loop to layer multiple ellipses for each particle
        //  Also, browse the Vector library for useful drawing functions that deal with vectors
        draw : function(g) {

            var pctAge = this.age / this.lifespan;
            var intensity = Math.sin(pctAge * Math.PI);

            var hue = .6 + .4 * Math.sin(pctAge * 3);
            var color = new common.KColor(hue, 1, 1);

            for (var i = 0; i < 3; i++) {
                var pct = i / 3;
                var r = this.radius * (1 - pct) * (intensity + .4);
                g.noStroke();
                color.fill(g, -.5 + 1.9 * pct, -1.5 + .5 * intensity + pct);
                g.ellipse(this.x + .2, this.y, r, r);
            }

        },
    });

    return Particle;
});
