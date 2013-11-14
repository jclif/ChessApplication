describe('User model', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.respondWith(
      "GET",
      "/users",
      [
        200,
        {"Content-Type": "application/json"},
        '{"response":"some json"}'
      ]
    );
    this.user = new ChessApplication.Models.User({
      email: 'test@example.com',
    });
  });

  afterEach(function() {
    this.server.restore();
  });

  describe("when user is initiated with data from api", function() {
    it("isFriendsWish should return correct value", function() {})
    it("receivedRequestFrom should return correct value", function() {})
    it("sendRequestTo should return correct value", function() {})
    it("otherGameUser should return correct value", function() {})
  });

  describe('when instantiated', function() {
    
    it('should exhibit attributes', function() {
      expect(this.user.get('email'))
        .toEqual('test@example.com');
    });
  });
  
  describe("url", function() {

    beforeEach(function() {
      var collection = {
        url: "/users"
      };
      this.user.collection = collection;
    });

    describe("when no id is set", function() {
      it("should return the collection URL", function() {
        expect(this.user.url()).toEqual("/users");
      });
    });

    describe("when id is set", function() {
      it("should return the collection URL and id", function() {
        this.user.id = 1;
        expect(this.user.url()).toEqual("/users/1");
      });
    });
  });
});
