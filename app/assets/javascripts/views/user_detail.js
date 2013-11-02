ChessApplication.Views.UserDetailView = Backbone.View.extend({

  template: JST["users/detail"],

  initialize: function () {
    var that = this;

    that.coords = [];
    that.pusher = that.options.pusher;
    that.userId = that.options.userId;
    that.friendships = that.options.friendships;
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
    "click .user-search-button": "showSearchedUser"
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      user: that.model,
      userId: that.userId
    }));

    _.defer(function() {
      if (that.userId !== that.model.attributes.id) {
        if (that.model.isFriendsWith(that.userId)) {
          $('.unfriend-button').show();
        } else {
          $('.friend-button').show();
        }
      }
    });

    return that.$el;
  },

  showSearchedUser: function() {
    var email = $('.profile-nav #user_email')[0].value;

    console.log(email);
  }

});
