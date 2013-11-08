ChessApplication.Models.Game = Backbone.Model.extend({
  urlRoot : '/games',

  pusherInit: function(pusher, currUserGames) {
    var that = this;

    var channel = pusher.subscribe('game_' + that.id + '_channel');

    channel.bind("update_game", function(data){
      var model = currUserGames.get(data.id);
      model.set(data);
    });

    channel.bind("delete_game", function(data) {
      var model = currUserGames.get(data.id);
      model.trigger("destroy", model);
    });
  }
});
