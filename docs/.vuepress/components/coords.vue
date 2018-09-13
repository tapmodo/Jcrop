<template>
  <ul class="coords" v-if="xymode">
    <li>X: <input type="text" v-model="rect.x" readonly/></li>
    <li>Y: <input type="text" v-model="rect.y" readonly/></li>
    <li>X2: <input type="text" v-model="rect.x2" readonly/></li>
    <li>Y2: <input type="text" v-model="rect.y2" readonly/></li>
    <li><button @click.prevent="toggleMode">w/h</button></li>
  </ul>
  <ul class="coords" v-else>
    <li>X: <input type="text" v-model="rect.x" readonly/></li>
    <li>Y: <input type="text" v-model="rect.y" readonly/></li>
    <li>W: <input type="text" v-model="rect.w" readonly/></li>
    <li>H: <input type="text" v-model="rect.h" readonly/></li>
    <li><button @click.prevent="toggleMode">x2/y2</button></li>
  </ul>
</template>

<script>
  export default {
    methods: {
      toggleMode() {
        this.xymode = !this.xymode;
      }
    },
    props: [ 'rect' ],
    data: () => ({
      xymode: false
    })
  }
</script>

<style>
  ul.coords {
    width: 750px;
    box-sizing: border-box;
    margin: 3px 0 0.5em;
    padding: 0.5em 0.5em 0.4em;
    border: 1px #aaa solid;
    background-color: #eee;
  }
  ul.coords li {
    margin: 0;
    padding: 0;
    display: inline-block;
    font-weight: bold;
    width: 8em;
  }
  ul.coords input {
    font-size: 108%;
    width: 4.5em;
    background-color: #f2f2f2;
  }
</style>

