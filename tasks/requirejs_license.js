/*
 * grunt-requirejs-license
 * https://github.com/sam/grunt-requirejs-license
 *
 * Copyright (c) 2013 hsfeng
 * Licensed under the MIT license.
 */'use strict';

module.exports = function(grunt) {

	var requirejs = require('requirejs');
	var _ = require('underscore');

	if ( typeof String.prototype.endsWith !== 'function') {
		String.prototype.endsWith = function(suffix) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
	}

	// TODO: extend this to send build log to grunt.log.ok / grunt.log.error
	// by overriding the r.js logger (or submit issue to r.js to expand logging support)
	requirejs.define('node/print', [], function() {
		return function print(msg) {
			if (msg.substring(0, 5) === 'Error') {
				grunt.log.errorlns(msg);
				grunt.fail.warn('RequireJS failed.');
			} else {
				grunt.log.oklns(msg);
			}
		};
	});

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('requirejs_license', 'Grunt task to collect license information of dependencies used in a requirejs project.', function() {
		var done = this.async(), options = this.options({
			logLevel : 0,
			done : function(done, response) {
				done();
			}
		}), requireConfig, extension = this.options().extension;

		if (_.isUndefined(extension)) {
			extension = 'licenses';
		}

		this.requiresConfig("requirejs." + this.target);
		this.requiresConfig("requirejs." + this.target + '.options');

		requireConfig = grunt.config('requirejs')[this.target].options;

		grunt.verbose.writeflags(options, 'Options');

		requirejs.tools.useLib(function(require) {
			require(["optimize", "build"], function(optimize, build) {
				optimize.optimizers.uglify = function() {
					return '';
				};

				//optimizing a whole project
				if (!_.isUndefined(requireConfig.out) && !_.isUndefined(requireConfig.name)) {
					requireConfig = _.extend(requireConfig, {
						preserveLicenseComments : true,
						generateSourceMaps : false,
						optimize : 'uglify',
						optimizeCss : 'none',
						findNestedDependencies : true,
						out : requireConfig.out + '.' + extension
					});
					grunt.log.writeflags(requireConfig, 'Options');
					build._run(requireConfig);
					//optimizing multiple modules
				} else if (!_.isUndefined(requireConfig.modules)) {
					_.each(requireConfig.modules, function(m) {
						grunt.log.writeln('Collecting ' + m.name + '...');
						var dir;
						if (!_.isUndefined(requireConfig.dir)) {
							dir = requireConfig.dir;
							if (!dir.endsWith('/')) {
								dir += '/';
							}
						} else {
							dir = '';
						}
						var moduleConfig = _.extend(m, {
							preserveLicenseComments : true,
							generateSourceMaps : false,
							baseUrl : requireConfig.baseUrl,
							optimize : 'uglify',
							optimizeCss : 'none',
							findNestedDependencies : false,
							mainConfigFile : requireConfig.mainConfigFile,
							name : m.name,
							out : dir + m.name + '.js.' + extension
						});
						grunt.log.writeflags(moduleConfig, 'Options');
						build._run(moduleConfig);
					});
				}

				done();
			});
		});
	});

};
