/**
 * @author Gavin, Alex, and Blake
 */

define(["common", "graph/graph", "../trees/treeEvo"], function(common, Graph, treeEvo) {
    var BODY_SIZE = 0;
    var WING_SIZE = 1;
    var STINGER_SIZE = 2;
    var BODY_COLOR = 3;
	var STRIPE_COUNT = 4;
	var SATURATION = 5;
	var HUE_START = 6;
    var HUE_DIFF = 7;

    var graphCount = 0;
    // Make some custom fractals

    var beeCount = 0;

    var BeeNode = Graph.Node.extend({
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
			this.idColor = new common.KColor("yellow");
            //this.idColor = new common.KColor((3 + this.dna[HUE_START] + .1 * this.dna[HUE_DIFF] * this.depth) % 1, -this.dna[SATURATION] * this.depth * .08 + .7 + .3 * this.dna[SATURATION] * (Math.sin(this.depth)), .3 + .1 * this.depth);

        },

        setParent : function() {

            this.bee = this.parent.bee;

            this.dna = this.parent.dna;

            this.depth = this.parent.depth + 1;

            // Add to the parent's list of children
            this.childIndex = this.parent.children.length;
            this.parent.children.push(this);

            // As a child, offset the child index
            ///var skew = Math.pow(this.dna[ANGLE_SKEW] - .5, 3);
            ///var spread = (1.5 * this.dna[BUSHINESS]);
            ///this.baseAngle = this.parent.angle + spread * (this.childPct - .5) + skew;

            ///this.baseAngle += this.dna[WIGGLE] * .1 * Math.sin(this.depth) * this.depth;

            // Set the position relative to the parent
            ///var mult = 15 - 12 * this.dna[BUSHINESS];
            ///this.branchLength = .7 * mult * this.parent.radius;

            // Add a variance in length
            ///this.branchLength *= (1 + 1 * this.dna[VARIATION] * (Math.random() - .5));
            ///this.radius = this.parent.radius * (.6 + .3 * this.dna[SHRINKAGE]);

            ///this.setToPolarOffset(this.parent, this.branchLength, this.baseAngle);

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
				//var wingL = 
				//var wingH = 

                ///var petalSize = 5 * this.radius;
                ///var aspect = .1 + .9 * this.dna[PETAL_ASPECT];
                ///var petalH = petalSize * aspect;
                ///var petalW = petalSize * (1 - aspect);

                // Draw some flowers?  What kind?

                /*for (var i = 0; i < this.bee.petalCount; i++) {
                    this.bee.bodyColor.fill(g, .1 * Math.sin(i), 1);
                    g.rotate(Math.PI * 2 / this.bee.petalCount);
                    g.ellipse(petalH * 1.5, 0, petalH, petalW);
                    this.bee.petalVolume += petalH * petalW;

                }*/
				//Draw some bees
				/*for (var i = 0; i < 1; i++){
					this.bee.bodyColor.fill(g, 0, 121, 184);
					//g.rotate(Math.PI * 2 / 50);
					//g.ellipse(10, -300, 15, 20);
					
				}*/

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
        init : function(dna, rootPos) {
            this._super();
            this.iterations = 0;
            this.dna = dna;
            this.id = beeCount;
			//this next chunk deals with appearance
			//NOTE: these values should be part of dna, so we'll need to
			//add them inside the dna instead of here
			this.radius=Math.random()*8;
			this.bodyWidth=Math.random()*10;
			this.wingWidth=Math.random()*11;
			this.rotation=Math.random()*180
			this.destX = Math.floor(Math.random()*400-300);
			this.destY = Math.floor(Math.random()*600-300);
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

            ///this.leafCount = Math.floor(this.dna[BODY_SIZE] * 5);

            ///this.petalCount = Math.round(8 * this.dna[WING_SIZE]);

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
				console.log("stuck");
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
            //console.log("this.dna.length: " + this.dna.length);
			console.log(this.dna[this.dna.length-1]);
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
			//g.fill(.17, .92, .87, .60);
            g.fill(this.dna[1],.92,.87,.60);
			g.translate(this.root.x,this.root.y);
			g.rotate(this.rotation);
			//body
			g.ellipse(0, 0, this.bodyWidth, this.bodyWidth*2);
			//wings
			g.ellipse(-this.bodyWidth/2-this.wingWidth/2, 0, this.wingWidth, this.radius);
			g.ellipse(this.bodyWidth/2+this.wingWidth/2, 0, this.wingWidth, this.radius);
			g.triangle(-this.bodyWidth, 0, this.bodyWidth, 0, 0, this.bodyWidth*3);
			
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
    });
    return Bee;

});
