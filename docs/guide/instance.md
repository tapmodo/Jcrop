---
title: Jcrop Instances
lang: en-US
---

# Jcrop Instances

> **stage /stāj/** a raised floor or platform, typically in a theater, on which actors, entertainers, or speakers perform

> Jcrop is totally object-oriented. If you have a complete understanding
> of Javascript, object-oriented programming, and web development/debugging
> techniques, this documentation may be superfluous.

In object-oriented programming, an important distinction exists between
the object definition (usually a `class`) and instances of that object.
Javascript has historically had an unusual inheritance method based on
prototypes, but the concept of instances is still the same. Frequently,
object instances are created using the `new` keyword.

## Creating an Instance

You're probably already familliar with creating a Jcrop instance:

```js
const jcrop = Jcrop.attach('target');
```

To use an instance, you will most likely want to store it in a
variable as shown here. To avoid confusion, this documentation
uses the variable `jcrop` to indicate a Jcrop instance.

::: tip Where is new?
By design, Jcrop objects are instantiated using static methods
such as `Jcrop.attach()` or `Jcrop.Widget.create()`—although
you don't see the `new` keyword, these functions use `new` internally
to create objects under the hood. These static methods perform
additional configuration, so they should be used unless you're
doing some hacking.
:::

### Attaching to any element

Jcrop attaches to any DOM element easily. The element can
be passed as a Javascript object or a string that matches the
ID of an element already in the DOM.

```html{4}
<img src="picture.jpg" id="target">

<script>
  Jcrop.attach('target');
</script>
```

  * Element must exist in the DOM
  * Element should be an image or block element
  * An HTMLElement object may be passed
  * If a string is passed, `document.getElementById()` is used

### Attaching to images

Images get slightly special treatment when you attach a Jcrop instance.

  * Container element created and CSS classes assigned to it
  * Container element inserted where the image tag exists in the DOM
  * Image element is moved inside the container element

The effect of this is that the image is wrapped in a container which
allows Jcrop to position its UI elements on top of the image.
Please inspect the structure of the elements and how CSS is applied to
them if you are having layout issues using Jcrop with your current CSS.

Because of these positioning needs, the container is `position: relative`
and the image is made `position: absolute`. The container element is then
sized to the size of the image element in the DOM. Also note that an
`onload` handler is attached to the image, so that the container size
can be updated when/if an image becomes loaded.

### Preloading Images

The most common use case for Jcrop is cropping an image. For Jcrop to
properly initialize in such a case, **the image must already be loaded**
in the DOM (at least enough to have width and height available).
Jcrop provides a convenient static method to ensure that an image is
pre-loaded before Jcrop is attached:

```html
<img src="https://d3o1694hluedf9.cloudfront.net/sierra-750.jpg" id="target">
```
```js
Jcrop.load('target').then(img => Jcrop.attach(img,options));
```

Of course, the `Jcrop.load()` static method can take an element as well.
If you wanted to create the `Image` element programatically, just make
sure you add it to the DOM.

```js
const myImage = new Image();
myImage.src = 'https://d3o1694hluedf9.cloudfront.net/sierra-750.jpg';
document.getElementById('container').appendChild(myImage);
Jcrop.load(myImage).then(img => Jcrop.attach(img,options));
```

## Instance Methods

### setOptions(options)

Jcrop options can be changed on-the-fly using the setOptions() method.
The instance will react to any changed options immediately.

```js
jcrop.setOptions({ shade: false });
```

::: tip Instance options vs. Widget options
Jcrop instances maintain a set of options that are inherited by any
cropping widgets that are attached. When `setOptions()` is called
on the instance, the same options are passed to any widgets that
are attached to the instance.
:::

### addWidget(widget)

Add an existing cropping widget to the Jcrop instance. To use this
method, you'll need to create the cropping widget first. This method
is called internally when `newWidget()` is used (see below).

```js
const widget = Jcrop.Widget.create();
jcrop.addWidget(widget);
```

Note that this code would create a widget and attach it to the Jcrop
stage instance, but it will probably require some positioning and
other configuration. It's recommended to use a `Rect` with the
`newWidget()` method instead.

### newWidget(rect,options)

Add a new cropping widget using a [`Rect`](/objects/rect.html) object.
[`Rect`](/objects/rect.html) objects define a rectangular region.

```js{2}
const rect = Jcrop.Rect.fromPoints([100,100],[200,200]);
jcrop.newCropper(rect,{ aspectRatio: rect.aspect });
```

### CSS class management

  * **addClass(classname)**
  * **removeClass(classname)**
  * **hasClass(classname)**

As a class extended from `DomObj`, the methods `addClass()`,
`removeClass()` and `hasClass()` are available to manage CSS
classes on the container element. There are some useful classes
that can be added to the container (or a parent element) to
affect the UI/UX of the instance.

## Instance Properties

### `active`

Contains a reference to the most recently selected or active widget.
Once any widget is attached to the instance, the `active` property
will always contain a value, unless all widgets are removed from
the instance.

### `crops`

A `Set` that contains any crop widgets currently attached to this
Jcrop instance. The last widget in the Set is the `active` widget.

### `el`

Contains a reference to the DOM element that this Jcrop instance is
attached to. This is almost always a div or block element of some type.

### `options`

The `options` object for the Jcrop instance. While you may read from
this object, it's recommended that you do not update it directly.
Use the `setOptions()` method described above if you want to modify
the options after the instance has been created.

### `srcEl`

This property is only defined if the `ImageStage` is being used.
It contains a reference to the original source image after wrapping.

## Removing an Instance

Jcrop instances provide a `destroy()` method to remove the instance.

```js
jcrop.destroy();
```

This feature is not well defined currently. No guarantees are made. :)
