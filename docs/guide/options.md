---
title: Configuration Options
lang: en-US
---

# Configuration Options

> Configuration options make it easy to alter the behavior of Jcrop.
> Set the initial state of the Jcrop instance when it is created,
> or update existing options at any time. Jcrop instantly
> responds to the new configuration.

## Setting Options

Options may be set on a Jcrop object when it is first attached,
or subsequently updated after Jcrop is attached to an element.
Changing option properties programatically can make building
complex interactions easier.

### Initial options

When attaching a new Jcrop instance, an options object may be passed in.
This object is merged with the complete list of default options.
Any values present in the options object will take precedence
over any existing default properties. The resulting new options object
is assigned to the Jcrop instance as `jcrop.options`. Although you can
alter this object directly, you should follow the instructions below
if you want to subsequently change Jcrop options on an existing instance.

```javascript
const jcrop = Jcrop.attach('target',{
  multi: true,
  aspectRatio: 3/4
});
```

### Options cascading

Since a Jcrop stage can contain multiple cropping widgets, it's
important to understand how crop-specific options are cascaded to
these widgets, and how individual crop widgets can have different
options applied to them for unique behaviors or building complex
interactivity.

When a cropping widget is added to the stage (either by a user
dragging a new crop, or programatically added) it receives the
options object that is currently set on the stage, and this is
used to create the widget's own options property that it will
use to determine its behavior.

### Updating options

To update the options on an existing instance, pass a new
options object to `jcrop.setOptions()`.

```js
const jcrop = Jcrop.attach('target');
jcrop.setOptions({ multi: true });
```

Updating options on an existing Jcrop instance will cascade
the changed settings to all existing crop widgets on the instance.
The result would be the same as if `setOptions()` were called
on each crop widget instance with the same values, as
described in the following section.

### Individual croppers

As implied above, each crop widget contains its own options
object that is usually derrived from the existing instance options.
Update options on an individual cropping widget by passing
an options object to the widget's `setOptions()` method.

```js
// Make the currently active crop widget undraggable
jcrop.active.setOptions({ canDrag: false });
```

[More information on working with multiple widgets](/guide/multiple.html)

As seen in this example, you might commonly access a single
crop widget by using the `jcrop.active` property, which always
points to the "active" crop widget on the stage, if one exists.
Alternatively, you might have a crop widget instance in a
variable if you programatically created it.

Setting updated options on individual crop widgets is not
necessary unless you want to change the behavior of only a single
crop widget. Updating options on the main instance will update
the changed options on all crop widgets.

## Available Options

See below for a list of available configuration options and their defaults.

### Stage behavior

### Crop behavior

### Display options

## Examples

### Cookbook
