---
title: Design Guide
lang: en-US
---

# Design Guide

Most Jcrop documentation focuses on technical implementation principles,
but it may benefit developers or designers to consider the user
experience (UX) when thinking about interaction design involving Jcrop.

## Start with a default crop

When Jcrop is initially attached to an element, nothing happens visually.
The default behavior will then allow the user to draw an initial crop area,
and when the first crop is created, there will always be only that one
crop element.

The reason for this default behavior is to satisfy the most common use-case
which is selecting a single crop area on a picture, almost as if the crop
coordinates were like a form `<input>` element that had this special behavior.
Indeed many interfaces using Jcrop are designed to function this way.

This is all great, except if the cropping input is _required_ by your form,
and the user has not selected an initial crop.

To prevent this, initialize the interface with a crop already selected.

```javascript
const jcp = Jcrop.attach('target');
jcp.newCropper(Rect.from(jcp.el));
```

## Restore previous state

If possible, restore the original image and previous cropping state when
navigating to the page
