ChessApplication.Views.GameDetailView = Backbone.View.extend({

  template: JST["games/detail"],

  initialize: function () {
    var that = this;

    that.coords = [];
    that.pusher = that.options.pusher;
    that.channelName = "game_" + that.model.id + "_channel";
    that.channel = that.pusher.subscribe(that.channelName);
    that.channel.bind("update_game", function(data){
      console.log("update_game");
      console.log(data);
      that.model.set(data);
    });

    var renderCallback = that.render.bind(that);
    that.listenTo(that.model, "change", renderCallback);
  },


  dispose: function() {
    this.remove();
    this.pusher.unsubscribe(this.channelName);
  },

  events: {
    "click div.square": "fromSquare",
    "click .back": "disponse"
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      game: that.model,
      board: JSON.parse(that.model.attributes.current_board)
    }));

    return that.$el;
  },

  fromSquare: function (event) {
    var that = this;
    var coord = [];

    strings = $(event.currentTarget).attr("data-id").split("_");
    _.each(strings, function(string, index) {
      coord.push(parseInt(string, 10));
    });

    if (that.coords.length === 0) {
      firstClickEl = $(event.currentTarget);
      firstClickEl.toggleClass("clicked");
      that.coords.push(coord);
    } else {
      that.coords.push(coord);
      firstClickEl.toggleClass("clicked");
      // update model

      move = "";
      fromCoord = that.coords[0];
      toCoord = that.coords[1];
      move = move.concat(that.letters(fromCoord[1]));
      move = move.concat(8-fromCoord[0]);
      move = move.concat(that.letters(toCoord[1]));
      move = move.concat(8-toCoord[0]);

      that.model.save({
        moves: that.model.attributes.moves + " " + move
      });
      that.coords = [];
    }
  },

  letters: function (num) {
    return ["a", "b", "c", "d", "e", "f", "g", "h"][num];
  }

});
