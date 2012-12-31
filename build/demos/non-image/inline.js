  jQuery(function($){

    // I did JSON.stringify(jcrop_api.tellSelect()) on a crop I liked:
    var c = {"x":13,"y":7,"x2":487,"y2":107,"w":474,"h":100};

    $('#target').Jcrop({
      bgFade: true,
      setSelect: [c.x,c.y,c.x2,c.y2]
    });

  });

