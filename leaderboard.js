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

  var rcl = redis.createClient(rport, rhost);

  return {
    leaderboard_name : leaderboard_name, 
    options : JSON.parse(JSON.stringify(options)),
    use_zero_index_for_rank: get(options, 'use_zero_index_for_rank', false),
    page_size : page_size,
    redis_connection : rcl,
    on_connect : function(callback) {
      this.redis_connection.stream.addListener("connect", callback)    
    },

    rank_member : function(member, score, callback) { this.redis_connection.zadd(this.leaderboard_name, score, member, function(err, reply) {
      if ("function" == typeof callback) { callback(err, reply); }
    }) },

    remove_member : function(member, callback) { this.redis_connection.zrem(this.leaderboard_name, member, function(err, reply) {
      if ("function" == typeof callback) { callback(err, reply); }
    }) },

    clear : function(callback) { this.redis_connection.delete(this.leaderboard_name, member, function(err, reply) {
      if ("function" == typeof callback) { callback(err, reply); }
    }) },

    total_members : function(callback) { this.redis_connection.zcard(this.leaderboard_name, function(err, reply) {
      if ("function" == typeof callback) { callback(err, reply); }
    }) },

    total_pages : function(callback) { this.total_members(function (err, reply) {
      if ("function" == typeof callback) { 
        callback(err, Math.ceil(parseFloat(reply) / this.page_size));
      }
    }) },

    total_members_in_score_range : function(min_score, max_score, callback) { this.redis_connection.zcount(this.leaderboard_name, min_score, max_score, function(err, reply) {
      if ("function" == typeof callback) { callback(err, reply); }
    }) },

    change_score_for : function(member, delta, callback) { this.redis_connection.zincr(this.leaderboard_name, member, delta, function(err, reply) {
      if ("function" == typeof callback) { callback(err, reply); }
    }) },

    rank_for : function(member, callback) { this.redis_connection.zrevrank(this.leaderboard_name, member, function(err, reply) {
      if ("function" == typeof callback) { callback(err, (reply + (this.use_zero_index_for_rank ? 0 : 1))); }
    }) },

    score_for : function(member, callback) { this.redis_connection.zscore(this.leaderboard_name, member, function(err, reply) {
      if ("function" == typeof callback) { callback(err, reply); }
    }) },

    check_member : function(member, callback) { this.redis_connection.zscore(this.leaderboard_name, member, function(err, reply) {
      if ("function" == typeof callback) { callback(err, (!(null == reply))); }
    }) },

    score_and_rank_for : function(member, callback) {
      innerthis = this;
      this.score_for(member, function(err, score) {
        innerthis.rank_for(member, function(err, rank) {
          if ("function" == typeof callback) { callback(err, score, rank); }
        })
      })
    },

    remove_members_in_score_range : function(min_score, max_score, callback) { this.redis_connection.zremrangebyscore(this.leaderboard_name, min_score, max_score, function(err, reply) {
      if ("function" == typeof callback) { callback(err, reply); }
    }) },

    leaders : function(current_page, with_scores, with_rank, callback) { 
      if (current_page < 1) { current_page = 1; }
      this.total_pages(function(err, pages) {
        redis_index = current_page - 1;
        starting_index = redis_index * this.page_size;
        ending_offset = (starting_offset + page_size) - 1;
        innerthis = this;
        raw_leader_data = this.redis_connection.zrevrange(this.leaderboard_name, starting_offset, ending_offset, with_score, function(err, reply) {
          innerthis._massage_leader_data(reply, with_rank, callback); })
      })
    },

    around_me : function(member, with_scores, with_rank, callback) { 
      this.redis_connection.zrevrank(this.leaderboard_name, member, function(err, reverse_rank_for_member) {
        starting_offset = Math.floor(reverse_rank_for_member - (this.page_size / 2));
        ending_offset = (starting_offset + this.page_size) - 1;
        innerthis = this;
        this.redis_connection.zrevrange(this.leaderboard_name, starting_offset, ending_offset, with_scores, function(err, reply) {
          innerthis._massage_leader_data(reply, with_rank, callback);
        })
      })
    },

    ranked_in_list : function(members, with_scores, callback) {
      leader_data = []
      members.forEach(function(member) {
        this.rank_for(member, function(err, rank) {
          innerthis = this;
          innerthis.score_for(member, function(err, score) {
            leader_data.unshift({'member' : member, 'score' : score, 'rank': rank})
          })
        })
      })
      if ("function" == typeof callback) { callback(false, leader_data); }
    },

    _massage_leader_data: function(leaders, with_rank, callback) {
      member_attribute = true;
      leader_data = [];
      leaders.forEach(function (leader) {
        data = {};
        data['member'] = leader_data_item[0]
        data['score'] = leader_data_item[1]
        if (with_rank) { 
          this.rank_for(data['member'], function (err, reply) {
            data['rank'] = reply
          })
        }
        leader_data.unshift(data);
      })

      callback(false, leader_data);
    }
  }
}

exports.Leaderboard = Leaderboard
