# Custom Widget

<example3 />

### Example code

```js
import Jcrop from 'jcrop';

class SvgWidget extends Jcrop.Widget {
  init () {
    super.init();
    const img = new Image();
    img.src = 'https://d3o1694hluedf9.cloudfront.net/img/js.svg';
    this.el.appendChild(img);
  }
}

Jcrop.attach('target',{
  aspectRatio: 1,
  widgetConstructor: SvgWidget
});
```
