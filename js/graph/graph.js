/**
 * @author Kate Compton
 */

define(["common", "./node", "./edge"], function(common, Node, Edge) {
    'use strict';
    var Graph = Class.extend({
        init : function() {

            this.nodes = [];
            this.edges = [];
            this.nodesToAdd = [];
            this.edgesToAdd = [];
        },

        addNode : function(n) {
            this.nodesToAdd.push(n);
        },

        addEdge : function(e) {
            this.edgesToAdd.push(e);
        },

        // Either makes the edge or returns if (if the current edge doesnt exist)
        connect : function(n0, n1) {
            var e = n0.getEdgeTo(n1);
            if (!e) {
                e = new Edge(n0, n1);
                this.edgesToAdd.push(e);
            }
            return e;
        },

        cleanup : function() {

            this.edges = this.edges.filter(function(edge) {
               
                return !edge.deleted;
            });

            this.nodes = this.nodes.filter(function(node) {
                return !node.deleted;
            });

         //   console.log("Adding " + this.edgesToAdd.length + " edges, " + this.nodesToAdd.length + " nodes");
            this.edges = this.edges.concat(this.edgesToAdd);
            this.edgesToAdd = [];
            this.nodes = this.nodes.concat(this.nodesToAdd);
            this.nodesToAdd = [];

        },

        update : function() {

        },

        createEdgeNode : function(edge, pct, offset) {

            var node = new Node(edge.getEdgePoint(pct, offset));
            this.nodesToAdd.push(node);
            return node;
        },

        // remove this edge, and replace with two new edges
        splitEdge : function(edge, nodes, removeEdge) {

            if (removeEdge)
                edge.deleted = true;

            var newEdges = [];

            var last = edge.start;
            // Connect these nodes with edges
            for (var i = 0; i < nodes.length; i++) {
                var e = new Edge(last, nodes[i]);
                this.edgesToAdd.push(e);
                newEdges.push(e);
                last = nodes[i];
            }

            var e = new Edge(last, edge.end);
            this.edgesToAdd.push(e);
            newEdges.push(e);

            return newEdges;
        },

        draw : function(g) {
            this.update();

            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].draw(g);
            }

            for (var i = 0; i < this.edges.length; i++) {
                this.edges[i].draw(g, 0, 0);
            }

        }
    });

    Graph.Node = Node;
    Graph.Edge = Edge;
    return Graph;

});
