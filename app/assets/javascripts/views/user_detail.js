ChessApplication.Views.UserDetailView = Backbone.View.extend({

  template: JST["users/detail"],

  initialize: function () {
    var that = this;

    that.coords = [];
    that.pusher = that.options.pusher;
    that.userId = that.options.userId;
    that.user = that.options.user;
    that.friendships = that.options.friendships;
    that.channel = null;

    that.pusherInit();

    var renderCallback = that.render.bind(that);
    that.listenTo(that.user, "change", renderCallback);
  },

  pusherInit: function() {
    var that = this;

    if (that.user.id !== that.userId) {
      that.channel = that.pusher.subscribe("user_" + that.user.id + "_channel");
      that.channel.bind("update_profile", function(data){
        that.user.set(data);
      });
    }
  },

  dispose: function() {
    var that = this;

    that.remove();
    if (that.channel) { that.pusher.unsubscribe(that.channel.name); }
  },

  events: {
    "click .user-search-button": "showSearchedUser",
    "keypress #user_email": "filterEnter",
    "click #profile-tabs li": "tabinate",
    "click .social-container .friend-button": "addFriendship",
    "click .social-container .unfriend-button": "deleteFriendship",
    "click .social-container .accept-friendship": "acceptFriendship",
    "click .social-container .deny-friendship": "denyFriendship"
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      user: that.user,
      userId: that.userId
    }));

    _.defer(function() {
      $('#user_email').autocomplete({
        source: "/users.json",
        minLength: 1
      });
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

  tabinate: function(event) {
    id = $(event.currentTarget).attr('class');

    $('.current-tab').removeClass('current-tab');
    $(event.currentTarget).addClass('current-tab');
    
    $('.current-panel').removeClass('current-panel');
    $('#' + id).addClass('current-panel');
  },

  addFriendship: function() {
    var that = this;

    var ajaxOptions = {
      url: '/friendships',
      type: 'POST',
      data: {"to_user_id": that.user.id},
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
      data: {"user_id": that.user.id, "response": "destroy"},
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
      data: {"user_id": that.user.id, "response": "accept"},
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
      data: {"user_id": that.user.id, "response": "deny"},
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
