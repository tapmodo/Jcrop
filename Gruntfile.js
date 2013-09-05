module.exports = function(grunt) {

  // These are the files used in order to build the Jcrop.js source
  // variable is used in initConfig concat rule below
  // also used for the watch task
  var jcrop_sources = [
    'src/intro.js',
    'src/filter/*.js',
    'src/component/*.js',
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
          "css/Jcrop.css": "src/css/Jcrop.less"
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
  grunt.registerTask('default', ['js','css']);
  grunt.registerTask('js', ['concat','uglify']);
  grunt.registerTask('css', ['less','cssmin']);

};
