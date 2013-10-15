TODO
====
SO MUCH TO DO, SO LITTLE TIME
*  x  : complete
*  _  : imcomplete
* [x] : in progress

Maybe
-----
* _ notification feed, which keeps track of games where it's your turn, and game invites

Efficiency
----------
* _ instead of passing move list and rebuilding board every eval, which checks win state of all the past moves, just construct the board by parsing board state, and check game state once.
* _ dont parse move from coord to long alg, then back to coord. just pass the coords to the api
* x rip out long polling solution, and integrate pusher for move updates
* _ integrate pusher with chat functionality
* _ pass back list of legal moves to backbone so that the ui can validate without hitting server

Security
--------
* _ generate new api keys, and hide them (AWS S3, with environment variables, perhaps?)
* _ figure out whether pusher channels are exposed to malicious parties in some way (need to auth?)

FIX THIS BEFORE YOU DEPLOY!!!
=============================
* [x] set up pusher api keys
* _ remove pusher log thingy

Move Logic
----------
* x two pawn two-space moves on the same column deletes first pawn (wat) not sure what other symptoms this bug may cause
* _ diagonal right produces "undefined method `pos=' for nil:NilClas" on line 226
* _ trying to move black king late game produces "undefined method 'pos' for nil:NilClas" on line 653 of can_castle?
* _ more elegant solution than @moving
* _ lots of draw conditions (50-move rule,threefold repitition, offer,...)
* _ Move class instead of move_hashes

Back End
--------
###Game
* x figure out who sent the move, and make sure current player is that user, else dont try_move
* [x] when game is over, delete the game and create a pgn with all of the game details
* _ write algorith for updating elo after game
* _ move all game logic to a better place, for organization karma (lib/chess perhaps?)
* x add create game api
* _ add ability to create games between friends or random online user

###Messages
* _ implement them!!!

###PGN (ie, past game stats)
* [x] implement them!!!

Front End
---------

###Profile View
* x add dat sh%t
* x display basic stats (elo, id, etc)
* _ display associated info: ie, pgns (past games), friends, etfc
* _ GrApHsSsSsS &*$#&YI$(*#&%(#$&*!!!!!

###ChatViews (not sure how exactly this will work)
* _ add dat sh%t

###Login
* x flash errors that can be clicked to hide
* x redirect to games#index
* x fix url, ie, "/games/#/games/:id" (this was a dirty hack so that registration is disabled [also delete devise controller and fix root stuff])

###Prettify
* x game index could be grid of updating miniboards, where first baord is plus icon for new game
* _ basic layout
* _ put move list in div and give it move numbers

###GameDetailView
* x indicate whether it's your move
* x indicate when check
* x indicate when in checkmate
* _ indication when the move is being validated
* _ indicate when the move is invalid
* _ redirect to results page when game is over
* _ invert board for black

###GameListView
* x grid of current games that updates dynamically, with first board being plus icon that takes user to new game menu

###GameCreateView
* x add that sh%t
* _ create menus for different types of games, p vs p vs p vs ai, and match with random online user vs match with friend

###Navigation
* _ four nav menus, starting from top-left, clockwise: chess, settings, chat, social
* _ create box from each point of board to corner of screen, and pull menu icon toward center of board as cursor nears the point.
* _ on mouseover of menu icon, display submenu

InTeReStInG/cRaZy IdEaS
-----------------------
* _ sMs BaSeD aPi ViA tWiLiO
