ChessApplication.Models.User= Backbone.Model.extend({

  urlRoot: '/users',

  isFriendsWith: function(otherUserId) {
    var that = this;
    var found = false;
    that.attributes.accepted_friends.forEach(function(friend) {
      if (friend.id === otherUserId) {
        found = true;
      }
    });
    return found;
  },

  receivedRequestFrom: function(otherUserId) {
    var that = this;
    var found = false;
    that.attributes.pending_friends_received.forEach(function(friend) {
      if (friend.id === otherUserId) {
        found = true;
      }
    });
    return found;
  },

  sentRequestTo: function(otherUserId) {
    var that = this;
    var found = false;
    that.attributes.pending_friends_sent_ids.forEach(function(id) {
      if (id === otherUserId) {
        found = true;
      }
    });
    return found;
  }

});
