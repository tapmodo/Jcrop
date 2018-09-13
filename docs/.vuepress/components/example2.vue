<template>
  <div>
    <Jcrop
      src="https://d3o1694hluedf9.cloudfront.net/sierra-750.jpg"
      @update="pos = $event.sel.round()"
      :rect="rect"
      :options="options"
    />
    <coords :rect="pos"/>
    <button @click="originalCrop()">Reset</button>
  </div>
</template>

<script>
  const origin = [150,160,540,270];

  export default {
    data: () => ({
      rect: origin.slice(0),
      options: {
        handles: ['sw','nw','ne','se'],
        aspectRatio: origin[2]/origin[3]
      },
      pos: {}
    }),
    methods: {
      getOrigin() { return origin.slice(0); },
      originalCrop() { this.rect = this.getOrigin(); }
    }
  }
</script>
