ChessApplication.Routers.GamesRouter = Backbone.Router.extend({

  initialize: function($rootEl, games, userId) {
    this.$rootEl = $rootEl;
    this.games = games;
    this.userId = userId;
    this.pusher = new Pusher('aa4b1aece38d355f8433');
    this.currentView = null;
  },

  routes: {
    "": "index",
    "games/new": "new_game",
    "games/:id": "show"
  },

  closePreviousView: function() {
    if (this.currentView !== null) {
      this.currentView.dispose();
    }
  },

  index: function() {
    var that = this;

    that.closePreviousView();

    that.currentView = new ChessApplication.Views.GamesListView({
      collection: that.games,
      pusher: that.pusher,
      userId: that.userId
    });

    that.$rootEl.html(that.currentView.render());
  },

  show: function(id) {
    var that = this;

    that.closePreviousView();

    //var game = that.games.findWhere({ id: parseInt(id, 10) });
    var game = that.games.get(id);
    that.currentView = new ChessApplication.Views.GameDetailView({
      model: game,
      pusher: that.pusher,
      userId: that.userId
    });

    that.$rootEl.html(that.currentView.render());
  },

  new_game: function() {
    var that = this;

    that.closePreviousView();

    that.currentView = new ChessApplication.Views.NewGameView({
      collection: that.games
    });

    that.$rootEl.html(that.currentView.render());
  }
});
