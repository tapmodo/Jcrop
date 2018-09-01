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

## Built-in `listen()` method


## Native Events

When the state of the Jcrop instance changes, native DOM events
are fired on its container that will bubble up through the DOM
the same way other events do. They can be treated the same way
built-in events are normally handled, using the `addEventListener()`
method to attach a listener.

```js{3-6}
const jcrop = Jcrop.attach('target');

document.getElementById('target').addEventListener('crop.move',(e) => {
  const crop = e.cropTarget;
  consol.log(crop.pos);
});
```

::: tip Best practice
As you can probably guess, the built-in `jcrop.listen()` method is
a simple wrapper around the native `element.addEventListener()` method.

**The `jcrop.listen()` method is the preferred approach.** The way
native events are augmented and handled may change in future versions.
:::

