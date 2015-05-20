module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['src/*.js'],
      tasks: []
    },
    concat: {
      options: {
        separator: ';',
      },
    dist: {
        // Order is important! gameLogic.js must be first because it defines myApp angular module.
        src: ['gameLogic.js', 'game.js', 'aiService.js'],
        dest: 'dist/everything.js',
      },
             },
    uglify: {
      options: {
        sourceMap: true,
      },
      my_target: {
        files: {
          'dist/everything.min.js': ['dist/everything.js'],
        }
      }
    },
    processhtml: {
      dist: {
        files: {
          'game.min.html': ['game.html']
        }
      }
    },
    manifest: {
      generate: {
        options: {
          basePath: '.',
          cache: [
             'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js',
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.min.js',
            'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
            'http://yoav-zibin.github.io/emulator/dist/turnBasedServices.2.min.js',
            'http://yoav-zibin.github.io/emulator/main.css',
            'dist/everything.min.js',
            'languages/en.js',
            'languages/zh.js',
            'game.css',
            'img/boardDark.png',
            'img/boardLight.png',
            'img/newblackStone.png',
            'img/newwhiteStone.png'
          ],
          network: ['dist/everything.min.js.map', 'dist/everything.js'],
          timestamp: true
        },
        dest: 'game.appcache',
        src: []
      }
    },
    });
 


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-manifest');
//  grunt.loadNpmTasks('grunt-http-server');
//  grunt.loadNpmTasks('grunt-protractor-runner');

  // Default task(s).
  grunt.registerTask('default', [
      'concat', 'uglify',
      'processhtml', 'manifest'//,
      //'http-server', 'protractor'
      ]);

};