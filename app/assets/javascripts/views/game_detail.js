ChessApplication.Views.GameDetailView = Backbone.View.extend({
  events: {},

  render: function() {
    var that = this;

    var renderedContent = JST["games/detail"]({
      game: that.model,
      board: JSON.parse(that.model.attributes.current_board)
    });

    that.$el.html(renderedContent);
    return that;
  },
});