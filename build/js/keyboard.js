class Keyboard {
  constructor (widget) {
    this.widget = widget;
    this.attach();
  }

  attach () {
    const c = this.widget;
    c.el.addEventListener('keydown',(e) => {
      const d = e.shiftKey ? 10 : 1;
      switch (e.key) {
        case 'ArrowRight': c.nudge(d); break;
        case 'ArrowLeft': c.nudge(-d); break;
        case 'ArrowUp': c.nudge(0,-d); break;
        case 'ArrowDown': c.nudge(0,d); break;

        case 'Delete':
        case 'Backspace':
          c.stage.removeWidget(c);
          break;

        default: return;
      }
      e.preventDefault();
    });
  }
}

Keyboard.attach = function (widget) {
  return new Keyboard(widget);
};

export default Keyboard;
