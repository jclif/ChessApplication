ChessApplication.Views.GamesListView = Backbone.View.extend({

  template: JST["games/list"],

  initialize: function () {
    var that = this;
    that.userId = that.options.userId;

    var renderCallback = that.render.bind(that);
    that.listenTo(that.collection, "add", renderCallback);
    that.listenTo(that.collection, "change", renderCallback);
    that.listenTo(that.collection, "reset", renderCallback);
    that.listenTo(that.collection, "remove", renderCallback);
    that.listenTo(that.collection, "destroy", renderCallback);
  },

  dispose: function() {
    var that = this;

    that.remove();
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      games: that.collection
    }));

    return that.$el;
  }
});
