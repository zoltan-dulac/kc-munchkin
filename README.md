# kc-munchkin

This is a clone of K.C. Munchkin, a video game from the 1980s that my favourite
for the Odyssey².  The game does not use HTML5 Canvas -- the animations are done
via HTML DOM elements animated using CSS animations.  It was done this way 
becuase:

1. I was lazy and wanted to use document.elementFromPoint to do
collision detection.
2. I was lazy and wanted to use CSS to make the game responsive.
3. I really wanted to find out if it was possible to
do a game without Canvas that would work on a mobile device as well as a full
blown computer.

The game also doesn't use full-blown ES6.  I did this because I thought it would
be funny to keep the retro feel of the game with the retro version of JavaScript. 

The original game for the Odyssey² was created by 
[Ed Averett](http://www.the-nextlevel.com/odyssey2/articles/edaverett/), who 
created the majority of the games for the system.

The graphics for this game were lifted from 
[this AtariAge forum page](http://atariage.com/forums/topic/220324-kc-munchkin/page-3),
which I believe were preliminary comps for a homebrew Atari 7800 version of the
game.  The maze algorithm is a modified version of 
[this maze algorithm from Rosetta Code](https://rosettacode.org/wiki/Maze_generation#JavaScript).

No frameworks were used except for the [Howler](https://howlerjs.com/) for
the sound effects.

This game is still in heavy development.  Right now, there is one level that
plays over and over again.  Future revisions will have different levels, including:

- a level that plays like K.C.'s Crazy Chase.
- a level that will have trap doors.
- a level that has a mutating maze (i.e. walls disappear and hide)
- a level that has an invisible maze
- possibly more levels.

This game also doesn't have any permission from Ed Averett.  I do intend to 
ask for permission when I can find out how to get a hold of him.  This game
is not intended to make money -- it is a labour of love.  It is forbidden to
use this game to make money.  Please feel free to download and hack, but not
to exploit for profit. :-)
