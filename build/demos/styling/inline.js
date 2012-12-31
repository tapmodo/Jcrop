  jQuery(function($){

    var api;

    $('#target').Jcrop({
      // start off with jcrop-light class
      bgOpacity: 0.5,
      bgColor: 'white',
      addClass: 'jcrop-light'
    },function(){
      api = this;
      api.setSelect([130,65,130+350,65+285]);
      api.setOptions({ bgFade: true });
      api.ui.selection.addClass('jcrop-selection');
    });

    $('#buttonbar').on('click','button',function(e){
      var $t = $(this), $g = $t.closest('.btn-group');
      $g.find('button.active').removeClass('active');
      $t.addClass('active');
      $g.find('[data-setclass]').each(function(){
        var $th = $(this), c = $th.data('setclass'),
          a = $th.hasClass('active');
        if (a) {
          api.ui.holder.addClass(c);
          switch(c){

            case 'jcrop-light':
              api.setOptions({ bgColor: 'white', bgOpacity: 0.5 });
              break;

            case 'jcrop-dark':
              api.setOptions({ bgColor: 'black', bgOpacity: 0.4 });
              break;

            case 'jcrop-normal':
              api.setOptions({
                bgColor: $.Jcrop.defaults.bgColor,
                bgOpacity: $.Jcrop.defaults.bgOpacity
              });
              break;
          }
        }
        else api.ui.holder.removeClass(c);
      });
    });

  });


