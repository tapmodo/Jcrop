---
title: Events and Handlers
lang: en-US
---

# Events and Handlers

> Jcrop emits events in the DOM when the user interacts with a widget
> or when changes happen, such as options being changed. This document
> describes how to detect these events and what they mean.

**There are two ways to listen for events in Jcrop:**

  * Use the built-in `listen()` method to attach a handler function
  * Use the DOM `addEventListener()` method to listen for native events

## Events

Use these event names with `stage.listen()` or `widget.listen()`

| Event Name              | Description                                      |
|:----------------------- |:------------------------------------------------ |
| `crop.activate`         | Active widget has changed                        |
| `crop.update`           | Widget dragging or resizing (frequent!)          |
| `crop.change`           | Widget dragging or resizing finished             |
| `crop.remove`           | Widget removed from stage                        |

## Listen for events 

```js
const stage = Jcrop.attach('target');

stage.listen('crop.move',(widget,e) => {
  console.log(widget.pos);
});
```

::: tip Best practice
As you can probably guess, the built-in `jcrop.listen()` method is
a simple wrapper around the native `element.addEventListener()` method.

**The `jcrop.listen()` method is the preferred approach.** The way
native events are augmented and handled may change in future versions.
:::

