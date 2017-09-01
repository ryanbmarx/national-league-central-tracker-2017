module.exports = function(grunt) {
  var config = {};

  // Put your JavaScript library dependencies here. e.g. jQuery, underscore,
  // etc.
  // You'll also have to install them using a command similar to:
  //     npm install --save jquery
  var VENDOR_LIBRARIES = [
    'd3'
  ];

  config.browserify = {
    options: {
      browserifyOptions: {
        debug: true
      }
    },
    app: {
      src: ['js/src/app.js'],
      dest: 'js/app.min.js',
      options: {
        plugin: [
          [
            'minifyify', {
              map: 'app.min.js.map',
              output: './js/app.min.js.map'
            }
          ]
        ],
        transform: [
          [
            'babelify', {
              presets: ['es2015']
            }
          ]
        ]
      }
    }
  };

  // Check if there are vendor libraries and build a vendor bundle if needed
  if (VENDOR_LIBRARIES.length) {
    config.browserify.app.options = config.browserify.app.options || {};
    config.browserify.app.options.exclude = VENDOR_LIBRARIES;

    config.browserify.vendor = {
      src: [],
      dest: 'js/vendor.min.js',
      options: {
        plugin: [
          [
            'minifyify', {
              map: 'vendor.min.js.map',
              output: './js/vendor.min.js.map'
            }
          ]
        ],
        require: VENDOR_LIBRARIES
      }
    };
  }

  config.sass = {
    options: {
      outputStyle: 'compressed',
      sourceMap: true,
      includePaths: [ 'sass/', 'node_modules/trib-styles/sass/' ]
    },
    app: {
      files: {
        'css/styles.css': 'sass/styles.scss'
      }
    }
  };

  config.watch = {
    sass: {
      files: ['sass/**/*.scss'],
      tasks: ['sass', 'postcss']
    },
    js: {
      files: ['js/src/**/*.js'],
      tasks: ['browserify:app']
    },
    svgstore: {
      files: ['img/src/**/*.svg'],
      tasks: ['svgstore']
    }
  };

  config.postcss = {
    options: {
      // map: true, // inline sourcemaps

      // or
      // map: {
      //     inline: false, // save all sourcemaps as separate files...
      //     annotation: 'dist/css/maps/' // ...to the specified directory
      // },

      processors: [
        // require('pixrem')(), // add fallbacks for rem units
        require('autoprefixer')(), // add vendor prefixes
        require('cssnano')() // minify the result
      ]
    },
    dist: {
      src: 'css/*.css'
    }
  }

  config.svgstore = {
    options: {
      cleanup:false,
      cleanupdefs:false
      // prefix : 'icon-', // This will prefix each ID 
      // svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG 
      //   viewBox : '0 0 100 100',
      //   xmlns: 'http://www.w3.org/2000/svg'
      // }
    },
    min: {
      // Target-specific file lists and/or options go here. 
      src:['img/src/**/*.svg'],
      dest:'img/sprite.svg'
    },
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');

  var defaultTasks = [];

  defaultTasks.push('sass');
  defaultTasks.push('browserify');
  defaultTasks.push('svgstore');
  defaultTasks.push('postcss');

  grunt.registerTask('default', defaultTasks);
};