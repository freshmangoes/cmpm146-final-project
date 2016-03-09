/**
 * @author Kate
 */

define(["common"], function(common) {

    var Individual = Class.extend({
        init : function(dna, index) {
            this.dna = dna;
            this.index = index;

            // line them up in rows

            this.center = new Vector((index % 5) * 150 - 300, Math.floor(index / 5) * 150 - 200);
            console.log(index + ": " + this.center);
            // TODO MAybe use this dna to make something

        },

        update : function(time) {
            // TODO Update the thing based on dna? on time?

        },

        draw : function(g) {
            // TODO Use this dna to draw something

            // Move to the right square
            g.pushMatrix();

            this.center.translateTo(g);

            g.fill(0, 0, 0, .4);
            var boxSize = 140;
            g.rect(-boxSize / 2, -boxSize / 2, boxSize, boxSize);
            for (var i = 0; i < this.dna.length / 5; i++) {
                var r = 10 + 30 * this.dna[i * 5];
                var theta = Math.PI * 2 * this.dna[i * 5 + 1];
                var hue = this.dna[i * 5 + 2];
                var pastel = this.dna[i * 5 + 3];
                var size = 30 * this.dna[i * 5 + 4];

                var p = Vector.polar(r, theta);
                var color = new common.KColor(hue, 1.2 - pastel, 1.2 * pastel);
                color.fill(g);
                g.noStroke();
                p.drawCircle(g, size, size);
            }
            g.popMatrix();
        },

        // Is this being clicked on?
        getDistanceTo : function(target) {
            return this.center.getDistanceTo(target);
        },

        select : function() {
            this.isSelected = true;
        },

        deselect : function() {
            this.isSelected = false;
        },
    });

    return Individual;
});
