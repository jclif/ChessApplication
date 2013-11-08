ChessApplication.Views.NavBotView = Backbone.View.extend({

  template: JST["nav/bot"],

  initialize: function() {
    var that = this;

    that.pusher = that.options.pusher;
    that.currUser = that.options.currUser;
    that.firstRender = true;

    var renderCallback = that.render.bind(that);
    that.listenTo(that.currUser, "change", renderCallback);
  },

  events: {
    "click #chat": "toggleChat",
    "click #pending-games": "togglePendingGames",
    "click #pending-friends": "togglePendingFriends",
    "click .pending-friend-list .accept-friendship": "acceptFriendship",
    "click .pending-friend-list .deny-friendship": "denyFriendship"
  },

  render: function() {
    var that = this;
    that.firstRender = false;

    that.$el.html(that.template({
      openGames: that.openGames,
      currUser: that.currUser
    }));

    _.defer(function() {

      var $navbot = $('.nav-bot');
      var bot_h = $navbot.outerHeight();

      if (that.firstRender) {
        $navbot.css({
          bottom: -bot_h * 2,
          opacity: 0,
          display: 'block'
        }).animate({
          bottom: 10,
          opacity: 1
        }, 1000, 'easeOutBounce');
      } else {
        $navbot.css({
          bottom: 10,
          opacity: 1,
          display: 'block'
        });
      }

      $('#new-game-tabs').tabs();

    });

    return that.$el;
  },

  toggleChat: function(event) {
    $(event.currentTarget).find('span').toggleClass('selected-nav');
    $('#chat-container').toggle();
  },

  togglePendingGames: function(event) {
    $(event.currentTarget).find('span').toggleClass('selected-nav');
    $('#pending-games-container').toggle();
  },

  togglePendingFriends: function(event) {
    $(event.currentTarget).find('span').toggleClass('selected-nav');
    $('#pending-friends-container').toggle();
  },

  acceptFriendship: function(event) {
    var that = this;

    var userId = $(event.currentTarget).attr('data-id');
    var ajaxOptions = {
      url: '/friendships/respond',
      type: 'POST',
      data: {"user_id": userId, "response": "accept"},
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    };

    $.ajax(ajaxOptions);
  },

  denyFriendship: function(event) {
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

