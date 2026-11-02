/* FERRO-PRO · comportamiento de la página */
// Cambie este número por el WhatsApp real de la empresa (código de país + número, sin + ni espacios)
const WHATSAPP = '525580003376';

const PRODUCTS = [
  { sku: 'EL-1001', name: 'Rotomartillo SDS-Plus 26 mm', spec: '800 W · 3 modos · estuche', cat: 'Eléctricas', icon: 'fa-bolt' },
  { sku: 'EL-1014', name: 'Esmeriladora angular 9"', spec: '2,200 W · disco 230 mm', cat: 'Eléctricas', icon: 'fa-bolt' },
  { sku: 'EL-1032', name: 'Sierra circular 7-1/4"', spec: '1,800 W · corte a 60 mm', cat: 'Eléctricas', icon: 'fa-bolt' },
  { sku: 'SG-2005', name: 'Casco de seguridad dieléctrico', spec: 'ANSI Z89.1 · clase E', cat: 'Seguridad', icon: 'fa-helmet-safety' },
  { sku: 'SG-2018', name: 'Respirador con filtros P100', spec: 'Media cara · 2 filtros', cat: 'Seguridad', icon: 'fa-mask-ventilator' },
  { sku: 'SG-2031', name: 'Guantes anticorte nivel 5', spec: 'Par · talla M a XL', cat: 'Seguridad', icon: 'fa-hand' },
  { sku: 'NE-3002', name: 'Compresor industrial 100 L', spec: '3 HP · 8 bar · 220 V', cat: 'Neumática', icon: 'fa-screwdriver-wrench' },
  { sku: 'NE-3017', name: 'Llave de impacto 1/2"', spec: '1,000 Nm · aire comprimido', cat: 'Neumática', icon: 'fa-screwdriver-wrench' },
  { sku: 'NE-3024', name: 'Torquímetro de click 1/2"', spec: '40–200 Nm · certificado', cat: 'Neumática', icon: 'fa-gauge-high' },
  { sku: 'FJ-4003', name: 'Ancla de expansión 1/2" x 4"', spec: 'Caja de 50 · acero zincado', cat: 'Fijación', icon: 'fa-link' },
  { sku: 'FJ-4019', name: 'Tornillería grado 8 surtida', spec: 'Kit 600 pzs · UNC', cat: 'Fijación', icon: 'fa-link' },
  { sku: 'FJ-4026', name: 'Cadena de carga grado 80', spec: '3/8" · metro lineal', cat: 'Fijación', icon: 'fa-link' }
];
const CATS = ['Todos', 'Eléctricas', 'Seguridad', 'Neumática', 'Fijación'];

const $ = (s) => document.querySelector(s);
const quote = new Map();
let activeCat = 'Todos', query = '';

// Menú móvil
const menuBtn = $('#menu-btn'), menu = $('#mobile-menu');
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('hidden') === false;
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.innerHTML = '<i class="fa-solid ' + (open ? 'fa-xmark' : 'fa-bars') + ' text-2xl"></i>';
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.add('hidden'); menuBtn.setAttribute('aria-expanded', false); }));

// Catálogo
function renderFilters() {
  $('#filters').innerHTML = CATS.map(c =>
    `<button data-cat="${c}" class="px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${c === activeCat ? 'bg-amber-500 text-steel-950 border-amber-500' : 'border-steel-700 text-slate-300 hover:border-amber-500 hover:text-amber-400'}">${c}</button>`).join('');
}
function renderGrid() {
  const q = query.trim().toLowerCase();
  const list = PRODUCTS.filter(p => (activeCat === 'Todos' || p.cat === activeCat) &&
    (!q || (p.name + ' ' + p.sku + ' ' + p.cat + ' ' + p.spec).toLowerCase().includes(q)));
  $('#empty').classList.toggle('hidden', list.length > 0);
  $('#grid').innerHTML = list.map(p => {
    const added = quote.has(p.sku);
    return `<article class="product bg-steel-900 border border-steel-700 rounded-xl p-5 flex flex-col transition-colors">
      <div class="w-full h-28 rounded-lg bg-steel-800 grid place-items-center text-amber-500 text-4xl"><i class="fa-solid ${p.icon}"></i></div>
      <p class="text-xs text-slate-500 mt-4">${p.cat} · ${p.sku}</p>
      <h3 class="font-bold text-white mt-1 leading-snug">${p.name}</h3>
      <p class="text-sm text-slate-400 mt-1 flex-1">${p.spec}</p>
      <button data-sku="${p.sku}" class="add mt-4 w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${added ? 'bg-steel-700 text-amber-400' : 'bg-amber-500 hover:bg-amber-450 text-steel-950'}">
        ${added ? 'Quitar de la cotización' : 'Añadir a la cotización'}</button>
    </article>`;
  }).join('');
}
$('#filters').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  activeCat = b.dataset.cat; renderFilters(); renderGrid();
});
$('#grid').addEventListener('click', e => {
  const b = e.target.closest('.add'); if (!b) return;
  const sku = b.dataset.sku;
  quote.has(sku) ? quote.delete(sku) : quote.set(sku, PRODUCTS.find(p => p.sku === sku));
  renderGrid(); renderQuote();
});
document.querySelectorAll('.cat-jump').forEach(a => a.addEventListener('click', () => {
  activeCat = a.dataset.cat; query = ''; $('#hero-q').value = ''; renderFilters(); renderGrid();
}));
$('#hero-search').addEventListener('submit', e => {
  e.preventDefault(); query = $('#hero-q').value; activeCat = 'Todos';
  renderFilters(); renderGrid(); $('#catalogo').scrollIntoView({ behavior: 'smooth' });
});

// Lista de cotización
function renderQuote() {
  $('#quote-count').textContent = quote.size;
  $('#quote-empty').classList.toggle('hidden', quote.size > 0);
  $('#quote-list').innerHTML = [...quote.values()].map(p =>
    `<li class="flex items-center justify-between gap-3 bg-steel-800 rounded-lg px-3 py-2">
      <span><b class="text-white">${p.name}</b> <span class="text-slate-500">${p.sku}</span></span>
      <button data-rm="${p.sku}" class="text-slate-400 hover:text-red-400" aria-label="Quitar ${p.name}"><i class="fa-solid fa-xmark"></i></button></li>`).join('');
}
$('#quote-list').addEventListener('click', e => {
  const b = e.target.closest('[data-rm]'); if (!b) return;
  quote.delete(b.dataset.rm); renderQuote(); renderGrid();
});

// Formulario
$('#quote-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = { name: $('#f-name'), company: $('#f-company'), email: $('#f-email'), phone: $('#f-phone'), msg: $('#f-msg') };
  const err = $('#form-error');
  const empty = Object.values(f).find(i => !i.value.trim());
  if (empty) { err.textContent = 'Complete todos los campos para enviar la solicitud.'; err.classList.remove('hidden'); empty.focus(); return; }
  if (!/^\S+@\S+\.\S+$/.test(f.email.value)) { err.textContent = 'Escriba un correo válido, por ejemplo nombre@empresa.com.'; err.classList.remove('hidden'); f.email.focus(); return; }
  err.classList.add('hidden');
  const items = [...quote.values()].map(p => '- ' + p.name + ' (' + p.sku + ')').join('\n') || '- (sin productos seleccionados)';
  const text = `Solicitud de cotización FERRO-PRO\nNombre: ${f.name.value}\nEmpresa: ${f.company.value}\nCorreo: ${f.email.value}\nTeléfono: ${f.phone.value}\n\nProductos:\n${items}\n\nDetalle: ${f.msg.value}`;
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
});

// Enlace activo al desplazarse
const links = document.querySelectorAll('.nav-link');
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id)); });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => io.observe(s));

$('#year').textContent = new Date().getFullYear();
renderFilters(); renderGrid(); renderQuote();
