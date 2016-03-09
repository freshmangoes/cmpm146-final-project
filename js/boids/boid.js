/**
 * @author Kate
 */

define(["common", "particles/particle"], function(common, Particle) {

    var boidCount = 0;

    // What forces are we tracking?
    var forceNames = ["separation", "cohesion", "alignment", "border", "flapping"];

    var Boid = Particle.extend({
        init : function(flock, index) {
            this._super();

            // Give this boid a position relative to its flock
            this.setToPolar(Math.random() * 50, Math.random() * 20);
            this.add(flock.center);
            // and a random direction to move
            this.rotation = Math.random() * Math.PI * 2;
            this.velocity.setToPolar(30, this.rotation);

            this.flock = flock;
            this.id = boidCount;
            this.idColor = flock.idColor.cloneShade(Math.random() * .1 - .05, 1);
            boidCount++;

            this.forces = {};

            for (var i = 0; i < forceNames.length; i++) {
                this.forces[forceNames[i]] = new Vector(0, 0);
            }
        },
        //============================================
        findNeighbors : function(allBoids) {
            this.neighbors = [];

            for (var i = 0; i < allBoids.length; i++) {
                if (allBoids[i] !== this) {

                    var d = allBoids[i].getDistanceTo(this);

                    if (d < this.neighbors.neighborRange)
                        this.neighbors.push(allBoids[i]);
                }
            }
        },

        updateForces : function(time) {
            this.rotation = this.velocity.getAngle();

            // drag
            this.velocity.mult(.985);

            // reset the forces
            this.totalForce.mult(0);
            for (var i = 0; i < forceNames.length; i++) {
                this.forces[forceNames[i]].mult(0);
            }

            // This bird is flapping its wings to move forward in the direction that it is pointed
            var speedBoost = 20 * this.flock.speedVariance * Math.sin(this.id * 5 + time.total);
            this.forces.flapping.setToPolar(30 + speedBoost, this.rotation);

            // Set the cohesion force
            // Get the average position of the flock
            if (this.neighbors.length > 0) {
                // Where is everyone?  Average their positions
                this.flockCenter = new Vector();

                // Where is everyone going?
                // Average everyone's direction together.
                // This works best by adding vectors (turn their direction into a vector with Vector.polar),
                // just adding angles doesn't often work the way you think it should! (but try it to see why)
                this.flockTarget = new Vector();

                var count = 0;
                for (var i = 0; i < this.neighbors.length; i++) {

                    if (this.neighbors[i] !== this) {
                        count++;
                        var neighbor = this.neighbors[i];

                        // Modify the flock center and the flock target
                        // where is everyone, and what direction are they moving?

                        // Is anyone too close?
                        var d = neighbor.getDistanceTo(this);
                        var range = 20;
                        if (d < range) {
                            // TODO: Do something to push this boid away from its neighbor
                            // add ...something to this.forces.separation
                        }

                    }
                }

                // TODO: You will probably need to divide by the number of neighbors that you added up
                //  then use flockCenter and flockTarget to do something to the cohesion and alignment forces
                //this.forces.cohesion.setTo(......something);
                //this.forces.alignment.setTo(......something);


                // USE MULTIPLIERS TO MAKE EACH FLOCK A BIT DIFFERENT 
                // (enable this to have evolutionary algorithms evolve your flocks when youclink on their center)
                /*
                this.forces.cohesion.mult(this.flock.multipliers.cohesion);
                this.forces.separation.mult(this.flock.multipliers.separation);
                this.forces.alignment.mult(this.flock.multipliers.alignment);
                */

                // BORDER FORCE
                // Move to the center if it gets too far off
                this.forces.border.mult(0);
                var d = this.magnitude();
                var range = 200;
                if (d > range) {
                    var distOutsideOfRange = d - range;
                    this.forces.border.addMultiple(this, -.2 * Math.pow(distOutsideOfRange, 1.22) / d);
                }
            }

            for (var i = 0; i < forceNames.length; i++) {
                this.totalForce.add(this.forces[forceNames[i]]);
            }
        },
        updatePosition : function(time) {
            this.flap = time.total * (10 + this.id % 2.4) + this.id;

            this._super(time);
        },

        //============================================

        drawForces : function(g) {
            // draw the forces
            for (var i = 0; i < forceNames.length; i++) {
                g.stroke(i * .14 + .4, 1, 1);
                this.drawArrow(g, this.forces[forceNames[i]], 1);
            }

        },

        draw : function(g) {
            g.noStroke();
            this.idColor.fill(g);

            //  this.flockTarget.drawCircle(g, 6);

            g.pushMatrix();
            this.translateTo(g);
            g.rotate(this.velocity.getAngle());

            g.noStroke();
            this.idColor.fill(g);
            var size = 6;
            var wingX = (1.9 + Math.sin(this.flap)) * size;
            var wingY = -2.2 * size + Math.abs(.3 + .8 * Math.sin(this.flap)) * size;

            g.beginShape();
            g.vertex(-size * 2, 0);
            g.vertex(wingY, -wingX);
            g.vertex(size, 0);
            g.vertex(wingY, wingX);
            g.endShape();

            g.popMatrix();

            if (this.selected) {

            }
        },
    });
    return Boid;

});
