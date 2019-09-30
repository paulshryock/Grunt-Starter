module.exports = function (grunt) {
  var defaults = {
    html: {
      src: './src/*.html',
      dest: './build'
    },
    css: {
      src: './src/_assets/css/style.scss',
      dest: './build/css',
      bundle: './build/css/bundle.css'
    },
    js: {
      root: './*.js',
      src: './src/_assets/js/**/*.js',
      dest: './build/js',
      bundle: './build/js/bundle.js'
    },
    fonts: {
      src: './src/_assets/fonts/**/*',
      dest: './build/fonts'
    },
    images: {
      src: './src/_assets/img/**/*',
      dest: './build/img'
    },
    favicon: {
      src: './src/_assets/favicon/**/*',
      dest: './build'
    }
  }

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Clean build directory
    clean: {
      build: ['build'],
      bundles: [defaults.css.bundle, defaults.js.bundle]
    },

    // Copy files
    copy: {
      main: {
        files: [
          { expand: true, flatten: true, src: [defaults.html.src], dest: defaults.html.dest, filter: 'isFile' },
          { expand: true, src: [defaults.fonts.src], dest: defaults.fonts.dest, filter: 'isFile' },
          { expand: true, src: [defaults.images.src], dest: defaults.images.dest, filter: 'isFile' },
          { expand: true, flatten: true, src: [defaults.favicon.src], dest: defaults.favicon.dest, filter: 'isFile' }
        ]
      }
    },

    // Compile Sass files
    sass: {
      dist: {
        files: {
          'build/css/bundle.css': defaults.css.src
        }
      }
    },

    // ES5: Lint .js files with jshint
    jshint: {
      files: [defaults.js.root, defaults.js.src],
      option: {
        globals: {
          console: true,
          module: true
        }
      }
    },

    // ES6: Lint .js files with standard
    standard: {
      options: {
        fix: true
      },
      app: {
        src: [
          defaults.js.root,
          defaults.js.src
        ]
      }
    },

    // Concatenate .js files
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: [defaults.js.src],
        dest: defaults.js.bundle
      }
    },

    // Minify .js bundle with uglify
    uglify: {
      dist: {
        files: {
          './build/js/bundle.min.js': defaults.js.bundle
        }
      }
    },

    // Run tasks whenever watched files change
    watch: {
      html: {
        files: [defaults.html.src]
      },
      sass: {
        files: [defaults.css.src],
        tasks: ['sass']
      },
      js: {
        files: [defaults.js.root, defaults.js.src],
        tasks: ['standard', 'concat', 'uglify']
      },
      options: {
        livereload: {
          host: 'localhost',
          post: 8000,
          reload: true
        }
      }
    },

    // Serve files and live reload
    connect: {
      server: {
        options: {
          base: 'build',
          port: 8000,
          hostname: 'localhost',
          livereload: true,
          keepalive: true
        }
      }
    }

  })

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-connect')

  grunt.registerTask('default', 'build')
  grunt.registerTask('build', ['develop', 'clean:bundles'])
  grunt.registerTask('develop', ['clean:build', 'copy', 'sass', 'standard', 'concat', 'uglify'])
  grunt.registerTask('serve', ['develop', 'connect'])
}
