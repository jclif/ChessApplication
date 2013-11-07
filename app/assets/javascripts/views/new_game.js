ChessApplication.Views.NewGameView = Backbone.View.extend({

  initialize: function() {
    var that = this;

    that.pusher = that.options.pusher;
    that.currUserGames = that.options.currUserGames;
    that.openGames = that.options.openGames;
    that.currUser = that.options.currUser;

    that.pusherInit();
  },

  template: JST["games/new"],

  events: {
    "click #play-a-friend button.submit": "inviteFriend",
    "click #open-games tr": "acceptOpenGame"
  },

  dispose: function() {
    this.remove();
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      openGames: that.openGames,
      currUser: that.currUser
    }));

    _.defer(function() {

      $('#new-game-tabs').tabs();

    });

    return that.$el;
  },

  submit: function(event) {
    event.preventDefault();
    var that = this;

    var formData = $(event.currentTarget).closest('form').serializeJSON();
    var game = new ChessApplication.Models.Game(formData.game);
    game.save({},{
      success: function(model, response, options) {
        game.pusherInit(that.pusher, that.currUserGames);
        that.currUserGames.add(game);
        Backbone.history.navigate("/", true);
      },
      error: function(model, response, options) {
        Backbone.history.navigate("/", true);
      }
    });
  },

  acceptOpenGame: function(event) {
    var that = this;

    gameId = $(event.currentTarget).attr("id");
    openGame = that.openGames.get(gameId);
    openGame.destroy({
      success: function(model, response) {
        console.log(response);
        var game = new ChessApplication.Models.Game(response);
        game.pusherInit(that.pusher, that.currUserGames);
        that.currUserGames.add(game);
      },
      error: function(response) {
        console.log(response);
      }
    });
  },

  pusherInit: function(event) {
  }
});
