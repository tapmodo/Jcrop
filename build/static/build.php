<?php

chdir(dirname(__FILE__));
require_once('../lib/tmpl.php');

class docDef extends tmplDef {
  public $output;
  public $css = array(
    '../css/jquery.Jcrop.css',
    'assets/doc.css',
  );
}

if (!defined('DOC_DIR'))
  define('DOC_DIR','../../');

$build_these = array(
  'docs/index.html' => 'tutorial1.html',
  'docs/basic-handler' => 'tutorial2.html',
  'preview-pane' => 'tutorial3.html',
  'transitions' => 'tutorial4.html',
  'api-demo' => 'tutorial5.html',
);

$demos = array();

foreach($build_these as $key=>$out){
  
  file_put_contents(
    $outfile=sprintf('%s/%s',DOC_DIR,$out),
    tmpl::render(tmpl::loader($key))
  );
  printf("Wrote %s to %s\n",$key,$outfile);
}

