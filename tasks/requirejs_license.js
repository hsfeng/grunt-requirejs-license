/*
 * grunt-requirejs-license
 * https://github.com/sam/grunt-requirejs-license
 *
 * Copyright (c) 2013 hsfeng
 * Licensed under the MIT license.
 */'use strict';

module.exports = function(grunt) {

	var _ = require('underscore'),
		path = require('path');

	if ( typeof String.prototype.endsWith !== 'function') {
		String.prototype.endsWith = function(suffix) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
	}

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('requirejs_license', 'Grunt task to collect license information of dependencies used in a requirejs project.', function() {
		
		
		delete require.cache[require.resolve('requirejs')];
		
		var requirejs = require('requirejs');
		
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
		
		grunt.verbose.writeflags(requireConfig, 'RequireJS Options');
		
		
		requirejs.tools.useLib(function(require) {
			require(["optimize", "build"], function(optimize, build) {
				optimize.optimizers.uglify = function() {
					return '';
				};

				//optimizing a whole project
				if (!_.isUndefined(requireConfig.out) && !_.isUndefined(requireConfig.name)) {
					requireConfig = _.extend({}, requireConfig);
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
						var dir = path.join(requireConfig.dir , requireConfig.baseUrl);
						var moduleConfig = _.extend({}, requireConfig); 
						moduleConfig = _.extend(moduleConfig, m);
						moduleConfig = _.extend(moduleConfig, {
							preserveLicenseComments : true,
							generateSourceMaps : false,
							optimize : 'uglify',
							optimizeCss : 'none',
							findNestedDependencies : false,
							name : m.name,
							out : path.join(dir , m.name + '.js.' + extension)
						});
						delete moduleConfig.dir;
						delete moduleConfig.appDir;
						delete moduleConfig.modules;
						grunt.log.writeflags(moduleConfig, 'Options');
						build._run(moduleConfig);
					});
				}

				done();
			});
		});
	});

};
