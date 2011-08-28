var lbm = require("./leaderboard.js");
var sys = require('sys');

// instantiate a leaderboard
leaderboard = lbm.Leaderboard('wins');

// don't do anything until we've successfully connected
leaderboard.on_connect(function () {
  leaderboard.total_members(function(err, reply) { sys.puts("total members: " + reply) })
// set a score (it's over 900!)
  leaderboard.rank_member('olamork', 9001, function(err, reply) { sys.puts("rank_member : " + reply ) })
// check that we're actually in there
  leaderboard.check_member('olamork', function(err, reply) { sys.puts(reply)})

  leaderboard.score_and_rank_for('olamork', function(err, reply) { sys.puts(reply)})
// but erling isn't.
  leaderboard.check_member('erling', function(err, reply) { sys.puts(reply)})
// there should be at least one now:
  leaderboard.total_members(function(err, reply) { 
    sys.puts("total members: " + reply);
    process.exit(0);
  })
});
