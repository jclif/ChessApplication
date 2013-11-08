ChessApplication.Views.NavBotView = Backbone.View.extend({

  initialize: function() {
    var that = this;

    that.pusher = that.options.pusher;
    that.currUser = that.options.currUser;

    that.pusherInit();
  },

  template: JST["nav/bot"],

  events: {
    "click #chat": "toggleChat",
    "click #pending-games": "togglePendingGames",
    "click #pending-friends": "togglePendingFriends"
  },

  render: function() {
    var that = this;

    that.$el.html(that.template({
      openGames: that.openGames,
      currUser: that.currUser
    }));

    _.defer(function() {

      var $navbot = $('.nav-bot');
      var bot_h = $navbot.outerHeight();

      $navbot.css({
        bottom: -bot_h * 2,
        opacity: 0,
        display: 'block'
      }).animate({
        bottom: 10,
        opacity: 1
      }, 1000, 'easeOutBounce');
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

  pusherInit: function() {
  }

});

