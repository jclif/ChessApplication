window.ChessApplication = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function($rootEl, gamesData, friendshipsData, userId) {
    var games = new ChessApplication.Collections.Games(gamesData);
    var friendships = new ChessApplication.Collections.Friendships(friendshipsData);

    new ChessApplication.Routers.GamesRouter($rootEl, games, friendships, userId);
    Backbone.history.start();
  }
};


