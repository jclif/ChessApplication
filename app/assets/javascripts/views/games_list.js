ChessApplication.Views.GamesListView = Backbone.View.extend({

  template: JST["games/list"],

  initialize: function () {
    var that = this;
    that.userId = that.options.userId;
    // Pusher
    that.pusher = that.options.pusher;
    that.channelName = 'user_' + that.userId + '_channel';
    that.channel = that.pusher.subscribe(that.channelName);
    // Subscriptions
    that.channel.bind("update_games", function(data){
      console.log("update_game");
      console.log(data);
      console.log(that.collection);

      var gameId = data.id;
      var model = that.collection.get(gameId);
    });
    that.channel.bind("add_game", function(data){
      console.log("add_game");
      console.log(data);
      var game = new ChessApplication.Models.Game(data);
      that.collection.add(game);
    });
    that.channel.bind("delete_game", function(data){
      console.log("delete_game");
      console.log(data);
    });

    var renderCallback = that.render.bind(that);
    that.listenTo(that.collection, "add", renderCallback);
    that.listenTo(that.collection, "change", renderCallback);
    that.listenTo(that.collection, "reset", renderCallback);
    that.listenTo(that.collection, "change", renderCallback);
    that.listenTo(that.collection, "destroy", renderCallback);
  },

  dispose: function() {
    this.remove();
    this.pusher.unsubscribe(this.channelName);
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      games: that.collection
    }));

    return that.$el;
  }
});
