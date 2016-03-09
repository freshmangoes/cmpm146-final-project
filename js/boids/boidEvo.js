/**
 * @author Kate
 */

define(["common", "../evo/evolution", "./boid", "./boidFlock"], function(common, Evolution, Boid, BoidFlock) {

    function gaussRandom() {
        var r = 2 * (Math.random() - .5);
        r *= Math.random();
        return r;
    }

    var BoidEvo = Evolution.extend({
        init : function() {
            this.dnaSize = 7;
            this.populationSize = 5;
            this.offset = 0;
            this.last = 0;

            this._super();

            this.selectAt(new Vector(0, 0));
        },

        //==================================================
        // a way to turn the thing you can modify
        //  into the thing you can judge
        instantiate : function(dna, index) {
            console.log(index + "/" + this.populationSize);
            var pos = new Vector((index / this.populationSize - .5) * 400, 0);

            var flock = new BoidFlock(dna, index);

            return flock;
        },

        // A thing you can modify
        createDNA : function() {
            var dna = [];
            for (var i = 0; i < this.dnaSize; i++) {
                dna[i] = Math.random();
            }
            return dna;
        },

        cloneDNA : function(dna) {
            var clone = [];
            for (var i = 0; i < dna.length; i++) {
                clone[i] = dna[i];
            }
            return clone;
        },

        modifyDNA : function(dna, amt) {
            for (var i = 0; i < dna.length; i++) {

                if (Math.random() > .5) {
                    dna[i] += 2 * Math.sin(300 * Math.random()) * amt;
                    dna[i] = Math.min(Math.max(0, dna[i]), 1);

                    dna[i] = (dna[i] - .5) * .99 + .5;
                }
            }
        },

        // Select the thing at the target (for picking with mouse interaction)
        selectAt : function(target) {
            this._super(target);
            console.log(this.selected);

            if (this.selected) {
                this.variance = .3;
                this.spawnFromSelected();
            }
        },

        // Update all the simulations
        update : function(time) {
            this._super(time);

        },

        // Draw all the individuals
        draw : function(g) {

            g.pushMatrix();

            this._super(g);

            g.popMatrix();

        }
    });
    return BoidEvo;

});
