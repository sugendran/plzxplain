module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      source_files: {
        files: ['Gruntfile.js', 'src/**/*.js', 'test/*.js'],
        tasks: ['default']
      }
    },
    clean: ['test/lib/*.js', 'js/main.js'],
    jasmine: {
      all: {
        src: ['test/lib/*.js']
      }
    },
    browserify: {
      main: {
        files: {
          'js/main.js': ['src/index.js']
        }
      },
      test: {
        files: {
          'test/lib/parser.js': ['test/*-parser.js']
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');


  grunt.registerTask('default', ['clean', 'browserify', 'jasmine']);
  grunt.registerTask('test', ['default']);

};