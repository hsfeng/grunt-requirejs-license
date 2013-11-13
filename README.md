# grunt-requirejs-license

> Grunt task to collect license information of dependencies used in a RequireJS project.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-requirejs-license --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-requirejs-license');
```

## The "requirejs_license" task

### Overview
In your project's Gruntfile, add a section named `requirejs_license` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    requirejs: {
      	....
      	requirejs_target:{
      		...
      	}
    },
  	requirejs_license: {
    	options: {
      		// Task-specific options go here.            
    	},
    	named_your_target_the_same_as_requirejs: {
      		// Target-specific options go here.
    	}
  	}
})
```

### Options

#### options.extension
Type: `String`
Default value: `licenses`

A string value that is used to license filename extension

### Usage Examples

#### Default Options
In this example, default options are used to output files with the extension ".license". 

```js
grunt.initConfig({
  	requirejs : {
  		...
  		compile : {
  			...
  			//your requirejs options
  		}
  	},
  	requirejs_license: {
    	options: {
    	},
    	compile: {
    	},
  	}
})
```

#### Custom Options
In this example, custom options are used to output files with the extension ".lic". 


```js
grunt.initConfig({
	requirejs : {
  	...
  		compile : {
  			...
  			//your requirejs options
  		}
  	},
  	requirejs_license: {
  		options: {
    		extension : 'lic'
    	},
    	compile: {
    	},
  },
})

```

## Release History
v0.1.0   Initial release.
