/**
 * @author Gavin, Alex, and Blake
 */

define(["common", "graph/graph", "../trees/treeEvo"], function(common, Graph, treeEvo) {
    var BODY_COLOR = 0;
    var WING_COLOR	= 1;
    var STINGER_COLOR = 2;
    var BODY_COLOR = 3;
	var STRIPE_COLOR = 4;
	var SATURATION = 5;
	var HUE_START = 6;
    var HUE_DIFF = 7;
	var BODY_HEIGHT=8;
	var BODY_WIDTH=9;
	var WING_WIDTH=10;
	var STINGER_WIDTH = 11;		
    var STINGER_HEIGHT = 12

    var graphCount = 0;
    // Make some custom fractals

    var beeCount = 0;

    var BeeNode = Graph.Node.extend({
        init : function(parent, childPct,treeRef) {

            this._super();
            this.parent = parent;
            this.depth = 0;

			this.treesRef=treeRef;
			//console.log(this.treesRef);

            // No children yet
            this.children = [];
            this.childPct = childPct;

            if (this.parent) {
                this.setParent();
            }

            // No offset to start
            this.angle = this.baseAngle;

            // Make a color for this node
			this.idColor = new common.KColor("yellow");

        },

        setParent : function() {

            this.bee = this.parent.bee;

            this.dna = this.parent.dna;

            this.depth = this.parent.depth + 1;

            // Add to the parent's list of children
            this.childIndex = this.parent.children.length;
            this.parent.children.push(this);

       

        },

        createChild : function(pct, graph) {
            var child = new BeeNode(this, pct);

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
            //this.idColor.fill(g);
            //this.drawCircle(g, this.radius);
			

            if (this.children.length === 0) {
                g.pushMatrix();
                this.translateTo(g);
                g.rotate(this.angle);
				
				var bodySize = 5 * this.radius;



                g.popMatrix();

            }
        },

        calculateStats : function() {
            this.stats = {
                height : 0,
                left : 999,
                right : -999,
                ///leafVolume : 0,
                ///flowerVolume : 0,
            };

            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].calculateStats(this.stats);
            }
        },

        getColor : function() {
            return this.idColor;
        }
    });

    // A root node is a special case of a bee node
    var RootNode = BeeNode.extend({
        init : function(bee, dna, pos, angle, radius) {
            this.dna = dna;
            this._super();
            this.bee = bee;

            this.setTo(pos);
            this.radius = radius;

            this.angle = angle;
            this.depth = 0;
        }
    });

    var Bee = Graph.extend({
        init : function(dna, rootPos,treeRef) {
            this._super();
            this.iterations = 0;
            this.dna = dna;
            this.id = beeCount;
			//this next chunk deals with appearance
			//NOTE: these values should be part of dna, so we'll need to
			//add them inside the dna instead of here
			/*this.radius=Math.random()*8;
			this.bodyWidth=Math.random()*10;
			this.wingWidth=Math.random()*11;*/
			this.radius = this.dna[BODY_HEIGHT] * 2;
			this.bodyWidth = this.dna[BODY_WIDTH] * 10;
			this.wingWidth = this.dna[WING_WIDTH] * 11;
			this.rotation=Math.random()*180
			this.destX = Math.floor(Math.random()*400-300);
			this.destY = Math.floor(Math.random()*600-300);
			this.treeRefs=treeRef;
            beeCount++;

            Bee.beeCount = beeCount;

            // Create a root node
            this.root = new RootNode(this, dna, rootPos, -Math.PI / 2,  5 + Math.random() * 4);//Create BeeBody

            this.addNode(this.root);

            this.cleanup();
            for (var i = 0; i < 3; i++) {
                this.iterate();
                this.cleanup();

            }

            this.bodyColor = new common.KColor((this.dna[BODY_COLOR] * 1.2 + .9) % 1, this.dna[BODY_COLOR], .6, .3);

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

                    var bodyParts = 3;
                    if (n.depth % 3 === 0)
                        bodyParts = 2;
                    for (var j = 0; j < bodyParts; j++) {
                        n.createChild((j + .5) / bodyParts, this);
                    }

                }

            }

            this.cleanup();
            this.iterations++;
        },
		
		moveBee : function(){
			//check if we're at the destinaiton
			if(Math.sqrt(Math.pow(this.destX-this.root.x, 2) + Math.pow(this.destY-this.root.y, 2))<4){
				console.log(this.treeRefs);
				//assign new destination
				this.destX = Math.floor(Math.random()*400-300);
				this.destY = Math.floor(Math.random()*600-300);
			}
			//move towards destination
			this.destX<this.root.x?this.root.x-=2:this.root.x+=2;
			this.destY<this.root.y?this.root.y-=2:this.root.y+=2;
			//this.rotation  = 180*Math.atan(this.root.y/this.root.x)/Math.PI;
		},

        select : function() {
            this.isSelected = true;
        },

        deselect : function() {
            this.isSelected = false;
        },
        update : function(time) {
			this.moveBee();
			//console.log(this.root.getColor());
			//console.log(this.dna[1]);
            this.root.update();
        },

        draw : function(g) {

            g.noStroke();
            if (this.isSelected) {
                //g.fill(.59, 1, 1);
                this.root.drawCircle(g, 20);
            }
			
			//DRAW BEES HERE
			g.pushMatrix();
			//g.fill(Math.random()*255, Math.random()*255, Math.random()*255);
			g.translate(this.root.x,this.root.y);
			g.rotate(this.rotation);
			//body
			g.fill(this.dna[BODY_COLOR], 1, 1, .6);
			g.ellipse(0, 0, this.bodyWidth, this.bodyWidth*2);
			//wings
			g.fill(this.dna[WING_COLOR], 1, 1, .6);
			g.ellipse(-this.bodyWidth/2-this.wingWidth/2, 0, this.wingWidth, this.radius);
			g.ellipse(this.bodyWidth/2+this.wingWidth/2, 0, this.wingWidth, this.radius);
			//stinger
			g.fill(this.dna[STINGER_COLOR], 1, 1, .6);

			g.triangle(-this.bodyWidth, 0, this.bodyWidth, 0, 0, this.bodyWidth*3);
			
			
			//stinger
			g.fill(this.dna[STINGER_COLOR], 1, 1, .6);
			g.triangle(-this.bodyWidth, 0, this.bodyWidth, 0, 0, this.bodyWidth*3);

            //stripes
            g.fill(this.dna[STRIPE_COLOR], 1, 1, 1);
            g.rect(-this.bodyWidth+this.bodyWidth*0.2, this.bodyWidth+(-2*this.bodyWidth), this.bodyWidth*2-(this.bodyWidth*0.4), 2);
            g.rect(-this.bodyWidth, 0 , this.bodyWidth*2, 2);
            g.rect(-this.bodyWidth+this.bodyWidth*0.25, this.bodyWidth, this.bodyWidth*2-(this.bodyWidth*0.5), 2);
			
			g.popMatrix();
			//END DRAW BEES
			//
			for (var i = 0; i < this.edges.length; i++){
				var e = this.edges[i];
				var m = e.getLength();
				g.pushMatrix();
				
				g.beginShape();
				g.vertex();
				g.vertex();
				g.vertex();
				g.vertex();
				g.endShape();
				
				g.popMatrix();
			}
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].draw(g);
            }
            //g.fill(0);
            ///g.text(this.leafVolume, this.root.x, this.root.y);
            ///g.text(this.petalVolume, this.root.x, this.root.y + 13);
        },
		
		

        calculateStats : function() {
            this.stats = {
                height : 0,
                left : 999,
                right : -999,
                ///leafVolume : 0,
                ///flowerVolume : 0,
            };

            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].calculateStats(this.stats);
            }
        },
		
		setTreeRef : function(tree){
			this.treeRefs=tree;
		}
		
    });
    return Bee;

});
