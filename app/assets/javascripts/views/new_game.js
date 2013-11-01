ChessApplication.Views.NewGameView = Backbone.View.extend({

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
      open_games: that.options.open_games,
      friendships: that.options.friendships
    }));

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
        console.log('success');
        // that.collection.create(response);
        that.collection.add(game);
        Backbone.history.navigate("/", true);
      },
      error: function(model, response, options) {
        console.log('error');
        Backbone.history.navigate("/", true);
      }
    });
  }
});
