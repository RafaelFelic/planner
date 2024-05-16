class Header {
  constructor() {
    this.header = document.querySelector('header');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > this.header.offsetTop) {
        this.header.classList.add('header-fix');
      } else {
        this.header.classList.remove('header-fix');
      }
    });
  }
}
const stickyHeader = new Header();

export default stickyHeader;
