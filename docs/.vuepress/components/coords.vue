<template>
  <ul class="coords">
    <li>X: <input type="text" v-model="rect.x" readonly/></li>
    <li>Y: <input type="text" v-model="rect.y" readonly/></li>
    <li>W: <input type="text" v-model="rect.w" readonly/></li>
    <li>H: <input type="text" v-model="rect.h" readonly/></li>
  </ul>
</template>

<script>
  export default {
    props: [ 'rect' ]
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
    width: 10em;
  }
  ul.coords input {
    font-size: 108%;
    width: 6em;
    background-color: #f2f2f2;
  }
</style>

