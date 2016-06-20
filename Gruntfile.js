'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      release: {
        files: {
          'dist/image-uploader.min.js': [
            'src/image-uploader.js'
          ]
        }
      },
      bundle: {
        files: {
          'dist/image-uploader.bundle.min.js': [
            'node_modules/aws-sdk/dist/aws-sdk.js',
            'src/image-uploader.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('default', ['build']);
};