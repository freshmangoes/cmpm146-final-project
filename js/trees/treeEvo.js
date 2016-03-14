/**
 * @author Kate
 */

define(["common", "../evo/evolution", "./tree", "../bees/bee"], function(common, Evolution, Tree, Bee) {

    function gaussRandom() {
        var r = 2 * (Math.random() - .5);
        r *= Math.random();
        return r;
    }

    var TreeEvolution = Evolution.extend({
        init : function() {
            this.offset = 0;
            this.last = 0;
            this.populationSize = 7;
            this.plantSpacing = 40;
            this.grass = [];

            this.treeLine = 200;

            // make grass
            for (var i = 0; i < 60; i++) {
                var r = 40 * (1 + utilities.noise(i * .3, 4));
                var theta = -Math.PI / 2 + .35 * ( utilities.noise(i * .09, 4));
                this.grass[i] = Vector.polar(r, theta);

            }
            this._super();
        },

        //==================================================
        // a way to turn the thing you can modify
        //  into the thing you can judge
        instantiate : function(dna, index) {

            var pos = new Vector(-300 + (app.dimensions.x - 80) * (index*.5 / this.populationSize), this.treeLine + Math.random() * 20);
			var beePos = new Vector(-300 + (app.dimensions.x - 80) * (index*.5 / this.populationSize), (this.treeLine + Math.random() * 20)-300);

            var tree = new Tree(dna, pos);
			var bee = new Bee(dna, beePos);

            return [tree, bee];
        },

        // A thing you can modify
        createDNA : function() {
            var dna = [];
            for (var i = 0; i < 20; i++) {
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

        selectAt : function(target) {
            this._super(target);
            console.log(this.selected);

            if (this.selected) {

                this.spawnFromSelected();
            }
        },

        update : function(time) {

            // for (var i = 0; i < this.currentPopulation.length; i++) {
            for(var i = 0; i < this.currentPopulation.length; i+=2){

				//this.currentPopulation[i].update(time);
                // this.currentPopulation[i][0].update(time);
				// this.currentPopulation[i][1].update(time);//might need to fix
                this.currentPopulation[i].update(time);
                this.currentPopulation[i+1].update(time);
                // replace

                //  console.log(x);
            }

        },
        draw : function(g) {

            for (var i = 0; i < 4; i++) {
                g.fill(.3, 6 + i * .2, 1 - i * .2, .2 + i * .1);
                g.rect(-g.width / 2, this.treeLine + -40 + Math.pow(i, 1.2) * 30, g.width, 120);
            }

            g.pushMatrix();

            for (var i = 0; i < this.grass.length; i++) {
                var y = this.treeLine + 40 + 20 * Math.sin(i * 3 + 40) - 50;
                g.fill(.3 + .1 * Math.sin(i + 20), .5 + .2 * Math.sin(i * 30 + 3), .8 + .2 * Math.sin(i * 50 + 2), .3);

                var x = (i / this.grass.length) * g.width;
                //var x = 50 + 20 * i;
                x = (x + this.offset + g.width * 100) % g.width - this.offset - g.width / 2;
                x += 5 * Math.sin(i * 30);
                g.beginShape();
                g.vertex(x - 9, y);
                g.vertex(x + 9, y);
                g.vertex(this.grass[i].x + x, this.grass[i].y + y);
                g.endShape();
                //  console.log(x);

            }

            this._super(g);

            // draw some grass

            for (var i = 0; i < this.grass.length; i++) {

                var y = this.treeLine + 40 + 20 * Math.sin(i * 3);
                g.fill(.3 + .1 * Math.sin(i), .5 + .2 * Math.sin(i * 30), .8 + .2 * Math.sin(i * 50), .6);

                var x = (i / this.grass.length) * g.width;
                //var x = 50 + 20 * i;
                x = (x + this.offset + g.width * 100) % g.width - this.offset - g.width / 2;
                x += 5 * Math.sin(i * 30);
                g.beginShape();
                g.vertex(x - 7, y);
                g.vertex(x + 7, y);
                g.vertex(this.grass[i].x + x, this.grass[i].y + y);
                g.endShape();
                //  console.log(x);

            }
            for (var i = 0; i < this.currentPopulation.length; i++) {

                //                this.currentPopulation[i].drawNumber(g);
            }
            g.popMatrix();

        }
    });
    return TreeEvolution;

});
