---
title: Quickstart Guide
lang: en-US
---

# Getting Started

> Getting started with Jcrop is easy. This document offers a brief
> overview of most common topics and concepts to help you get going.
> Links are provided to more detailed documentation where relevant.

::: tip Pick your version
This documentation covers the vanilla Javascript version of Jcrop.
While it is very worthwhile to read and understand how Jcrop works,
you may be more interested in using Jcrop wrappers for [Vue](/vue/)
or [jQuery](/jquery/) which have their own quickstart docs.
:::

## Including files

First, include the Jcrop library and CSS files in the HTML
document. Basic understanding of HTML and CSS is a
pre-requisite so this should need little explanation.

```html
<link rel="stylesheet" href="https://unpkg.com/jcrop/dist/jcrop.css">
<script src="https://unpkg.com/jcrop"></script>
```

::: warning Order of Inclusion
You must ensure the library is already loaded before attempting to use
any Jcrop functionality. In other words, the script tag above must
appear in your HTML document before any other scripts that reference Jcrop.
:::

## Attaching Jcrop

Although there are many invocation approaches, the simplest and
most common usage is the `Jcrop.attach()` helper function.

Jcrop attaches to any DOM element easily. The element can
be passed as a Javascript object or a string that matches the
ID of an element already in the DOM.

```html{4}
<img src="picture.jpg" id="target">

<script>
  Jcrop.attach('target');
</script>
```

This function can receive two parameters: the element to attach
and an [options object](/guide/options.html).

  * Element must exist in the DOM
  * Element should be an image or block element
  * An HTMLElement object may be passed
  * If a string is passed, `document.getElementById()` is used

Images get slightly special treatment when you attach a Jcrop instance.

  * [Read more about the stage instance and attaching](/guide/instance.html)
  * [Read more about configuration and options](/guide/options.html)

## Setting Options

Basic Jcrop behavior can be customized by passing an options object
to `Jcrop.attach()`. Some options control the behavior of the main
Jcrop instance while others are used by individual widgets. Widgets and
widget constructors also accept options objects, for very granular
configurations. In most cases, options are merged with any existing
options settings, and the default options.

```js
Jcrop.attach('target',{
  shadeColor: 'red',
  multi: true
});
```

  * [Instance and structure](instance.html)
  * [Configuration and options](options.html)

## Widgets

With `Jcrop.attach()` we have only created a **Jcrop Instance** (called
the "stage") which can contain one or more cropping widgets.

  * Widgets have their own distinct configuration options
  * Widgets can be created, focused, or removed using stage methods
  * Widgets can be configured or manipulated using widget methods

### Creating widgets

Widgets can be created:

  * Widgets can be user-drawn on the stage with a mouse or touch
  * Using `newWidget()` or `addWidget()` stage methods

```js
const rect = Jcrop.Rect.create(x,y,w,h);
const options = {};
jcrop.newWidget(rect,options);
```

### Active widget

**The current/last active widget is stored in `stage.active`**

A widget is usually made active when:

  * It is first added to the stage (by mouse, touch, or programatically)
  * The `Widget` instance is is passed to `stage.activate()`
  * It is selected in the UI by the user, using mouse or touch

### Removing widgets

Widgets can be removed:

  * By the user through the UI (usually pressing delete or backspace)
  * Programatically by calling `stage.removeWidget(widget)`

```js
jcrop.removeWidget(jcrop.active);
```

### User drawn

By default, when a user begins a drag operation on the stage area with
the mouse (or touch), a cropping widget will be created. This behavior
is only activated when the current stage options allow it.

The default options will allow the user to draw the first crop if none
exist, but due to the default setting `multi: false` 

## Reading state

Getting the state of the crop widget(s) can be done two ways:

  * Reading properties from the Jcrop instance itself
  * Attaching event handlers that respond to changes in state

### From the instance

```js
const stage = Jcrop.attach('target');
console.log(stage.active.pos);
```

::: tip
As the name suggests, an instance's `active` property contains
the most recently active cropping widget. You should only access
this property if it contains a value, so you might want to add
a conditional if you're not sure. [Read more about Jcrop instances.](/guide/instance.html)
:::

### Event Handling

Jcrop also includes a convenient method to attach a listener
function to its container.

```js{3-6}
const stage = Jcrop.attach('target');

stage.listen('crop.move',function(widget,e){
  const pos = widget.pos;
  console.log(pos.x,pos.y,pos.w,pos.h);
});
```

Note that the callback function receives a reference to the `widget`
and also recieves the native event as the second argument.

[Full state handling and events documentation.](/guide/events.html)

