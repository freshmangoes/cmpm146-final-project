/**
 * @author Kate
 */

define(["common", "./boid"], function(common, Boid) {

    var BoidFlock = Class.extend({
        init : function(dna, index) {
            this.dna = dna;
            this.index = index;
            this.idColor = new common.KColor((Math.pow(index, 1.1) * .104 + .9) % 1, 1, 1);
            this.center = Vector.polar(210, index * .78);

            this.boids = [];

            this.neighborRange = 250;

            var pow = 3;
            this.multipliers = {
                separation : .14 + 6 * Math.pow(this.dna[1], pow),
                cohesion : .14 + 6 * Math.pow(this.dna[2], pow),
                alignment : .14 + 6 * Math.pow(this.dna[3], pow),

            };

            this.wanderForce = this.dna[4];
            this.wanderSpeed = this.dna[5];
            this.speedVariance = this.dna[6];

            for (var i = 0; i < 5; i++) {
                this.boids[i] = new Boid(this, i);

                this.boids[i].neighbors = this.boids;
            }

        },

        update : function(time) {

            this.center.mult(0);
            for (var i = 0; i < this.boids.length; i++) {
                // Find neighbors
                //    if (time % this.boids.length === i)
                //      this.boids[i].findFlock(this.boids);

                this.center.add(this.boids[i]);
            }

            this.center.div(this.boids.length);

            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].updateForces(time);
            }
            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].updatePosition(time);
            }
        },

        draw : function(g) {
            this.idColor.fill(g, 0, -.5);
            g.ellipse(this.center.x, this.center.y, 20, 20);
            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].draw(g);
            }

            if (app.showDebugInfo) {
                for (var i = 0; i < this.boids.length; i++) {

                    this.boids[i].drawForces(g);
                }
            }

            // Draw the dna for this flock
            g.pushMatrix();
            g.noStroke();
            var border = 2;
            g.translate(this.index * 130 + 10 - g.width / 2, 10 - g.height / 2);
            this.idColor.fill(g);
            g.rect(-border, -border, 120 + border * 2, 20 + border * 2);
            this.idColor.fill(g, -.7);
            g.rect(0, 0, 120, 20);

            var w = 120 / this.dna.length;
            for (var i = 0; i < this.dna.length; i++) {
                this.idColor.fill(g, this.dna[i]);
                var h = this.dna[i] * 20;
                g.rect(w * i, 20, w, -h);
            }
            g.popMatrix();

        },

        getDistanceTo : function(target) {
            return target.getDistanceTo(this.center);
        },

        select : function() {
            this.isSelected = true;
        },

        deselect : function() {
            this.isSelected = false;
        },
    });

    return BoidFlock;
});
