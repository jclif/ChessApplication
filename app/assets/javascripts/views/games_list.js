ChessApplication.Views.GamesListView = Backbone.View.extend({
  events: {},

  render: function() {
    var that = this;

    var renderedContent = JST["games/list"]({
      games: that.collection
    });

    that.$el.html(renderedContent);
    return that;
  },
});
