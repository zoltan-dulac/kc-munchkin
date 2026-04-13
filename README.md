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

No overall fancy framework (i.e. React, Angular, etc) was used for this 
project -- this is coded in plain old Javascript.  I did, however, make use of a
few cool things available on the Internet: 

- [sfMaker](https://www.leshylabs.com/apps/sfMaker/) was used to generate
the mp3 sound effects for this game 
- [Howler](https://howlerjs.com/) is used to play the mp3 files.
- The sprites used in the game were created by Illya Wilson, which were originally
designed for an Atari 7800 port of the game.  I discovered his work on
[this thread](http://atariage.com/forums/topic/220324-kc-munchkin/page-3)
of the [Atari Age website](http://atariage.com/forums/topic/220324-kc-munchkin/page-3).
Many thanks to both Illya and Atari Age -- without the both of you this game is
a lot better than it would have been.
- the sprites were converted from png to SVG using
[pixel2svg](http://florian-berger.de/en/software/pixel2svg/).  This was necessary
since scaling PNGs as a background image without anti-aliasing is currently
impossible with IE/Edge.
- The algorithm that the munchers (a.k.a "ghosts") use makes use of 
[this implementation of Dijkstra's algorithm](https://github.com/mburst/dijkstras-algorithm).
- [These more efficient implementations of setTimeout/setInterval](https://gist.github.com/joelambert/1002116)
were used throughout the code.
- The random mazes uses [this code](https://rosettacode.org/wiki/Maze_generation#JavaScript)
as a basis.  It was modified to reduce dead ends and make it more suitable 
for K.C. Munchkin.

Music may be added in a future release.  The following links are being used as inspiration.
 * Idea for music: http://plnkr.co/edit/se2OIUBRxZsa3lUPtOJp?p=preview
 * https://www.sheetmusicdirect.com/se/ID_No/117773/Product.aspx


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
