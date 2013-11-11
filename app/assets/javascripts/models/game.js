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
  },

  is_current_player: function(playerId) {
    var that = this;
    var result = false;

    if (that.attributes.current_player === "black") {
      if (playerId === that.attributes.black_user_id) {
        result = true;
      }
    } else {
      console.log("white's turn");
      if (playerId === that.attributes.white_user_id) {
        result = true;
      }
    }
    
    return result;
  }

});
