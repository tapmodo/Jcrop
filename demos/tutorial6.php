<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
	$src="demo_files/pool.jpg";
	$img_w=$_POST['img_w'];
	$img_h=$_POST['img_h'];
	
	list($original_w,$original_h)=getimagesize($src);
	
	$ratio_w=$img_w/$original_w;
	$ratio_h=$img_h/$original_h;
	
	$jpeg_quality = 90;
	
	$x=round($_POST['x']/$ratio_w);
	$y=round($_POST['y']/$ratio_h);
	$w=round($_POST['w']/$ratio_w);
	$h=round($_POST['h']/$ratio_h);
	
	$targ_w = $w;
	$targ_h = $h;
	
	
	
	$img_r = imagecreatefromjpeg($src);
	$dst_r = ImageCreateTrueColor( $targ_w, $targ_h );
	
	imagecopyresampled($dst_r,$img_r,0,0,$x,$y,
	$targ_w,$targ_h,$w,$h);

	header('Content-type: image/jpeg');
	imagejpeg($dst_r,null,$jpeg_quality);

	exit;
}
?>
<!DOCTYPE html>
<!--
	*This demo focus on Zoom in and Zoom out Feature
	* Contributed by Prashant Preetam
-->

<html lang="en">
<head>
  <title>API Demo | Jcrop Demo</title>
  <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />

<script src="../js/jquery.min.js"></script>
<script src="../js/jquery.Jcrop.js"></script>
<link rel="stylesheet" href="demo_files/main.css" type="text/css" />
<link rel="stylesheet" href="demo_files/demos.css" type="text/css" />
<link rel="stylesheet" href="../css/jquery.Jcrop.css" type="text/css" />
<script type="text/javascript">

/*
 * Variable height and width is used for
 * Zooming, Default Zoom(CSS) should not be used
 */
 	var height;
 	var width;
 	
 	/*
 	 * Following code-4 lines will intiate height and width
 	 */
 	$(document).ready(function(){
 		height=$('#target').height();
		width=$('#target').width();
		
 	});
	
	/*
	 * startClip function used to start area selection on image
	 * Using a trigger button
	 * Trigger button id=addClass
	 * 
	 */
	var myJcrop;
    function startClip(){

  
      myJcrop = $.Jcrop('#target', {
          
          onSelect: updateCoords,
          onRelease: destroyApi
         
      });
      $("#unhook").show();
      $(".zoom").hide();
      $("#addClass").hide();
   };
   
   function destroyApi()
   {
   	myJcrop.destroy();
   	$('#crop').hide();
   	$('.zoom').show();
   	$("#addClass").show();
   }
	/*
	 * zoomIn function is used to zoom into the image
	 * triggered by button
	 * button id=zoom-id
	 * Call this function by any button with onclick response as zoomIn()
	 */
	function zoomIn(){
		var ratio=$('#ratio').val();
		ratio=parseFloat(ratio)+0.1;
		var newWidth=width*ratio;

		var newHeight=height*ratio;
		ratio=ratio.toString();
		$('#target').width(newWidth);
		$('#target').height(newHeight);
		
		$('#ratio').val(ratio);
	}
	
	/*
	 * Similar to zoomIn
	 * used to zoom out of the image
	 */
	function zoomOut(){
		var ratio=$('#ratio').val();
		ratio=parseFloat(ratio)-0.1;
		var newWidth=width*ratio;

		var newHeight=height*ratio;
		ratio=ratio.toString();
		$('#target').width(newWidth);
		$('#target').height(newHeight);
		
		$('#ratio').val(ratio);
	}
  
/*
 * This function is used to update the hidden form with coordinates
 * This function comes with Plugin-JCrop
 */
  function updateCoords(c)
  {
  	
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
    $('#img_w').val($("#target").width());
    $('#img_h').val($('#target').height());
    
    var x=$('.jcrop-tracker').offset();
    
    var boxWidth=$('.jcrop-tracker').width();
    var buttonWidth=$('#crop').width();
    var left=(x.left+(boxWidth-buttonWidth)/2)-15;
    
    var top=x.top-$('#crop').height()-15;
    
    $('#crop').css({'position':'absolute','left':left,'top':top,'z-index':'1000','display':'block'});
    
  };
//this function is used to check if form is complete or not
  function checkCoords()
  {
    if (parseInt($('#w').val())) return true;
    alert('Please select a crop region then press submit.');
    return false;
  };
  
  //sendForCrop() function is used to send data to php file where actual cropping is done
  //and cropped image is saved
  
		
		
  
  
  
</script>
<style type="text/css">
  #target {
    background-color: #ccc;
    width: 500px;
    height: 330px;
    font-size: 24px;
    display: block;
  }


</style>
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
  <li class="active">API Demo</li>
</ul>
<h1>API Demo</h1>
</div>

  <img src="demo_files/pool.jpg" id="target" alt="[Jcrop Example]" />

  

		<!-- This is the form that our event handler fills -->
		<form action="#" method="post" >
			<input type="hidden" id="x" name="x" />
			<input type="hidden" id="y" name="y" />
			<input type="hidden" id="w" name="w" />
			<input type="hidden" id="h" name="h" />
			<input type="hidden" id="img_w" name="img_w" />
			<input type="hidden" id="img_h" name="img_h" />
			<input type="hidden" id="ratio" name="ratio" value="1">
			<input class="btn btn-info" style="display:none;position:absolute;" id="crop" type="submit" value="Crop Image" onclick="sendForCrop();" class="btn btn-large btn-inverse" />
		</form>

		<button id="addClass" onclick="startClip()" class="btn btn-mini" type="button">Select Area</button>
		<button  onclick="zoomIn()" class="btn btn-mini zoom" type="button ">Zoom in</button>
		<button type="button"  class="btn btn-mini zoom" onclick="zoomOut()">Zoom Out</button>
		<button type="button" id="unhook"  class="btn btn-mini" style="display: none;" onclick="destroyApi()">Destroy</button>





<div class="tapmodo-footer">
  <a href="http://tapmodo.com" class="tapmodo-logo segment">tapmodo.com</a>
  <div class="segment"><b>&copy; 2008-2014 Tapmodo Interactive LLC</b><br />
    Jcrop is free software released under <a href="../MIT-LICENSE.txt">MIT License</a>
  </div>
</div>

<div class="clearfix"> </div>

</div>
</div>
</div>
</div>

</body>
</html>

