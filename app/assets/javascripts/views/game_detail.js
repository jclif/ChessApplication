ChessApplication.Views.GameDetailView = Backbone.View.extend({
  initialize: function () {
    var that = this;

    setInterval(function () {
      that.model.fetch();
    }, 1000);

    var renderCallback = that.render.bind(that);
    that.listenTo(that.model, "change", renderCallback);
  },

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