/**
 * @author Kate
 */

define(["common", "graph/graph"], function(common, Graph) {
    var SPREAD = 0;
    var ID_ANGLE = 1;
    var ANGLE_SKEW = 2;
    var ANIM_ANGLE = 3;
    var SHRINKAGE = 4;
    var BUSHINESS = 5;
    var HUE_START = 6;
    var HUE_DIFF = 7;
    var FLOWER_HUE = 8;
    var FLOWER_COUNT = 9;

    var FLOWER_SATURATION = 10;

    var WIGGLE = 11;
    var LEAF_SHAPE = 12;
    var LEAF_VARIATION = 13;
    var LEAF_COUNT = 14;
    var LEAF_ASPECT = 15;

    var SATURATION = 18;
    var VARIATION = 19;
    var FLOWER_SECONDARY = 16;
    var PETAL_ASPECT = 17;

    var graphCount = 0;
    // Make some custom fractals

    var treeCount = 0;

    var TreeNode = Graph.Node.extend({
        init : function(parent, childPct) {

            this._super();
            this.parent = parent;
            this.depth = 0;

            // No children yet
            this.children = [];
            this.childPct = childPct;

            if (this.parent) {
                this.setParent();
            }

            // No offset to start
            this.angle = this.baseAngle;

            // Make a color for this node
            this.idColor = new common.KColor((3 + this.dna[HUE_START] + .1 * this.dna[HUE_DIFF] * this.depth) % 1, -this.dna[SATURATION] * this.depth * .08 + .7 + .3 * this.dna[SATURATION] * (Math.sin(this.depth)), .3 + .1 * this.depth);

        },

        setParent : function() {

            this.tree = this.parent.tree;

            this.dna = this.parent.dna;

            this.depth = this.parent.depth + 1;

            // Add to the parent's list of children
            this.childIndex = this.parent.children.length;
            this.parent.children.push(this);

            // As a child, offset the child index
            var skew = Math.pow(this.dna[ANGLE_SKEW] - .5, 3);
            var spread = (1.5 * this.dna[BUSHINESS]);
            this.baseAngle = this.parent.angle + spread * (this.childPct - .5) + skew;

            this.baseAngle += this.dna[WIGGLE] * .1 * Math.sin(this.depth) * this.depth;

            // Set the position relative to the parent
            var mult = 15 - 12 * this.dna[BUSHINESS];
            this.branchLength = .7 * mult * this.parent.radius;

            // Add a variance in length
            this.branchLength *= (1 + 1 * this.dna[VARIATION] * (Math.random() - .5));
            this.radius = this.parent.radius * (.6 + .3 * this.dna[SHRINKAGE]);

            this.setToPolarOffset(this.parent, this.branchLength, this.baseAngle);

        },

        createChild : function(pct, graph) {
            var child = new TreeNode(this, pct);

            graph.addNode(child);
            graph.connect(this, child);
        },

        update : function() {
            // Set the position relative to the parent
            if (this.parent) {
                this.angleOffset = .1 * (1.2 + this.depth) * Math.sin(2 * app.time.total + this.depth);

                // Offset self
                this.angleOffset += .2 * Math.sin(this.id);

                this.angle = this.baseAngle + this.angleOffset;

                this.setToPolarOffset(this.parent, this.branchLength, this.angle);
            }

            // Update self, then update children
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].update();
            }
        },

        draw : function(g) {
            g.noStroke();
            this.idColor.fill(g);
            this.drawCircle(g, this.radius);

            if (this.children.length === 0) {
                g.pushMatrix();
                this.translateTo(g);
                g.rotate(this.angle);

                var petalSize = 5 * this.radius;
                var aspect = .1 + .9 * this.dna[PETAL_ASPECT];
                var petalH = petalSize * aspect;
                var petalW = petalSize * (1 - aspect);

                // Draw some flowers?  What kind?

                for (var i = 0; i < this.tree.petalCount; i++) {
                    this.tree.petalColor.fill(g, .1 * Math.sin(i), 1);
                    g.rotate(Math.PI * 2 / this.tree.petalCount);
                    g.ellipse(petalH * 1.5, 0, petalH, petalW);
                    this.tree.petalVolume += petalH * petalW;

                }

                g.popMatrix();

            }
        },

        calculateStats : function() {
            this.stats = {
                height : 0,
                left : 999,
                right : -999,
                leafVolume : 0,
                flowerVolume : 0,
            };

            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].calculateStats(this.stats);
            }
        },

        getColor : function() {
            return this.idColor;
        }
    });

    // A root node is a special case of a tree node
    var RootNode = TreeNode.extend({
        init : function(tree, dna, pos, angle, radius) {
            this.dna = dna;
            this._super();
            this.tree = tree;

            this.setTo(pos);
            this.radius = radius;

            this.angle = angle;
            this.depth = 0;
        }
    });

    var Tree = Graph.extend({
        init : function(dna, rootPos) {
            this._super();
            this.iterations = 0;
            this.dna = dna;
            this.id = treeCount;
            treeCount++;

            Tree.treeCount = treeCount;

            // Create a root node
            this.root = new RootNode(this, dna, rootPos, -Math.PI / 2, 5 + Math.random() * 4);

            this.addNode(this.root);

            this.cleanup();
            for (var i = 0; i < 10; i++) {
                this.iterate();
                this.cleanup();

            }

            this.leafCount = Math.floor(this.dna[LEAF_COUNT] * 5);

            this.petalCount = Math.round(8 * this.dna[FLOWER_COUNT]);

            this.petalColor = new common.KColor((this.dna[FLOWER_HUE] * 1.2 + .9) % 1, this.dna[FLOWER_SATURATION], .6, .3);

        },

        getDistanceTo : function(target) {
            return target.getDistanceTo(this.root);
        },

        iterate : function() {
            this.cleanup();

            // Take all the current nodes
            for (var i = 0; i < this.nodes.length; i++) {
                // Any children?
                var n = this.nodes[i];

                if (n.children.length === 0 && n.radius > 2) {
                    // Create children

                    var branches = 1;
                    if (n.depth % 3 === 0)
                        branches = 2;
                    for (var j = 0; j < branches; j++) {
                        n.createChild((j + .5) / branches, this);
                    }

                }

            }

            this.cleanup();
            this.iterations++;
        },

        select : function() {
            this.isSelected = true;
        },

        deselect : function() {
            this.isSelected = false;
        },
        update : function(time) {

            this.root.update();
        },

        draw : function(g) {
            this.leafVolume = 0;
            this.petalVolume = 0;

            g.noStroke();
            if (this.isSelected) {
                g.fill(.59, 1, 1);
                this.root.drawCircle(g, 20);
            }

            for (var i = 0; i < 6; i++) {
                var r = 50 * Math.pow(i / 5, 3) + 15;
                g.fill(0, 0, 0, .1 + .5 / i);
                g.ellipse(this.root.x, this.root.y + i * 2 + 5, r, r * .3);
            }

            for (var i = 0; i < this.edges.length; i++) {
                var e = this.edges[i];
                var angle = e.getAngle();
                var m = e.getLength();
                var r0 = e.start.radius;
                var r1 = e.end.radius;
                g.pushMatrix();

                e.start.translateTo(g);
                g.rotate(angle);
                //  g.rect(0, 0, m, 4);

                e.start.getColor().fill(g, 0, 0);
                g.beginShape();
                g.vertex(0, -r0);
                g.vertex(0, r0);
                g.vertex(m, r1);
                g.vertex(m, -r1);
                g.endShape();

                // draw leaves

                for (var j = 0; j < this.leafCount; j++) {
                    e.start.getColor().fill(g, .3 * Math.sin(j + e.start.depth), -.3 + .2 * Math.sin(j + e.start.depth));

                    g.translate(m / this.leafCount, 0);
                    var r = 15 * e.start.radius * (.3 + this.dna[LEAF_ASPECT]);
                    var r1 = r * (.7 * this.dna[LEAF_SHAPE] + .12);
                    var theta = Math.sin(j * 3 + e.start.depth);
                    var dTheta = 1 / (.8 + 2 * this.dna[LEAF_ASPECT]);
                    var theta0 = theta - dTheta;
                    var theta1 = theta + dTheta;

                    this.leafVolume += r * r1;

                    g.beginShape();
                    g.vertex(0, 0);
                    g.vertex(r1 * Math.cos(theta0), r1 * Math.sin(theta));
                    g.vertex(r * Math.cos(theta), r * Math.sin(theta));
                    g.vertex(r1 * Math.cos(theta1), r1 * Math.sin(theta1));

                    g.endShape();

                }

                g.popMatrix();

            }
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].draw(g);
            }
            g.fill(0);
            g.text(this.leafVolume, this.root.x, this.root.y);
            g.text(this.petalVolume, this.root.x, this.root.y + 13);
        },

        calculateStats : function() {
            this.stats = {
                height : 0,
                left : 999,
                right : -999,
                leafVolume : 0,
                flowerVolume : 0,
            };

            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].calculateStats(this.stats);
            }
        },
    });
    return Tree;

});
