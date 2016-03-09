/**
 * @author Kate
 */

define(["common"], function(common) {
    var IndData = Class.extend({
        init : function(index) {
            this.index = index;
            this.data = [];
        },

        evaluate : function(stat, individual) {
            var val = stat.evaluate(individual);
            this.data.push(val);
        },

        draw : function(g) {
            g.noFill();
            g.stroke((this.index * .12) % 1, .4, 1);
            g.beginShape();
            for (var i = 0; i < 30; i++) {

                var index = this.data.length - (1 + i);
                if (index > 0) {
                    g.vertex(g.width - i * 10 - 20, this.data[index] * 200);
                }

            }
            g.endShape();
        }
    });

    var PopData = Class.extend({
        init : function(stat, populationCount) {
            this.populationCount = populationCount;
            this.data = [];
            this.stat = stat;
            for (var i = 0; i < populationCount; i++) {
                this.data[i] = new IndData(i);
            }
        },

        evaluate : function(population) {
            for (var i = 0; i < this.data.length; i++) {

                this.data[i].evaluate(this.stat, population[i]);
            }
        },

        draw : function(g) {
            for (var i = 0; i < this.data.length; i++) {
                this.data[i].draw(g);
            }
        }
    });

    var Stats = Class.extend({
        init : function(populationCount, recordStats) {
            this.recordStats = recordStats;
            this.populationCount = populationCount;
            this.popStats = [];
            for (var i = 0; i < recordStats.length; i++) {
                this.popStats[i] = new PopData(recordStats[i], populationCount);
            }
        },

        evaluate : function(population) {
            for (var i = 0; i < this.popStats.length; i++) {
                this.popStats[i].evaluate(population);
            }
        },

        draw : function(g) {
            for (var i = 0; i < this.popStats.length; i++) {
                this.popStats[i].draw(g);
            }
        }
    });
    return Stats;
});
