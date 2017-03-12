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
	
	me.width = 0;
	me.height = 0;
	
	
	me.el = gid('maze');
	
	
	me.dirs = ['s', 'e', 'w', 'n'];
	
	function gid(e) { return document.getElementById(e); }
	function irand(x) { return Math.floor(Math.random() * x); }
	
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
		me.el.innerHTML = '';
		me.el.add('tr', h);
		me.el.childNodes.map(function(x) {
				x.add('th', 1);
				x.add('td', w, '*');
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
		
		removeDeadEnds();
	};
	
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
var Dot = function(x, y, classes) {
	var
		me = this,
		cellEl = maze.getCell(x, y);
	
	me.x = x;
	me.y = y;
	me.el = null;
	
	function animationendHandler(e) {
		var cellInfo = maze.getCellInDir(me.x, me.y, me.dir);
		cellEl = cellInfo.cell;
		me.x = cellInfo.x;
		me.y = cellInfo.y;
		maze.putInCell(me.el, cellInfo.x, cellInfo.y);
		me.el.classList.remove('n', 's', 'e', 'w');
		setTimeout(go, 1);
	}
	
	function go() {
		me.dir = game.setPlayerDir(me, cellEl, me.dir);
	}
	
	function init() {
		me.el = ce('div');
		me.el.className = 'dot ' + (classes || '');
		maze.putInCell(me.el, x, y);
		me.el.addEventListener('animationend', animationendHandler);
		setTimeout(go, 1);
	}
	
	me.stop = function() {
		me.el.classList.add('stop');
	}
	
	init();
};


/*
 *  KC
 */

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
		//me.el.style.animationPlayState=''; //me.el.classList.remove('paused');
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
		}
		
		if (lastCmd !== '') {
			if (isMoving) {
				
			} else {
				isMoving = true;
				go();
			}
		}
		
		//me.el.className = 'kc move ' + me.dir;
	}
	
	function animationendHandler(e) {
		if (me.dir !== '') {
			var cellInfo = maze.getCellInDir(me.x, me.y, me.dir);
			if (cellInfo) {
				cellEl = cellInfo.cell;
				me.x = cellInfo.x;
				me.y = cellInfo.y;
				maze.putInCell(me.el, cellInfo.x, cellInfo.y);
				me.el.classList.remove('n', 's', 'e', 'w');
			setTimeout(go, 1);
			}
		}
	}
	
	function go() {
		var cellInfo = maze.getCell(me.x, me.y);
		if (cellInfo.classList.contains(lastCmd)) {
			me.dir = lastCmd;
			if (lastCmd !== '') {
				me.el.classList.add('move', lastCmd);
			}
		} else {
			me.el.classList.remove('move', 'n', 's', 'e', 'w');
			isMoving = false;
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
		me.el.removeEventListener('animationend', me.reincarnate);
		me.el.classList.remove('die');
		me.el.classList.add('dead');
		
		setTimeout(game.reset, 1);
	}
	
	function stop(e) {
		e.preventDefault();
		//lastCmd = '';
		//me.el.style.animationPlayState='paused'; //classList.add('paused');
	}
	
	
	
	function init() {
		me.el = ce('div');
		me.el.className = 'kc';
		maze.putInCell(me.el, x, y);
		
		document.addEventListener('keydown', move);
		document.addEventListener('keyup', stop);
		me.el.addEventListener('animationend', animationendHandler);
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
	
	function animationendHandler(e) {
		var cellInfo = maze.getCellInDir(me.x, me.y, me.dir);
		cellEl = cellInfo.cell;
		me.x = cellInfo.x;
		me.y = cellInfo.y;
		maze.putInCell(me.el, cellInfo.x, cellInfo.y);
		me.el.classList.remove('n', 's', 'e', 'w');
		
		// if the muncher is in the pen and was eaten, reincarnate it.
		if (me.x === game.den.x && me.y === game.den.y) {
			me.reincarnate();
		}
		
		setTimeout(go, 1);
	}
	
	function go() {
		var aimCoord;
		if (me.isEaten()) {
			aimCoord = {
				x: game.den.x,
				y: game.den.y
			}
		} else {
			aimCoord = null;
		}
		me.dir = game.setPlayerDir(me, cellEl, me.dir, aimCoord);
	}
	
	me.stop = function() {
		me.el.classList.add('stop');
	}
	
	me.isEaten = function () {
		return me.el.classList.contains('eaten');
	}
	
	me.die = function () {
		me.el.classList.add('eaten');
	}
	
	me.reincarnate = function () {
		me.el.classList.remove('eaten');
	}
	
	function init() {
		me.el = ce('div');
		
		me.el.__player = me;
		
		me.el.addEventListener('animationend', animationendHandler);
		me.el.className = 'muncher muncher-'+ index;
		
		me.el.style.animationDuration = me.speed + 'ms';
		maze.putInCell(me.el, x, y);
		setTimeout(go, 1);
		
	}
	
	
	init();
}

var game = new function () {
	var me = this,
		score = 0,
		scoreEl = document.getElementById('score'),
		dotSpeedEl = document.getElementById('dot-speed'),
		dotSpeed,
		collisionInterval,
		stateTimeout,
		bonusDisplayEl = document.getElementById('bonus-display'),
		munchersEaten = 0;
	
	me.dots = Array(6),
	me.munchers = Array(3),
	me.kc,
	me.den,
	me.dotSpeed;
	me.canEatMunchers = false;
	
	Object.defineProperty(
		me, 
		'dotSpeed',
		{
			set: function (n) {
				dotSpeedEl.innerHTML = 'td > .dot {	animation-duration: ' + n + 'ms;}';
				dotSpeed = n;
			},
			
			get: function (n) {
				return dotSpeed;
			}
		}
	);
	
	setBonusDisplay = function(x, y, val) {
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
			setBonusDisplay(box.x, box.y, n);
		}
	}
	
	me.reset = function (keepScore) {
		me.den.stop();
		delete(me.dots);
		delete(me.munchers);
		delete(me.kc);
		delete(me.den);
		
		clearInterval(collisionInterval);
		me.dots = new Array(6);
		me.munchers = new Array(3);
		me.canEatMunchers = false;
		
		
		me.den = null;
		if (!keepScore) {
			me.setScore(0);
		}
		me.start();
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
				me.dots[i] = new Dot(x, y, 'pill');
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
		
		//me.shuffleArray(possibleDirs);
		
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
			possibleDirs = cellEl.classList
			numPossibleDirs = possibleDirs.length,
			nextDirIndex = game.randInt(0, numPossibleDirs - 1),
			nextDir = possibleDirs[nextDirIndex];
			
		if (numPossibleDirs > 1) {
			if (aimCoords) {
				var targetDirs = me.getTargetedDirs(player, aimCoords);
				nextDir = targetDirs[me.randInt(0, targetDirs.length - 1)];
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
	
	function whatIsOnTopOf(obj) {
		var box = obj.el.getBoundingClientRect(),
			w = box.right - box.left,
			h = box.bottom - box.top,
			midX = box.left + w/2,
			midY = box.top + h/2,
			objOnTop = document.elementFromPoint(midX, midY);
		return objOnTop;
	}
	
	function detectCollisions() {
			var
				objOnTop = whatIsOnTopOf(me.kc),
				playerOnTop = objOnTop.__player,
				i;
				
			if (objOnTop !== me.kc.el) {
				if (me.canEatMunchers) { 
					if (!playerOnTop.isEaten()) {
						playerOnTop.die();
						munchersEaten++;
						me.setScore(Math.pow(2, munchersEaten) * 100, true, true);
					}
				} else if (!playerOnTop.isEaten()){
					me.kc.die()
				};
			}
			
			for (i=0; i<me.dots.length; i++) {
				var dot = me.dots[i];
				objOnTop = whatIsOnTopOf(dot);
				
				if (objOnTop === me.kc.el) {
					dot.stop();
					me.dots.splice(i, 1);
					
					if (dot.el.classList.contains('pill')) {
						me.setScore(50, true);
						me.setState('pill-eaten');
					} else {
						me.setScore(10, true);
					}
					me.dotSpeed -= 250;
					if (me.dots.length === 0) {
						me.reset(true);
					}
				}
			}
	}
	
	
	me.setState = function (state) {
		maze.setState(state);
		switch(state){
			case 'pill-eaten':
				clearTimeout(stateTimeout);
				stateTimeout = setTimeout(function() {
					me.setState('pill-wearing-out');
				}, 8000);
				game.canEatMunchers = true;
				break;
			case 'pill-wearing-out':
				stateTimeout = setTimeout(function() {
					me.setState('');
				}, 2000);
				break;
			case '':
				clearTimeout(stateTimeout);
				game.canEatMunchers = false;
				
				if (me.munchers) {
					for (var i = 0; i < me.munchers.length; i++) {
						me.munchers[i].reincarnate();
					}
					munchersEaten = 0;
				}
				break;
			}
	};
	
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
	}
	
	
	me.start = function () {
		maze.make(9, 7);
		createDots();
		createKC();
		createDen();
		createMunchers();
		me.dotSpeed = 3000;
		me.setState('');
		collisionInterval = setInterval(detectCollisions, 100);
	}
	
	me.init = function () {
		bonusDisplayEl.addEventListener('animationend', bonusDisplayAnimationEnd);
		me.start();
	}
	
	
};


game.init();
