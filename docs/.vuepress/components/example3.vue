<template>
  <div>
    <Jcrop
      ref="crop"
      class="jcrop-ux-current-hi"
      src="https://d3o1694hluedf9.cloudfront.net/sierra-750.jpg"
      @update="pos = $event.sel.round()"
      :options="options"
      :rect="rect"
    />
    <coords :rect="pos"/>
    <div>
      <label>
        <input type="checkbox" v-model="options.multi">
        <tt>multi:{{ options.multi? 'true':'false' }}</tt>
      </label>
    </div>
  </div>
</template>

<script>
  import Jcrop from 'jcrop';

  class SvgWidget extends Jcrop.Widget {
    init () {
      super.init();
      const img = new Image();
      img.src = 'https://d3o1694hluedf9.cloudfront.net/img/js.svg';
      this.el.appendChild(img);
    }
  }

  export default {
    data: () => ({
      rect: [50,300,150,150],
      options: {
        multi: true,
        aspectRatio: 1,
        handles: ['sw','nw','ne','se'],
        widgetConstructor: SvgWidget
      },
      pos: {}
    })
  }
</script>

