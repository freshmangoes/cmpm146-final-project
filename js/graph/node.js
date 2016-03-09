/**
 * @author Kate Compton
 */

define(["common"], function(common) {
    'use strict';
    var nodeCount = 0;
    var Node = Vector.extend({
        init : function() {
            this._super.apply(this, arguments);
            this.id = nodeCount;
            nodeCount++;

            this.inbound = [];
            this.outbound = [];

        },

        getEdgeTo : function(n0) {
            for (var i = 0; i < this.outbound.length; i++) {
                if (this.outbound[i].end === n0)
                    return this.outbound[i];
            }
        },

        draw : function(g) {

            g.fill(0, 0, 0, .5);
            g.noStroke();
            this.drawCircle(g, 10);

        },

        addInbound : function(e) {
            this.inbound.push(e);

        },
        addOutbound : function(e) {
            this.outbound.push(e);
        },
        toString : function() {
            return "N" + this.id;
        }
    });

    return Node;
});
