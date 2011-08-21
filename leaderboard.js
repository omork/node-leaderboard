var redis = require("./redis-client.js");

function get(hash, key, default_value) { 
  if (key in hash) { return key }
  else { return default_value }
}

function Leaderboard(leaderboard_name, options) {
  if (undefined == options) { options = {} }
  VERSION = '1.1.4'
  DEFAULT_PAGE_SIZE = 25
  DEFAULT_REDIS_HOST = 'localhost'
  DEFAULT_REDIS_PORT = 6379
  DEFAULT_REDIS_DB = 0

  page_size = get(options, 'page_size', DEFAULT_PAGE_SIZE)
  if (page_size < 1) { page_size = DEFAULT_PAGE_SIZE }

  rhost = get(options, 'host', DEFAULT_REDIS_HOST)
  rport = get(options, 'port', DEFAULT_REDIS_PORT)
  rdb   = get(options, 'db',   DEFAULT_REDIS_DB)

  var rcl = redis.createClient(rhost, rport, {'db':rdb});

  return {
    leaderboard_name : leaderboard_name, 
    options : JSON.parse(JSON.stringify(options)),
    page_size : page_size,
    redis_connection : rcl,
    total_members : function(leaderboard, callback) { return this.redis_connection.zcard(leaderboard_name, function (result) { 
      if (!undefined == callback) { callback(result) }
    })},
    rank_member : function(member, score, callback) { this.redis_connection.zadd(leaderboard_name, score, member, function(result) { 
      if (!undefined == callback) { callback(result) }
    }) }
  }
}

leaderboard = Leaderboard('asd')

leaderboard.rank_member('asdf', 1)
console.log(leaderboard.total_members())
