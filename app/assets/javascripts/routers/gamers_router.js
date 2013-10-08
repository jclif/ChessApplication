ChessApplication.Routers.GamesRouter = Backbone.Router.extend({
  initialize: function($rootEl, games) {
    this.$rootEl = $rootEl;
    this.games = games;
  },

  routes: {
    "": "index"
  },

  index: function() {
    var that = this;

    var gamesListView = new ChessApplication.Views.GamesListView({
      collection: that.games
    })

    that.$rootEl.html(gamesListView.render().$el);
  }
});