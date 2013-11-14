describe('Open Game model', function() {

  describe('when instantiated', function() {
    
    it('should exhibit attributes', function() {
      var openGame = new ChessApplication.Models.OpenGame({
        user_id: 1,
        color: "white"
      });
      expect(openGame.get('user_id'))
        .toEqual(1);

      expect(openGame.get('color'))
        .toEqual("white");
    });
    
  });
  
});
