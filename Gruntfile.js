'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    eslint: {
      target: ['lib/**/*.js']
    },

    simplemocha: {
      unit: {
        src: 'test/unit/**/*.js',
        options: {
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        }
      },
      integration: {
        src: 'test/integration/**/*.js',
        options: {
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // Default task.
  grunt.registerTask('test', ['simplemocha:unit', 'simplemocha:integration']);

  grunt.registerTask('default', ['eslint', 'test']);

};
