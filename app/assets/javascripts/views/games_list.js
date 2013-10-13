ChessApplication.Views.GamesListView = Backbone.View.extend({
  initialize: function () {
    var that = this;
    that.userId = that.options.userId;
    that.pusher = that.options.pusher;
    console.log('user_' + that.userId + '_channel');
    that.channel = that.pusher.subscribe('user_' + that.userId + '_channel');
    that.channel.bind('update_games', function(data) {
      console.log(data);
    });

    // gutting this out in favor of pusher
    /*that.timer = setInterval(function () {
      that.collection.fetch({
        add: true,
        update: true,
        success: function (model) {
          console.log('fetch');
        }
      });
      console.log(that.collection);
    }, 5000);*/

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

    var renderedContent = JST["games/list"]({
      games: that.collection
    });

    that.$el.html(renderedContent);
    return that;
  }
});
