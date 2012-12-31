<?php
/**
 * build.php - Build Jcrop demo files
 *
 * It's become easier to build the demo files from a template than to
 * manage them manually. To rebuild the demo files you should run
 * build/build-all.bash which in turn calls this file
 */

// Make sure we know what directory we're in
chdir(dirname(__FILE__));

// Require tmpl class which does our rendering
require_once('../lib/tmpl.php');

// Generic class for our demo pages
// Each of the demo files below will create one of these objects
class demoDef extends tmplDef {
  public $js = array(
    '../js/jquery.min.js',
    '../js/jquery.Jcrop.js',
  );
  public $css = array(
    'demo_files/main.css',
    'demo_files/demos.css',
    '../css/jquery.Jcrop.css',
  );
}

// Specify output directory
if (!defined('DEMO_DIR'))
  define('DEMO_DIR','../../demos');

// Specify the demo files to build
$build_these = array(
  'hello-world' => 'tutorial1.html',
  'basic-handler' => 'tutorial2.html',
  'preview-pane' => 'tutorial3.html',
  'transitions' => 'tutorial4.html',
  'api-demo' => 'tutorial5.html',
  'non-image' => 'non-image.html',
  'styling' => 'styling.html',
);

// Build each one
foreach($build_these as $key=>$out){
  file_put_contents(
    $outfile=sprintf('%s/%s',DEMO_DIR,$out),
    tmpl::render(tmpl::loader($key))
  );
  printf("Wrote %s to %s\n",$key,$outfile);
}
