class SlideController {
  constructor() {
    this.currentSlideIndex = 1;
    this.slideContainer = document.querySelector('.container');
    this.slides = document.querySelectorAll('.slide');
    this.dots = document.querySelectorAll('.dot');
    this.init();
  }

  init() {
    this.updateDots();
    this.addEventListeners();
  }

  addEventListeners() {
    // Evento de clique para cada bolinha
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.setCurrentSlide(index + 1));
    });

    // Evento de rolagem horizontal
    this.slideContainer.addEventListener(
      'scroll',
      this.handleScroll.bind(this)
    );
  }

  setCurrentSlide(index) {
    this.currentSlideIndex = index;
    this.updateDots();
    this.scrollToCurrentSlide();
  }

  handleScroll() {
    if (this.slides.length === 0) return; // Adicionando verificação de segurança

    const scrollLeft = this.slideContainer.scrollLeft;
    const slideWidth = this.slides[0].offsetWidth;
    const newSlideIndex = Math.round(scrollLeft / slideWidth) + 1;

    if (newSlideIndex !== this.currentSlideIndex) {
      this.currentSlideIndex = newSlideIndex;
      this.updateDots();
    }
  }

  scrollToCurrentSlide() {
    const slideWidth = this.slides[0].offsetWidth;
    const newScrollLeft = (this.currentSlideIndex - 1) * slideWidth;
    this.slideContainer.scrollLeft = newScrollLeft;
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentSlideIndex - 1) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

const slideController = new SlideController();
export default slideController;
