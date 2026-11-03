document.querySelector(".nav-burger")?.addEventListener("click", () => {
    const menu = document.getElementById("nav-menu");
    const btn = document.querySelector(".nav-burger");
    if (!menu) return;
    const open = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open);
  });

  document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => {
    document.getElementById("nav-menu")?.classList.remove("is-open");
    document.querySelector(".nav-burger")?.setAttribute("aria-expanded", "false");
  }));

  gsap.registerPlugin(ScrollTrigger);

// Hero cinematic reveal
gsap.to('.hero-img-wrap', {
  clipPath: 'inset(0% 0 0 0)',
  duration: 1.8,
  ease: 'power4.inOut',
  delay: 0.3
});

gsap.from('.hero-img', {
  scale: 1.2,
  duration: 2.5,
  ease: 'power2.out',
  delay: 0.3
});

// Scroll hint line
gsap.to('.scroll-line', {
  scaleY: 0,
  repeat: -1,
  yoyo: true,
  duration: 1.2,
  ease: 'power2.inOut'
});

// Text reveals
gsap.utils.toArray('.reveal-text').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });
});

// Card/element slide-up reveals
gsap.utils.toArray('.reveal-up').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: i % 3 * 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      toggleActions: 'play none none none'
    }
  });
});

// Parallax hero
gsap.to('.hero-img', {
  yPercent: 30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

// Parallax about image
gsap.utils.toArray('.parallax-img').forEach(img => {
  gsap.to(img, {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: img.closest('.parallax-wrap'),
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});

// Gallery stagger reveal
gsap.utils.toArray('.gallery-item').forEach((item, i) => {
  gsap.from(item, {
    opacity: 0,
    y: 60,
    duration: 0.8,
    delay: (i % 3) * 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 90%',
      toggleActions: 'play none none none'
    }
  });
});

// Animated counters
const counterEls = document.querySelectorAll('.counter-num');
counterEls.forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          el.textContent = Math.floor(this.targets()[0].val).toLocaleString('es-MX');
        }
      });
    }
  });
});
