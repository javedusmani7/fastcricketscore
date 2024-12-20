const mongoose = require('mongoose');

const Playerstatistic = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
    pid: { type: Number,  unique: true},
    player: {
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
    },
    batting: {
        test: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            notout: { type: Number },
            runs: { type: Number },
            balls: { type: Number },
            highest: { type: Number },
            run100: { type: Number },
            run50: { type: Number },
            run4: { type: Number },
            run6: { type: Number },
            average: { type: String },
            strike: { type: String },
            catches: { type: Number },
            stumpings: { type: Number },
            fastest50balls: { type: Number },
            fastest100balls: { type: Number },
        },
        odi: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            notout: { type: Number },
            runs: { type: Number },
            balls: { type: Number },
            highest: { type: Number },
            run100: { type: Number },
            run50: { type: Number },
            run4: { type: Number },
            run6: { type: Number },
            average: { type: String },
            strike: { type: String },
            catches: { type: Number },
            stumpings: { type: Number },
            fastest50balls: { type: Number },
            fastest100balls: { type: Number },
        },
        t20i: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            notout: { type: Number },
            runs: { type: Number },
            balls: { type: Number },
            highest: { type: Number },
            run100: { type: Number },
            run50: { type: Number },
            run4: { type: Number },
            run6: { type: Number },
            average: { type: String },
            strike: { type: String },
            catches: { type: Number },
            stumpings: { type: Number },
            fastest50balls: { type: Number },
            fastest100balls: { type: Number },
        },
        t20: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            notout: { type: Number },
            runs: { type: Number },
            balls: { type: Number },
            highest: { type: Number },
            run100: { type: Number },
            run50: { type: Number },
            run4: { type: Number },
            run6: { type: Number },
            average: { type: String },
            strike: { type: String },
            catches: { type: Number },
            stumpings: { type: Number },
            fastest50balls: { type: Number },
            fastest100balls: { type: Number },
        },
        lista: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            notout: { type: Number },
            runs: { type: Number },
            balls: { type: Number },
            highest: { type: Number },
            run100: { type: Number },
            run50: { type: Number },
            run4: { type: Number },
            run6: { type: Number },
            average: { type: String },
            strike: { type: String },
            catches: { type: Number },
            stumpings: { type: Number },
            fastest50balls: { type: Number },
            fastest100balls: { type: Number },
        },
        firstclass: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            notout: { type: Number },
            runs: { type: Number },
            balls: { type: Number },
            highest: { type: Number },
            run100: { type: Number },
            run50: { type: Number },
            run4: { type: Number },
            run6: { type: Number },
            average: { type: String },
            strike: { type: String },
            catches: { type: Number },
            stumpings: { type: Number },
            fastest50balls: { type: Number },
            fastest100balls: { type: Number },
        },
        t10: {
            match_id: { type: String },
            inning_id: { type: String },
            matches: { type: String },
            innings: { type: String },
            notout: { type: String },
            runs: { type: String },
            balls: { type: String },
            highest: { type: String },
            run100: { type: String },
            run50: { type: String },
            run4: { type: String },
            run6: { type: String },
            average: { type: String },
            strike: { type: String },
            catches: { type: String },
            stumpings: { type: String },
        },
    },
    bowling: {
        test: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            balls: { type: Number },
            overs: { type: Number },
            runs: { type: Number },
            wickets: { type: Number },
            bestinning: { type: String },
            bestmatch: { type: String },
            econ: { type: String },
            average: { type: String },
            strike: { type: String },
            wicket4i: { type: Number },
            wicket5i: { type: Number },
            wicket10m: { type: Number },
            hattrick: { type: Number },
            expensive_over_runs: { type: Number },
        },
        odi: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            balls: { type: Number },
            overs: { type: Number },
            runs: { type: Number },
            wickets: { type: Number },
            bestinning: { type: String },
            bestmatch: { type: String },
            econ: { type: String },
            average: { type: String },
            strike: { type: String },
            wicket4i: { type: Number },
            wicket5i: { type: Number },
            wicket10m: { type: Number },
            hattrick: { type: Number },
            expensive_over_runs: { type: Number },
        },
        t20i: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            balls: { type: Number },
            overs: { type: Number },
            runs: { type: Number },
            wickets: { type: Number },
            bestinning: { type: String },
            bestmatch: { type: String },
            econ: { type: String },
            average: { type: String },
            strike: { type: String },
            wicket4i: { type: Number },
            wicket5i: { type: Number },
            wicket10m: { type: Number },
            hattrick: { type: Number },
            expensive_over_runs: { type: Number },
        },
        t20: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            balls: { type: Number },
            overs: { type: Number },
            runs: { type: Number },
            wickets: { type: Number },
            bestinning: { type: String },
            bestmatch: { type: String },
            econ: { type: String },
            average: { type: String },
            strike: { type: String },
            wicket4i: { type: Number },
            wicket5i: { type: Number },
            wicket10m: { type: Number },
            hattrick: { type: Number },
            expensive_over_runs: { type: Number },
        },
        lista: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            balls: { type: Number },
            overs: { type: Number },
            runs: { type: Number },
            wickets: { type: Number },
            bestinning: { type: String },
            bestmatch: { type: String },
            econ: { type: String },
            average: { type: String },
            strike: { type: String },
            wicket4i: { type: Number },
            wicket5i: { type: Number },
            wicket10m: { type: Number },
            hattrick: { type: Number },
            expensive_over_runs: { type: Number },
        },
        firstclass: {
            match_id: { type: Number },
            inning_id: { type: Number },
            matches: { type: Number },
            innings: { type: Number },
            balls: { type: Number },
            overs: { type: Number },
            runs: { type: Number },
            wickets: { type: Number },
            bestinning: { type: String },
            bestmatch: { type: String },
            econ: { type: String },
            average: { type: String },
            strike: { type: String },
            wicket4i: { type: Number },
            wicket5i: { type: Number },
            wicket10m: { type: Number },
            hattrick: { type: Number },
            expensive_over_runs: { type: Number },
        },
        t10: {
            match_id: { type: String },
            inning_id: { type: String },
            matches: { type: String },
            innings: { type: String },
            balls: { type: String },
            overs: { type: String },
            runs: { type: String },
            wickets: { type: String },
            bestinning: { type: String },
            bestmatch: { type: String },
            econ: { type: String },
            average: { type: String },
            strike: { type: String },
            wicket4i: { type: String },
            wicket5i: { type: String },
            wicket10m: { type: String },
        },
    },
});

module.exports = mongoose.model('Playerstatistic', Playerstatistic);