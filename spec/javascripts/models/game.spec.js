describe('Game model', function() {

  describe('when instantiated', function() {
    
    it('should exhibit attributes', function() {
      var game = new ChessApplication.Models.Game({
        white_user_id: 1,
        black_user_id: 2
      });
      expect(game.get('white_user_id'))
        .toEqual(1);
    
      expect(game.get('black_user_id'))
        .toEqual(2);
    });
    
  });
  
});
