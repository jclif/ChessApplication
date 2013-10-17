ChessApplication.Routers.GamesRouter = Backbone.Router.extend({

  initialize: function($rootEl, games, friendships, userId, pusher) {
    this.$rootEl = $rootEl;
    this.games = games;
    this.friendships = friendships;
    this.userId = userId;
    this.currentView = null;
    this.pusher = pusher;
  },

  routes: {
    "": "index",
    "games/new": "new_game",
    "games/:id": "show_game",
    "users/:id" : "show_user"
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
      userId: that.userId
    });

    that.$rootEl.html(that.currentView.render());
  },

  show_game: function(id) {
    var that = this;

    that.closePreviousView();

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
  },

  show_user: function(id) {
    var that = this;

    that.closePreviousView();

    // if id === that.userId, this profile is the current users, and the friendships collection should be passed in,
    // otherwise, a database call should be made to collect that users friendships, which can then be passed in
    var user = new ChessApplication.Models.User({id: parseInt(id, 10) });
    user.fetch({
      success:function() {
        that.currentView = new ChessApplication.Views.UserDetailView({
          pusher: that.pusher,
          model: user
        });
        that.$rootEl.html(that.currentView.render());
      }
    });
  }

});
