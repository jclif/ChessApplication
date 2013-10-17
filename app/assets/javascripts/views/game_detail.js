ChessApplication.Views.GameDetailView = Backbone.View.extend({

  template: JST["games/detail"],

  initialize: function () {
    var that = this;

    that.coords = [];
    that.subViews = [];
    // Pusher
    that.pusher = that.options.pusher;
    that.channelName = "game_" + that.model.id + "_channel";
    that.channel = that.pusher.subscribe(that.channelName);
    // Subscriptions
    that.channel.bind("update_game", function(data){
      that.model.set(data);
    });
    that.channel.bind("delete_game", function(data){
      console.log(that);
      // Creates View
      var resultsView = new ChessApplication.Views.GameResultsView({
        pgn: data
      });
      // Disable listenTo stuff
      that.undelegateEvents();
      // Puts verlay in list of views to be deleted
      that.subViews.push(resultsView);
      // Calls ender on new view
      that.$el.append(resultsView.render());
      // Delete model
      that.model.trigger("destroy", that.model);
    });

    var renderCallback = that.render.bind(that);
    that.listenTo(that.model, "change", renderCallback);
  },

  dispose: function() {
    var that = this;

    that.remove();
    that.pusher.unsubscribe(this.channelName);
    that.subViews.forEach(function(view) {
      view.dispose();
    });
  },

  events: {
    "click .square": "moveClick",
    "click .moves": "test"
  },

  test: function(event) {
    var that = this;
    console.log("testing");
    var resultsView = new ChessApplication.Views.GameResultsView({
      game: 5
    });
    that.subViews.push(resultsView);

    that.$el.append(resultsView.render());
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      game: that.model,
      board: JSON.parse(that.model.attributes.current_board)
    }));

    return that.$el;
  },

  moveClick: function (event) {
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
