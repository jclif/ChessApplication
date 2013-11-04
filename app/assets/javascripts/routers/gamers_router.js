ChessApplication.Routers.GamesRouter = Backbone.Router.extend({

  initialize: function($rootEl, currUser, currUserGames, openGames, pusher) {
    this.$rootEl = $rootEl;
    this.currUser = currUser;
    this.currUserGames = currUserGames;
    this.openGames = openGames;
    this.pusher = pusher;
    this.currentView = null;
  },

  routes: {
    "": "index",
    "games/new": "new_game",
    "games/:id": "show_game",
    "users/:id" : "show_user",

    '*notFound': 'notFound'
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
      collection: that.currUserGames,
      userId: that.currUser.id
    });

    that.$rootEl.html(that.currentView.render());
  },

  new_game: function() {
    var that = this;

    that.closePreviousView();

    that.currentView = new ChessApplication.Views.NewGameView({
      open_games: that.openGames,
      currUser: that.currUser
    });

    that.$rootEl.html(that.currentView.render());
  },

  show_game: function(id) {
    var that = this;

    that.closePreviousView();

    var game = that.currUserGames.get(id);
    that.currentView = new ChessApplication.Views.GameDetailView({
      model: game,
      pusher: that.pusher,
      userId: that.currUser.id
    });

    that.$rootEl.html(that.currentView.render());
  },

  show_user: function(id) {
    var that = this;

    that.closePreviousView();

    if (id === that.currUser.id) {
      that.currentView = new ChessApplication.Views.UserDetailView({
        pusher: that.pusher,
        model: that.currUser,
        userId: that.currUser.id
      });
      that.$rootEl.html(that.currentView.render());
    } else {
      var user = new ChessApplication.Models.User({id: parseInt(id, 10) });
      user.fetch({
        success: function() {
          that.currentView = new ChessApplication.Views.UserDetailView({
            pusher: that.pusher,
            model: user,
            userId: that.currUser.id
          });
          that.$rootEl.html(that.currentView.render());
        },
        error: function() {
          that.notFound();
        }
      });
    }
  },

  notFound: function() {
    var that = this;

    that.closePreviousView();
    that.currentView = new ChessApplication.Views.PageNotFoundView();

    that.$rootEl.html(that.currentView.render());
  }

});
