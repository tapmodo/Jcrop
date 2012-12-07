module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      meta: {
          banner: "/**\n" +
          " * jquery.Jcrop.min.js v<%= pkg.version %> (build:<%= grunt.template.today('yyyymmdd') %>)\n" +
          " * jQuery Image Cropping Plugin - released under MIT License\n" +
          " * Copyright (c) 2008-2012 Tapmodo Interactive LLC\n" + 
          " * https://github.com/tapmodo/Jcrop\n" +
          " */"
      },

      lint: {
          files: ["grunt.js", "js/jquery.Jcrop.js"]
      },

      min: {
          "js/jquery.Jcrop.min.js": ["<banner>", "js/jquery.Jcrop.js"]
      },
      jshint: {
          globals: {$:true,define:true}
      }
  });

  // Default task.
  grunt.registerTask("default", "lint");

};
