/**
 * @author Kate
 */

define(["common", "./evoStats/evoStats"], function(common, EvoStats) {

    Evolution = Class.extend({

        init : function() {
            var evo = this;
            if (this.populationSize === undefined)
                this.populationSize = 8;

            if (this.variance === undefined)
                this.variance = .05;

            this.selected = undefined;

            /*
             this.stats = new EvoStats(this.populationSize, [{
             name : "height",
             evaluate: function(ind) {
             // measure something
             return utilities.noise(ind.id, app.time.total*.2);
             }
             },
             ]);
             */

            this.respawnAll();
        },

        draw : function(g) {

            for (var i = 0; i < this.currentPopulation.length; i++) {

                this.currentPopulation[i].draw(g);
            }

            if (this.stats) {
                g.pushMatrix();
                g.translate(-g.width / 2, 100);
                g.fill(0, 0, 0, .9);
                g.rect(0, 0, g.width, 200);
                g.translate(0, 190);

                this.stats.draw(g);
                g.popMatrix();
            }
        },

        update : function(time) {

            for (var i = 0; i < this.currentPopulation.length; i++) {

                this.currentPopulation[i].update(time);
            }

            /*
             if (time.frames % 10 === 0 && this.stats)
             this.stats.evaluate(this.currentPopulation);
             */
        },

        //==================================================
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

        //==================================================
        // a way to turn the thing you can modify
        //  into the thing you can judge
        instantiate : function(dna) {

        },

        respawnAll : function() {
            this.currentPopulation = [];
            for (var i = 0; i < this.populationSize; i++) {
                var dna = this.createDNA();
                this.currentPopulation[i] = this.instantiate(dna, i);
            }
        },

		findBestBee : function(treeDNA, beeArray){
			var leastDiff = 0;
			var bodyDiff = 0;
			var shrinkDiff = 0;
			var leastBeeIndex;
			for(var i=0;i<beeArray.length;i++){
				var currDiff=0;//stores cummulative difference between bee and tree
				
				// compare dna
				//body_height and leaf shape
				bodyDiff += treeDNA[12]-beeArray[i].dna[8];
				
				//body_width and leaf shape
				bodyDiff += treeDNA[15]-beeArray[i].dna[9];
				
				//bushy and wing width
				//bodyDiff += treeDNA[5]-beeArray[i].dna[10];
				
				//shrink and body height
				shrinkDiff += treeDNA[4]-beeArray[i].dna[8];
				
				//shrink and body width
				shrinkDiff += treeDNA[4]-beeArray[i].dna[9];
				
				if (bodyDiff>shrinkDiff){
					currDiff = bodyDiff;
				}
				else{
					currDiff = shrinkDiff;
				}
				//then add to currDiff
				//bee with lowest currDiff is the best bee
				if (leastDiff > currDiff || leastDiff == 0){
					leastDiff = currDiff;
					leastBeeIndex = i;
				}
				
			}
			//compare the treeDNA to the dna of each bee in the array.
			//return the bee that is the most similar to the given tree
			return beeArray[leastBeeIndex];
		},
		
        spawnFromSelected : function(beeRef) {
			var bestBee = this.findBestBee(this.selected.dna,beeRef.currentPopulation);
            var sourceTreeDNA = this.selected.dna;
			var sourceBeeDNA = bestBee.dna;
            this.currentPopulation = [];
            for (var i = 0; i < this.populationSize; i++) {
                var treeDNA = this.cloneDNA(sourceTreeDNA);
				var beeDNA = this.cloneDNA(sourceBeeDNA);
                this.modifyDNA(treeDNA, this.variance);
				this.modifyDNA(beeDNA, this.variance);
                this.currentPopulation[i] = this.instantiate(treeDNA, i);
				//next line needs to use beeDNA
				beeRef.currentPopulation[i] = beeRef.instantiate(beeDNA, i);
            }
        },
		
        spawnFromSelf : function() {

            for (var i = 0; i < this.populationSize; i++) {
                var sourceDNA = this.currentPopulation[i].dna;
                var dna = this.cloneDNA(sourceDNA);
                this.modifyDNA(dna, this.variance);
                this.currentPopulation[i] = this.instantiate(dna, i);
            }
        },
        //==================================================
        // Interaction
        selectAt : function(p) {
            var closest;
            var closestDist = 150;
            for (var i = 0; i < this.currentPopulation.length; i++) {
                var current = this.currentPopulation[i];
                var d = current.getDistanceTo(p);
                if (d < closestDist) {
                    closestDist = d;
                    closest = current;
                }
            }

            if (this.selected) {
                this.selected.deselect();
            }
            this.selected = closest;
            if (this.selected) {
                this.selected.select();
            }

        }
    });

    return Evolution;
});
