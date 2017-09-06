module.exports = function(grunt) {
  var config = {};

  var VENDOR_LIBRARIES = [
    "d3"
  ];

  config.browserify = {
    options: {
      browserifyOptions: {
        debug: true
      }
    },
    app: {
      src: ["js/src/app.js"],
      dest: "js/app.min.js",
      options: {
        plugin: [
          [
            "minifyify", {
              map: "app.min.js.map",
              output: "./js/app.min.js.map"
            }
          ]
        ],
        transform: [
          [
            "babelify", {
              presets: ["es2015"]
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
      dest: "js/vendor.min.js",
      options: {
        plugin: [
          [
            "minifyify", {
              map: "vendor.min.js.map",
              output: "./js/vendor.min.js.map"
            }
          ]
        ],
        require: VENDOR_LIBRARIES
      }
    }
  }

  config.sass = {
    options: {
      outputStyle: "compressed",
      sourceMap: true,
      includePaths: [ "sass/", "node_modules/trib-styles/sass/" ]
    },
    app: {
      files: {
        "css/styles.css": "sass/styles.scss"
      }
    }
  };

  config.watch = {
    sass: {
      files: ["sass/**/*.scss"],
      tasks: ["sass", "postcss"]
    },
    js: {
      files: ["js/src/**/*.js"],
      tasks: ["browserify:app"]
    },
    // svgstore: {
    //   files: ["img/src/**/*.svg"],
    //   tasks: ["svgstore"]
    // },
    "convert-svg-to-png": {
      files: ["img/src/**/*.svg"],
      tasks: ["convert-svg-to-png"]
    }
  };

  config.postcss = {
    options: {
      processors: [
        // require("pixrem")(), // add fallbacks for rem units
        require("autoprefixer")(), // add vendor prefixes
        require("cssnano")() // minify the result
      ]
    },
    dist: {
      src: "css/*.css"
    }
  }

  // config.svgstore = {
  //   options: {
  //     cleanup:false,
  //     cleanupdefs:false
  //     // prefix : "icon-", // This will prefix each ID 
  //     // svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG 
  //     //   viewBox : "0 0 100 100",
  //     //   xmlns: "http://www.w3.org/2000/svg"
  //     // }
  //   },
  //   min: {
  //     // Target-specific file lists and/or options go here. 
  //     src:["img/src/**/*.svg"],
  //     dest:"img/sprite.svg"
  //   },
  // };

  config["convert-svg-to-png"] = {
    fallback: {
      options: {
        size: {
          w: '100px',
          h: '100px'
        }
      },
      files: [{
        expand: true,
        // cwd: "test/svg",
        src: ["img/src/**/*.svg"],
        dest: "img/logos"
      }]
    }
  };

  grunt.initConfig(config);
  
  grunt.loadNpmTasks("grunt-convert-svg-to-png");
  // grunt.loadNpmTasks("grunt-svgstore");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-postcss");

  var defaultTasks = [];

  defaultTasks.push("sass");
  defaultTasks.push("browserify");
  // defaultTasks.push("svgstore");
  defaultTasks.push("postcss");
  defaultTasks.push("convert-svg-to-png");

  grunt.registerTask("default", defaultTasks);
};