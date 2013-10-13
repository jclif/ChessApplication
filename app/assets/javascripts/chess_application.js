window.ChessApplication = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function($rootEl, gamesData, userId) {
    var games = new ChessApplication.Collections.Games(gamesData);
    new ChessApplication.Routers.GamesRouter($rootEl, games, userId);
    Backbone.history.start();
  }
};


