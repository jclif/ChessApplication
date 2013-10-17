ChessApplication.Views.GamesListView = Backbone.View.extend({

  template: JST["games/list"],

  initialize: function () {
    var that = this;
    that.userId = that.options.userId;
    // Pusher
    that.pusher = that.options.pusher;
    // Add Game Sub
    var channel = that.pusher.subscribe('user_' + that.userId + '_channel');
    channel.bind("add_game", function(data){
      console.log("add_game");
      var game = new ChessApplication.Models.Game(data);
      that.collection.add(game);
    });
    // For each game already in collection:
    that.collection.forEach(function(game) {
      // Update Game Sub
      var channel = that.pusher.subscribe('game_' + game.id + '_channel');
      channel.bind("update_game", function(data){
        console.log("update_game");
        var model = that.collection.get(data.id);
        that.collection.add(model, {merge: true});
      });
      // Delete Game Sub
      channel.bind("delete_game", function(data){
        console.log("delete_game");
        var model = that.collection.get(data.id);
        that.model.trigger("destroy", that.model);
      });
    });

    var renderCallback = that.render.bind(that);
    that.listenTo(that.collection, "add", renderCallback);
    that.listenTo(that.collection, "change", renderCallback);
    that.listenTo(that.collection, "reset", renderCallback);
    that.listenTo(that.collection, "change", renderCallback);
    that.listenTo(that.collection, "destroy", renderCallback);
  },

  dispose: function() {
    var that = this;

    that.remove();
    console.log(that.pusher);
    // unsubscribe from pusher trigger for games in collection
    that.collection.forEach(function(game) {
      that.pusher.unsubscribe('game_' + game.id + '_channel');
    });
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      games: that.collection
    }));

    return that.$el;
  }
});
