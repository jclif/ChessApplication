ChessApplication.Views.GamesListView = Backbone.View.extend({

  template: JST["games/list"],

  initialize: function () {
    var that = this;
    that.userId = that.options.userId;

    var renderCallback = that.render.bind(that);
    that.listenTo(that.collection, "add", renderCallback);
    that.listenTo(that.collection, "change", renderCallback);
    that.listenTo(that.collection, "reset", renderCallback);
    that.listenTo(that.collection, "remove", renderCallback);
    that.listenTo(that.collection, "destroy", renderCallback);
  },

  dispose: function() {
    var that = this;

    that.remove();
  },

  render: function() {
    var that = this;

    var is_white = function(uni) {
      whites = [
        "\u2654",
        "\u2655",
        "\u2656",
        "\u2657",
        "\u2658",
        "\u2659"];

      return _.contains(whites, uni);
    };

    var white_to_solid = function(uni) {
      var white_to_black = {
      "\u2655": "\u265B",
      "\u2654": "\u265A",
      "\u2656": "\u265C",
      "\u2657": "\u265D",
      "\u2658": "\u265E",
      "\u2659": "\u265F"
      };

      if (_.contains(Object.keys(white_to_black), uni)) {
        return white_to_black[uni];
      }
    };

    that.el = that.template({
      is_white: is_white,
      white_to_solid: white_to_solid,
      games: that.collection
    });

    return that.el;
  }
});
