# Widget Instances

## Creating a widget

```js
const widget = Jcrop.Widget.create();
```

### Add widget to stage

```js
const jcrop = Jcrop.attach('target');
const widget = Jcrop.Widget.create();
jcrop.addWidget(widget);
```

### Create from the stage

Add a new cropping widget using a [`Rect`](/objects/rect.html) object.
[`Rect`](/objects/rect.html) objects define a rectangular region.

```js{2}
const rect = Jcrop.Rect.fromPoints([100,100],[200,200]);
jcrop.newCropper(rect,{ aspectRatio: rect.aspect });
```


