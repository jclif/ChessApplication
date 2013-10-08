ChessApplication.Routers.GamesRouter = Backbone.Router.extend({
  initialize: function($rootEl, games) {
    this.$rootEl = $rootEl;
    this.games = games;
  },

  routes: {
    "": "index",
    "games/:id": "show"
  },

  index: function() {
    var that = this;

    var gamesListView = new ChessApplication.Views.GamesListView({
      collection: that.games
    })

    that.$rootEl.html(gamesListView.render().$el);
  },

  show: function(id) {
    var that = this;

    var game = _(that.games).findWhere({ id: parseInt(id) });
    var gameDetailView = new ChessApplication.Views.GameDetailView({
      model: game
    })

    that.$rootEl.html(taskDetailView.render().$el);
  }
});