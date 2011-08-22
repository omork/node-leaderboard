Overview
========

Leaderboards backed by Redis for node.js, http://redis.io.

Builds off ideas proposed in http://blog.agoragames.com/2011/01/01/creating-high-score-tables-leaderboards-using-redis/.

see https://github.com/agoragames/leaderboard/ for detailed usage information

see http://nodejs.org/ for more information about node.js.


Example
=======

see examples.js for more.::

  var lbm = require("./leaderboard.js");
  var sys = require('sys');
  
  // instantiate a leaderboard
  leaderboard = lbm.Leaderboard('wins');
  
  // don't do anything until we've successfully connected
  leaderboard.onConnect(function () {
    leaderboard.total_members(function(err, reply) { sys.puts("total members: " + reply) })
  }


.. _license:

License
=======

This software is licensed under the `New BSD License`. See the ``LICENSE``
file in the top distribution directory for the full license text.

