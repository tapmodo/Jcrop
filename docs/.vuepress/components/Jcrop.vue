<template>
  <div v-once/>
</template>

<script>
import Jcrop from 'jcrop';

export default {
  name: 'Jcrop',
  props: [ 'src', 'options', 'rect' ],
  mounted: function() {
    const img = new Image();
    this.$el.appendChild(img);
    img.src = this.src;
    Jcrop.load(img).then(this.startup);
  },
  methods: {
    startup(img){
      this.jcrop = Jcrop.attach(img,this.options||{});
      var rect = Jcrop.Rect.sizeOf(this.jcrop.el);

      this.jcrop.listen('crop.update',widget => this.$emit('update',widget));
      this.jcrop.listen('crop.activate',widget => this.$emit('activate',widget));
      this.jcrop.listen('crop.change',widget => this.$emit('change',widget));
      this.jcrop.listen('crop.remove',widget => this.$emit('remove',widget));

      if (this.rect) rect = Jcrop.Rect.from(this.rect);
      else rect = rect.scale(.7,.5).center(rect.w,rect.h)

      this.jcrop.newWidget(rect);
      this.pos = this.jcrop.pos;
      this.jcrop.focus();
    }
  },
  watch: {
    rect: {
      handler: function(v) {
        if (!this.jcrop.active) return false;
        this.jcrop.active.animate(Jcrop.Rect.from(v),20,'inOutCirc')
          .then(() => {
            this.jcrop.focus();
          });
      },
      deep: true
    },
    options: {
      handler: function(o) { this.jcrop.setOptions(o); },
      deep: true
    }
  },
  beforeDestroy: function () {
    this.jcrop.destroy();
  },
  data: () => ({
    pos: null,
    jcrop: null
  })
}
</script>

<style lang="scss">
@import "~jcrop/build/css/jcrop.scss";
</style>
