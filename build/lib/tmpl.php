<?php

class tmplDef {
  public $key;        // Basic key
  public $name;       // Short name
  public $desc;       // Short description
  public $title;      // Optional page title
  public $content;    // Full content
  public $js_inline;  
  public $css_inline;  
  public $js = array();
  public $css = array();
  public $meta = array();

  function __construct(array $cfg=array()){
    foreach($cfg as $k=>$v){
      if (property_exists($this,$k)) {
        if (is_array($this->$k)) $this->$k = array_merge($this->$k,(array)$v);
          else $this->$k = $v;
      }
        else throw new Exception("unknown configuration key {$k}");
    }
  }
  function get_template(){
    return sprintf('%s/../template.php',$this->path);
  }
  function get_path(){
    return sprintf('./%s',$this->key);
  }
  function __get($k){
    if (property_exists($this,$k)) return $this->$k;

      elseif (method_exists($this,$m="get_{$k}")) 
        return call_user_func(array($this,$m));

    return null;
  }
}

class tmpl {
  static function render(tmplDef $tmpl){
    $data = $tmpl->meta;
    $data['tmpl'] = $tmpl;
    return self::renderRaw($tmpl->template,$data);
  }
  static function renderRaw($fn,array $data=array()){
    if (!is_readable($fn)) throw new Exception('view not readable');
    extract($data);
    ob_start();
    require $fn;
    return ob_get_clean();
  }
  static function loader($key){
    if (!is_readable($fn="{$key}/page.php"))
      throw new Exception('definition not readable');

    require $fn;

    if (!isset($page) or !$page instanceof tmplDef)
      throw new Exception('definition corrupt');

    $page->key = $key;
    $page->name or $page->name = $page->key;
    $page->title or $page->title = $page->name;
    $data = $page->meta;
    $data['tmpl'] = $page;

    if (!is_readable($fn=sprintf('%s/content.html',$page->path)))
      throw new Exception("content missing {$fn}");
      
    $page->content = self::renderRaw($fn,$data);

    if (is_readable($fn=sprintf('%s/inline.js',$page->path)))
      $page->js_inline = self::renderRaw($fn,$data);

    if (is_readable($fn=sprintf('%s/inline.css',$page->path)))
      $page->css_inline = self::renderRaw($fn,$data);

    return $page;
  }
}

