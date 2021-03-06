/*
 * setTimeout, setInterval replacements using requestAnimationFrame by Joe Lambert
 * https://gist.github.com/joelambert/1002116
 */


/**
 * Behaves the same as setInterval except uses requestAnimationFrame() 
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.setRequestInterval = function(fn, delay) {
		
	var start = new Date().getTime(),
		handle = new Object();
		
	function loop() {
		var current = new Date().getTime(),
			delta = current - start;
			
		if(delta >= delay) {
			fn.call();
			start = new Date().getTime();
		}

		handle.value = requestAnimationFrame(loop);
	};
	
	handle.value = requestAnimationFrame(loop);
	return handle;
}

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame()
 * @param {int|object} fn The callback function
 */
window.clearRequestInterval = function(handle) {
	if (handle) { 
		window.cancelAnimationFrame(handle.value);
	}
};

/**
 * Behaves the same as setTimeout except uses requestAnimationFrame()
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */

window.setRequestTimeout = function(fn, delay) {		
	var start = new Date().getTime(),
		handle = new Object();
		
	function loop(){
		var current = new Date().getTime(),
			delta = current - start;
			
		delta >= delay ? fn.call() : handle.value = requestAnimationFrame(loop);
	};
	
	handle.value = requestAnimationFrame(loop);
	return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame()
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function(handle) {
	if (handle) {
		window.cancelAnimationFrame(handle.value);
	}
};




/**
 * Basic priority queue implementation. If a better priority queue is wanted/needed,
 * this code works with the implementation in google's closure library (https://code.google.com/p/closure-library/).
 * Use goog.require('goog.structs.PriorityQueue'); and new goog.structs.PriorityQueue()
 * 
 */
function PriorityQueue () {
  this._nodes = [];

  this.enqueue = function (priority, key) {
    this._nodes.push({key: key, priority: priority });
    this.sort();
  };
  this.dequeue = function () {
    return this._nodes.shift().key;
  };
  this.sort = function () {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  };
  this.isEmpty = function () {
    return !this._nodes.length;
  };
}

/**
 * Dijkstra's algorithm pathfinding starts here.
 * 
 * Code from https://github.com/mburst/dijkstras-algorithm
 */
function Graph(){
  var INFINITY = 1/0;
  this.vertices = {};

  this.addVertex = function(name, edges){
    this.vertices[name] = edges;
  };

  this.shortestPath = function (start, finish) {
    var nodes = new PriorityQueue(),
        distances = {},
        previous = {},
        path = [],
        smallest, vertex, neighbor, alt;

    for(vertex in this.vertices) {
      if(vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      }
      else {
        distances[vertex] = INFINITY;
        nodes.enqueue(INFINITY, vertex);
      }

      previous[vertex] = null;
    }

    while(!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      if(smallest === finish) {
        path = [];

        while(previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }

        break;
      }

      if(!smallest || distances[smallest] === INFINITY){
        continue;
      }

      for(neighbor in this.vertices[smallest]) {
        alt = distances[smallest] + this.vertices[smallest][neighbor];

        if(alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;

          nodes.enqueue(alt, neighbor);
        }
      }
    }

    return path;
  };
}

/*
 * Cookie routines
 */
var Cookie = new function() {
	var me = this;
	
	function getCookieVal (offset) {
		var endstr = document.cookie.indexOf (";", offset);
		if (endstr == -1)
			endstr = document.cookie.length;
		return unescape(document.cookie.substring(offset, endstr));
	}

	me.get = function(name) {
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg)
			return getCookieVal (j);
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0) break; 
		}
		return null;
	}

	me.set = function (name, value) {
		var argv = me.set.arguments;
		var argc = me.set.arguments.length;
		var expires = (argc > 2) ? argv[2] : null;
		var path = (argc > 3) ? argv[3] : null;
		var domain = (argc > 4) ? argv[4] : null;
		var secure = (argc > 5) ? argv[5] : false;
		document.cookie = name + "=" + escape (value) +
		((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
		((path == null) ? "" : ("; path=" + path)) +
		((domain == null) ? "" : ("; domain=" + domain)) +
		((secure == true) ? "; secure" : "");
	}

	me.delete = function(name) {
		var exp = new Date();
		exp.setTime (exp.getTime() - 100);  // This cookie is history
		var cval = me.get(name);
		document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
	}

	// this func asks for a number of days and gives back a Date() that is
	// that many days from now.
	function DaystoDate(expDays) {
		var exp = new Date(); 
		exp.setTime(exp.getTime() + (expDays*24*60*60*1000));
		window.alert(expDays*24*60*60*1000);
		return exp;
	}

	function createDate(Month, date, Year, Hour, Minutes, Seconds) {
		var expiration = new Date();
		expiration.setMonth( Month );
			expiration.setDate( date );
			expiration.setYear( Year );
			expiration.setHours( Hour );
			expiration.setMinutes( Minutes );
			expiration.setSeconds( Seconds );
		return expiration;
	}

	me.canUse = function() {
		var r,
			tmpName = "canBrowserSetCookie";

		me.set(tmpName, "true");
		if (me.get(tmpName) === "true") {
			me.delete(tmpName);
			r=true;
		} else {
			r=false;
		}
		return r;
	} 
}

/*
 * Collection and Vector2 objects taken from 
 * https://www.sitepoint.com/create-a-cross-browser-touch-based-joystick-with-hand-js/
 */

var Collection = function () {
	this.count = 0;
	this.collection = {};
	this.add = function (key, item) {
			if (this.collection[key] != undefined)
					return undefined;
			this.collection[key] = item;
			return ++this.count
	}
	this.remove = function (key) {
			if (this.collection[key] == undefined)
					return undefined;
			delete this.collection[key]
			return --this.count
	}
	this.item = function (key) {
			return this.collection[key];
	}
	this.forEach = function (block) {
			for (key in this.collection) {
					if (this.collection.hasOwnProperty(key)) {
							block(this.collection[key]);
					}
			}
	}
}

var Vector2 = function (x,y) {
	this.x= x || 0; 
	this.y = y || 0; 
	
};

Vector2.prototype = {

	reset: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	toString : function (decPlaces) {
	 	decPlaces = decPlaces || 3; 
		var scalar = Math.pow(10,decPlaces); 
		return "[" + Math.round (this.x * scalar) / scalar + ", " + Math.round (this.y * scalar) / scalar + "]";
	},
	
	clone : function () {
		return new Vector2(this.x, this.y);
	},
	
	copyTo : function (v) {
		v.x = this.x;
		v.y = this.y;
	},
	
	copyFrom : function (v) {
		this.x = v.x;
		this.y = v.y;
	},	
	
	magnitude : function () {
		return Math.sqrt((this.x*this.x)+(this.y*this.y));
	},
	
	magnitudeSquared : function () {
		return (this.x*this.x)+(this.y*this.y);
	},
	
	normalise : function () {
		
		var m = this.magnitude();
				
		this.x = this.x/m;
		this.y = this.y/m;

		return this;	
	},
	
	reverse : function () {
		this.x = -this.x;
		this.y = -this.y;
		
		return this; 
	},
	
	plusEq : function (v) {
		this.x+=v.x;
		this.y+=v.y;
		
		return this; 
	},
	
	plusNew : function (v) {
		 return new Vector2(this.x+v.x, this.y+v.y); 
	},
	
	minusEq : function (v) {
		this.x-=v.x;
		this.y-=v.y;
		
		return this; 
	},

	minusNew : function (v) {
	 	return new Vector2(this.x-v.x, this.y-v.y); 
	},	
	
	multiplyEq : function (scalar) {
		this.x*=scalar;
		this.y*=scalar;
		
		return this; 
	},
	
	multiplyNew : function (scalar) {
		var returnvec = this.clone();
		return returnvec.multiplyEq(scalar);
	},
	
	divideEq : function (scalar) {
		this.x/=scalar;
		this.y/=scalar;
		return this; 
	},
	
	divideNew : function (scalar) {
		var returnvec = this.clone();
		return returnvec.divideEq(scalar);
	},

	dot : function (v) {
		return (this.x * v.x) + (this.y * v.y) ;
	},
	
	angle : function (useRadians) {
		
		return Math.atan2(this.y,this.x) * (useRadians ? 1 : Vector2Const.TO_DEGREES);
		
	},
	
	rotate : function (angle, useRadians) {
		
		var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
		var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
	
		Vector2Const.temp.copyFrom(this); 

		this.x= (Vector2Const.temp.x*cosRY)-(Vector2Const.temp.y*sinRY);
		this.y= (Vector2Const.temp.x*sinRY)+(Vector2Const.temp.y*cosRY);
		
		return this; 
	},	
		
	equals : function (v) {
		return((this.x==v.x)&&(this.y==v.x));
	},
	
	isCloseTo : function (v, tolerance) {	
		if(this.equals(v)) return true;
		
		Vector2Const.temp.copyFrom(this); 
		Vector2Const.temp.minusEq(v); 
		
		return(Vector2Const.temp.magnitudeSquared() < tolerance*tolerance);
	},
	
	rotateAroundPoint : function (point, angle, useRadians) {
		Vector2Const.temp.copyFrom(this); 
		//trace("rotate around point "+t+" "+point+" " +angle);
		Vector2Const.temp.minusEq(point);
		//trace("after subtract "+t);
		Vector2Const.temp.rotate(angle, useRadians);
		//trace("after rotate "+t);
		Vector2Const.temp.plusEq(point);
		//trace("after add "+t);
		this.copyFrom(Vector2Const.temp);
		
	}, 
	
	isMagLessThan : function (distance) {
		return(this.magnitudeSquared()<distance*distance);
	},
	
	isMagGreaterThan : function (distance) {
		return(this.magnitudeSquared()>distance*distance);
	}
	
	
	// still AS3 to convert : 
	// public function projectOnto(v:Vector2) : Vector2
	// {
	// 		var dp:Number = dot(v);
	// 
	// 		var f:Number = dp / ( v.x*v.x + v.y*v.y );
	// 
	// 		return new Vector2( f*v.x , f*v.y);
	// 	}
	// 
	// 
	// public function convertToNormal():void
	// {
	// 	var tempx:Number = x; 
	// 	x = -y; 
	// 	y = tempx; 
	// 	
	// 	
	// }		
	// public function getNormal():Vector2
	// {
	// 	
	// 	return new Vector2(-y,x); 
	// 	
	// }
	// 
	// 
	// 
	// public function getClosestPointOnLine ( vectorposition : Point, targetpoint : Point ) : Point
	// {
	// 	var m1 : Number = y / x ;
	// 	var m2 : Number = x / -y ;
	// 	
	// 	var b1 : Number = vectorposition.y - ( m1 * vectorposition.x ) ;
	// 	var b2 : Number = targetpoint.y - ( m2 * targetpoint.x ) ;
	// 	
	// 	var cx : Number = ( b2 - b1 ) / ( m1 - m2 ) ;
	// 	var cy : Number = m1 * cx + b1 ;
	// 	
	// 	return new Point ( cx, cy ) ;
	// }
	// 

};

Vector2Const = {
	TO_DEGREES : 180 / Math.PI,		
	TO_RADIANS : Math.PI / 180,
	temp : new Vector2()
};


/*
 * Ideas here taken from https://www.sitepoint.com/create-a-cross-browser-touch-based-joystick-with-hand-js/
 */
var mobileController = new function () {
		
	var me=this,
		bodyEl,
		canvas,
		c, // c is the canvas' context 2D
		container,
		halfWidth,
		halfHeight,
		leftPointerID = -1,
		leftPointerPos = new Vector2(0, 0),
		leftPointerStartPos = new Vector2(0, 0),
		leftVector = new Vector2(0, 0);

	var pointers; // collections of pointers
	

	window.onorientationchange = resetCanvas;
	window.onresize = resetCanvas;

	me.init = function () {
			bodyEl = document.body;
			setupCanvas();
			pointers = new Collection();
			canvas.addEventListener('pointerdown', onPointerDown, false);
			canvas.addEventListener('pointermove', onPointerMove, false);
			canvas.addEventListener('pointerup', onPointerUp, false);
			canvas.addEventListener('pointerout', onPointerUp, false);
			bodyEl.addEventListener('touchstart', function(e){ e.preventDefault(); });
			requestAnimationFrame(draw);
	}

	function resetCanvas(e) {
			// resize the canvas - but remember - this clears the canvas too. 
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			halfWidth = canvas.width / 2;
			halfHeight = canvas.height / 2;

			//make sure we scroll to the top left. 
			window.scrollTo(0, 0);
	}

	function draw() {
			c.clearRect(0, 0, canvas.width, canvas.height);

			pointers.forEach(function (pointer) {
					if (pointer.identifier == leftPointerID) {
							c.beginPath();
							c.strokeStyle = "cyan";
							c.lineWidth = 6;
							c.arc(leftPointerStartPos.x, leftPointerStartPos.y, 40, 0, Math.PI * 2, true);
							c.stroke();
							c.beginPath();
							c.strokeStyle = "cyan";
							c.lineWidth = 2;
							c.arc(leftPointerStartPos.x, leftPointerStartPos.y, 60, 0, Math.PI * 2, true);
							c.stroke();
							c.beginPath();
							c.strokeStyle = "cyan";
							c.arc(leftPointerPos.x, leftPointerPos.y, 40, 0, Math.PI * 2, true);
							c.stroke();

					} else {

							c.beginPath();
							c.fillStyle = "white";
							c.fillText("type : " + pointer.type + " id : " + pointer.identifier + " x:" + pointer.x + 
	" y:" + pointer.y, pointer.x + 30, pointer.y - 30);

							c.beginPath();
							c.strokeStyle = "red";
							c.lineWidth = "6";
							c.arc(pointer.x, pointer.y, 40, 0, Math.PI * 2, true);
							c.stroke();
					}
			});

			requestAnimationFrame(draw);
	}

	function givePointerType(event) {
			switch (event.pointerType) {
					case event.POINTER_TYPE_MOUSE:
							return "MOUSE";
							break;
					case event.POINTER_TYPE_PEN:
							return "PEN";
							break;
					case event.POINTER_TYPE_TOUCH:
							return "TOUCH";
							break;
			}
	}

	function onPointerDown(e) {
			var newPointer = { identifier: e.pointerId, x: e.clientX, y: e.clientY, 
			type: givePointerType(e) };
			if ((leftPointerID < 0)) {
					leftPointerID = e.pointerId;
					leftPointerStartPos.reset(e.clientX, e.clientY);
					leftPointerPos.copyFrom(leftPointerStartPos);
					leftVector.reset(0, 0);
			}
			pointers.add(e.pointerId, newPointer);
	}

	function onPointerMove(e) {
			if (leftPointerID == e.pointerId) {
					leftPointerPos.reset(e.clientX, e.clientY);
					leftVector.copyFrom(leftPointerPos);
					leftVector.minusEq(leftPointerStartPos);
			}
			else {
					if (pointers.item(e.pointerId)) {
							pointers.item(e.pointerId).x = e.clientX;
							pointers.item(e.pointerId).y = e.clientY;
					}
			}
	}

	function onPointerUp(e) {
			var deltaX, deltaY, dir;
			if (leftPointerID == e.pointerId) {
					leftPointerID = -1;
					leftVector.reset(0, 0);

			}
			leftVector.reset(0, 0);

			pointers.remove(e.pointerId);

			deltaX = leftPointerPos.x - leftPointerStartPos.x;
			deltaY = leftPointerPos.y - leftPointerStartPos.y;


			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				dir = (deltaX > 0 ? "Right" : "Left");
			} else {
				dir = (deltaY > 0 ? "Down" : "Up");
			}

			if (dir) {
				game.kc.moveHelper(null, dir);
			}
	}

	function setupCanvas() {
			canvas = document.getElementById('mobile-controller');
			c = canvas.getContext('2d');
			resetCanvas();
			c.strokeStyle = "#ffffff";
			c.lineWidth = 2;
	}	
}




Node.prototype.add = function(tag, cnt, txt, datasetItem) {
	for (var i = 0; i < cnt; i++) {
		var newNode = ce(tag, txt);
		if (datasetItem) {
			newNode.dataset[datasetItem] = 'true';
		}
		this.appendChild(newNode);
	}
};
Node.prototype.ins = function(tag) {
	this.insertBefore(ce(tag), this.firstChild);
};
Node.prototype.kid = function(i) { return this.childNodes[i]; };
Node.prototype.cls = function(t) { this.classList.add(t); };
 
NodeList.prototype.map = function(g) {
	for (var i = 0; i < this.length; i++) g(this[i]);
};

Array.prototype.remove = function() {
	var what, a = arguments, L = a.length, ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};

function ce(tag, txt) {
	var x = document.createElement(tag);
	if (txt !== undefined) x.innerHTML = txt;
	return x;
}

/*
 * This maze object is a modified version of this:
 * https://rosettacode.org/wiki/Maze_generation#JavaScript
 * 
 * Note that it has been modified so that it doesn't become maze with
 * entrance and exit, but a video-game-like maze (with no dead ends and more
 * than one way to get around).)
 */
var maze = new function () { 
	var 
		me = this;
	
	me.width = 0;
	me.height = 0;
	me.denX = null;
	me.denY = null;
	me.graph = null;
	me.leftTunnelCell = null;
	me.rightTunnelCell = null;
	
	me.el = gid('maze');
	
	
	me.dirs = ['s', 'e', 'w', 'n'];
	
	function gid(e) { return document.getElementById(e); }
	function irand(x) { return Math.floor(Math.random() * x); }
	
	/*
	 * Remember, cells are indexed starting at 1, not 0.
	 */
	me.getCell = function(x, y) {
		if (0 < x && x <= me.width && 0 < y && y <= me.height) {
			return me.el.kid(y).kid(x);
		} else {
			return null;
		}
	}
	
	me.getCellDirs = function (x, y) {
		return Array.from(me.getCell(x, y).classList);
	}
	
	me.canGoInDir = function(x, y, dir) {
		var cell = me.getCell(x, y);
		return (cell.classList.contains(dir));
	}
	
	me.getCellInDir = function(x, y, dir) {
		var currentCell = me.getCell(x,y),
			tunnel = currentCell.dataset.tunnel;

		switch(dir) {
			case "n":
				return {
					cell: me.getCell(x, y - 1),
					x: x,
					y: y - 1
				};
				
			case "s": 
				return {
					cell: me.getCell(x, y + 1),
					x: x,
					y: y + 1
				};
				
			case "w":
				if (tunnel === 'w') {
					return {
						cell: me.getCell(me.width, y),
						x: me.width,
						y: y,
						isInTunnel: true
					};
				} else {
					return {
						cell: me.getCell(x-1, y),
						x: x - 1,
						y: y
					};
				}
				
			case "e":
				if (tunnel === 'e') {
					return {
						cell: me.getCell(1, y),
						x: 1,
						y: y,
						isInTunnel: true
					};
				} else {
					return {
						cell: me.getCell(x + 1, y),
						x: x + 1,
						y: y
					};
				}
			default:
				return {
					cell: me.getCell(x, y),
					x: x,
					y: y
				};
				
		}
	}
	
	/*
	 * WARNING: Call this only within a requestAnimationFrame() 
	 */
	me.putInCell = function(el, x, y) {
		var originalParent = el.parentNode,
			originalCell = (originalParent && originalParent.nodeName === 'TD') ? originalParent : null,
			targetCell = me.getCell(x, y),
			originalCellClassList = originalCell ? originalCell.classList : null,
			targetCellClassList = targetCell.classList;
		
		if (originalCell) {
			originalCellClassList.add('will-empty');
		}
		targetCellClassList.add('will-fill');
		
		// first remove node from page (if it's there)
		if (el.parentNode) {
			el.parentNode.removeChild(el);
		}
		
		// now remove all direction info.  You must do it after you remove the node
		// to prevent the object from appearing in the previous cell for even a 
		// minute fraction of a sec.
		el.classList.remove('move', 'n', 's', 'e', 'w');
		
		// now, put in the next cell
		me.getCell(x,y).appendChild(el);
		targetCellClassList.remove('will-fill');
		
		if (originalCell) {
			originalCellClassList.remove('will-empty');
		}
		
	}
	
	function toArray(obj) {
		var array = [];
		// iterate backwards ensuring that length is an UInt32
		for (var i = obj.length >>> 0; i--;) { 
			array[i] = obj[i];
		}
		return array;
	}
	
	function removeRandomWallInCell(x, y, cell) {
		var bannedDirs = [],
			possibleDirs = me.dirs.slice(0),
			i;

		if (x === 1) {
			bannedDirs.push('w');
		} else if (x === me.width) {
			bannedDirs.push('e');
		}
		
		if (y === 1) {
			bannedDirs.push('n');
		} else if ( y === me.height) {
			bannedDirs.push('s');
		}
		
		// openDirs == bannedDirs + the dirs that don't have walls
		var openDirs = bannedDirs.concat(toArray(cell.classList));
		
		// make possibleDirs = the ones that have walls.
		for (i=0; i<openDirs.length; i++) {
			possibleDirs.remove(openDirs[i]);
		}
		
		
		if (possibleDirs.length > 1) {
			var openDirsLength = openDirs.length;
			var wallToRemove = possibleDirs[game.randInt(0, openDirsLength - 1)];
			me.setWall(x, y, wallToRemove, 'remove');
		} else {
			me.setWall(x, y, possibleDirs[0], 'remove');
		}
		
		/*
		 * Keeping this old way that removes too many walls around becuase it
		 * may be useful later on.
		 */
		/* for (i=0; i<possibleDirs.length; i++) {
			me.setWall(x, y, possibleDirs[i], 'remove');
		}
		*/
	}
	
	function makePathAroundDen() {
		var i;
			
		for (i=me.denX-1; i<=me.denX; i++) {
			me.setWall(i, me.denY-1, 'e', 'remove');
			me.setWall(i, me.denY+1, 'e', 'remove');
		}
		
		for (i=me.denY-1; i<=me.denY; i++) {
			me.setWall(me.denX-1, i, 's', 'remove');
			me.setWall(me.denX+1, i, 's', 'remove');
		}
	}
	
	function removeDeadEnds() {
		var i, j;
		for (i=1; i <= me.width; i++) {
			for (j=1; j <= me.height; j++) {
				var cell = me.getCell(i, j),
					classList = cell.classList;
				if (classList.length <	2) {
					removeRandomWallInCell(i, j, cell);
					
				}
			}
		}
	}
	
	function removeThreeInARow() {
		var i, j, wallCounter;
		
		for (i=2; i <= me.width; i++) {
			wallCounter = 0;
			for (j=1; j <= me.height; j++) {
				var cell = me.getCell(i, j),
					classList = cell.classList;
				if (!classList.contains('w')) {
					wallCounter++;
				} else {
					wallCounter = 0;
				}
				
				if (wallCounter === 3) {
					me.setWall(i, j, 'w', 'remove');
					wallCounter = 0;
				}
			}
		}
		
		wallCounter = 0;
		for (j=2; j <= me.height; j++) {
			wallCounter = 0;
			for (i=1; i <= me.width; i++) {
				var cell = me.getCell(i, j),
					classList = cell.classList;
				if (!classList.contains('n')) {
					wallCounter++;
				} else {
					wallCounter = 0;
				}
				
				if (wallCounter === 3) {
					me.setWall(i, j, 'n', 'remove');
					wallCounter = 0;
				}
			}
		}
	}

	function makeTunnel() {
		var y = game.randInt(3, me.height - 2);

		me.leftTunnelCell = me.getCell(1, y),
		me.rightTunnelCell = me.getCell(me.width, y);

		me.leftTunnelCell.dataset.tunnel="w";
		me.rightTunnelCell.dataset.tunnel="e";
		
		// make west tunnel
		me.setWall(1, y, 'w', 'remove');
		me.setWall(1, y, 'n', 'add');
		me.setWall(1, y, 's', 'add');

		// make east tunnel
		me.setWall(me.width, y, 'e', 'remove');
		me.setWall(me.width, y, 'n', 'add');
		me.setWall(me.width, y, 's', 'add');
	}
	
	me.setWall = function (x, y, dir, operation) {
		var cell = me.getCell(x, y),
			cellInDir = me.getCellInDir(x, y, dir).cell,
			classListOp = (operation === 'add' ? 'remove' : 'add');
		
		cell.classList[classListOp](dir);
		
		if (cellInDir) {
			cellInDir.classList[classListOp](game.oppositeDir(dir));
		}
	}
	
	me.clear = function () {
		me.el.innerHTML = '';
	}
	 
	me.make = function (w, h, denX, denY) {
		me.width = w;
		me.height = h;
		me.denX = denX;
		me.denY = denY;
		me.clear();
		me.el.add('tr', h);
		me.el.childNodes.map(function(x) {
				x.add('th', 1);
				x.add('td', w, '*', 'initialState');
				x.add('th', 1);
		});
		me.el.ins('tr');
		me.el.add('tr', 1);
		me.el.firstChild.add('th', w + 2);
		me.el.lastChild.add('th', w + 2);
		for (var i = 1; i <= h; i++) {
			for (var j = 1; j <= w; j++) {
				me.el.kid(i).kid(j).neighbors = [
					me.el.kid(i + 1).kid(j),
					me.el.kid(i).kid(j + 1),
					me.el.kid(i).kid(j - 1),
					me.el.kid(i - 1).kid(j)
				];
			}
		}
		walk(me.el.kid(irand(h) + 1).kid(irand(w) + 1));
		
		//Now, we must close up the maze
		close_maze();
		
		makePathAroundDen();
		makeTunnel();
		removeDeadEnds();
		removeThreeInARow();
		generateGraph();
		setRequestTimeout(makeVisible, 200);
	};

	function makeVisible() {
		var cells = toArray(me.el.getElementsByTagName('td')),
			delay = 50,
			duration = parseFloat(document.defaultView.getComputedStyle(cells[0], null).transitionDuration.split(',')[0]) * 1000;

		cells = game.shuffleArray(cells);
		for (var i=0; i<cells.length; i++) {
			var cell = cells[i];
			cell.style.transitionDelay = `${delay * i}ms, ${delay * i}ms`;
			delete cell.dataset.initialState;
		}

		setRequestTimeout(function () {
			
			game.startLevel();
		}, delay * i + duration);

	}
	
	function generateGraph() {
		var i, j, k, edges, cell, cellClassList, dir;
		
		me.graph = new Graph();
		
		for (i = 1; i <= me.width; i++ ) {
			for ( j = 1; j <= me.height; j++ ) {
				edges = {};
				cell = me.getCell(i, j);
				cell.dataset.x = i;
				cell.dataset.y = j;
				
				cellClassList = cell.classList;
				if (cellClassList.contains('n')) {
					edges[`${i}${j-1}`] = 1;
				} 
				
				if (cellClassList.contains('s')) {
					edges[`${i}${j+1}`] = 1;
				}
				
				if (cellClassList.contains('w')) {
					edges[`${i-1}${j}`] = 1;
				}
				
				if (cellClassList.contains('e')) {
					edges[`${i+1}${j}`] = 1;
				}
				
				me.graph.addVertex(`${i}${j}`, edges)
			}
		}
		
	}
	
	function close_maze() {
		var firstRow = me.el.kid(1),
			lastRow = me.el.kid(me.height),
			i;
		
		for (i = 1; i <= me.height; i++) {
			me.setWall(1, i, 'w', 'add');
			me.setWall(me.width, i, 'e', 'add');
		}
		
		for (i = 1; i <= me.width; i++) {
			me.setWall(i, 1, 'n', 'add');
			me.setWall(i, me.height, 's', 'add');
		}
	}
	 
	function shuffle(x) {
		for (var i = 3; i > 0; i--) {
			j = irand(i + 1);
			if (j == i) continue;
			var t = x[j]; x[j] = x[i]; x[i] = t;
		}
		return x;
	}
	 
	function walk(c) {
		c.innerHTML = '&nbsp;';
		var idx = shuffle([0, 1, 2, 3]);
		for (var j = 0; j < 4; j++) {
			var i = idx[j];
			var x = c.neighbors[i];
			if (x.textContent != '*') continue;
			
			c.cls(me.dirs[i]); 
			x.cls(me.dirs[3 - i]);
			walk(x);
		}
	}
	
	me.place = function (el, x, y) {
		me.el.kid(y).kid(x).appendChild(el);
	};
	
	me.setState = function (state) {
		me.el.classList.remove('pill-eaten', 'pill-wearing-out');
		if (state !== '') {
			me.el.classList.add(state);
		}
	}
	
};

/*******************
 * DOT
 *******************/
var Dot = function(x, y, index, classes) {
	var
		me = this,
		cellEl = maze.getCell(x, y);
	
	me.x = x;
	me.y = y;
	me.el = null;
	me.isDot = true;
	me.index = index;;
	
	function animationendHandler(e) {
		var cellInfo = maze.getCellInDir(me.x, me.y, me.dir);
		cellEl = cellInfo.cell;
		me.x = cellInfo.x;
		me.y = cellInfo.y;
		requestAnimationFrame(function () {
			maze.putInCell(me.el, cellInfo.x, cellInfo.y);
			go()
		});
	}
	
	function go() {
		me.dir = game.setPlayerDir(me, cellEl, me.dir);
	}
	
	function init() {
		me.el = ce('div');
		me.el.__player = me;
		me.el.className = `dot ${(classes || '')} player`;
		maze.putInCell(me.el, x, y);
		me.el.addEventListener('animationend', animationendHandler);
		requestAnimationFrame(go);
	}
	
	me.stop = function() {
		me.el.classList.add('stop');
	}
	
	init();
};


/*
 *	KC
 */

var KC = function(x, y) {
	var 
		me = this,
		lastCmd,
		isMoving = false,
		isSoundPlaying = false,
		cellInfo,
		isPaused = false,
		isBackingUp = false,
		animStartTime = null,
		reverseTime,
		timeDelta = 0,
		animationDuration = null,
		canGoInNextCell  = true;
	
	me.x = x;
	me.y = y;
	me.dir = null;
	me.el = null;
	me.isInTunnel = false;
	
	angleKeyMapping = [];
	angleKeyMapping[360] = 'ArrowRight';
	angleKeyMapping[0] = 'ArrowRight';
	angleKeyMapping[90] = 'ArrowUp';
	angleKeyMapping[180] = 'ArrowLeft';
	angleKeyMapping[270] = 'ArrowDown';

	me.isAtEndOfAnimation = function () {
		return (me.el && me.el.classList.contains('end-of-animation'));
	}
	
	function playSound() {
		if (window.Howl && !isSoundPlaying) {
			window.Howl && game.sounds['kc-move'].play();
			isSoundPlaying = true;
		}
	}
	
	function stopSound() {
		window.Howl && game.sounds['kc-move'].pause();
		isSoundPlaying = false;
	}
	
	function move(e) {
		me.moveHelper(e, e.key || ('Arrow' + e.keyIdentifier));
	}
	
	me.moveHelper = function (e, key) {
		var cmdBeforeLast = lastCmd;
		
		/*
		 * Edge has e.key set to just the direction without the "Arrow" string.
		 */
		switch (key) {
			case "ArrowDown":
			case "Down":
				lastCmd = 's';
				e && e.preventDefault();
				break;
			case "ArrowUp":
			case "Up":
				lastCmd = 'n';
				e && e.preventDefault();
				break;
			case "ArrowLeft":
			case "Left":
				lastCmd = 'w';
				e && e.preventDefault();
				break;
			case "ArrowRight":
			case "Right":
				lastCmd = 'e';
				e &&e.preventDefault();
				break;
			case " ":
				e && pause(e);
		}
		
		// hack to deal when KC gets stuck in the edge case of moving back and forth
		// a lot
		var classList = me.el.classList;
		if (!(
			me.el.classList.contains('w') ||
			me.el.classList.contains('e') ||
			me.el.classList.contains('s') ||
			me.el.classList.contains('n')
		)) {
			isMoving = false;
			isBackingUp = false;
		}
		
		
		// Check to see if we gave a command.
		if (lastCmd !== '') {
			var currentCell = maze.getCell(me.x, me.y),
				isInTunnel = !!currentCell.dataset.tunnel;

			// If we are moving (and we are not in the tunnel), 
			// then we check if we reversed.  If so, reverse right
			// away.
			if (isMoving && !isInTunnel) {
				if (cmdBeforeLast === game.oppositeDir(lastCmd)) {
					requestAnimationFrame(function () {
						go(true);
					});
				}
			// Otherwise, we check if we are not moving.  If so then we change the 
			// direction right away.
			} else if (!isMoving || (key !== ' ' && isPaused)) {
				isMoving = true;
				requestAnimationFrame(function () {
					go(false);
				});
			}
			
			// Note that is we are moving, the change of direction will be handled
			// by the `animationendHandler()` method.  We don't do that here.
		}
		
		//me.el.className = 'kc move ' + me.dir;
	}

	function animationstartHandler(e) {

		if (e.animationName.indexOf('-in-tunnel') > 0) {
			me.isInTunnel = true;
		
			if (window.Howl) {
				game.sounds['tunnel1'].play();
			}
		}
	}
	
	/*
	 * KC animation end handler
	 */ 
	function animationendHandler(e) {
		if (!canGoInNextCell) {
			return;
		}

		var dir = isBackingUp ? '' : me.dir,
			elClass = me.el.classList;

		pause();
		isBackingUp = false;
		timeDelta = 0;
		reverseTime = 0;
		animStartTime = new Date().getTime();

		// If the animation ends, put this class in.  
		elClass.add('end-of-animation');

		elClass.remove('reverse');
		if (me.dir !== '') {
			cellInfo = maze.getCellInDir(me.x, me.y, dir);
			
			if (cellInfo) {
				cellEl = cellInfo.cell;
				me.x = cellInfo.x;
				me.y = cellInfo.y;

				if (me.isInTunnel) {
					me.isInTunnel = false;

					if (window.Howl) {
						game.sounds['tunnel1'].play();
					}
				}
				
				
				requestAnimationFrame(function() {
					maze.putInCell(me.el, cellInfo.x, cellInfo.y);
					elClass.remove('end-of-animation');
					go()
				});
			}
		}
	}
	
	function setReversePosition(time) {
		canGoInNextCell = false;
		var actualDir = isBackingUp ? game.oppositeDir(me.dir) : me.dir,
			delayTime = `-${time}ms`; //isBackingUp ? `${-time}ms` : `${time}ms`,
			elStyle = me.el.style;
		//requestAnimationFrame(function() {
			elStyle.setProperty('display', 'none');
			elStyle.setProperty('animation-name', 'fake-animation-name', 'important');
			requestAnimationFrame(function() {
				elStyle.setProperty('animation-delay', delayTime, 'important');
				elStyle.removeProperty('animation-name');
				elStyle.removeProperty('display');
				canGoInNextCell = true;
			});
		//});
	}
	
	function go(doReverse) {
		canGoInNextCell = false;
		var classList = me.el.classList,
			now;
		
		// ZOLTAN
		if (doReverse) {
			// We need to figure out what percentage of the animation we were in
			now = new Date().getTime();
			
			isBackingUp = !isBackingUp;
			if (timeDelta === 0) {
				reverseTime = (now - animStartTime);
				timeDelta = reverseTime;
			} else {
				if (isBackingUp) {
					timeDelta = now + (reverseTime + timeDelta);
				} else {
					timeDelta = now - (reverseTime - timeDelta);
				}
			}
			
			reverseTime = now;
			
			if (isBackingUp) {
				classList.add('reverse');
			} else {
				classList.remove('reverse');
			}
			setReversePosition(animationDuration - timeDelta);
			unpause();
			return;
		} else {
			me.el.style.animationDelay = '';
		}
		
		unpause();
		me.el.classList.remove('reverse');
		if (!isBackingUp) {
			var cellInfo = maze.getCell(me.x, me.y);
			if (cellInfo.classList.contains(lastCmd)) {
				me.dir = lastCmd;
				if (lastCmd !== '') {
					playSound();
					animStartTime = new Date().getTime();
					classList.add('move', lastCmd);
				}
			} else {
				stopSound();
				isMoving = false;
			}
		}
		
		canGoInNextCell = true;
	}
	
	me.die = function () {
		document.body.removeEventListener('keydown', move);
		document.body.removeEventListener('keyup', stop);
		var currentTransform = document.defaultView.getComputedStyle(me.el, null).transform;
		
		me.el.classList.remove('n', 's', 'e', 'w', 'reverse');
		me.el.style.transform = currentTransform;
		me.el.classList.add('die');
		stopSound();
		isSoundPlaying=false;
		game.sounds['kc-die1'].play();
		game.stopPlayers();
		
		delete maze.el.dataset.hasFinishedRendering;
		
		/*
		 * We originally had
		 *    me.el.addEventListener('animationend', me.reincarnate);
		 * and it worked for all browsers except IE/Edge, which can't
		 * fire animationend events on pseudo-elements.  So we put in a
		 * setRequestTimeout instead (which should be okay, since it is
		 * using requestAnimationFrame()).
		 */
		setRequestTimeout(me.reincarnate, 1000);
		
	}
	
	me.reincarnate = function () {
		game.clearStateTimeout();
		me.el.classList.remove('die');
		me.el.classList.add('dead');
		
		game.lives --;
		game.setLives();
		if (game.lives === 0) {
			game.showGameOver();
		} else {
			requestAnimationFrame(
				function() {
					game.reset(true)
				}
			);
		}
		
	}
	
	function stop(e) {
		e.preventDefault();
		/* me.el.classList.remove('move', 'n', 's', 'e', 'w');	
		game.sounds['kc-move'].stop();
		lastCmd = ''; */
		//me.el.style.animationPlayState='paused'; //classList.add('paused');
	}
	
	function pause(e) {
		isPaused = true;
		e && e.preventDefault();
		var classList = me.el.classList;
	}
	
	function unpause(e) {
		isPaused = false;
		e && e.preventDefault();
		var classList = me.el.classList;
		classList.remove('paused');
	}
	
	function initGestures() {
		var activeRegion = ZingTouch.Region(document.body);
		activeRegion.bind(maze.el, 'swipe', swipeEvent)
	}
	
	function init() {
		me.el = ce('div');
		me.el.className = 'kc player';
		me.el.__player = me;
		maze.putInCell(me.el, x, y);
		document.body.addEventListener('keydown', move);
		document.body.addEventListener('keyup', stop);
		//initGestures();

		// to play the tunnel sound when KC enters the tunnel
		me.el.addEventListener('animationstart', animationstartHandler);
		me.el.addEventListener('animationend', animationendHandler);
		animationDuration = parseFloat(document.defaultView.getComputedStyle(me.el, null).animationDuration)*1000;
	}
	
	init();
};

var MuncherDen = function (x, y) {
	var me = this,
		dirs = ['s', 'w', 'n', 'e'],
		openDir = dirs[0],
		timeout = null;
		
	me.el = maze.getCell(x, y);
	
	me.x = x;
	me.y = y;
	
	function render() {
		for (var i=0; i<dirs.length; i++) {
			var dir = dirs[i],
				operation = (openDir === dir) ? 'remove' : 'add';
			maze.setWall(me.x, me.y, dir, operation);
		}
		
		
	}
	
	me.stop = function () {
		clearRequestInterval(timeout);
	}
	
	function rotate() {
		var index = dirs.indexOf(openDir);
		openDir = dirs[(index+1) % dirs.length];
		render();
	}
	
	function init() {
		me.el = maze.getCell(x,y);
		render();
		timeout = setRequestInterval(rotate, 1000);
	}
	
	init();
}
	
var Muncher = function (x, y, dir, speed, index) {
	var me = this,
		dirs = ['n', 'e', 's', 'w'],
		openDir = dirs[0],
		el,
		cellEl = maze.getCell(x, y),
		scatterY = [1, 5, 9],
		modes = {
			SCATTER: -1,
			PURSUIT: 0,
			FLEE: 1
		},
		modeTimeout = null;
	
	me.x = x;
	me.y = y;
	me.dir = dir;
	me.speed = speed;
	me.state = modes.SCATTER;
	me.index = index;
	me.isEnemy = true;
	
	/* Muncher animation end handler */
	function animationendHandler(e) {
		var cellInfo = maze.getCellInDir(me.x, me.y, me.dir);
		cellEl = cellInfo.cell;
		me.x = cellInfo.x;
		me.y = cellInfo.y;
		
		requestAnimationFrame(function () {
			maze.putInCell(me.el, cellInfo.x, cellInfo.y);
			
			// if the muncher is in the pen and was eaten, reincarnate it.
			if (me.x === game.den.x && me.y === game.den.y) {
				me.reincarnate();
			}
			go()
		});
	}
	
	function go() {
		var aimCoord,
			ghostState = me.state;

		if (me.isEaten()) {
			aimCoord = {
				x: game.den.x,
				y: game.den.y
			}
		} else {
			if (maze.el.className !== '') {
				ghostState = modes.FLEE;
			} 
			switch (ghostState) {
				case modes.SCATTER:
					aimCoord = {
						x: scatterY[me.index],
						y: maze.height
					}
					
					// if the muncher is on the aimed coord, then we will
					// change the mode and make sure we go to the next case
					if (me.x === aimCoord.x && me.y === aimCoord.y) {
						me.state = modes.FLEE;
					} else {
						break;
					}
				case modes.FLEE:
					aimCoord = null;
					break;
				case modes.PURSUIT:
					aimCoord = {
						x: game.kc.x,
						y: game.kc.y
					}
					break;
			}
		}
		me.dir = game.setPlayerDir(me, cellEl, me.dir, aimCoord);
	}
	
	me.stop = function() {
		me.el.classList.add('stop');
	}
	
	me.isEaten = function () {
		return me.el.classList.contains('eaten');
	}
	
	me.isEdible = function () {
		var classList = me.el.classList;
		return classList.contains('edible') && !classList.contains('eaten');
	}
	
	me.setEdible = function (val) {
		if (val) {
			me.el.classList.add('edible');
		} else {
			me.el.classList.remove('edible');
		}
	}
	
	
	me.die = function () {
		var classList = me.el.classList;
			
		me.setEdible(false);
		classList.add('eaten');
		game.sounds['muncher-eaten'].play();
	}
	
	me.reincarnate = function () {
		me.el.classList.remove('eaten');
		game.doStateCheck();
	}
	
	function changeMode(mode) {
		me.state = (me.state + 1) % 2;
		modeTimeout = setRequestTimeout(changeMode, 10000);
	}
	
	me.teardown = function () {
		if (modeTimeout) {
			clearRequestTimeout(modeTimeout);
		}
	}
	
	function init() {
		me.el = ce('div');
		
		me.el.__player = me;
		
		me.el.addEventListener('animationend', animationendHandler);
		me.el.className = `muncher muncher-${index} player`;
		
		me.el.style.animationDuration = me.speed + 'ms';
		maze.putInCell(me.el, x, y);
		requestAnimationFrame(go);
		
		modeTimeout = setRequestTimeout(changeMode, 10000);
		
	}
	
	
	init();
}

var demo = new function () {
	var me = this,
		bodyEl = document.body,
		demoEl = document.getElementById('demo'),
		logoEl,
		kcDemoEl;
	
	me.start = function () {
		document.body.addEventListener('keydown', keyDownClickEvent);
		document.body.addEventListener('click', keyDownClickEvent);
		document.body.addEventListener('touchstart', keyDownClickEvent);
		bodyEl.className = 'demo-mode';
		slide1();
	}
	
	function keyDownClickEvent(e) {
		if (e.key === ' ' || e.type === 'click') {
			document.body.removeEventListener('keydown', keyDownClickEvent);
			document.body.removeEventListener('click', keyDownClickEvent);
			document.body.removeEventListener('touchstart', keyDownClickEvent);
			
			e.preventDefault();
			game.start(e);
			
		}
	}
	
	function slide1() {
		demoEl.innerHTML = `
			<div id="slide1-1" class="slide" demo-text"></div>
			<div id="slide-1" class="slide pixelate logo-container">
				<div id="slide1-2" class="kc-munchkin-logo white-gradient">
					K.C. Munchkin<span class="sup">²</span>
				</div>
			</div>
			<div id="slide1-3" class="slide">Press space to start</div>
			<div id="slide1-4" class="slide">
				<div id="kc-demo" class="kc player move e"></div>
			</div>
		`;
		me.showLetterByLetter(document.getElementById('slide1-1'), 'Useragentman presents', 0, 150, slide1a);
		
		kcDemoEl = document.getElementById('kc-demo');
		kcDemoEl.addEventListener('animationend', stopKC);
	}
	
	function slide1a() {
		logoContainer = document.getElementById('slide-1');
		if (logoContainer) {
			logoContainer.classList.add('pixelate-animation');
			logoEl = document.getElementById('slide1-2');
			//logoEl.addEventListener('transitionend', slide1b);
			requestAnimationFrame( function () {
				logoEl.className += ' animate';
			});
		}	
	}
	
	
	function stopKC(e) {
		kcDemoEl.classList.remove('move', 'e');
	}
	
	me.stop = function () {
		demoEl.innerHTML = '';
		bodyEl.className = '';
		window.removeEventListener('keydown', keyDownClickEvent);
		window.removeEventListener('click', keyDownClickEvent);
		window.removeEventListener('touchstart', keyDownClickEvent);
	}
	
	me.showLetterByLetter = function (targetEl, message, index, interval, callback) {
		targetEl.classList.add('letter-by-letter-animation');
		me.showLetterByLetterHelper(targetEl, message, index, interval, callback);
	}
	
	me.showLetterByLetterHelper = function (targetEl, message, index, interval, callback) {
		requestAnimationFrame(
			function () {
				if (index < message.length) { 
					var letter = message[index++];

					if (letter === ' ') {
						letter = '&nbsp;';
					}

					targetEl.innerHTML += `<span class="char-${index}">${letter}</span>`; 
					setRequestTimeout(
						function () {
							requestAnimationFrame(
								function () {
									me.showLetterByLetter(targetEl, message, index, interval, callback);
								}
							)
						}, interval
					); 
				} else {
					targetEl.classList.remove('letter-by-letter-animation');
					if (callback){
						callback();
					}
				}
			}
		);
	}
}

var preloader = new function () {
	var me = this,
		dataset = document.body.dataset,
		preloadImages = dataset.preloadImages.split(','),
		imageDir = dataset.imageDir,
		preloadSounds = dataset.preloadSounds.split(','),
		totalToLoad = preloadImages.length + preloadSounds.length,
		soundDir = dataset.soundDir,
		images = [],
		numLoaded = 0,
		el = document.getElementById('preloader'),
		i;
		
		function assetErrorHandler(e) {
			console.error(`Error: invalid image ${e.target.src}`);
			assetLoadHandler();
		}
		
		
		function assetLoadHandler() {
			requestAnimationFrame(imageLoadFrame);
		}
		
		function imageLoadFrame() {
			numLoaded ++;
			if (numLoaded == images.length) {
				el.className = 'hidden';
				me.callback();
			}
			
			el.value = numLoaded;
			el.innerHTML = `<strong>Loaded ${numLoaded * 100 / images.length}%.`
		}
		
		
		
		me.init = function(callback) {
			me.callback = callback;
			for (i = 0; i < preloadImages.length; i++) {
				var image = new Image();
				image.onload = assetLoadHandler;
				image.onerror = assetErrorHandler;
				image.src = `${imageDir}/${preloadImages[i]}.svgz`;
				images.push(image);
			}
			
			for (i=0; i<preloadSounds.length; i++) {
				var file = preloadSounds[i];
				
				// Don't execute if Howl lib not loaded.
				if (window.Howl) {
					game.sounds[file] = new Howl({
						autoplay: false, //(i === 'kc-move'),
						src: ['sounds/' + file + '.wav'],
						loop: (i === 'kc-move'),
						onload: assetLoadHandler,
						onloaderror: assetErrorHandler,
					});
				}
			}
		}
}

var game = new function () {
	var me = this,
		score = 0,
		highScore = 0,
		lives = 0,
		scoreEl = document.getElementById('score'),
		highScoreEl = document.getElementById('high-score'),
		dotSpeedEl = document.getElementById('dot-speed'),
		overlayEl = document.getElementById('overlay'),
		livesEl = document.getElementById('lives'),
		dotSpeed,
		collisionInterval,
		stateTimeout,
		bonusDisplayEl = document.getElementById('bonus-display'),
		munchersEaten = 0,
		numActiveDots = 0;
	
	me.dots = [],
	me.munchers = [],
	me.numMunchers = 0,
	me.kc,
	me.den,
	me.dotSpeed;
	me.canEatMunchers = false,
	me.sounds = {};
	me.lives = 3;
	
	Object.defineProperty(
		me, 
		'dotSpeed',
		{
			set: function (n) {
				dotSpeedEl.innerHTML = `.player.dot {	animation-duration: ${n}ms;}`;
				dotSpeed = n;
			},
			
			get: function (n) {
				return dotSpeed;
			}
		}
	);
	
	me.clearStateTimeout = function () {
		clearRequestTimeout(stateTimeout);
	}

	function setBonusDisplay(x, y, val) {
		var style = bonusDisplayEl.style;
		style.left = x + 'px';
		style.top = y + 'px';
		
		bonusDisplayEl.innerHTML = val;
		bonusDisplayEl.className = 'show';
	}
	
	function bonusDisplayAnimationEnd(e) {
		bonusDisplayEl.innerHTML = '';
		bonusDisplayEl.className = '';
		bonusDisplayEl.style.top = '-100px';
	}
		
	me.randInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	me.setScore = function (n, doIncrease, isBonus) {
		score = (doIncrease ? score + n : n);
		scoreEl.innerHTML = score;
		
		if (isBonus) {
			var box = me.kc.el.getBoundingClientRect();
			setBonusDisplay(box.left, box.top, n);
		}
	}
	
	me.setLives = function() {
		livesEl.innerHTML = '';
		var i;
		for (i=1; i<=me.lives; i++) {
			livesEl.innerHTML += '<span class="kc-life"></span>';
		}
	}
	
	function setHighScore(s) {
		var exp = new Date();
		exp.setDate(exp.getDate() + 20 * 365); // 20 years from now.

		highScore = s;
		highScoreEl.innerHTML = s;
		Cookie.set('kc-hi', s, exp);
	}

	function getHighScore() {
		var s = Cookie.get('kc-hi');

		if (!s) {
			s = 0;
		}
		highScoreEl.innerHTML = s;
		highScore = parseInt(s);
	}
	
	me.teardown = function (keepScore) {
		var i;
		clearRequestTimeout(stateTimeout);
		setMunchersEdibility(false);
		me.den.stop();
		delete(me.dots);
		
		for (i=0; i<me.munchers.length; i++) {
			me.munchers[i].teardown();
		}
		delete(me.munchers);
		delete(me.kc);
		delete(me.den);
		
		clearRequestInterval(collisionInterval);
		me.dots = [];
		me.munchers = new Array(3);
		
		me.den = null;
		
		window.Howl && game.sounds['kc-move'].pause();
	}
	
	me.reset = function (keepScore) {
		delete maze.el.dataset.hasFinishedRendering;
		me.teardown(keepScore);
		me.reincarnate();
	};
	
	me.oppositeDir = function(dir) {
		switch(dir) {
			case 'n':
				return 's';
			case 's':
				return 'n';
			case 'w':
				return 'e';
			case 'e':
				return 'w';
		}
		return null;
	}
	
	function createDots() {
		var i = 0;
		
		for (x = 1; x <= maze.width; x += maze.width - 1) {
			for ( y = 1; y <= maze.height; y += maze.height - 1) {
				me.dots[i] = new Dot(x, y, i, 'pill');
				me.dots[i + 1] = new Dot (x, (y==1 ? y + 1 : y - 1), i+1);
				me.dots[i + 2] = new Dot ((x==1 ? x + 1 : x - 1), y, i+2);
				i+=3;
			}
		}
		numActiveDots = i;
	}
	
	function createKC() {
		me.kc = new KC(5, 4);
	}
	
	function createDen() {
		me.den = new MuncherDen(5, 5);
	}
	
	function createMunchers() {
		var i;
		
		for (i=0; i<me.numMunchers; i++) {
			me.munchers[i] = new Muncher(5 , 5, 'n', 450 + 50 * i, i);
		}
		
	}
	
	me.stopPlayers = function () {
		var i;
		for (i=0; i<me.munchers.length; i++) {
			me.munchers[i].stop();
		}
		
		for (i=0; i<me.dots.length; i++) {
			me.dots[i].stop();
		}
		
		me.den.stop();

		// stop sounds.
	}
	
	me.getTargetedDirs = function (player, target, goAway) {
		var possibleDirs = maze.getCellDirs(player.x, player.y),
			favouredDirs = [],
			returnDirs = [],
			badDir = (possibleDirs.length > 1) ? me.oppositeDir(player.dir) : null ;
		
		
		if (player.x > target.x) {
			favouredDirs.push(goAway ? 'e' : 'w');
		} else if (player.x < target.x) {
			favouredDirs.push(goAway ? 'w' : 'e');
		}
		
		if (player.y > target.y) {
			favouredDirs.push(goAway ? 's' : 'n');
		} else if (player.y < target.y){
			favouredDirs.push(goAway ? 'n' : 's');
		}

		/*
		 * we push the favoured directions twice on the return value
		 */
		for (var i=0; i < possibleDirs.length; i++) {
			var dir = possibleDirs[i];
			if (dir !== badDir) {
				if (favouredDirs.indexOf(dir) > -1) {
					returnDirs.push(dir);
				}
				returnDirs.push(dir);
			}
		}
		
		return returnDirs;
	}
	
	me.setPlayerDir = function (player, cellEl, currentDir, aimCoords) {
		var
			dir,
			possibleDirs = cellEl.classList,
			numPossibleDirs = possibleDirs.length,
			nextDirIndex = game.randInt(0, numPossibleDirs - 1),
			nextDir = possibleDirs[nextDirIndex],
			path,
			cellKey,
			aimKey;
			
		if (numPossibleDirs > 1) {
			if (aimCoords) {
				
				// old code
				/* var targetDirs = me.getTargetedDirs(player, aimCoords);
				nextDir = targetDirs[me.randInt(0, targetDirs.length - 1)]; */
				
				// new code
				cellKey = `${player.x}${player.y}`;
				aimKey = `${aimCoords.x}${aimCoords.y}`;
				path = maze.graph.shortestPath(cellKey, aimKey).reverse();
				
				// If the muncher is almost on top of K.C., then we pick a random 
				// direction.
				if (path.length > 0) {
					nextDir = whichDir(cellKey, path[0]);
				} else {
					var targetDirs = me.getTargetedDirs(player, aimCoords);
					nextDir = targetDirs[me.randInt(0, targetDirs.length - 1)];
				}
				
			} else {
				if (nextDir === game.oppositeDir(currentDir)) {
					nextDirIndex = (nextDirIndex + 1) % numPossibleDirs;
					nextDir = possibleDirs[nextDirIndex];
				}
			}
		}
		
		dir = nextDir;
		
		player.el.classList.add(dir);
		return dir;
	}
	
	function whichDir(from, to) {
		var fromArray = from.split(''),
			toArray = to.split('');
			
		if (fromArray[0] > toArray [0] ) {
			return 'w';
		} else if (fromArray[0] < toArray[0]) {
			return 'e';
		} else if (fromArray[1] > toArray[1]) {
			return 'n';
		} else {
			return 's';
		}
	}
	
	function whatIsOnTopOf(obj) {
		var box = obj.el.getBoundingClientRect(),
			w = box.right - box.left,
			h = box.bottom - box.top,
			midX = box.left + w/2,
			midY = box.top + h/2,
			objOnTop = document.elementFromPoint(midX, midY);
			
		return objOnTop? objOnTop.__player : null;
	}
	
	
	function setMunchersEdibility(val) {
		var i, muncher;
		
		game.canEatMunchers = val;
		
		munchersEaten = 0;

		for (i=0; i<me.munchers.length; i++) {
			muncher = me.munchers[i];
			
			if (val) {
				if (muncher.isEaten()) {
					munchersEaten ++;
				} else {
					me.munchers[i].setEdible(val);
				}
			} else {
				me.munchers[i].setEdible(val);
			}
		}
	}
	
	function detectCollisionsInterval() {
		requestAnimationFrame(detectCollisions)
	}
	
	function detectCollisions() {

			// if KC is at the end of a CSS animation, we don't check for 
			// a collision.  This is because he is in a reversed state, he will
			// appear to the browser in the cell he came from briefly, which
			// is not perceptually correct. 
			//
			// We also don't count collisions that happen inside the tunnel
			if (!me.kc || me.kc.isAtEndOfAnimation() || me.kc.isInTunnel) {
				return;
			}


			var
				playerOnTop = whatIsOnTopOf(me.kc),
				i;
			
			/*
			 * Only if playerOnTop is a muncher.
			 */
			if (playerOnTop) {
				if (playerOnTop !== me.kc) {
					if (playerOnTop.isEnemy) {
						if (playerOnTop.isEdible()) {
							playerOnTop.die();
							munchersEaten++;
							me.setScore(Math.pow(2, munchersEaten) * 100, true, true);
						} else if (!playerOnTop.isEaten()){
							me.kc.die();
						}
					} else if (playerOnTop.isDot) {
						playerOnTop.stop();
						numActiveDots --;
						
						if (playerOnTop.el.classList.contains('pill')) {
							window.Howl && game.sounds['eat-pill'].play();
							me.setScore(50, true);
							me.setState('pill-eaten');
							setMunchersEdibility(true);
						} else {
							window.Howl && game.sounds['eat-dot'].play();
							me.setScore(10, true);
						}
						me.dotSpeed -= 250;
						if (numActiveDots === 0) {
							me.reset(true);
						}
					}
				}
			}
			
			
	}
	
	
	me.setState = function (state) {
		maze.setState(state);
		switch(state){
			case 'pill-eaten':
				clearRequestTimeout(stateTimeout);
				stateTimeout = setRequestTimeout(function() {
					me.setState('pill-wearing-out');
				}, 8000);
				
				break;
			case 'pill-wearing-out':
				clearRequestTimeout(stateTimeout);
				window.Howl && me.sounds['warning'].play();
				stateTimeout = setRequestTimeout(function() {
					me.setState('');
				}, 2000);
				break;
			case '':
				clearRequestTimeout(stateTimeout);
				setMunchersEdibility(false);
				break;
			}
	};
	
	me.doStateCheck = function () {
		if (munchersEaten === 3) {
			me.setState('');
		}
	}
	
	/**
	 * Shuffles array in place. 
	 * From http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
	 * 
	 * @param {Array} a items The array containing the items.
	 */
	me.shuffleArray = function (a) {
		var j, x, i;
		for (i = a.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = a[i - 1];
			a[i - 1] = a[j];
			a[j] = x;
		}

		return a;
	}
	
	me.start = function () {
		me.lives = 3;
		me.setScore(0)
		me.reincarnate();
	}
	
	me.reincarnate = function () {
		maze.clear();
		demo.stop();
		showIntro(initLevel);
	}
	
	function showIntro(callback) {
		overlayEl.className = '';
		demo.showLetterByLetter(overlayEl, 'Ready Player 1', 0, 120, function () {
			setRequestTimeout(function () {
				overlayEl.innerHTML = '';
				overlayEl.className = 'hidden';
			}, 1000);
		});

		callback();
	}
	
	me.showGameOver = function () {
		if (score > highScore) {
			setHighScore(score);
		}
		me.setLives();
		overlay.className = '';
		demo.showLetterByLetter(overlayEl, 'Game Over', 0, 100, function () {
			setRequestTimeout(function () {
				
				game.teardown();
				overlayEl.innerHTML = '';
				overlayEl.className = 'hidden';
				demo.start();
			}, 3000);
		});
	}
	
	function initLevel() {
		maze.make(9, 7, 5, 5);
	}

	me.startLevel = function () {
		maze.el.dataset.hasFinishedRendering = 'true';
		createDots();
		createKC();
		createDen();
		me.numMunchers = parseInt(document.body.dataset.numMunchers);
		createMunchers();
		me.setLives();
		me.dotSpeed = 3000;
		me.setState('');
		collisionInterval = setRequestInterval(detectCollisionsInterval, 10);
	}
	
	function initSounds() {
		me.sounds['kc-move'].loop(true);
		me.sounds['kc-move'].pause();
		me.sounds['kc-move'].volume(0.1);
	}
	
	me.initHelper = function () {
		window.scrollTo(0, 1);
		bonusDisplayEl.addEventListener('animationend', bonusDisplayAnimationEnd);
		initSounds();
		setRequestTimeout(demo.start, 500);
		getHighScore();
		mobileController.init();
	}
	
	me.log = console.log
	
	me.init = function () {
		preloader.init(me.initHelper);
	}
};


game.init();
