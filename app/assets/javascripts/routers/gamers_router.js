ChessApplication.Routers.GamesRouter = Backbone.Router.extend({

  initialize: function($rootEl, current_users_games, open_games, friendships, userId, pusher) {
    this.$rootEl = $rootEl;
    this.current_users_games = current_users_games;
    this.open_games = open_games;
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
    console.log(this.open_games);
    var that = this;

    that.closePreviousView();

    that.currentView = new ChessApplication.Views.GamesListView({
      collection: that.current_users_games,
      userId: that.userId
    });

    that.$rootEl.html(that.currentView.render());
  },

  show_game: function(id) {
    var that = this;

    that.closePreviousView();

    var game = that.current_users_games.get(id);
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
      open_games: that.open_games,
      friendships: that.friendships,
      userId: that.userId
    });

    that.$rootEl.html(that.currentView.render());
  },

  show_user: function(id) {
    var that = this;

    that.closePreviousView();

    var user = new ChessApplication.Models.User({id: parseInt(id, 10) });
    user.fetch({
      success:function() {
        that.currentView = new ChessApplication.Views.UserDetailView({
          pusher: that.pusher,
          model: user,
          userId: that.userId
        });
        that.$rootEl.html(that.currentView.render());
      }
    });
  }

});
