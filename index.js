'use strict';
var through = require('through2');
var optimizer = require('optimizer');
var injector = require('./lib/html-injector');
var gutil = require('gulp-util');
var fs = require('fs');
var extend = require('raptor-util/extend');
var PluginError = gutil.PluginError;

module.exports = function (options) {
    //Path to a JSON optimizer configuration file
    var configFile = options.configFile;
    var name = options.name || 'default';
    var dependencies = options.dependencies || [];
    var mode = options.mode || null;
    var config = {};

    if (mode) {
        config.minify = (mode === "production") ? true : false;
        config.bundlingEnabled = (mode === "production") ? true : false;
        config.fingerprintsEnabled = (mode === "production") ? true : false;
    }

    extend(config, options);

    delete config.dependencies;
    delete config.mode;

    if (configFile) {
        try {
            extend(config, JSON.parse(fs.readFileSync(configFile, {encoding: 'utf8'})));
        } catch(e) {
            console.error('Unable to parse JSON config file at path "' + config + '". Exception: ' + e);
            process.exit(1);
        }
    }

    return through.obj(function (file, enc, cb) {
        var stream = this;

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-optimizer', 'Streaming not supported'));
            return;
        }

        var str = file.contents.toString();

        optimizer.configure(config);
        optimizer.optimizePage({
                dependencies: dependencies,
                name: name
            },
            function(err, optimizedPage) {
                // console.log('ERROR: ', err);
                if (err) {
                    stream.emit('error', err);
                    return;
                }

                file.contents = new Buffer(injector.inject(str, optimizedPage));
                cb(null, file);
            }
        );
    });
};