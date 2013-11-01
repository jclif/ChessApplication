ChessApplication.Models.User= Backbone.Model.extend({

  urlRoot: '/users',

  isFriendsWith: function(OtherUserId) {
    var that = this;
    var found = false;
    that.attributes.accepted_friends.forEach(function(friend) {
      if (friend.id === OtherUserId) {
        found = true;
      }
    });
    return found;
  }

});
