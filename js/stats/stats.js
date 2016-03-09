/**
 * @author Kate
 */

define(["common"], function(common) {

    var Stats = Class.extend({
        init : function(population, evalFxnX, evalFxnY) {
            var evaluations = [];
            
            
            for (var i = 0; i < population.length; i++) {
                var p = population[i];
                var x = evalFxnX(population[i]);
                var y = evalFxnY(population[i]);
                p.evaluation = new Vector(x, y);
            }
        }
    });
});
