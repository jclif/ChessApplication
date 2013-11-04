ChessApplication.Views.NewGameView = Backbone.View.extend({

  initialize: function() {
    var that = this;

    that.pusher = that.options.pusher;
    that.currUserGames = that.options.currUserGames;
    that.openGames = that.options.openGames;
    that.currUser = that.options.currUser;
  },

  template: JST["games/new"],

  events: {
    "click button.submit": "submit"
  },

  dispose: function() {
    this.remove();
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      open_games: that.open_games,
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
    console.log(game);
    game.save({},{
      success: function(model, response, options) {
        var channel = that.pusher.subscribe('game_' + game.id + '_channel');
        channel.bind("update_game", function(data){
          var model = that.currUserGames.get(data.id);
          model.set(data);
        });
        that.currUserGames.add(game);
        Backbone.history.navigate("/", true);
      },
      error: function(model, response, options) {
        Backbone.history.navigate("/", true);
      }
    });
  }
});
