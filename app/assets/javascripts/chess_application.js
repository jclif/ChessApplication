window.ChessApplication = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function($rootEl, gamesData) {
    var games = new ChessApplication.Collections.Games(gamesData);

    new ChessApplication.Routers.GamesRouter($rootEl, games);
    Backbone.history.start();
  }
};


