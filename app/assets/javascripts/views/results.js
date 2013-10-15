ChessApplication.Views.GameResultsView = Backbone.View.extend({
  initialize: function() {
    var that = this;

    that.pgn = that.options.pgn;
  },

  template: JST['games/results'],

  render: function() {
    var that = this;

    that.$el.addClass('overlay clearfix').html(that.template({pgn: that.pgn}));

    return that.$el;
  },

  dispose: function() {
    this.remove();
  }
});
