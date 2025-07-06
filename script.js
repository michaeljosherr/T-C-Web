const nav = document.querySelector("nav");
const navLinks = document.querySelectorAll(".nav-links li");
const menu = document.querySelector("#menu");

document.body.addEventListener("click", (e) => {
  if (!menu.contains(e.target) & !nav.contains(e.target)) {
    nav.classList.remove("active");
    menu.classList.remove("active");
  } else if (menu.contains(e.target)) {
    nav.classList.toggle("active");
    menu.classList.toggle("active");
  }
});

navLinks.forEach((link) => link.addEventListener("click", addActiveClass));

function addActiveClass() {
  navLinks.forEach((link) => link.classList.remove("active"));
  this.classList.add("active");
}

// animation for vertical line 📏 & circles ⚪
const verticalLine = document.querySelector(".vertical");
const circles = document.querySelectorAll(".circle");
const horizontalLines = document.querySelectorAll(".horizontal");
const startingPoint = document.querySelector("#home").offsetHeight / 2;

let activeIndex = 0;

/// **  Description **
/**
 * animation will start at height/2 of the Home page.
 * when scrollAmount >= height of a feature card
 * we want to increment active Index and
 * then animate vertical line and the circles.
 */

function scrollEffect() {
  const scrollAmt = scrollY - startingPoint;

  if (scrollAmt < 0) {
    activeIndex = 0;
    circles.forEach((circle) => circle.classList.remove("active"));
    horizontalLines.forEach((circle) => circle.classList.remove("active"));
    verticalLine.style.height = 0;
    return;
  }

  const amtToScroll =
    document.querySelector(".feature").offsetHeight * (activeIndex + 1);

  if (scrollAmt >= amtToScroll) {
    activeIndex = Math.min(activeIndex + 1, circles.length);
    verticalLine.style.height = `${(activeIndex * 100) / circles.length}%`;
    circles[activeIndex - 1].classList.add("active");
    horizontalLines[activeIndex - 1].classList.add("active");
  }
}

window.onscroll = scrollEffect;

// Products tabs functionality
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Add active class to clicked button and corresponding panel
      this.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
});

// --- Carousel Logic for Products Page ---
(function() {
  // Only run after DOM is ready
  window.addEventListener('DOMContentLoaded', function() {
    // Carousel only on products.html
    const track = document.querySelector('.carousel-track');
    let images = Array.from(document.querySelectorAll('.carousel-img'));
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    if (!track || images.length === 0) return; // Only run on products.html
    let current = 0;
    let interval = null;
    // Remove any previous clones (for hot reloads)
    images.forEach(img => { if (img.classList.contains('clone')) img.remove(); });
    images = Array.from(document.querySelectorAll('.carousel-img'));
    // Clone first and last for seamless loop and peeking
    const firstClone = images[0].cloneNode(true);
    const lastClone = images[images.length-1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    track.appendChild(firstClone);
    track.insertBefore(lastClone, images[0]);
    images = Array.from(document.querySelectorAll('.carousel-img'));
    const realSlidesCount = images.length - 2;
    function getImgWidth() {
      const container = track.parentElement;
      return container.offsetWidth * 0.7;
    }
    function setImgSizes() {
      const imgWidth = getImgWidth();
      const margin = track.parentElement.offsetWidth * 0.05;
      images.forEach((img, i) => {
        img.style.width = imgWidth + 'px';
        img.style.margin = '0 ' + margin + 'px';
      });
      track.style.minWidth = (images.length * (imgWidth + margin * 2)) + 'px';
    }
    function getFullImgWidth() {
      return getImgWidth() + track.parentElement.offsetWidth * 0.1;
    }
    setImgSizes();
    let imgWidth = getFullImgWidth();
    function setTrack(noTransition = false) {
      if (noTransition) track.style.transition = 'none';
      else track.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
      track.style.transform = `translateX(${-imgWidth * (current+1) + (track.parentElement.offsetWidth - imgWidth) / 2}px)`;
    }
    function updateCarousel(idx, animate=true) {
      current = idx; // let it go out of bounds
      images.forEach((img, i) => {
        img.classList.toggle('active', i === current+1);
        img.classList.toggle('center', i === current+1);
        img.style.transform = i === current+1 ? 'scale(1.12)' : 'scale(0.92)';
        img.style.zIndex = i === current+1 ? 2 : 1;
        img.style.boxShadow = i === current+1 ? '0 8px 24px rgba(0,0,0,0.18)' : 'none';
      });
      // Update dots based on real index
      let realIdx = current;
      if (realIdx >= realSlidesCount) realIdx = 0;
      if (realIdx < 0) realIdx = realSlidesCount - 1;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === realIdx);
        dot.setAttribute('aria-selected', i === realIdx ? 'true' : 'false');
      });
      setTrack(!animate);
    }
    function next() { updateCarousel(current+1); }
    function prev() { updateCarousel(current-1); }
    function start() { interval = setInterval(next, 3000); }
    function stop() { clearInterval(interval); }
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { updateCarousel(i); stop(); start(); });
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { updateCarousel(i); stop(); start(); }
      });
    });
    leftArrow.addEventListener('click', () => { prev(); stop(); start(); });
    rightArrow.addEventListener('click', () => { next(); stop(); start(); });
    leftArrow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { prev(); stop(); start(); }
    });
    rightArrow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { next(); stop(); start(); }
    });
    document.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') { prev(); stop(); start(); }
      else if (e.key === 'ArrowRight') { next(); stop(); start(); }
    });
    // Always start at the first image as center
    current = 0;
    setTimeout(() => {
      setImgSizes();
      imgWidth = getFullImgWidth();
      updateCarousel(0, false);
    }, 0);
    start();
    // Pause on hover
    const carousel = document.querySelector('.collage-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
    }
    // Responsive: recalc width on resize
    window.addEventListener('resize', () => {
      setImgSizes();
      imgWidth = getFullImgWidth();
      setTrack(true);
    });
    // Flicker-free seamless looping using transitionend
    let isJumping = false;
    track.addEventListener('transitionend', () => {
      if (isJumping) return;
      if (current >= realSlidesCount) {
        isJumping = true;
        track.style.transition = 'none';
        current = 0;
        setTrack(true);
        void track.offsetWidth;
        track.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
        isJumping = false;
      }
      if (current < 0) {
        isJumping = true;
        track.style.transition = 'none';
        current = realSlidesCount - 1;
        setTrack(true);
        void track.offsetWidth;
        track.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
        isJumping = false;
      }
    });
  });
})();
