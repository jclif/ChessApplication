ChessApplication.Views.NewGameView = Backbone.View.extend({
  events: {
    "click button.submit": "submit"
  },

  render: function() {
    var that = this;

    var renderedContent = JST["games/new"]();
    that.$el.html(renderedContent);
    return that;
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
