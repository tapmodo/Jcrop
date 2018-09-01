---
title: Extending Jcrop
lang: en-US
---

# Extending Jcrop

> Due to its elegant object-oriented design, it's easy to extend Jcrop
in your application without modifying the Jcrop source code.

::: danger Proceed with caution!
Any customizations or changes you make can cause errors
or future incompatibilities. It is not recommended to extend Jcrop
unless you are very sure of what you're doing!
:::

### Why extend Jcrop?

  * Experiment with bug fixes or modifications
  * Create customized behavior or interfaces

## Extensible Classes

| Option Name             | Jcrop Class      | Description                   |
|:----------------------- |:---------------- |:----------------------------- |
| `widgetConstructor`     | `Jcrop.Widget`   | Cropping Widget               |
| `stageConstructor`      | `Jcrop.Stage`    | Default DOM stage             |

## Extending Jcrop classes

Here's a class extended from `Jcrop.Widget` that logs `Rect`
coordinates to the console each time the widget is redrawn/rendered.
It augments the default behavior by calling a `super` method.

```js
class MyWidget extends Jcrop.Widget {
  render(pos) {
    console.log(pos);
    super.render(pos);
  }
}
```

See the following sections for _how to_ use this extended class
with Jcrop, as well as a [list of classes that can be extended
through Jcrop options](#extensible-classes).

### Replacing global default

The global defaults for Jcrop can be modified _before_ `Jcrop.attach()`
or similar method is called. This will affect all subsequent invocations.

```js
Jcrop.defaults.widgetConstructor = MyWidget;
```

### With a single instance

Pass the configuration key when attaching an instance. This setting
will affect all objects constructed by the instance as long as the
options are in effect.

```js
Jcrop.attach('target',{ widgetConstructor: MyWidget });
```

### Update existing instance

Use `setOptions()` method to update an existing instance.

```js
jcrop.setOptions({ widgetConstructor: MyWidget });
```

::: tip Don't be late to the party
As most classes are used to build parts of the interface, updating
classes/constructors on an existing instance only affects
objects constructed after your change.
:::

