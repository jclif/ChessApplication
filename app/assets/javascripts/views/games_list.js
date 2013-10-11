ChessApplication.Views.GamesListView = Backbone.View.extend({
  initialize: function () {
    var that = this;

    that.timer = setInterval(function () {
      that.collection.fetch({
        add: true,
        update: true,
        success: function (model) {
          console.log('fetch');
        }
      });
      console.log(that.collection);
    }, 5000);

    var renderCallback = that.render.bind(that);
    that.listenTo(that.collection, "add", renderCallback);
    that.listenTo(that.collection, "change", renderCallback);
    that.listenTo(that.collection, "reset", renderCallback);
  },

  close: function() {
    var that = this;

    clearInterval(that.timer);
  },


  events: {},

  render: function() {
    var that = this;

    console.log(that.collection);
    var renderedContent = JST["games/list"]({
      games: that.collection
    });

    that.$el.html(renderedContent);
    return that;
  }
});
