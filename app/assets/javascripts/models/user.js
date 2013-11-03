ChessApplication.Models.User= Backbone.Model.extend({

  urlRoot: '/users',

  isFriendsWith: function(OtherUserId) {
    var that = this;
    var found = false;
    console.log(OtherUserId);
    that.attributes.accepted_friend_ids.forEach(function(friend) {
      console.log(friend.id);
      if (friend.id === OtherUserId) {
        found = true;
      }
    });
    console.log(found);
    return found;
  },

  isWaitingForResponseFrom: function(OtherUserId) {
    var that = this;
    var found = false;
    that.attributes.pending_friends.forEach(function(friend) {
      if (friend.id === OtherUserId) {
        found = true;
      }
    });
    return found;
  }

});
