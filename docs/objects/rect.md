---
title: Rect Object
lang: en-US
---

# `Rect` Object

> The `Rect` class is the heart of the Jcrop engine. While it may appear to
> be a plain old Javascript object, it has some unique behavior that makes
> it easy to work with coordinates and crop selections.

A `Rect` object instance represents coordinates for an arbitrary
rectangle, usually top left and bottom right. Internally the class
is used to set or describe an existing crop selection. You may
use `Rect` objects when using the Jcrop API or to describe rectangles
within your own application.

## Properties

The native properties of a `Rect` object are `x`, `y`, `w`, `h`. These
properties should only contain integers or floating point numbers that
represent the `x` and `y` top left corner of the crop, and the crop
dimentions as `w` and `h` for width and height, respectively.

Getters and setters exist for `x2` and `y2`, if it is desirable to
know the secondary coordinates (usually the bottom-right point). If
you set `x2` or `y2`, the object's `w` and `h` values are updated as
if the secondary point had been moved.

Additionally, `x1` and `y1` setters exist for cases where you want
to move the primary point without without moving the entire object.
Another way to say this is that `w` and `h` will be adjusted as if
only this point moved.

To get the aspect ratio of the `Rect` object's current values,
a getter named `aspect` exists.

## Instance Methods

### rect.normalize()

Rect coordinates may have negative values for `w` or `h` if the
secondary point is above or to the left of the primary point.
Calling the `normalize()` method will return a new `Rect` object
with adjusted values indicating a positive `w` and `h`. This method
is used internally by Jcrop to provide values that are easily
rendered regardless of the current orientation of the coordinates,
such as during a dragging operation.

```js
const r = Jcrop.Rect.create(110,110,-100,-50);
const s = r.normalize();
console.log(r.x,r.w); // --> 110, -100
console.log(s.x,s.w); // --> 10, 100
```

### rect.rebound(w,h)

The `rebound()` method will move the Rect coordinates back into an
area inside of a box defined by the w,h parameters given. It returns
a `Rect` object with the rebounded coordinates. This method is used
internally to prevent a bounded crop from being dragged outside the
boundaries of the stage element.

```js
const r = Jcrop.Rect.create(-15,-20,100,50);
const s = r.rebound(200,200);
console.log(r.x,r.y); // --> -15, -20
console.log(s.x,s.y); // --> 0, 0
```

### rect.scale(x,y)

Scales the width and height based on `x,y` scaling values,
usually somewhere between 1 and 0 for a percentage. Returns a
fresh `Rect` object with the width and height scaled.

### rect.center(w,h)

Returns a new `Rect` object with `x,y` producing a region
centered within the space defined by `w,h`.

### rect.round()

Especially when using aspect ratios, fractional values are very
possible, but not always desirable. Call the `round()` method and
get a totally new `Rect` with rounded values.

## Static Methods

### Rect.create(x,y,w,h)

Creates a new `Rect` object with the given values.

```js
const r = Jcrop.Rect.create(10,10,100,100);
```

### Rect.from(el)

Creates a new `Rect` object by reading `offsetTop`, `offsetLeft`, 
`offsetWidth` and `offsetHeight` from the given DOM object. The
object should probably be in the DOM, as not all of these properties
may be set on an element that is not in the DOM.

```js
const el = document.getElementById('crop1');
const r = Jcrop.Rect.from(el);
```

### Rect.fromPoints(p1,p2)

Creates a new `Rect` from coordinate points specified as arrays
(e.g. `[x1,y1]` and `[x2,y2]`).

```js
const p1 = [10,10], p2 = [110,110];
const r = Jcrop.Rect.fromPoints(p1,p2);
```

### Rect.fromPoint(p1,w,h,quad)

Creates a new `Rect` object anchored at a single point, such as `[10,10]`.
The Rect will be of size `w` and `h` and the direction is determined
by the value of `quad` which must be one of `tl`, `tr`, `bl`, or `br`
(the default) indicating top/bottom left/right quadrant.

```js
const point = [10,10];
const r = Jcrop.Rect.fromPoint(point,100,100,'br');
```

### Rect.getMax(w,h,aspect)

Returns an array of `[w,h]` representing maximum rectangle size
of `ratio` that fits within the given `w,h` size passed as parameters.
This function is used in conjunction with `Rect.fromPoint()` to
perform aspect ratio filtering when that feature is enabled.

```js
const ratio = 4/3;
const [w,h] = Jcrop.Rect.getMax(200,150,ratio);
```

## Source Code

<<< @/build/js/rect.js
