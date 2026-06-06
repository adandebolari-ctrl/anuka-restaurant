async function loadPosts() {
  try {
    const response = await fetch('data/posts.json');
    if (!response.ok) throw new Error('Impossible de charger les actualités.');
    const data = await response.json();
    renderPosts(data.posts || []);
  } catch (error) {
    console.warn(error);
    renderPosts([]);
  }
}

function renderPosts(posts) {
  const list = document.getElementById('posts-list');
  if (!list) return;
  if (posts.length === 0) {
    list.innerHTML = '<li>Aucune actualité pour le moment.</li>';
    return;
  }

  list.innerHTML = posts
    .map(post => `
      <li>
        <h3>${escapeHtml(post.title)}</h3>
        <p class="news-date">${escapeHtml(post.date)}</p>
        <p>${escapeHtml(post.content)}</p>
      </li>
    `)
    .join('');
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
  loadPosts();

  const heroSlides = document.querySelectorAll('.hero-image img');
  const indicatorContainer = document.querySelector('.hero-indicators');
  const prevButton = document.querySelector('.slider-btn.prev');
  const nextButton = document.querySelector('.slider-btn.next');

  if (heroSlides.length > 1 && indicatorContainer) {
    let activeSlide = 0;
    let sliderInterval = null;

    const indicators = Array.from(heroSlides).map((slide, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Voir l'image ${index + 1}`);
      if (index === 0) dot.classList.add('active');
      indicatorContainer.appendChild(dot);
      dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoSlide();
      });
      return dot;
    });

    function showSlide(index) {
      heroSlides[activeSlide].classList.remove('active');
      indicators[activeSlide].classList.remove('active');
      activeSlide = index;
      heroSlides[activeSlide].classList.add('active');
      indicators[activeSlide].classList.add('active');
    }

    function nextSlide() {
      showSlide((activeSlide + 1) % heroSlides.length);
    }

    function prevSlide() {
      showSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length);
    }

    function resetAutoSlide() {
      if (sliderInterval) clearInterval(sliderInterval);
      sliderInterval = setInterval(nextSlide, 4500);
    }

    if (prevButton) prevButton.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    if (nextButton) nextButton.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    resetAutoSlide();
  }

  const form = document.getElementById('reservation-form');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.getElementById('reserve-name').value.trim();
      const phone = document.getElementById('reserve-phone').value.trim();
      const date = document.getElementById('reserve-date').value;
      const time = document.getElementById('reserve-time').value;
      const people = document.getElementById('reserve-people').value;

      if (!name || !phone || !date || !time || !people) {
        alert('Merci de remplir tous les champs du formulaire de réservation.');
        return;
      }

      const subject = encodeURIComponent('Réservation Anuka Restaurant');
      const body = encodeURIComponent(`Bonjour,\n\nJe souhaite réserver une table au nom de ${name}.\nTéléphone : ${phone}.\nDate : ${date}.\nHeure : ${time}.\nNombre de personnes : ${people}.\n\nMerci !`);
      window.location.href = `mailto:anukarestauran@gamil.com?subject=${subject}&body=${body}`;
    });
  }

  const specialForm = document.getElementById('special-request-form');
  if (specialForm) {
    specialForm.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.getElementById('special-name').value.trim();
      const phone = document.getElementById('special-phone').value.trim();
      const message = document.getElementById('special-message').value.trim();
      const diet = document.getElementById('special-diet').value;

      if (!name || !phone || !message) {
        alert('Merci de remplir le nom, le téléphone et le détail de la demande.');
        return;
      }

      let subjectText = 'Demande spéciale Anuka Restaurant';
      let bodyText = `Bonjour,\n\nJe souhaite faire une demande spéciale.\nNom : ${name}.\nTéléphone : ${phone}.\n`;
      if (diet) {
        bodyText += `Option diététique : ${diet}.\n`;
      }
      bodyText += `Détails de la demande : ${message}.\n\nMerci !`;

      const subject = encodeURIComponent(subjectText);
      const body = encodeURIComponent(bodyText);
      window.location.href = `mailto:anukarestauran@gamil.com?subject=${subject}&body=${body}`;
    });
  }
});
