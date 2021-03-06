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
    "click .pending-friends-list .accept-friendship": "acceptFriendship",
    "click .pending-friends-list .deny-friendship": "denyFriendship",
    "click #pending-games-list .accept-game": "acceptGame",
    "click #pending-games-list .deny-game": "denyGame",
    "click .chat-friend": "chatDetail",
    "click .chat-exit": "chatExit",
    "click .submit-message-button": "submitMessage",
    "keypress .chat-input": "filterEnter"
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
    var that = this;

    $(event.currentTarget).find('span').toggleClass('selected-nav');

    if ($('#chat-container').css("display") == 'none') {
      $('#chat-container').toggle();
    } else {
      that.chatExit();
      $('#chat-container').toggle();
    }
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

    var userId = $(event.currentTarget).data('id');
    var ajaxOptions = {
      url: '/friendships/respond',
      type: 'POST',
      data: {"user_id": userId, "response": "deny"},
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    };

    $.ajax(ajaxOptions);
  },

  chatDetail: function(event) {
    var that = this;

    var userId = $(event.currentTarget).data('id');
    var ajaxOptions = {
      url: '/messages/',
      type: 'GET',
      data: {"user_id": userId},
      success: function(data) {
        $('.selected-chat-friend').removeClass('selected-chat-friend');
        $(event.currentTarget).addClass("selected-chat-friend");
        that.chatExit();
        that.pusherInit(userId);
        that.renderChat(data, userId);
        $('#selected-chat').show();
      },
      error: function(data) {
        console.log(data);
      }
    };

    $.ajax(ajaxOptions);
  },

  renderChat: function(data, userId) {
    var that = this;

    var $el = $('#selected-chat').append('<span class="icon-x chat-exit"></span>');
    var $input = $("<input data-id='" + userId + "' class='clearfix chat-input' type='text'></input>");
    var $icon = $("<span class='icon-reply submit-message-button'></span>");
    var $ul = $('<ul></ul>').addClass('chat-list');
    var $li = null;

    if (data.length === 0) {
      $el.append("<p class='sad-panda'>No messages yet.</p>");
      $el.append($ul).append($input);
    } else {
      data.forEach(function(message) {
        $li = $('<li></li>').addClass('clearfix');
        $span = $('<span></span>').html(message.body);
        if (that.currUser.id == message.sender_id) {
          $span.addClass('currUser-message');
        } else {
          $span.addClass('otherUser-message');
        }
        $ul.append($li.append($span));
      });

      $el.append($ul.append($li)).append($input).append($icon);
    }
  },

  chatExit: function() {
    $('#selected-chat').empty();
    $('#selected-chat').hide();
  },

  filterEnter: function(event) {
    var that = this;

    if (event.keyCode === 13) {
      that.submitMessage(event);
    }
  },

  submitMessage: function(event) {
    var that = this;
    console.log(event.currentTarget);

    var userId = parseInt($('.chat-input').attr('data-id'), 10);
    var body = $('.chat-input').val();
    console.log(body);
    var ajaxOptions = {
      url: '/messages/',
      type: 'POST',
      data: {"user_id": userId, "body": body},
      success: function(data) {
        $('.chat-input').val("");
        $li = $("<li class='clearfix'>" + "<span class='currUser-message'>" + data.body + "</span>" + "</li>");
        $('.chat-list').append($li);
      },
      error: function(data) {
        console.log(data);
      }
    };

    $.ajax(ajaxOptions);
  },

  pusherInit: function(userId) {
  },

  acceptGame: function(event) {
    var that = this;

    gameId = $(event.currentTarget).attr('data-id');
    
    var ajaxOptions = {
      url: '/games/' + gameId + 'respond',
      type: 'POST',
      data: {"response": "accept"},
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    };

    $.ajax(ajaxOptions);
  },

  denyGame: function(event) {
    var that = this;

    gameId = $(event.currentTarget).attr('data-id');
    
    var ajaxOptions = {
      url: '/games/' + gameId + 'respond',
      type: 'POST',
      data: {"response": "deny"},
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

