/**
 * @author Kate Compton
 */

define(["common"], function(common) {
    'use strict';

    var Edge = Class.extend({
        init : function(start, end) {

            this.start = start;
            this.end = end;
            this.offset  = new Vector();
                 this.offset.setToDifference(this.end, this.start);
       this.start.addOutbound(this);
            this.end.addInbound(this);
        },

        getLength : function() {
            this.offset.setToDifference(this.end, this.start);
            return this.offset.magnitude();
        },
        getAngle : function() {
            this.offset.setToDifference(this.end, this.start);
            return this.offset.getAngle();
        },

        getEdgePoint : function(pct, normalOffset) {
            var theta = this.offset.getAngle();
            var pt = this.start.lerp(this.end, pct);
            pt.addPolar(normalOffset, theta + Math.PI / 2);
            return pt;
        },

        drawOffset : function(g, spacing, border) {

            var theta = this.offset.getAngle();
            var w = this.offset.magnitude();
            g.pushMatrix();
            this.start.translateTo(g);
            g.rotate(theta);

            g.strokeWeight(30 / (1 + Math.pow(this.group, 1.8)));

            g.line(border, spacing, w - border * 2, spacing);

            g.popMatrix();
        },

        draw : function(g, spacing, border) {

            if (this.testColor)
                this.testColor.stroke(g, 0, 0);
            else
                g.stroke(0, 0, 0, .3);

            g.line(this.start.x, this.start.y, this.end.x, this.end.y);

        },

        drawAsArrow : function(g, spacing, border) {
            var theta = this.offset.getAngle();

            var arrowW = 12;
            var arrowH = arrowW * .3;

            var w = this.offset.magnitude();

            g.pushMatrix();
            this.start.translateTo(g);
            g.rotate(theta);
            g.stroke(0, 0, 0, .3);
            g.line(border, spacing, w - border - arrowW * .5, spacing);

            g.fill(0, 0, 0, .3);
            g.noStroke();
            g.translate(w - border, spacing);

            g.beginShape();
            g.vertex(0, 0);
            g.vertex(-arrowW, arrowH);
            g.vertex(-arrowW * .8, 0);
            g.vertex(-arrowW, -arrowH);
            g.endShape(g.CLOSE);
            g.popMatrix();

        },

        toString : function() {
            //   return this.start + "-" + this.end + "(" + this.group + ")";
            return this.side;
        }
    });
    return Edge;
});
