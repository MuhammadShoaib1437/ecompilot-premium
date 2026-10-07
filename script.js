// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Marquee seamless loop
(function(){
  const track = document.getElementById('marqueeTrack');
  if (track) track.innerHTML += track.innerHTML;
})();

// Scroll reveal
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('section > *, .svc-card, .course-card, .platform-card, .step, .article-card, .faq-item').forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

// 3D tilt (desktop)
(function(){
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// Services carousel
(function(){
  const track = document.getElementById('svcTrack');
  if (!track) return;
  let idx = 0;
  const perView = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  const maxIdx = () => track.children.length - perView();
  function go(i){
    idx = Math.max(0, Math.min(i, maxIdx()));
    const card = track.children[0];
    const gap = 22;
    track.style.transform = `translateX(-${idx * (card.offsetWidth + gap)}px)`;
  }
  document.getElementById('svcPrev').addEventListener('click', () => go(idx - 1));
  document.getElementById('svcNext').addEventListener('click', () => go(idx + 1));
  window.addEventListener('resize', () => go(idx));
})();

// Academy filters
document.querySelectorAll('#courseFilters .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#courseFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.course-card').forEach(c => {
      c.classList.toggle('hide', f !== 'all' && c.dataset.cat !== f);
    });
  });
});

// Explore accordions
document.querySelectorAll('.explore-toggle').forEach(t => {
  t.addEventListener('click', () => {
    const list = t.nextElementSibling;
    const open = list.classList.toggle('open');
    t.textContent = open ? 'What you\'ll explore －' : 'What you\'ll explore ＋';
  });
});

// FAQ accordions
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Modals
function openModal(id){ document.getElementById(id).hidden = false; document.body.style.overflow = 'hidden'; }
function closeModals(){ document.querySelectorAll('.modal').forEach(m => m.hidden = true); document.body.style.overflow = ''; }
document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', closeModals));
document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModals(); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

// Program data for modal
const PROGRAMS = {
  "eBay course": ["eBay Seller Training","Build a structured understanding of eBay selling, from product research to listing quality and day-to-day store operations.",["Seller setup essentials","Product research and sourcing","Listing structure and search visibility","Orders, service and store performance"]],
  "Etsy course": ["Etsy Shop Training","Explore how to present creative products, organise an Etsy shop and develop a consistent selling workflow.",["Shop planning and product fit","Product photography and presentation","Titles, tags and listing structure","Pricing, orders and customer communication"]],
  "Amazon course": ["Amazon Seller Training","Understand the foundations of the Amazon seller journey and how catalogue, sourcing and operations fit together.",["Seller journey and business models","Product and supplier research","Catalogue and listing fundamentals","Inventory, fulfilment and cost planning"]],
  "TikTok Shop course": ["TikTok Shop Training","Connect shop operations with product content and develop an organised approach to social commerce.",["Shop setup essentials","Product research and selection","Listings and content planning","Orders, fulfilment and daily routines"]],
  "Facebook Marketplace course": ["Facebook Marketplace Training","Learn how to present products clearly and manage the enquiries and routines involved in Marketplace selling.",["Marketplace selling foundations","Product selection and pricing","Photos and effective listings","Buyer enquiries and selling routines"]],
  "Walmart course": ["Walmart Marketplace Training","Explore marketplace operations, product catalogue preparation and the foundations of a Walmart selling workflow.",["Marketplace and seller foundations","Product research and catalogue planning","Listing quality and product information","Inventory and order management"]],
  "Mercari course": ["Mercari Reselling Training","Develop a repeatable approach to resale, from evaluating product condition to preparing listings and managing orders.",["Resale sourcing and product evaluation","Condition checks and pricing","Photography and listing preparation","Order handling and buyer communication"]],
  "Poshmark course": ["Poshmark Reselling Training","Build the foundations of a well-presented resale catalogue with clear product information and organised selling routines.",["Resale planning and product selection","Closet organisation and presentation","Condition, sizing and listing details","Pricing and customer communication"]],
  "OfferUp course": ["OfferUp Local Selling Training","Understand local selling workflows and learn how to create useful listings and manage buyer enquiries.",["Local selling foundations","Product selection and pricing","Clear photography and descriptions","Buyer communication and fulfilment planning"]],
  "Temu course": ["Temu Seller Foundations","Explore the seller landscape and develop a foundation in product preparation, catalogue quality and operating routines.",["Platform and seller overview","Product research and selection","Catalogue and product information","Pricing and operational planning"]]
};
let currentCourse = "General enquiry";
document.querySelectorAll('.view-program').forEach(b => {
  b.addEventListener('click', () => {
    const key = b.dataset.course;
    const [title, desc, items] = PROGRAMS[key];
    currentCourse = key;
    document.getElementById('pmNum').textContent = b.closest('.course-card').querySelector('.course-num').textContent;
    document.getElementById('pmTitle').textContent = title;
    document.getElementById('pmDesc').textContent = desc;
    document.getElementById('pmList').innerHTML = items.map(i => `<li>${i}</li>`).join('');
    openModal('programModal');
  });
});
document.getElementById('pmEnquire').addEventListener('click', () => {
  closeModals();
  preselectInterest(currentCourse);
});

// Quote / discuss buttons -> contact form with preselected interest
function preselectInterest(value){
  const sel = document.getElementById('eqInterest');
  [...sel.options].forEach(o => { if (o.text === value || o.textContent.trim() === value) sel.value = o.value || o.text; });
  sel.value = value;
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => document.getElementById('eqName').focus({ preventScroll: true }), 800);
}
document.querySelectorAll('.quote-btn').forEach(b => {
  b.addEventListener('click', () => preselectInterest(b.dataset.interest));
});

// Ecosystem chips -> platform card
document.querySelectorAll('.eco-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const card = document.querySelector(`.platform-card[data-name="${chip.dataset.platform}"]`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

// Pause animation toggle
(function(){
  const btn = document.getElementById('pauseAnim');
  const journey = document.getElementById('journeyAnim');
  btn.addEventListener('click', () => {
    const paused = journey.classList.toggle('paused');
    btn.textContent = paused ? 'Resume animation' : 'Pause animation';
  });
})();

// Articles modal
const ARTICLES = [
  { meta: "BEFORE YOU BEGIN · ECOMPILOT FIELD NOTES · 5 MIN READ", title: "Choose a marketplace that fits your business", desc: "A practical way to compare your product, audience and everyday selling needs." },
  { meta: "STORE FOUNDATIONS · ECOMPILOT FIELD NOTES · 4 MIN READ", title: "A better product listing starts with the basics", desc: "A clear checklist for presenting products and answering buyer questions." },
  { meta: "BUILD WITH INTENTION · ECOMPILOT FIELD NOTES · 5 MIN READ", title: "Your first store: make a plan before you launch", desc: "Turn a big idea into a manageable set of decisions and next steps." }
];
document.querySelectorAll('.article-card').forEach(card => {
  card.addEventListener('click', () => {
    const a = ARTICLES[+card.dataset.article];
    document.getElementById('amMeta').textContent = a.meta;
    document.getElementById('amTitle').textContent = a.title;
    document.getElementById('amDesc').textContent = a.desc;
    openModal('articleModal');
  });
});
document.getElementById('amEnquire').addEventListener('click', () => {
  closeModals();
  preselectInterest('General enquiry');
});

// Review modal
let rating = 0;
document.getElementById('shareReview').addEventListener('click', () => openModal('reviewModal'));
document.querySelectorAll('#starRow button').forEach(s => {
  s.addEventListener('click', () => {
    rating = +s.dataset.s;
    document.querySelectorAll('#starRow button').forEach(b => b.classList.toggle('lit', +b.dataset.s <= rating));
  });
});
document.getElementById('rvSubmit').addEventListener('click', () => {
  const name = document.getElementById('rvName').value.trim();
  const title = document.getElementById('rvTitle').value.trim();
  const text = document.getElementById('rvText').value.trim();
  if (!name || !text) { alert('Please add your name and review.'); return; }
  const raw = `Student Review — ${'★'.repeat(rating || 5)}\nName: ${name}\nTitle: ${title}\n\n${text}`;
  document.getElementById('rvWA').href = `https://wa.me/923456209399?text=${encodeURIComponent(raw)}`;
  document.getElementById('rvDone').hidden = false;
  document.getElementById('rvSend').hidden = false;
});

// Enquiry form -> WhatsApp / Email
document.getElementById('enquiryForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('eqName').value.trim();
  const interest = document.getElementById('eqInterest').value;
  const msg = document.getElementById('eqMsg').value.trim();
  const text = `New enquiry from EcomPilot website%0A%0AName: ${encodeURIComponent(name)}%0AInterested in: ${encodeURIComponent(interest)}%0A%0A${encodeURIComponent(msg)}`;
  document.getElementById('sendWA').href = `https://wa.me/923456209399?text=${text}`;
  document.getElementById('sendMail').href = `mailto:ecompilotgrowthagency@gmail.com?subject=${encodeURIComponent('Enquiry: ' + interest)}&body=${encodeURIComponent(`Name: ${name}\nInterested in: ${interest}\n\n${document.getElementById('eqMsg').value.trim()}`)}`;
  document.getElementById('formSend').hidden = false;
  document.getElementById('formSend').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 40 ? '0 4px 24px rgba(0,0,0,.5)' : 'none';
});
