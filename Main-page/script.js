// Optional JS for animations or dynamic navbar highlighting

// Highlight navbar link based on scroll (basic version)
const navLinks = document.querySelectorAll('.navbar ul li a');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY;
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      const top = section.offsetTop - 60;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos <= bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
});
