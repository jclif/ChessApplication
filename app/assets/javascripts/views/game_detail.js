ChessApplication.Views.GameDetailView = Backbone.View.extend({
  render: function() {
    var that = this;

    var renderedContent = JST["games/detail"]({
      game: that.model
    });

    that.$el.html(renderedContent);
    return that;
  }
})