TODO
====
SO MUCH TO DO, SO LITTLE TIME
 -  : complete
 *  : imcomplete
[*] : in progress

Move Logic
----------
- two pawn two-space moves on the same column deletes first pawn (wat) not sure what other symptoms this bug may cause
* diagonal right produces "undefined method `pos=' for nil:NilClas" on line 226
* trying to move black king late game produces "undefined method 'pos' for nil:NilClas" on line 653 of can_castle?
* more elegant solution than @moving
* lots of draw conditions (50-move rule,threefold repitition, offer,...)
* Move class instead of move_hashes

Back End
--------
###Game
- figure out who sent the move, and make sure current player is that user, else dont try_move
* when game is over, delete the game and create a pgn with all of the game details
* move all game logic to a better place, for organization karma (lib/chess perhaps?)

###PGN
* implement them!!!

Front End
---------

###Login
- flash errors that can be clicked to hide
- redirect to games#index

###Prettify
* game index could be grid of updating miniboards, where first baord is plus icon for new game
* basic layout
* put move list in div and give it move numbers

###GameDetailView
- indicate whether it's your move
[*] indicate when in check/checkmate
* redirect to results page when game is over
* invert board for black

###GameIndexView
* grid of current games that updates dynamically, with first board being plus icon that takes user to new game menu

###Navigation
* four nav menus, starting from top-left, clockwise: chess, settings, chat, social
* create box from each point of board to corner of screen, and pull menu icon toward center of board as cursor nears the point.
* on mouseover of menu icon, display submenu
