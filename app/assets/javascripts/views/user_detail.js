ChessApplication.Views.UserDetailView = Backbone.View.extend({

  template: JST["users/detail"],

  initialize: function () {
    var that = this;

    that.coords = [];
    that.pusher = that.options.pusher;
    that.channelName = "user_" + that.model.id + "_channel";
    that.channel = that.pusher.subscribe(that.channelName);
    that.channel.bind("update_profile", function(data){
      console.log("update_profile");
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
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      user: that.model
    }));

    return that.$el;
  }
});
