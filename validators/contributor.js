var contributors = require('../utils/contributors');

function isContributor(name, roster) {
    if (name == null || name == undefined) return false;
    if (name === false) return true; // explicit false means ignore
    return roster.map(function(p) { return p.Github; })
                 .reduce(function(prev, curr) {
                    if (prev) return prev;
                    return curr == name;
                 }, false);
}

function validator(sha, githubUser, _, githubClient, callback) {
    console.log('Validating contributor "' + githubUser + '"...');
    if (githubUser == githubUser.user) {
        // The Github user assigned as the API client whould always pass validation.
        callback(null, {state: 'success'})
    } else {
        contributors.getAll(githubClient.contributorsUrl, function(err, contributors) {
            var response = {
                state: 'success',
            };
            if (err) return callback(err);
            if (! isContributor(githubUser, contributors)) {
                response.state = 'failure';
                response.description = githubUser + ' has not signed the Numenta Contributor License';
                response.target_url = 'http://numenta.org/licenses/cl/';
            }
            callback(null, response);
        });
    }
}

module.exports.validate = validator;
module.exports.name = 'Contributor Validator';
