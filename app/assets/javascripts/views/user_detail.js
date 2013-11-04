ChessApplication.Views.UserDetailView = Backbone.View.extend({

  template: JST["users/detail"],

  initialize: function () {
    var that = this;

    that.coords = [];
    that.pusher = that.options.pusher;
    that.userId = that.options.userId;
    that.friendships = that.options.friendships;
    that.channel = that.pusher.subscribe("user_" + that.model.id + "_channel");

    if (that.model.id !== that.userId) {
      that.channel.bind("update_profile", function(data){
        console.log("update_profile");
        console.log(data);
        that.model.set(data);
      });
    }

    var renderCallback = that.render.bind(that);
    that.listenTo(that.model, "change", renderCallback);
  },


  dispose: function() {
    var that = this;

    that.remove();
    that.pusher.unsubscribe(that.channel.name);
  },

  events: {
    "click .user-search-button": "showSearchedUser",
    "keypress #user_email": "filterEnter",
    "click .friend-button": "addFriendship",
    "click .unfriend-button": "deleteFriendship",
    "click .accept-friendship": "acceptFriendship",
    "click .deny-friendship": "denyFriendship"
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
        } else if (that.model.receivedRequestFrom(that.userId)) {
          $('.request-sent-button').show();
        } else if (that.model.sentRequestTo(that.userId)) {
          $('.pending-button').show();
        } else {
          $('.friend-button').show();
        }
      } else {
        $('#messages').show();
        $('.messages').show();
      }

      $('#user_email').autocomplete({
        source: "/users.json",
        minLength: 2
      });

      $('#profile-tabs').tabs();

      $('.fancybox').fancybox();

    });

    return that.$el;
  },

  filterEnter: function(e) {
    var that = this;

    if (e.keyCode === 13) {
      that.showSearchedUser();
    }
  },

  showSearchedUser: function() {
    var that = this;
    var email = $('.profile-nav #user_email')[0].value;
    var ajaxOptions = {
      url: '/users',
      type: 'GET',
      data: {"user_email": email},
      success: function(data) {
        Backbone.history.navigate('#/users/' + data.userId);
      }
    };

    $.ajax(ajaxOptions);
  },

  addFriendship: function() {
    var that = this;

    var ajaxOptions = {
      url: '/friendships',
      type: 'POST',
      data: {"to_user_id": that.model.id},
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    };

    $.ajax(ajaxOptions);
  },

  deleteFriendship: function() {
    var that = this;

    var ajaxOptions = {
      url: '/friendships/respond',
      type: 'POST',
      data: {"user_id": that.model.id, "response": "destroy"},
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    };

    $.ajax(ajaxOptions);
  },

  acceptFriendship: function() {
    var that = this;

    var ajaxOptions = {
      url: '/friendships/respond',
      type: 'POST',
      data: {"user_id": that.model.id, "response": "accept"},
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    };

    $.ajax(ajaxOptions);
  },

  denyFriendship: function() {
    var that = this;

    var ajaxOptions = {
      url: '/friendships/respond',
      type: 'POST',
      data: {"user_id": that.model.id, "response": "deny"},
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    };

    $.ajax(ajaxOptions);
  }

});
