window.ChessApplication = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function($rootEl, gamesData, friendshipsData, userId) {
    var that = this;

    var games = new ChessApplication.Collections.Games(gamesData);
    var friendships = new ChessApplication.Collections.Friendships(friendshipsData);
    // Pusher
    var pusher = new Pusher('bfb361cbdaac1e51c621');
    // Add Game Sub
    var channel = pusher.subscribe('user_' + that.userId + '_channel');
    channel.bind("add_game", function(data){
      var game = new ChessApplication.Models.Game(data);
      games.add(game);
      var channel = pusher.subscribe('game_' + game.id + '_channel');
      channel.bind("update_game", function(data) {
        var model = games.get(data.id);
        games.add(model, {merge:true});
      });
      channel.bind("delete_game", function(data) {
        var model = games.get(data.id);
        model.trigger("destroy", that.model);
      });
    });
    // For each game already in collection:
    games.forEach(function(game) {
      // Update Game Sub
      var channel = pusher.subscribe('game_' + game.id + '_channel');
      channel.bind("update_game", function(data){
        var model = games.get(data.id);
        model.set(data);
      });
      // Delete Game Sub
      channel.bind("delete_game", function(data){
        games.remove(data.id);
      });
    });

    new ChessApplication.Routers.GamesRouter($rootEl, games, friendships, userId, pusher);
    Backbone.history.start();
  }
};


