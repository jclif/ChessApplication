ChessApplication.Collections.OpenGames = Backbone.Collection.extend({
  model: ChessApplication.Models.OpenGame,
  url: 'open_games/'
});
