var contributors = require('../contributors');

function isContributor(name, roster) {
    return roster.map(function(p) { return p.Github; })
                 .reduce(function(prev, curr) {
                    if (prev) return prev;
                    return curr == name;
                 }, false);
}

function validator(pullRequest, statusHistory, _, callback) {
    var sha = pullRequest.head.sha,
        githubUser = pullRequest.user.login;

    contributors.getAll(function(err, contributors) {
        var response = {
            state: 'success',
        };
        if (err) return callback(err);
        if (! isContributor(githubUser, contributors)) {
            response.status = 'failure';
            response.description = githubUser + ' has not signed the Numenta Contributor License';
            response.target_url = 'http://numenta.com/licenses/cl/';
        }
        callback(null, response);
    });
}

module.exports.validate = validator;
module.exports.name = 'Contributor Validator';
