module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    clean: ['js/plzxplain.min.js'],
    uglify: {
      all: {
        files: {
          'js/plzxplain.min.js': [
            'vendor/jquery/jquery.js',
            'vendor/esprima/esprima.js',
            'vendor/codemirror/lib/codemirror.js',
            'vendor/codemirror/mode/javascript/javascript.js',
            'vendor/raphael/raphael.js',
            'vendor/flowchart/flowchart-1.2.5.js',
            'js/index.js',
            'js/parser.js']
        }
      }
    }
  });

  // Modules
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['clean', 'uglify']);

};