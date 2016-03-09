/**
 * @author Kate
 */

define(["common", "../evo/evolution", "./individual"], function(common, Evolution, Individual) {

    function gaussRandom() {
        var r = 2 * (Math.random() - .5);
        r *= Math.random();
        return r;
    }

    var CustomEvo = Evolution.extend({
        init : function() {
            this.dnaSize = 35;
            this.populationSize = 15;
            this.offset = 0;
            this.last = 0;

            this._super();

            this.selectAt(new Vector(0, 0));
        },

        //==================================================

        // A thing you can modify
        // TODO: Is this the DNA you want?  Would you rather have an array, or an array of arrays? Or something else?
        createDNA : function() {
            var dna = [];
            for (var i = 0; i < this.dnaSize; i++) {
                dna[i] = Math.random();
            }
            return dna;
        },

        // A way to turn the thing you can modify
        //  into the thing you can judge TODO, modify the individual.js file
        instantiate : function(dna, index) {

            var obj = new Individual(dna, index);
            return obj;
        },

        // Draw all the individuals (a way to judge the thing)
        draw : function(g) {
            this._super(g);
        },

        // Select the thing at the target (for picking with mouse interaction)
        selectAt : function(target) {
            this._super(target);
            console.log(this.selected);

            if (this.selected) {
                this.spawnFromSelected();
            }
        },

        // Helpers
        // TODO: If you change the DNA, you should also be able to change
        cloneDNA : function(dna) {
            var clone = [];
            for (var i = 0; i < dna.length; i++) {
                clone[i] = dna[i];
            }
            return clone;
        },

        // TODO: Is this the DNA you want?  Would you rather have an array, or an array of arrays? Or something else?
        modifyDNA : function(dna, amt) {
            for (var i = 0; i < dna.length; i++) {

                if (Math.random() > .5) {
                    dna[i] += 2 * Math.sin(300 * Math.random()) * amt;
                    dna[i] = Math.min(Math.max(0, dna[i]), 1);

                    dna[i] = (dna[i] - .5) * .99 + .5;
                }
            }
        },

        // Update all the simulations
        update : function(time) {
            this._super(time);

        },
    });
    return CustomEvo;

});
