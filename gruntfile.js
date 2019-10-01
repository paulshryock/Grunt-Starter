module.exports = function (grunt) {
  const defaults = {
    html: {
      src: './src/*.html',
      dest: './build',
      output: './build/**/*.html'
    },
    css: {
      src: './src/_assets/css/style.css',
      dest: './build/css',
      output: './build/css/bundle.css'
    },
    js: {
      root: './*.js',
      src: './src/_assets/js/**/*.js',
      dest: './build/js',
      output: './build/js/bundle.js'
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
      css: [defaults.css.output, `${defaults.css.output}.map`],
      js: [defaults.js.output, `${defaults.js.output}.map`]
    },

    // Copy files
    copy: {
      html: {
        files: [
          { expand: true, flatten: true, src: [defaults.html.src], dest: defaults.html.dest, filter: 'isFile' }
        ]
      },
      assets: {
        // TODO: Process fonts
        fonts: {
          files: [
            { expand: true, src: [defaults.fonts.src], dest: defaults.fonts.dest, filter: 'isFile' }
          ]
        },
        // TODO: Process images
        images: {
          files: [
            { expand: true, src: [defaults.images.src], dest: defaults.images.dest, filter: 'isFile' }
          ]
        },
        // TODO: Process favicon
        favicon: {
          files: [
            { expand: true, flatten: true, src: [defaults.favicon.src], dest: defaults.favicon.dest, filter: 'isFile' }
          ]
        }
      }
    },

    jsbeautifier: {
      html: {
        src: [defaults.html.output],
        options: {
          html: {
            indentSize: 2
          }
        }
      },
      css: {
        src: [defaults.css.output],
        options: {
          css: {
            indentSize: 2
          }
        }
      },
      js: {
        src: [defaults.js.output],
        options: {
          js: {
            indentSize: 2
          }
        }
      }
    },

    // Lint CSS
    stylelint: {
      options: {
        formatter: 'string',
        syntax: 'scss',
        extends: ['stylelint-config-standard']
      },
      src: ['src/_assets/css/**/*.css']
    },

    // Process CSS
    postcss: {
      process: {
        options: {
          // map: true, // inline sourcemaps

          // or
          map: {
            inline: false, // save all sourcemaps as separate files...
            annotation: 'build/css/' // ...to the specified directory
          },

          processors: [
            require('postcss-easy-import'), // @import files
            require('precss'), // Transpile Sass-like syntax
            require('postcss-preset-env'), // Polyfill modern CSS
            require('autoprefixer'), // Add vendor prefixes
            require('pixrem')() // Add fallbacks for rem units
          ]
        },
        src: defaults.css.src,
        dest: defaults.css.output
      },
      minify: {
        options: {
          map: true, // inline sourcemaps

          // or
          // map: {
          // inline: false, // save all sourcemaps as separate files...
          // annotation: 'build/css/maps/' // ...to the specified directory
          // },

          processors: [
            require('cssnano') // Minify
          ]
        },
        src: defaults.css.output,
        dest: './build/css/bundle.min.css'
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

    // Concatenate and rename .js files
    concat: {
      options: {
        separator: ';\n',
        sourceMap: true
      },
      js: {
        src: [defaults.js.src],
        dest: defaults.js.output
      }
    },

    // Compile ECMAScript 2015+ into a backwards compatible version of JavaScript
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          './build/js/bundle.js': defaults.js.output
        }
      }
    },

    // Minify .js bundle with uglify
    uglify: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          './build/js/bundle.min.js': defaults.js.output
        }
      }
    },

    // Run tasks whenever watched files change
    watch: {
      html: {
        files: [defaults.html.src],
        tasks: ['build:html']
      },
      css: {
        files: [defaults.css.src],
        tasks: ['build:css', 'minify:css']
      },
      js: {
        files: [defaults.js.root, defaults.js.src],
        tasks: ['build:js', 'minify:js']
      },
      fonts: {
        files: [defaults.fonts.src],
        tasks: ['copy:fonts']
      },
      images: {
        files: [defaults.images.src],
        tasks: ['copy:images']
      },
      favicon: {
        files: [defaults.favicon.src],
        tasks: ['copy:favicon']
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
  grunt.loadNpmTasks('grunt-jsbeautifier')
  grunt.loadNpmTasks('grunt-stylelint')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-babel')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-connect')

  grunt.registerTask('default', 'build')
  grunt.registerTask('build', ['develop', 'minify:css', 'minify:js'])
  grunt.registerTask('build:html', ['copy:html', 'jsbeautifier:html'])
  grunt.registerTask('build:css', ['stylelint', 'postcss:process', 'jsbeautifier:css'])
  grunt.registerTask('build:js', ['standard', 'concat:js', 'babel', 'jsbeautifier:js'])
  grunt.registerTask('minify:css', ['postcss:minify', 'clean:css'])
  grunt.registerTask('minify:js', ['uglify', 'clean:js'])
  grunt.registerTask('develop', ['clean:build', 'build:html', 'copy:assets', 'build:css', 'build:js'])
  grunt.registerTask('serve', ['develop', 'connect'])
}
