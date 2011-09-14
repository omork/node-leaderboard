# Overview


Leaderboards backed by Redis for node.js, http://redis.io.

Builds off ideas proposed in http://blog.agoragames.com/2011/01/01/creating-high-score-tables-leaderboards-using-redis/.

See https://github.com/agoragames/leaderboard/ for detailed usage information

See http://nodejs.org/ for more information about node.js.

For other platforms see:

  Ruby - https://github.com/agoragames/leaderboard
  Python - https://github.com/agoragames/python-leaderboard
  Java - https://github.com/agoragames/java-leaderboard
  Scala - https://github.com/agoragames/scala-leaderboard
  PHP - https://github.com/agoragames/php-leaderboard
  Erlang - https://github.com/agoragames/erlang-leaderboard

# Example


See examples.js for more.

```javascript
  var lbm = require("./leaderboard.js");
  var sys = require('sys');
  
  // instantiate a leaderboard
  leaderboard = lbm.Leaderboard('wins');
  
  // don't do anything until we've successfully connected
  leaderboard.on_connect(function () {
    leaderboard.total_members(function(err, reply) { sys.puts("total members: " + reply) })
  }
```

# Dependencies

  * https://github.com/mranney/node_redis (included)
  * https://github.com/joyent/node

# License

This software is licensed under the `New BSD License`. See the ``LICENSE``
file in the top distribution directory for the full license text.
