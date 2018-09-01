<template>
  <div>
    <Jcrop
      src="https://d3o1694hluedf9.cloudfront.net/sierra-750.jpg"
      @update="pos = $event.pos.round()"
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
  export default {
    data: () => ({
      rect: [50,140,580,290],
      options: { multi: false },
      pos: {}
    })
  }
</script>
