ChessApplication.Views.PageNotFoundView = Backbone.View.extend({

  template: JST["general/page_not_found"],

  initialize: function () {
  },

  dispose: function() {
    this.remove();
  },

  events: {
  },

  render: function() {
    var that = this;

    var randomNumber=Math.floor(Math.random()*11);

    that.$el.html(that.template({
      rageFaceNum: randomNumber
    }));

    return that.$el;
  }

});
