TODO
====
SO MUCH TO DO, SO LITTLE TIME
*  x  : complete
*  _  : imcomplete
* [x] : in progress

FIX THIS BEFORE YOU DEPLOY!!!
-----------------------------
* x set up pusher api keys
* [x] configure capistrano
* _ remove pusher log thingy

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
###Users
* [x] add guest account
* x add omniauth support for gihutb
* x add omniauth support for facebook
* x add omniauth support for google
* _ profile images with paperclip

###Games
* x figure out who sent the move, and make sure current player is that user, else dont try_move
* x when game is over, delete the game and create a pgn with all of the game details
* x write algorith for updating elo after game
* _ move all game logic to a better place, for organization karma (lib/chess perhaps?)
* x add create game api
* [x] on game create, allow for autocompleting the opponents email, and picking color
* _ add ability to create games between friends or random online user

###Messages
* _ implement them!!!

###PGN (ie, past game stats)
* x implement them!!!

###Friendships
* [x] implement them!!!

###Notifications
* [x] a user can accept or deny friendships (perhaps as a field for the user/friendship model)
* _ a user can accept or deny games
* _ pending games and friendships could be aggregated into lists that drop down from different icons (game icon, friendships icon, etc), with buttons for accepting or denying

Front End
---------

###Pusher Listeners
* [x] initialize all collections initially, then set up pusher listeners for each of those models

###Profile View
* x add dat sh%t
* _ tabinate!@@#$#@$
* x display basic stats (elo, id, etc)
* [x] display associated info: ie, pgns (past games), friends, etfc
* _ search feature for past games
* _ allow user to iterate through past game moves
* _ GrApHsSsSsS &$#&YI$(#&%(#$&!!!!!
* _ if you click on the messages tab, the chat minimizes

###ChatViews (not sure how exactly this will work)
* _ add dat sh%t

###Login
* x flash errors that can be clicked to hide
* x redirect to games#index
* x fix url, ie, "/games/#/games/:id" (this was a dirty hack so that registration is disabled [also delete devise controller and fix root stuff])
* x button for github omniauth
* x button for facebook omniauth
* x button for google omniauth
* _ check valid login and jquery shake login-container if invalid
* [x] button for guest sign in
* [x] less ugly plz

###Prettify
* _ basic layout
* _ put move list in div and give it move numbers
* _ implement notification growl, where hidden box is filled with notification content (by pusher listener for current user) when it receives data, then slowly fades away

###GameDetailView
* x indicate whether it's your move
* x indicate when check
* x indicate when in checkmate
* _ indication when the move is being validated
* _ indicate when the move is invalid
* x results overlay when game is over
* _ invert board for black
* _ weird pusher error when channel not properly established (Pusher::HTTPError - end of file reached)

###GameListView
* x grid of current games that updates dynamically, with first board being plus icon that takes user to new game menu
* _ when cursor over game, more details!
* _ pagination, or some way of not displaying too many boards

###GameCreateView
* x add that sh%t
* x !!! fix redirect error
* _ radio buttons for color desired, or random
* _ create menus for different types of games, p vs p vs p vs ai, and match with random online user vs match with friend

###Navigation
* _ three nav menus, starting from top-left, clockwise: chess/social, notifications/settings/logout, chat
* _ create box from each point of board to corner of screen, and pull menu icon toward center of board as cursor nears the point.

InTeReStInG/cRaZy IdEaS
-----------------------
* _ sMs BaSeD aPi ViA tWiLiO
