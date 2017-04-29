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
		console.log('v');
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
					console.log(i, j);
					me.setWall(i, j, 'w', 'remove');
					wallCounter = 0;
				}
			}
		}
		console.log('h')
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
					console.log(i, j);
					me.setWall(i, j, 'n', 'remove');
					wallCounter = 0;
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
	
	me.clear = function () {
		me.el.innerHTML = '';
	}
	 
	me.make = function (w, h) {
		me.width = w;
		me.height = h;
		me.clear();
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
		removeThreeInARow();
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
		me.el.className = `dot ${(classes || '')} player`;
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
 *	KC
 */

var KC = function(x, y) {
	var 
		me = this,
		lastCmd,
		isMoving = false,
		isSoundPlaying = false;
	
	me.x = x;
	me.y = y;
	me.dir = null;
	me.el = null;
	
	angleKeyMapping = [];
	angleKeyMapping[360] = 'ArrowRight';
	angleKeyMapping[0] = 'ArrowRight';
	angleKeyMapping[90] = 'ArrowUp';
	angleKeyMapping[180] = 'ArrowLeft';
	angleKeyMapping[270] = 'ArrowDown';
	
	function playSound() {
		if (!isSoundPlaying) {
			game.sounds['kc-move'].play();
			isSoundPlaying = true;
		}
	}
	
	function stopSound() {
		game.sounds['kc-move'].pause();
		isSoundPlaying = false;
	}
	
	function swipeEvent(e) {
		var data = e.detail.data[0],
			dir = data.currentDirection;
		
		if ((0 <= dir && dir<= 45) || (315 <= dir && dir <= 360)) {
			moveHelper(e, 'ArrowRight');
		} else if (46 <= dir && dir <= 135) {
			moveHelper(e, 'ArrowUp');
		} else if (136 <= dir && dir <= 225) {
			moveHelper(e, 'ArrowLeft');
		} else {
			moveHelper(e, 'ArrowDown');
		}
		
		console.log(dir, data.currentDirection	);
		if (dir) {
			moveHelper(e, dir);
		}
	}

	function move(e) {
		moveHelper(e, e.key);
	}
	
	function moveHelper(e, key) {
		//me.el.style.animationPlayState=''; //me.el.classList.remove('paused');
		switch (key) {
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
				playSound();
				
				me.el.classList.add('move', lastCmd);
			}
		} else {
			me.el.classList.remove('move', 'n', 's', 'e', 'w');
			stopSound();
			isMoving = false;
		}
	}
	
	me.die = function () {
		me.el.addEventListener('animationend', me.reincarnate);
		me.el.classList.remove('n', 's', 'e', 'w');
		me.el.classList.add('die');
		stopSound();
		isSoundPlaying=false;
		game.sounds['kc-die1'].play();
		game.stopPlayers();
		document.removeEventListener('keydown', move);
		document.removeEventListener('keyup', stop);
		
	}
	
	me.reincarnate = function () {
		me.el.removeEventListener('animationend', me.reincarnate);
		me.el.classList.remove('die');
		me.el.classList.add('dead');
		
		game.lives --;
		if (game.lives === 0) {
			game.showGameOver();
		} else {
			setTimeout(
				function() {
					game.reset(true)
				}, 
			1);
		}
		
	}
	
	function stop(e) {
		e.preventDefault();
		/* me.el.classList.remove('move', 'n', 's', 'e', 'w');	
		game.sounds['kc-move'].stop();
		lastCmd = ''; */
		//me.el.style.animationPlayState='paused'; //classList.add('paused');
	}
	
	function initGestures() {
		var activeRegion = ZingTouch.Region(document.body);
		activeRegion.bind(maze.el, 'swipe', swipeEvent)
	}
	
	function init() {
		me.el = ce('div');
		me.el.className = 'kc player';
		maze.putInCell(me.el, x, y);
		
		document.addEventListener('keydown', move);
		document.addEventListener('keyup', stop);
		initGestures();
		me.el.addEventListener('animationend', animationendHandler);
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
		game.sounds['muncher-eaten'].play();
	}
	
	me.reincarnate = function () {
		me.el.classList.remove('eaten');
	}
	
	function init() {
		me.el = ce('div');
		
		me.el.__player = me;
		
		me.el.addEventListener('animationend', animationendHandler);
		me.el.className = `muncher muncher-${index} player`;
		
		me.el.style.animationDuration = me.speed + 'ms';
		maze.putInCell(me.el, x, y);
		setTimeout(go, 1);
		
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
		document.addEventListener('keydown', keyDownClickEvent);
		document.addEventListener('click', keyDownClickEvent);
		document.addEventListener('touchstart', keyDownClickEvent);
		bodyEl.className = 'demo-mode';
		slide1();
	}
	
	function keyDownClickEvent(e) {
		if (e.key === ' ' || e.type === 'click') {
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
			<div id="slide1-3" class="slide"></div>
			<div id="slide1-4" class="slide">
				<div id="kc-demo" class="kc player move e"></div>
			</div>
		`;
		me.showLetterByLetter(document.getElementById('slide1-1'), 'Useragentman presents', 0, 100, slide1a);
		
		kcDemoEl = document.getElementById('kc-demo');
		kcDemoEl.addEventListener('animationend', stopKC);
	}
	
	function slide1a() {
		logoEl = document.getElementById('slide1-2');
		logoEl.addEventListener('transitionend', slide1b);
		logoEl.className += ' animate';
	}
	
	function slide1b(e) {
		
		if (e.propertyName === 'opacity') {
			me.showLetterByLetter(document.getElementById('slide1-3'), "Press Space To Start", 0, 100);
		}
		
	}
	
	function stopKC(e) {
		kcDemoEl.classList.remove('move', 'e');
	}
	
	me.stop = function () {
		demoEl.innerHTML = '';
		bodyEl.className = '';
		document.removeEventListener('keydown', keyDownClickEvent);
		document.removeEventListener('click', keyDownClickEvent);
		document.removeEventListener('touchstart', keyDownClickEvent);
	}
	
	me.showLetterByLetter = function (targetEl, message, index, interval, callback) {		
		if (index < message.length) { 
			targetEl.innerHTML += `<span class="char-${index}">${message[index++]}</span>`; 
			setTimeout(
				function () {
					requestAnimationFrame(
						function () {
							me.showLetterByLetter(targetEl, message, index, interval, callback);
						}
					)
				}, interval
			); 
		} else if (callback){
			callback();
		}
	}
}

var preloader = new function () {
	var me = this,
		body = document.body,
		preloadNames = body.dataset.preload.split(','),
		imageDir = body.dataset.imagedir,
		images = [],
		numLoaded = 0,
		el = document.getElementById('preloader');
		
		function imageErrorHandler(e) {
			console.error(`Error: invalid image ${e.target.src}`);
			imageLoadHandler();
		}
		
		
		function imageLoadHandler() {
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
			for (i = 0; i < preloadNames.length; i++) {
				var image = new Image();
				image.onload = imageLoadHandler;
				image.onError = imageErrorHandler;
				image.src = `${imageDir}/${preloadNames[i]}.gif`;
				images.push(image);
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
		munchersEaten = 0;
	
	me.dots = Array(6),
	me.munchers = Array(3),
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
			setBonusDisplay(box.left, box.top, n);
		}
	}
	
	function setLives () {
		livesEl.innerHTML = '';
		var i;
		for (i=1; i<=me.lives; i++) {
			livesEl.innerHTML += '<span class="kc-life"></span>';
		}
	}
	
	function setHighScore(s) {
		highScore = s;
		highScoreEl.innerHTML = s;
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
		game.sounds['kc-move'].pause();
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
				me.dots[i] = new Dot(x, y, 'pill');
				me.dots[i + 1] = new Dot (x, (y==1 ? y + 1 : y - 1));
				me.dots[i + 2] = new Dot ((x==1 ? x + 1 : x - 1), y);
				i+=3;;
			}
		}
	}
	
	function createKC() {
		me.kc = new KC(5, 4);
	}
	
	function createDen() {
		me.den = new MuncherDen(5, 5);
	}
	
	function createMunchers() {
		var i;
		
		for (i=0; i<me.munchers.length; i++) {
			me.munchers[i] = new Muncher(5 , 5, 'n', 350 + 100 * i, i);
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
			
			/*
			 * Only if playerOnTop is a muncher.
			 */
			if (playerOnTop) {
				if (objOnTop !== me.kc.el) {
					if (me.canEatMunchers) { 
						if (!playerOnTop.isEaten()) {
							playerOnTop.die();
							munchersEaten++;
							me.setScore(Math.pow(2, munchersEaten) * 100, true, true);
						}
					} else if (!playerOnTop.isEaten()){
						me.kc.die();
						if (score > highScore) {
							setHighScore(score);
						}
					};
				}
			}
			
			for (i=0; i<me.dots.length; i++) {
				var dot = me.dots[i];
				objOnTop = whatIsOnTopOf(dot);
				
				if (objOnTop === me.kc.el) {
					dot.stop();
					me.dots.splice(i, 1);
					
					if (dot.el.classList.contains('pill')) {
						game.sounds['eat-pill'].play();
						me.setScore(50, true);
						me.setState('pill-eaten');
					} else {
						game.sounds['eat-dot'].play();
						me.setScore(10, true);
					}
					me.dotSpeed -= 250;
					if (me.dots.length === 0) {
						me.reset(true);
					}
				}
			}
			requestAnimationFrame(detectCollisions);
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
				me.sounds['warning'].play();
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
		me.lives = 3;
		me.reincarnate();
	}
	
	me.reincarnate = function () {
		maze.clear();
		demo.stop();
		showIntro(startLevel);
	}
	
	function showIntro(callback) {
		overlayEl.className = '';
		demo.showLetterByLetter(overlayEl, 'Ready Player 1', 0, 100, function () {
			setTimeout(function () {
				overlayEl.innerHTML = '';
				overlayEl.className = 'hidden';
				callback();
			}, 1000);
		});
	}
	
	me.showGameOver = function () {
		overlay.className = '';
		demo.showLetterByLetter(overlayEl, 'Game Over', 0, 100, function () {
			setTimeout(function () {
				overlayEl.innerHTML = '';
				overlayEl.className = 'hidden';
				demo.start();
			}, 3000);
		});
	}
	
	function startLevel() {
		maze.make(9, 7);
		createDots();
		createKC();
		createDen();
		createMunchers();
		setLives();
		me.dotSpeed = 3000;
		me.setState('');
		collisionInterval = requestAnimationFrame(detectCollisions, 100);
	}
	
	function initSounds() {
		var soundFiles = ['eat-dot', 'eat-pill', 'kc-die1', 'muncher-eaten', 'warning', 'kc-move'],
			i;
			
		for (var i=0; i<soundFiles.length; i++) {
			var file = soundFiles[i];
			me.sounds[file] = new Howl({
				autoplay: (i === 'kc-move'),
				src: ['sounds/' + file + '.wav'],
				loop: (i === 'kc-move')
			});
		}
		
		me.sounds['kc-move'].loop(true);
		me.sounds['kc-move'].play();
		me.sounds['kc-move'].pause();
		me.sounds['kc-move'].volume(0.1);
	}
	
	me.initHelper = function () {
		window.scrollTo(0, 1);
		bonusDisplayEl.addEventListener('animationend', bonusDisplayAnimationEnd);
		initSounds();
		demo.start();
	}
	
	me.init = function () {
		preloader.init(me.initHelper);
	}
};


game.init();
