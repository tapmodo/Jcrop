$(function(){

  $.canvasrot = function(canvas, image, opt) {
    if (typeof(opt) != 'object') opt = {};

    var options = $.extend({},$.canvasrot.defaults,opt),
        current_rot = 0,
        current_size = 1,
        cxt = canvas.getContext('2d');

    function redrawImage() {
      cxt.fillStyle = "rgb(0,0,0)";
      cxt.fillRect(0, 0, canvas.width, canvas.height);

      // Save the current context
      cxt.save();
      // Translate to the center point of our image
      cxt.translate(image.width * 0.5, image.height * 0.5);
      // Perform the rotation and scaling
      cxt.scale(current_size,current_size);
      cxt.rotate(current_rot * (Math.PI/180));
      // Translate back to the top left of our image
      cxt.translate(-image.width * 0.5, -image.height * 0.5);
      // Finally we draw the image
      cxt.drawImage(image,0,0);
      // And restore the context ready for the next loop
      cxt.restore();
    }

    function setRot(d) {
      current_rot = d;
    }
    function setSize(s) {
      current_size = s;
    }

    redrawImage();

    return {
      rotate: setRot,
      resize: setSize,
      redraw: redrawImage
    };
  };
  $.canvasrot.defaults = {
    src: null,
    width: null,
    height: null
  };

  var jcrop_api, rot_api,
      img = new Image;

  img.onload = initBkg;
  img.src = 'demo_files/sago.jpg';

  function initBkg() {

    // Initialize two sliders (jquery-ui)
    $('#sizeslider').slider({
      min: 0,
      max: 200,
      value: 100,
      slide: sizeChange,
      orientation: 'vertical'
    });
    $('#rotslider').slider({
      min: 0,
      max: 360,
      value: 360,
      slide: rotChange,
      orientation: 'vertical'
    });

    // Initialize Jcrop and grab the API
    $('#croptarg').Jcrop({
      shade: true,
      shadeColor: 'black',
      borderOpacity: .2,
      bgOpacity: .5,
      handleOpacity: .4,
      handleSize: 7,
      boundary: 0,
      bgFade: true,
      setSelect: [ 60, 40, 542, 360 ],
      bgColor: 'transparent'
    },function(){
      jcrop_api = this;
    });

    // These functions handle the slider events
    // and manipulate the canvasrot API
    function rotChange(ev, ui) {
      rot_api.rotate(ui.value);
      rot_api.redraw();
      return true;
    }
    function sizeChange(ev, ui) {
      rot_api.resize(ui.value/100);
      rot_api.redraw();
      return true;
    }

    // Initialize the canvasrot API
    var canvas_obj = document.getElementById('myCanvas');
    rot_api = $.canvasrot(canvas_obj,img);

    // Setup the grab button, see canvas-grab.js
    $('#grabButton').click(function(){
      grabCrop(jcrop_api.tellSelect());
    });
  }

  // This function is entirely self-contained
  // It takes crop coordinates from the Jcrop API,
  // grabs the image data from the canvas and opens a
  // dialog box containing that data pasted to a new canvas
  function grabCrop(c) {

    if ((c.w<1) || (c.h<1)) {
      alert('Please make a crop selection first.');
      return false;
    }

    var cvs = document.getElementById('myCanvas'),
        cxt = cvs.getContext('2d'),
        data = cxt.getImageData(c.x,c.y,c.w,c.h),
        targ = $('<canvas></canvas>')[0],
        ctxt = targ.getContext('2d');

    targ.width = c.w;
    targ.height = c.h;
    ctxt.putImageData(data,0,0);

    $($('<div></div>').append(targ)).dialog({
      title: 'Canvas Grab',
      modal: true,
      width: c.w+25,
      resizable: false
    });
    return targ;
  }

});
