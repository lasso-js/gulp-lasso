'use strict';
var path = require('path'),
    through = require('through2'),
    optimizer = require('optimizer'),
    injector = require('./lib/html-injector'),
    gutil = require('gulp-util'),
    fs = require('fs');

module.exports = function (options) {
    //Path to a JSON optimizer configuration file
    var configFile = options.configFile || "optimizer-config.json", //if no configFile specified, default to optimizer-config.json in the current directory
        name = options.name || 'default',
        packagePath = options.packagePath || null,
        dependencies = options.dependencies || null,
        plugins = options.plugins || null,
        mode = options.mode || null,
        pageOptmizerConfig;

    try {
        pageOptmizerConfig = JSON.parse(fs.readFileSync(configFile, {encoding: 'utf8'}));
    } catch(e) {
        console.error('Unable to parse JSON config file at path "' + pageOptmizerConfig + '". Exception: ' + e);
        process.exit(1);
    }

    if(plugins) {
        pageOptmizerConfig.plugins = plugins;
    }
    if(mode) {
        pageOptmizerConfig.minify = (mode === "production") ? true : false;
        pageOptmizerConfig.bundlingEnabled = (mode === "production") ? true : false;
    }

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-optimizer', 'Streaming not supported'));
            return;
        }

        var str = file.contents.toString();
        var filePath = file.path;

        try {
            optimizer.configure(pageOptmizerConfig);
            optimizer.optimizePage({
                    dependencies: dependencies,
                    name: name,

                },
                function(err, optimizedPage) {
                    if (err) {
                        cb(new gutil.PluginError('gulp-optimizer', err, {
                            fileName: filePath
                        }));
                    }

                    file.contents = new Buffer(injector.inject(str, optimizedPage));
                    cb(null, file);
                }
            );
            
        } catch (err) {
            cb(new gutil.PluginError('gulp-optimizer', err, {
                fileName: filePath
            }));
        }
    });
};