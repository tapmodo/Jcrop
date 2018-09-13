# Vue.js Jcrop Component

## Installation

```bash
npm install vue-jcrop
```

## Usage

```vue
<template>
  <div>
    <Jcrop
      src="https://d3o1694hluedf9.cloudfront.net/sierra-750.jpg"
      @update="sel = $event.sel"
      :rect="[10,10,100,100]"
      :options="options"
    />

    <div>Dynamically updated coordinates:</div>
    <tt>{{ sel.x }}, {{ sel.y }}, {{ sel.w }}, {{ sel.h }}</tt>
  </div>
</template>

<script>
import { Jcrop } from 'vue-jcrop';

export default {
  components: { Jcrop },
  data: () => ({
    options: { },
    sel: { }
  })
}
</script>
```

## Events

| Event Name | Description |
| :--------- | :---------- |
| `activate` | Widget is activated or active widget changed |
| `update`   | Widget is dragging or resizing |
| `change`   | Widget is done dragging or resizing |
| `remove`   | Widget is being removed from stage |

As in the example above, you should set a data property on your Vue
instance or component, and attach some action to `@update` or
`@change` events to update the state in your local instance.

## Properties

| Event Name | Description |
| :--------- | :---------- |
| `src` | Set an image `src` URL and vue-jcrop will pre-load the image |
| `rect` | An array `[x,y,w,h]` or `Rect` object to set crop coordinates |
| `options` | An object containing configuration options |
