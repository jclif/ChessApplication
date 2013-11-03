ChessApplication.Routers.GamesRouter = Backbone.Router.extend({

  initialize: function($rootEl, current_user, current_users_games, open_games, pusher) {
    this.$rootEl = $rootEl;
    this.current_user = current_user;
    this.current_users_games = current_users_games;
    this.open_games = open_games;
    this.pusher = pusher;
    this.currentView = null;
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
      collection: that.current_users_games,
      userId: that.current_user.id
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
      userId: that.current_user.id
    });

    that.$rootEl.html(that.currentView.render());
  },

  new_game: function() {
    var that = this;

    that.closePreviousView();

    that.currentView = new ChessApplication.Views.NewGameView({
      open_games: that.open_games,
      friendships: that.friendships,
      userId: that.current_user.id
    });

    that.$rootEl.html(that.currentView.render());
  },

  show_user: function(id) {
    var that = this;

    that.closePreviousView();

    if (id === that.current_user.id) {
      that.currentView = new ChessApplication.Views.UserDetailView({
        pusher: that.pusher,
        model: that.current_user,
        userId: that.current_user.id
      });
      that.$rootEl.html(that.currentView.render());
    } else {
      var user = new ChessApplication.Models.User({id: parseInt(id, 10) });
      user.fetch({
        success:function() {
          that.currentView = new ChessApplication.Views.UserDetailView({
            pusher: that.pusher,
            model: user,
            userId: that.current_user.id
          });
          that.$rootEl.html(that.currentView.render());
        }
      });
    }
  }

});
