const mongoose = require('mongoose');
  
const Matchlive = new mongoose.Schema({
  sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
  source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
  match_id: { type: Number,  unique: true },
  mid: { type: Number },
  status: { type: Number },
  status_str: { type: String },
  game_state: { type: Number },
  game_state_str: { type: String },
  status_note: { type: String },
  day_remaining_over: { type: String },
  team_batting: { type: String },
  team_bowling: { type: String },
  live_inning_number: { type: Number },
  live_score: {
    runs: { type: Number },
    overs: { type: Number },
    wickets: { type: Number },
    target: { type: Number },
    runrate: { type: Number },
    required_runrate: { type: Number },
  },
  commentary: { type: Number },
  wagon: { type: Number },
  batsmen: {type : [{
    name: { type: String },
    batsman_id: { type: Number },
    runs: { type: Number },
    balls_faced: { type: Number },
    fours: { type: Number },
    sixes: { type: Number },
    strike_rate: { type: String },
  }]},
  bowlers: {type : [{
    name: { type: String },
    bowler_id: { type: Number },
    overs: { type: Number },
    runs_conceded: { type: Number },
    wickets: { type: Number },
    maidens: { type: Number },
    econ: { type: String },
  }]},
  commentaries: {type : [{}]},
  // commentaries: {type : [{
  //   event_id: { type: String },
  //   event: { type: String },
  //   batsman_id: { type: String },
  //   bowler_id: { type: String },
  //   over: { type: String },
  //   ball: { type: String },
  //   score: { type: String },
  //   commentary: { type: String },
  //   noball_dismissal: { type: Boolean },
  //   text: { type: String },
  //   timestamp: { type: Number },
  //   run: { type: Number },
  //   noball_run: { type: String },
  //   wide_run: { type: String },
  //   bye_run: { type: String },
  //   legbye_run: { type: String },
  //   bat_run: { type: String },
  //   noball: { type: Boolean },
  //   wideball: { type: Boolean },
  //   six: { type: Boolean },
  //   four: { type: Boolean },
  //   wicket_batsman_id: { type: String },
  //   how_out: { type: String },
  //   batsman_runs: { type: String },
  //   batsman_balls: { type: String },
  // }]},
  day: { type: String },
  session: { type: String },
  live_inning: {
    iid: { type: Number },
    number: { type: Number },
    name: { type: String },
    short_name: { type: String },
    status: { type: Number },
    issuperover: { type: String },
    result: { type: Number },
    batting_team_id: { type: Number },
    fielding_team_id: { type: Number },
    scores: { type: String },
    scores_full: { type: String },
    fielder: {type : [{
      fielder_id: { type: String },
      fielder_name: { type: String },
      catches: { type: Number },
      runout_thrower: { type: Number },
      runout_catcher: { type: Number },
      runout_direct_hit: { type: Number },
      stumping: { type: Number },
      is_substitute: { type: String },
    }]},
    powerplay: {type: Object },
    review: {
      batting: {
          batting_team_total_review: { type: String },
          batting_team_review_success: { type: String },
          batting_team_review_failed: { type: String },
          batting_team_review_available: { type: String },
          batting_team_review_retained: { type: String },
      },
      bowling: {
          bowling_team_total_review: { type: String },
          bowling_team_review_success: { type: String },
          bowling_team_review_failed: { type: String },
          bowling_team_review_available: { type: String },
          bowling_team_review_retained: { type: String },
      },
    },
    last_wicket: {
      name: { type: String },
      batsman_id: { type: String },
      runs: { type: String },
      balls: { type: String },
      how_out: { type: String },
      score_at_dismissal: { type: Number },
      overs_at_dismissal: { type: String },
      bowler_id: { type: String },
      dismissal: { type: String },
      number: { type: Number },
    },
    extra_runs: {
      byes: { type: Number },
      legbyes: { type: Number },
      wides: { type: Number },
      noballs: { type: Number },
      penalty: { type: String },
      total: { type: Number },
    },
    equations: {
      runs: { type: Number },
      wickets: { type: Number },
      overs: { type: String },
      bowlers_used: { type: Number },
      runrate: { type: String },
    },
    current_partnership: {
      runs: { type: Number },
      balls: { type: Number },
      overs: { type: Number },
      batsmen: {type : [{
        name: { type: String },
        batsman_id: { type: Number },
        runs: { type: Number },
        balls: { type: Number },
      }]},
    },
    did_not_bat: {type : []},
    max_over: { type: String },
    target: { type: String },
    recent_scores: { type: String },
    last_five_overs: { type: String },
    last_ten_overs: { type: String },
  },
  teams: {type : [{
    tid: { type: Number },
    title: { type: String },
    abbr: { type: String },
    alt_name: { type: String },
    type: { type: String },
    thumb_url: { type: String },
    logo_url: { type: String },
    country: { type: String },
    sex: { type: String },
    scores_full: { type: String },
    scores: { type: String },
    overs: { type: String },
  }]},
  players: {type : [{
    pid: { type: Number },
    title: { type: String },
    short_name: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    middle_name: { type: String },
    birthdate: { type: String },
    birthplace: { type: String },
    country: { type: String },
    primary_team: {type : []},
    logo_url: { type: String },
    playing_role: { type: String },
    batting_style: { type: String },
    bowling_style: { type: String },
    fielding_position: { type: String },
    recent_match: { type: Number },
    recent_appearance: { type: Number },
    fantasy_player_rating: { type: Number },
    facebook_profile: { type: String },
    twitter_profile: { type: String },
    instagram_profile: { type: String },
    debut_data: { type: String },
    thumb_url: { type: String },
    nationality: { type: String },
    role: { type: String },
    role_str: { type: String },
  }]},
});

module.exports = mongoose.model('Matchlive', Matchlive);