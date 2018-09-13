<template>
  <div>
    <Jcrop
      src="https://d3o1694hluedf9.cloudfront.net/sierra-750.jpg"
      @update="pos = $event.sel.round()"
      :class="elclass"
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

    <div style="margin-top:0.8em"><b>CSS Classes</b></div>
    <div>
      <label>
        <input type="checkbox" v-model="elclass['jcrop-ux-no-outline']">
        <tt>.jcrop-ux-no-outline</tt>
        <small>(disable focused outline)</small>
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" v-model="elclass['jcrop-ux-fade-more']">
        <tt>.jcrop-ux-fade-more</tt>
        <small>(inactive widgets less visible)</small>
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" v-model="elclass['jcrop-ux-inactive-handles']">
        <tt>.jcrop-ux-inactive-handles</tt>
        <small>(show handles on inactive widgets)</small>
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" v-model="elclass['jcrop-ux-keep-current']">
        <tt>.jcrop-ux-keep-current</tt>
        <small>(active widget retains full opacity)</small>
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      elclass: {
        'jcrop-ux-no-outline': false,
        'jcrop-ux-fade-more': true,
        'jcrop-ux-inactive-handles': false,
        'jcrop-ux-keep-current': true
      },
      rect: [50,140,580,290],
      options: { multi: false },
      pos: {}
    })
  }
</script>
