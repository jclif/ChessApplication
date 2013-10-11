ChessApplication.Routers.GamesRouter = Backbone.Router.extend({
  initialize: function($rootEl, games) {
    this.$rootEl = $rootEl;
    this.games = games;
  },

  routes: {
    "": "index",
    "games/new": "new_game",
    "games/:id": "show"
  },

  index: function() {
    var that = this;

    var gamesListView = new ChessApplication.Views.GamesListView({
      collection: that.games
    });

    that.$rootEl.html(gamesListView.render().$el);
  },

  show: function(id) {
    var that = this;

    var game = that.games.findWhere({ id: parseInt(id, 10) });
    var gameDetailView = new ChessApplication.Views.GameDetailView({
      model: game
    });

    that.$rootEl.html(gameDetailView.render().$el);
  },

  new_game: function() {
    console.log('hi');
    var that = this;

    var newGameView = new ChessApplication.Views.NewGameView({
      collection: that.games
    });

    that.$rootEl.html(newGameView.render().$el);
  }
});
