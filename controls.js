class Controls {
  constructor(type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    switch (type) {
      case 'USER':
        this.#addKeyboardListeners();
        break;
      case 'BOT':
        this.forward = true;
        break;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (evt) => {
      switch (evt.key) {
        case 'ArrowUp':
          this.forward = true;
          break;
        case 'ArrowLeft':
          this.left = true;
          break;
        case 'ArrowRight':
          this.right = true;
          break;
        case 'ArrowDown':
          this.reverse = true;
          break;
      }
      // console.table(this);
    };
    document.onkeyup = (evt) => {
      switch (evt.key) {
        case 'ArrowUp':
          this.forward = false;
          break;
        case 'ArrowLeft':
          this.left = false;
          break;
        case 'ArrowRight':
          this.right = false;
          break;
        case 'ArrowDown':
          this.reverse = false;
          break;
      }
      // console.table(this);
    };
  }
}
