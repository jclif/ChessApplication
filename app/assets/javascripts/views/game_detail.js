ChessApplication.Views.GameDetailView = Backbone.View.extend({
  initialize: function () {
    var that = this;

    that.coords = [];

    setInterval(function () {
      that.model.fetch();
    }, 1000);

    var renderCallback = that.render.bind(that);
    that.listenTo(that.model, "change", renderCallback);
  },

  events: {
    "click div.square": "fromSquare"
  },

  render: function() {
    var that = this;

    var renderedContent = JST["games/detail"]({
      game: that.model,
      board: JSON.parse(that.model.attributes.current_board)
    });

    that.$el.html(renderedContent);
    return that;
  },

  fromSquare: function (event) {
    var that = this;
    var coord = [];

    strings = $(event.currentTarget).attr("data-id").split("_");
    _.each(strings, function(string, index) { coord.push(parseInt(string)); });

    console.log(coord);

    if (that.coords.length === 0) {
      firstClickEl = $(event.currentTarget);
      firstClickEl.toggleClass("clicked");
      that.coords.push(coord);
      console.log("first click!");
    } else {
      that.coords.push(coord);
      firstClickEl.toggleClass("clicked");
      console.log("second click!");
      // update model

      move = "";
      fromCoord = that.coords[0];
      toCoord = that.coords[1];
      move = move.concat(that.letters(fromCoord[1]));
      move = move.concat(8-fromCoord[0]);
      move = move.concat(that.letters(toCoord[1]));
      move = move.concat(8-toCoord[0]);
      console.log(move);

      that.model.save({moves: that.model.attributes.moves + " " + move});
      that.coords = [];
    }
  },

  letters: function (num){
    return ["a", "b", "c", "d", "e", "f", "g", "h"][num];
  },

});
