window.ChessApplication = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  initialize: function($rootEl, currUserId, CurrUserGamesData, OpenGamesData) {
    var that = this;

    var currUser = new ChessApplication.Models.User({id: currUserId });
    var currUserGames = new ChessApplication.Collections.Games(CurrUserGamesData);
    var openGames = new ChessApplication.Collections.Games(OpenGamesData);
    var pusher = new Pusher('bfb361cbdaac1e51c621');

    currUser.fetch({
      success:function() {
        that.pusherInit(pusher, currUser, currUserGames, openGames);
        new ChessApplication.Routers.GamesRouter($rootEl, currUser, currUserGames, openGames, pusher);
        Backbone.history.start();
      }
    });
  },

  pusherInit: function(pusher, currUser, currUserGames, openGames) {
    // Add Game Subscription
    var channel = pusher.subscribe('user_' + currUser.id + '_channel');
    channel.bind("update_profile", function(data) {
      currUser.set(data);
    });
    channel.bind("add_game", function(data) {
      var game = new ChessApplication.Models.Game(data);
      currUserGames.add(game);
      var channel = pusher.subscribe('game_' + game.id + '_channel');
      channel.bind("update_game", function(data) {
        var model = currUserGames.get(data.id);
        currUserGames.add(model, {merge:true});
      });
      channel.bind("delete_game", function(data) {
        var model = currUserGames.get(data.id);
        model.trigger("destroy", that.model);
      });
    });
    // For each game already in collection:
    currUserGames.forEach(function(game) {
      // Update Game Sub
      var channel = pusher.subscribe('game_' + game.id + '_channel');
      channel.bind("update_game", function(data){
        var model = currUserGames.get(data.id);
        model.set(data);
      });
      // Delete Game Sub
      channel.bind("delete_game", function(data){
        currUserGames.remove(data.id);
      });
    });
  }
};
