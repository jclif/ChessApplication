ChessApplication.Views.NewGameView = Backbone.View.extend({

  template: JST["games/new"],

  events: {
    "click button.submit": "submit"
  },

  render: function() {
    var that = this;

    that.$el.html(that.template());

    return that.$el;
  },

  submit: function(event) {
    event.preventDefault();
    var that = this;

    var formData = $(event.currentTarget).closest('form').serializeJSON();
    var game = new ChessApplication.Models.Game(formData.game);

    that.collection.add(game);
    game.save();
    Backbone.history.navigate("#/");
  }
});
