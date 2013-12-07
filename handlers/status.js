var repoClients,
    httpHandlers,
    config,
    validators;

function createHandlerReport(handlers, config) {
    var itemHtml = handlers.map(function(handlerConfig) {
        var urls = Object.keys(handlerConfig);
        return urls.map(function(url) {
            var handler = handlerConfig[url](repoClients, handlers, config, validators),
                name = handler.title,
                desc = handler.description;
                htmlOut = '<a target="_blank" href="' + url + '">' + name + '</a>: ' + desc;
            if (handler.disabled) {
                htmlOut = '<strike>' + htmlOut + '</strike>&nbsp;&nbsp;<strong>DISABLED</strong>';
            }
            return htmlOut;
        });
    });
    return  '<ul>\n<li>' + itemHtml.join('</li><li>') + '</li>\n</ul>\n';
}

function createMonitorReport(clients) {
    var itemHtml = Object.keys(clients).map(function(key) {
            return '<a target="_blank" href="http://github.com/' + key + '/">http://github.com/' + key + '</a>';
        });
    return  '<ul>\n<li>' + itemHtml.join('</li><li>') + '</li>\n</ul>\n';
}

function createValidatorReport(validators) {
    if (validators) {
        return  '<ul>\n<li>' + validators.join('</li><li>') + '</li>\n</ul>\n';
    } else {
        return '';
    }
}

function statusReporter(req, res) {
    var htmlOut = '<html><body>\n<h1>nupic.tools is alive</h1>\n';
    htmlOut += '<h3>This server is monitoring the following repositories:</h3>';
    htmlOut += createMonitorReport(repoClients);
    htmlOut += '<h3>The following validators are active:</h3>';
    htmlOut += createValidatorReport(validators);
    htmlOut += '<h3>Available add-on services:</h3>';
    htmlOut += createHandlerReport(httpHandlers, config);
    htmlOut += '</body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', htmlOut.length);
    res.end(htmlOut);
}

statusReporter.title = 'Status Reporter';
statusReporter.description = 'Reports the repositories this tools server is monitoring.';

module.exports = {
    '/status': function(_repoClients, _httpHandlers, _config, activeValidators) {
        repoClients = _repoClients;
        httpHandlers = _httpHandlers;
        config = _config;
        validators = activeValidators;
        return statusReporter;
    }
};
