<?php

$mydate = getenv('JCROP_COPYRIGHT')?:date('Y');

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title><?=$tmpl->title?"{$tmpl->title} | Jcrop Demo":'Demo | Jcrop Demo'?></title>
  <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />

<?php

if (is_array($tmpl->js) and count($tmpl->js))
  foreach($tmpl->js as $row)
    printf("<script src=\"%s\"></script>\n",$row);

if ($tmpl->js_inline)
  printf("<script type=\"text/javascript\">\n%s\n</script>\n",$tmpl->js_inline);

if (is_array($tmpl->css) and count($tmpl->css))
  foreach($tmpl->css as $row)
    printf("<link rel=\"stylesheet\" href=\"%s\" type=\"text/css\" />\n",$row);

if ($tmpl->css_inline)
  printf("<style type=\"text/css\">\n%s\n</style>\n",$tmpl->css_inline);

?>

</head>
<body>

<div class="container">
<div class="row">
<div class="span12">
<div class="jc-demo-box">

<div class="page-header">
<ul class="breadcrumb first">
  <li><a href="../index.html">Jcrop</a> <span class="divider">/</span></li>
  <li><a href="../index.html">Demos</a> <span class="divider">/</span></li>
  <li class="active"><?=$tmpl->name?></li>
</ul>
<h1><?=$tmpl->title?></h1>
</div>

<?=$tmpl->content?>

<div class="tapmodo-footer">
  <a href="http://tapmodo.com" class="tapmodo-logo segment">tapmodo.com</a>
  <div class="segment"><b>&copy; 2008-<?=$mydate?> Tapmodo Interactive LLC</b><br />
    Jcrop is free software released under <a href="../MIT-LICENSE.txt">MIT License</a>
  </div>
</div>

<div class="clearfix"></div>

</div>
</div>
</div>
</div>

</body>
</html>

