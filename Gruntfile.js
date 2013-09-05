module.exports = function(grunt) {

  var jcrop_sources = [
    'src/intro.js',
    'src/filter/ConstrainFilter.js',
    'src/filter/ExtentFilter.js',
    'src/filter/BackoffFilter.js',
    'src/filter/RatioFilter.js',
    'src/filter/RoundFilter.js',
    'src/filter/ShadeFilter.js',
    'src/filter/GridFilter.js',
    'src/DragState.js',
    'src/CropAnimator.js',
    'src/KeyWatcher.js',
    'src/StageDrag.js',
    'src/StageManager.js',
    'src/Selection.js',
    'src/ImageLoader.js',
    'src/JcropTouch.js',
    'src/constructor.js',
    'src/static.js',
    'src/api.js',
    'src/plugin.js',
    'src/outro.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %>.js v<%= pkg.version %> - build: <%= grunt.template.today("yyyymmdd") %>\n'+
          ' *  @copyright 2008-2013 Tapmodo Interactive LLC\n' +
          ' *  @license Free software under MIT License\n'+
          ' *  @website http://jcrop.org/\n'+
          ' **/\n'
      },
      dist: {
        src: jcrop_sources,
        dest: 'js/<%= pkg.name %>.js'
      }
    },
    less: {
      css: {
        files: {
          "css/Jcrop.css": "build/less/Jcrop.less"
        }
      }
    },
    cssmin: {
      main: {
        options: {
          banner: '/*! <%= pkg.name %>.min.css v<%= pkg.version %> - build: <%= grunt.template.today("yyyymmdd") %>\n'+
            ' *  Copyright 2008-2013 Tapmodo Interactive LLC\n' +
            ' *  Free software under MIT License\n'+
            ' **/\n'
        },
        files: {
          "css/Jcrop.min.css": "css/Jcrop.css"
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>.min.js v<%= pkg.version %> - build: <%= grunt.template.today("yyyymmdd") %>\n' +
          ' *  Copyright 2008-2013 Tapmodo Interactive LLC\n' +
          ' *  Free software under MIT License\n'+
          ' **/\n'
      },
      build: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'js/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['less','concat','uglify','cssmin']);

};
