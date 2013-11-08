window.ChessApplication = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},


  initialize: function($rootEl, $navEl, currUserId, CurrUserGamesData) {
    var that = this;

    var currUser = new ChessApplication.Models.User({id: currUserId });
    var currUserGames = new ChessApplication.Collections.Games(CurrUserGamesData);
    var pusher = new Pusher('bfb361cbdaac1e51c621');

    currUser.fetch({
      success:function() {
        that.pusherInit(pusher, currUser, currUserGames);
        new ChessApplication.Routers.GamesRouter($rootEl, $navEl, currUser, currUserGames, pusher);
        Backbone.history.start();
      }
    });
  },

  pusherInit: function(pusher, currUser, currUserGames) {
    var channel = pusher.subscribe('user_' + currUser.id + '_channel');

    channel.bind("update_profile", function(data) {
      console.log(currUser);
      currUser.set(data);
      console.log(currUser);
    });

    channel.bind("add_game", function(data) {
      var game = new ChessApplication.Models.Game(data);
      game.pusherInit(pusher, currUserGames);
      currUserGames.add(game);
    });

    currUserGames.forEach(function(game) {
      game.pusherInit(pusher, currUserGames);
    });
  }
};
