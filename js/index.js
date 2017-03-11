/*
 * Graphics from: http://atariage.com/forums/topic/220324-kc-munchkin/page-3
 */


Node.prototype.add = function(tag, cnt, txt) {
	for (var i = 0; i < cnt; i++)
		this.appendChild(ce(tag, txt));
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

var maze = new function () { 
	var 
		me = this;
	
	me,width = 0;
	me.height = 0;
	
	
	me.tblEl = gid('maze');
	
	
	me.dirs = ['s', 'e', 'w', 'n'];
	
	
	function gid(e) { return document.getElementById(e); }
	function irand(x) { return Math.floor(Math.random() * x); }
	
	me.getCell = function(x, y) {
		if (0 < x && x <= me.width && 0 < y && y <= me.height) {
			return me.tblEl.kid(y).kid(x);
		} else {
			return null;
		}
	}
	
	me.getCellInDir = function(x, y, dir) {
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
				return {
					cell: me.getCell(x-1, y),
					x: x - 1,
					y: y
				};
				
			case "e":
				return {
					cell: me.getCell(x + 1, y),
					x: x + 1,
					y: y
				};
				
		}
		return null;
	}
	
	me.putInCell = function(el, x, y) {
		me.getCell(x,y).appendChild(el);
	}
	
	
	function removeRandomWall(x, y, cell) {
		var bannedDirs = [],
			possibleDirs = me.dirs.slice(0),
			i;

		if (x === 1) {
			bannedDirs.push('w');
		} else if (x === me.width) {
			bannedDirs.push('e');
		}
		
		if (y === 1 ) {
			bannedDirs.push('n');
		} else if ( y === me.height) {
			bannedDirs.push('s');
		}
		
		var openDirs = bannedDirs.concat(cell.classList);
		
		for (i=0; i<openDirs.length; i++) {
			possibleDirs.remove(openDirs[i]);
		}
		
		for (i=0; i<possibleDirs.length; i++) {
			me.setWall(x, y, possibleDirs[i], 'remove');
		}
		
	}
	
	function removeDeadEnds() {
		var i, j;
		for (i=1; i <= me.width; i++) {
			for (j=1; j <= me.height; j++) {
				var cell = me.getCell(i, j),
					classList = cell.classList;
				if (classList.length < 2) {
					removeRandomWall(i, j, cell);
					
				}
			}
		}
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
	 
	me.make = function (w, h) {
		me.width = w;
		me.height = h;
		me.tblEl.innerHTML = '';
		me.tblEl.add('tr', h);
		me.tblEl.childNodes.map(function(x) {
				x.add('th', 1);
				x.add('td', w, '*');
				x.add('th', 1);
		});
		me.tblEl.ins('tr');
		me.tblEl.add('tr', 1);
		me.tblEl.firstChild.add('th', w + 2);
		me.tblEl.lastChild.add('th', w + 2);
		for (var i = 1; i <= h; i++) {
			for (var j = 1; j <= w; j++) {
				me.tblEl.kid(i).kid(j).neighbors = [
					me.tblEl.kid(i + 1).kid(j),
					me.tblEl.kid(i).kid(j + 1),
					me.tblEl.kid(i).kid(j - 1),
					me.tblEl.kid(i - 1).kid(j)
				];
			}
		}
		walk(me.tblEl.kid(irand(h) + 1).kid(irand(w) + 1));
		
		//Now, we must close up the maze
		close_maze();
		
		removeDeadEnds();
	};
	
	function close_maze() {
		var firstRow = me.tblEl.kid(1),
			lastRow = me.tblEl.kid(me.height),
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
		me.tblEl.kid(y).kid(x).appendChild(el);
	}
};

/*******************
 * DOT
 *******************/
var Dot = function(x, y) {
	var
		me = this,
		cellEl = maze.getCell(x, y);
	
	me.x = x;
	me.y = y;
	me.el = null;
	
	function transitionEndHandler(e) {
		var cellInfo = maze.getCellInDir(me.x, me.y, me.dir);
		cellEl = cellInfo.cell;
		me.x = cellInfo.x;
		me.y = cellInfo.y;
		maze.putInCell(me.el, cellInfo.x, cellInfo.y);
		me.el.classList.remove('n', 's', 'e', 'w');
		setTimeout(go, 1);
	}
	
	function go() {
		me.dir = game.setPlayerDir(me.el, cellEl, me.dir);
	}
	
	function init() {
		me.el = ce('div');
		me.el.className = 'dot';
		maze.putInCell(me.el, x, y);
		me.el.addEventListener('transitionend', transitionEndHandler);
		setTimeout(go, 1);
	}
	
	me.stop = function() {
		me.el.classList.add('stop');
	}
	
	init();
};

var KC = function(x, y) {
	var 
		me = this,
		lastCmd,
		isMoving = false;
	
	me.x = x;
	me.y = y;
	me.dir = null;
	me.el = null;

	function move(e) {
		
		switch (e.key) {
			case "ArrowDown":
				lastCmd = 's';
				e.preventDefault();
				break;
			case "ArrowUp":
				lastCmd = 'n';
				e.preventDefault();
				break;
			case "ArrowLeft":
				lastCmd = 'w';
				e.preventDefault();
				break;
			case "ArrowRight":
				lastCmd = 'e';
				e.preventDefault();
				break;
			default:
				lastCmd = '';
		}
		
		if (lastCmd !== '') {
			isMoving = true;
			go();
		}
		
		//me.el.className = 'kc move ' + me.dir;
	}
	
	function transitionEndHandler(e) {
		if (me.dir !== '') {
			var cellInfo = maze.getCellInDir(me.x, me.y, me.dir);
			cellEl = cellInfo.cell;
			me.x = cellInfo.x;
			me.y = cellInfo.y;
			maze.putInCell(me.el, cellInfo.x, cellInfo.y);
			me.el.classList.remove('n', 's', 'e', 'w');
			setTimeout(go, 1);
		}
	}
	
	function go() {
		me.dir = lastCmd;
		if (lastCmd !== '') {
			me.el.classList.add('move', lastCmd);
		}
	}
	
	me.die = function () {
		me.el.addEventListener('animationend', me.reincarnate);
		me.el.classList.remove('n', 's', 'e', 'w');
		me.el.classList.add('die');
		game.stopPlayers();
		document.removeEventListener('keydown', move);
		document.removeEventListener('keyup', stop);
	}
	
	me.reincarnate = function () {
		console.log('xxx')
		me.el.removeEventListener('animationend', me.reincarnate);
		me.el.classList.remove('die');
		me.el.classList.add('dead');
		
		setTimeout(game.reset, 1);
	}
	
	function stop(e) {
		e.preventDefault();
		lastCmd = '';
	}
	
	
	
	function init() {
		me.el = ce('div');
		me.el.className = 'kc';
		maze.putInCell(me.el, x, y);
		
		document.addEventListener('keydown', move);
		document.addEventListener('keyup', stop);
		me.el.addEventListener('transitionend', transitionEndHandler);
	}
	
	init();
};

var MuncherDen = function (x, y) {
	var me = this,
		dirs = ['n', 'e', 's', 'w'],
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
		clearInterval(timeout);
	}
	
	function rotate() {
		var index = dirs.indexOf(openDir);
		openDir = dirs[(index+1) % dirs.length];
		render();
	}
	
	function init() {
		me.el = maze.getCell(x,y);
		render();
		timeout = setInterval(rotate, 1000);
	}
	
	init();
}


var Muncher = function (x, y, dir, speed, index) {
	var me = this,
		dirs = ['n', 'e', 's', 'w'],
		openDir = dirs[0],
		el,
		cellEl = maze.getCell(x, y);
	
	me.x = x;
	me.y = y;
	me.dir = dir;
	me.speed = speed;
	
	function transitionEndHandler(e) {
		var cellInfo = maze.getCellInDir(me.x, me.y, me.dir);
		cellEl = cellInfo.cell;
		me.x = cellInfo.x;
		me.y = cellInfo.y;
		maze.putInCell(me.el, cellInfo.x, cellInfo.y);
		me.el.classList.remove('n', 's', 'e', 'w');
		setTimeout(go, 1);
	}
	
	function go() {
		me.dir = game.setPlayerDir(me.el, cellEl, me.dir);
	}
	
	me.stop = function() {
		me.el.classList.add('stop');
	}
	
	function init() {
		me.el = ce('div');
		
		me.el.addEventListener('transitionend', transitionEndHandler);
		me.el.className = 'muncher muncher-'+ index;
		
		me.el.style.transitionDuration = me.speed + 'ms';
		maze.putInCell(me.el, x, y);
		setTimeout(go, 1);
		
	}
	
	init();
}

var game = new function () {
	var me = this,
		score = 0,
		scoreEl = document.getElementById('score');
	
	me.dots = Array(6),
	me.munchers = Array(3),
	me.kc,
	me.den;
	
	
		
	me.randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	me.setScore = function (n, doIncrease) {
		score = (doIncrease ? score + n : n);
		scoreEl.innerHTML = score;
	}
	
	me.reset = function () {
		delete(me.dots);
		delete(me.munchers);
		delete(me.kc);
		delete(me.den);
		
		me.dots = new Array(6);
		me.munchers = new Array(3);
		me.den = null;
		me.setScore(0);
		me.start();
	}
	
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
				me.dots[i] = new Dot(x, y);
				me.dots[i + 1] = new Dot (x, (y==1 ? y + 1 : y - 1));
				me.dots[i + 2] = new Dot ((x==1 ? x + 1 : x - 1), y);
				i+=3;;
			}
		}
	}
	
	function createKC() {
		me.kc = new KC(5, 6);
	}
	
	function createDen() {
		me.den = new MuncherDen(5, 5);
	}
	
	function createMunchers() {
		var i;
		
		for (i=0; i<me.munchers.length; i++) {
			me.munchers[i] = new Muncher(5 , 5, 'n', 250 + 100 * i, i);
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
	}
	
	me.setPlayerDir = function (el, cellEl, currentDir) {
		var
			dir,
			possibleDirs = cellEl.classList
			numPossibleDirs = possibleDirs.length,
			nextDirIndex = game.randInt(0, numPossibleDirs - 1),
			nextDir = possibleDirs[nextDirIndex];
			
		if (numPossibleDirs > 1) {
			if (nextDir === game.oppositeDir(currentDir)) {
				nextDirIndex = (nextDirIndex + 1) % numPossibleDirs;
				nextDir = possibleDirs[nextDirIndex];
			}
		}
		
		dir = nextDir;
		
		el.classList.add(dir);
		return dir;
	}
	
	function whatIsOnTopOf(obj) {
		var box = obj.el.getBoundingClientRect(),
			w = box.right - box.left,
			h = box.bottom - box.top,
			midX = box.left + w/2,
			midY = box.top + h/2,
			objOnTop = document.elementFromPoint(midX, midY);
		return objOnTop;
	}
	
	function removeItemFromArray(item, array) {
		var index = array.indexOf(item);
		if (index > -1) {
			return array.splice(index, 1);
		} else {
			return array;
		}
	}
	
	function detectCollisions() {
			var
				objOnTop = whatIsOnTopOf(me.kc),
				i;
				
			if (objOnTop !== me.kc.el) {
				//game.stopPlayers();
				me.kc.die();
			} else {
				setTimeout(detectCollisions, 100);
			}
			
			for (i=0; i<me.dots.length; i++) {
				var dot = me.dots[i];
				objOnTop = whatIsOnTopOf(dot);
				
				if (objOnTop === me.kc.el) {
					console.log('before', me.dots);
					dot.stop();
					me.dots.splice(i, 1);
					console.log('ontop', me.dots);
					me.setScore(10, true);
				}
			}
	}
	
	me.start = function () {
		maze.make(9, 7);
		createDots();
		createKC();
		createDen();
		createMunchers();
		
		detectCollisions();
	}
};

game.start();