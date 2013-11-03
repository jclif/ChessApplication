window.ChessApplication = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function($rootEl, CurrUserData, CurrUserGamesData, OpenGamesData) {
    var that = this;

    var current_user = new ChessApplication.Models.User(CurrUserData);
    var current_users_games = new ChessApplication.Collections.Games(CurrUserGamesData);
    var open_games = new ChessApplication.Collections.Games(OpenGamesData);
    // var friendships = new ChessApplication.Collections.Friendships(friendshipsData);

    var pusher = new Pusher('bfb361cbdaac1e51c621');
    // Add Game Subscription
    var channel = pusher.subscribe('user_' + that.userId + '_channel');
    channel.bind("add_game", function(data){
      var game = new ChessApplication.Models.Game(data);
      current_users_games.add(game);
      var channel = pusher.subscribe('game_' + game.id + '_channel');
      channel.bind("update_game", function(data) {
        var model = current_users_games.get(data.id);
        current_users_games.add(model, {merge:true});
      });
      channel.bind("delete_game", function(data) {
        var model = current_users_games.get(data.id);
        model.trigger("destroy", that.model);
      });
    });
    // For each game already in collection:
    current_users_games.forEach(function(game) {
      // Update Game Sub
      var channel = pusher.subscribe('game_' + game.id + '_channel');
      channel.bind("update_game", function(data){
        var model = current_users_games.get(data.id);
        model.set(data);
      });
      // Delete Game Sub
      channel.bind("delete_game", function(data){
        current_users_games.remove(data.id);
      });
    });

    new ChessApplication.Routers.GamesRouter($rootEl, current_user, current_users_games, open_games, pusher);
    Backbone.history.start();
  }
};


