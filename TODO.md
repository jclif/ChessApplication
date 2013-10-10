TODO
====
SO MUCH TO DO, SO LITTLE TIME

Move Logic
----------
* two pawn two-space moves on the same column deletes first pawn (wat) not sure what other symptoms this bug may cause
* diagonal right produces "undefined method `pos=' for nil:NilClas" on line 226

Back End
--------
###Game
* figure out who sent the move, and make sure current player is that user, else dont try_move
* when game is over, delete the game and create a pgn with all of the game details

###PGN
* implement them!!!

Front End
---------

###Prettify
* game index could be grid of updating miniboards, where first baord is plus icon for new game
* basic layout
* put move list in div and give it move numbers

###GameDetailView
* indicate whether it's your move
* indicate when in check/checkmate
* redirect to results page when game is over
* invert board for black
