ChessApplication.Views.GameDetailView = Backbone.View.extend({

  template: JST["games/detail"],

  initialize: function () {
    console.log(this);
    var that = this;

    that.coords = [];
    that.subViews = [];
    var channel = that.options.pusher.subscribe('game_' + that.model.id + '_channel');
    channel.bind("render_pgn", function(data){
      console.log("rendering_pgn");
      console.log(data.game.current_board);
      // Disable listenTo stuff
      that.undelegateEvents();
      // Render last move
      var game = new ChessApplication.Models.Game;
      game.set(data.game);
      that.$el.html(that.template({
        game: game,
        board: JSON.parse(data.game.current_board)
      }));
      game.trigger('destroy', game);
      // Create/render results view
      var resultsView = new ChessApplication.Views.GameResultsView({
        pgn: data.pgn
      });
      // Puts verlay in list of views to be deleted
      that.subViews.push(resultsView);
      // Calls ender on new view
      that.$el.append(resultsView.render());
    });

    var renderCallback = that.render.bind(that);
    that.listenTo(that.model, "change", renderCallback);
  },

  dispose: function() {
    var that = this;

    that.remove();
    that.subViews.forEach(function(view) {
      view.dispose();
    });
  },

  events: {
    "click .square": "moveClick"
  },

  render: function() {
    console.log("rendering");
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
      }, {
        silent:true
      });
      that.coords = [];
    }
  },

  letters: function (num) {
    return ["a", "b", "c", "d", "e", "f", "g", "h"][num];
  }

});
