// Una buena noticia para ti · Felicitación de Navidad · Parroquia de Santa Casilda
// Quien envía escribe una carta; la carta viaja sobre Tierra Santa hasta Belén y se comparte por WhatsApp.
// Quien recibe abre el enlace, rompe el lacre y escucha su buena noticia.
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // ---------- contenido ----------
  const MENSAJES = [
    { id: 1, texto: 'La buena noticia llega hoy a tu vida tal como estás, con tus luces y tus sombras.', voz: 'audio/voz_05.mp3' },
    { id: 2, texto: 'Va a nacer el Salvador, y te está esperando.', voz: 'audio/voz_06.mp3' },
    { id: 3, texto: 'No hace falta tenerlo todo en orden para ir a su encuentro.', voz: 'audio/voz_09.mp3' },
    { id: 4, texto: 'Basta con abrirle una rendija al corazón y dejar que su luz entre por fin en casa.', voz: 'audio/voz_10.mp3' }
  ];
  const ESCENAS = [
    { id: 3, img: 'img/escena3.webp', nombre: 'El anuncio del ángel', brillo: ['50%', '24%'] },
    { id: 6, img: 'img/escena6.webp', nombre: 'El pesebre', brillo: ['52%', '48%'] },
    { id: 7, img: 'img/escena7.webp', nombre: 'Camino de Belén', brillo: ['57%', '71%'] },
    { id: 9, img: 'img/escena9.webp', nombre: 'La luz encendida', brillo: ['58%', '49%'] }
  ];
  const VOZ_TITULO = 'audio/voz_00.mp3', VOZ_FINAL = 'audio/voz_11.mp3';
  const limpia = (s, n) => (s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);

  // ---------- pantallas ----------
  let actual = null;
  function ir(id) {
    if (actual) $('#' + actual).classList.remove('activa');
    actual = id; const el = $('#' + id); el.classList.add('activa'); el.scrollTop = 0;
    document.body.classList.toggle('oscuro', ['s-carta-form', 's-parroquia', 's-abrir', 's-sello'].includes(id));
    if (id === 's-carta-form') { camModo = 'reposo'; history.replaceState(null, '', location.pathname); }
  }
  $$('[data-ir]').forEach((b) => b.addEventListener('click', () => ir(b.dataset.ir)));

  function aviso(t) { const el = $('#toast'); el.textContent = t; el.classList.add('ver'); setTimeout(() => el.classList.remove('ver'), 2200); }
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- sonido ----------
  const musica = new Audio('audio/musica.mp3'); musica.loop = true; musica.volume = 0.32;
  let mudo = false, vozActual = null;
  const btnSonido = $('#sonido');
  btnSonido.addEventListener('click', () => {
    mudo = !mudo; btnSonido.classList.toggle('mudo', mudo);
    musica.muted = mudo; if (vozActual) vozActual.muted = mudo;
  });
  function arrancaMusica() { btnSonido.hidden = false; musica.play().catch(() => {}); }
  function habla(src) {
    return new Promise((res) => {
      const a = new Audio(src); vozActual = a; a.muted = mudo;
      musica.volume = 0.14;
      const fin = () => { musica.volume = 0.32; res(); };
      a.addEventListener('ended', fin, { once: true }); a.addEventListener('error', fin, { once: true });
      a.play().catch(fin);
    });
  }

  // ---------- formulario ----------
  $('#lista-mensajes').innerHTML = MENSAJES.map((m, i) =>
    `<label class="mensaje-op"><input type="radio" name="m" value="${m.id}" ${i === 1 ? 'checked' : ''}>${m.texto}</label>`).join('');
  $('#lista-escenas').innerHTML = ESCENAS.map((e, i) =>
    `<label class="mini" title="${e.nombre}"><input type="radio" name="e" value="${e.id}" ${i === 0 ? 'checked' : ''} aria-label="${e.nombre}"><img src="${e.img}" alt=""></label>`).join('');
  $('#lista-escenas').style.gridTemplateColumns = 'repeat(4,1fr)';

  function enlace(d) {
    const p = new URLSearchParams({ para: d.para, de: d.de, m: d.m, e: d.e });
    if (d.nota) p.set('n', d.nota);
    return location.origin + location.pathname + '?' + p.toString();
  }

  $('#formulario').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const d = { para: limpia(f.get('para'), 30), de: limpia(f.get('de'), 30), m: +f.get('m'), e: +f.get('e'), nota: limpia(f.get('nota'), 140) };
    if (!d.para || !d.de) { aviso('Escribe los dos nombres'); return; }
    arrancaMusica();
    const url = enlace(d);
    const msg = MENSAJES.find((x) => x.id === d.m), esc = ESCENAS.find((x) => x.id === d.e);
    // carta en miniatura
    const mini = $('#carta-mini'); mini.innerHTML = '';
    const im = document.createElement('img'); im.src = esc.img; im.alt = ''; mini.appendChild(im);
    const p = document.createElement('p'); p.textContent = msg.texto; mini.appendChild(p);
    const sobre = $('#sobre-envio'); sobre.className = 'sobre';
    $('#pie-sello').textContent = 'Guardando tu carta…';
    ir('s-sello');
    await espera(500); sobre.classList.add('dentro');
    await espera(1100); sobre.classList.add('cerrado'); $('#pie-sello').textContent = 'Sellando…';
    await espera(900); sobre.classList.add('sellado'); $('#pie-sello').textContent = 'Sellada con el lacre de Santa Casilda';
    await espera(1400);
    // viaje
    $('#txt-vuelo').innerHTML = 'Tu buena noticia viaja<br>hacia Belén…';
    ir('s-vuelo'); await vuela();
    $('#txt-vuelo').innerHTML = 'Ha llegado a Belén';
    await espera(1200);
    $('#listo-para').textContent = d.para;
    const texto = `${d.para}, tienes una carta desde Belén ✉️\nÁbrela aquí: ${url}`;
    $('#btn-whatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(texto);
    $('#btn-ver').href = url;
    $('#btn-copiar').onclick = async () => {
      try { await navigator.clipboard.writeText(url); aviso('Enlace copiado'); }
      catch (e) { prompt('Copia el enlace:', url); }
    };
    ir('s-listo');
  });

  // ---------- quien recibe ----------
  const q = new URLSearchParams(location.search);
  // Sin parámetros, la web abre la carta de la parroquia (primer envío, para todos los amigos de WhatsApp).
  const PARROQUIA = { para: '', de: 'Parroquia de Santa Casilda', m: 2, e: 3, nota: 'Esta Navidad queremos que esta buena noticia te llegue a ti. Y después, a quien tú quieras.', generica: true };
  const conCarta = q.get('para') && q.get('de');
  const R = conCarta
    ? { para: limpia(q.get('para'), 30), de: limpia(q.get('de'), 30), m: +q.get('m') || 2, e: +q.get('e') || 3, nota: limpia(q.get('n'), 140), generica: false }
    : PARROQUIA;

  // ---------- la carta de Belén (texto de prueba) ----------
  const CARTA_BELEN = [
    { t: 'Cerca de Belén, unos pastores velaban por turnos su rebaño.', v: 'audio/voz_01.mp3', img: 'img/escena2.webp', b: ['37%', '79%'] },
    { t: 'Una noche como tantas otras, les sorprendió un anuncio:', v: 'audio/voz_02.mp3', img: 'img/escena3.webp', b: ['50%', '24%'] },
    { t: '«No temáis, os traigo una buena noticia».', v: 'audio/voz_03.mp3', cls: 'cita' },
    { t: 'El ángel no les pidió que cambiaran antes de escucharla.', v: 'audio/voz_04.mp3', img: 'img/escena4.webp', b: ['10%', '85%'] },
    { t: 'La buena noticia llega hoy a tu vida tal como estás, con tus luces y tus sombras.', v: 'audio/voz_05.mp3', img: 'img/escena5.webp', b: ['32%', '42%'] },
    { t: 'Va a nacer el Salvador, y te está esperando.', v: 'audio/voz_06.mp3', img: 'img/escena6.webp', b: ['52%', '48%'], cls: 'fuerte' },
    { t: '«Vayamos a Belén», se dijeron.', v: 'audio/voz_07.mp3', img: 'img/escena7.webp', b: ['57%', '71%'], cls: 'cita' },
    { t: 'Tú también puedes dar un paso pequeño este año.', v: 'audio/voz_08.mp3', img: 'img/escena8.webp', b: ['49%', '37%'] },
    { t: '«No hace falta tenerlo todo en orden para ir a su encuentro.»', v: 'audio/voz_09.mp3', img: 'img/escena9.webp', b: ['58%', '49%'], cls: 'destacado' },
    { t: 'Basta con abrirle una rendija al corazón y dejar que su luz entre por fin en casa.', v: 'audio/voz_10.mp3' }
  ];
  function cambiaImagen(src, b) {
    const im = $('#carta-img'), fig = $('.carta-imagen');
    im.style.opacity = 0;
    setTimeout(() => { im.src = src; fig.style.setProperty('--bx', b[0]); fig.style.setProperty('--by', b[1]); im.style.opacity = 1; }, 450);
  }
  async function abrirCartaBelen() {
    arrancaMusica();
    $('#carta').classList.add('belen');
    $('#carta-img').src = CARTA_BELEN[0].img;
    $('#carta-para').textContent = 'Querido amigo, querida amiga';
    $('#carta-de').textContent = 'Parroquia de Santa Casilda';
    $('#carta-mensaje').textContent = ''; $('#carta-nota').textContent = '';
    const cuerpo = $('#carta-mensaje');
    const sobre = $('#sobre-llega'); sobre.className = 'sobre cerrado sellado'; sobre.parentElement.style.opacity = 1;
    ir('s-abrir');
    await espera(900); sobre.classList.add('roto');
    await espera(700); sobre.classList.remove('cerrado');
    await espera(1000); sobre.parentElement.style.transition = 'opacity .6s'; sobre.parentElement.style.opacity = 0;
    $('#carta').classList.add('abierta');
    await espera(900);
    const partes = $$('.carta-texto > *');
    partes[0].classList.add('ver'); await espera(400); partes[1].classList.add('ver');
    await habla(VOZ_TITULO);
    partes[2].classList.add('ver');
    for (const p of CARTA_BELEN) {
      if (p.img) cambiaImagen(p.img, p.b);
      const el = document.createElement('span'); el.className = 'parrafo ' + (p.cls || ''); el.textContent = p.t;
      cuerpo.appendChild(el); requestAnimationFrame(() => el.classList.add('ver'));
      const carta = $('#carta'); carta.scrollTo({ top: carta.scrollHeight, behavior: 'smooth' });
      await habla(p.v); await espera(350);
    }
    partes[4].classList.add('ver'); await espera(900);
    $('#btn-seguir').classList.add('ver'); $('#carta').scrollTo({ top: $('#carta').scrollHeight, behavior: 'smooth' });
  }
  async function abrirCarta() {
    if (R.generica) return abrirCartaBelen();
    arrancaMusica();
    const msg = MENSAJES.find((x) => x.id === R.m) || MENSAJES[1];
    const esc = ESCENAS.find((x) => x.id === R.e) || ESCENAS[0];
    $('#carta-img').src = esc.img;
    const fig = $('.carta-imagen'); fig.style.setProperty('--bx', esc.brillo[0]); fig.style.setProperty('--by', esc.brillo[1]);
    $('#carta-para').textContent = R.generica ? 'Querido amigo, querida amiga' : R.para; $('#carta-de').textContent = R.de;
    $('#carta-mensaje').textContent = msg.texto; $('#carta-nota').textContent = R.nota ? '«' + R.nota + '»' : '';
    const sobre = $('#sobre-llega'); sobre.className = 'sobre cerrado sellado'; sobre.parentElement.style.opacity = 1;
    ir('s-abrir');
    await espera(900); sobre.classList.add('roto');
    await espera(700); sobre.classList.remove('cerrado');
    await espera(1000); sobre.parentElement.style.transition = 'opacity .6s'; sobre.parentElement.style.opacity = 0;
    $('#carta').classList.add('abierta');
    await espera(900);
    const partes = $$('.carta-texto > *');
    partes[0].classList.add('ver'); await espera(400); partes[1].classList.add('ver');
    await habla(VOZ_TITULO);
    partes[2].classList.add('ver'); await habla(msg.voz);
    partes[3].classList.add('ver'); await espera(R.nota ? 1600 : 200);
    partes[4].classList.add('ver'); await espera(900);
    $('#btn-seguir').classList.add('ver');
  }
  $('#btn-seguir').addEventListener('click', () => { ir('s-parroquia'); camModo = 'reposo'; habla(VOZ_FINAL); });
  $('#btn-abrir').addEventListener('click', abrirCarta);
  // reenviar la misma carta de Belén
  const ENLACE = location.origin + location.pathname;
  $('#btn-reenviar').href = 'https://wa.me/?text=' + encodeURIComponent('✉️ Tienes una carta desde Belén. Es una buena noticia para ti.\nÁbrela aquí: ' + ENLACE);
  $('#btn-copiar2').addEventListener('click', async () => { try { await navigator.clipboard.writeText(ENLACE); aviso('Enlace copiado'); } catch (e) { prompt('Copia el enlace:', ENLACE); } });
  $('#btn-otra-vez').addEventListener('click', () => { location.href = ENLACE; });

  // ---------- mapa 3D de Tierra Santa ----------
  const lienzo = $('#mapa');
  let renderer, scene, camera, BL, glow, camModo = 'reposo', t0 = performance.now(), lugarActual = 'belen';
  const LUGARES = {};
  function cambiaLugar(n) {
    if (!renderer || !LUGARES[n]) return;
    for (const k in LUGARES) LUGARES[k].mesh.visible = (k === n);
    lugarActual = n; BL = LUGARES[n].objetivo; glow.position.copy(BL).add(new THREE.Vector3(0, .08, 0));
  }
  const sobreVolando = $('#sobre-volando');
  let vuelo = null;
  const lerp = (a, b, u) => a + (b - a) * u, clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const suave = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  function iniciaMapa() {
    try {
      renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch (e) { lienzo.style.background = 'radial-gradient(ellipse at 50% 30%,#1a2240,#07080c 70%)'; return false; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x0a0d18, 16, 42);
    camera = new THREE.PerspectiveCamera(50, 1, 0.05, 200);
    const sol = new THREE.DirectionalLight(0xffe2b0, 0.9); sol.position.set(-8, 10, -6); scene.add(sol);
    scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x6a5434, 1.5));
    function terreno(H, url, lon0, dlon, latTop, dlat, lonT, latT, K, avisa) {
      const { w: GW, h: GH, d: GD } = H;
      const geo = new THREE.BufferGeometry(), pos = new Float32Array(GW * GH * 3), uv = new Float32Array(GW * GH * 2);
      for (let i = 0; i < GH; i++) for (let j = 0; j < GW; j++) {
        const k = i * GW + j; pos[k * 3] = j / (GW - 1) * 18 - 9; pos[k * 3 + 1] = GD[k] * K; pos[k * 3 + 2] = i / (GH - 1) * 24 - 12;
        uv[k * 2] = j / (GW - 1); uv[k * 2 + 1] = 1 - i / (GH - 1);
      }
      const idx = []; for (let i = 0; i < GH - 1; i++) for (let j = 0; j < GW - 1; j++) { const a = i * GW + j, b = a + 1, c = a + GW, d = c + 1; idx.push(a, c, b, b, c, d); }
      geo.setIndex(idx); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.computeVertexNormals();
      const tex = new THREE.TextureLoader().load(url, avisa); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: tex })); scene.add(mesh);
      const jj = Math.round((lonT - lon0) / dlon * (GW - 1)), ii = Math.round((latTop - latT) / dlat * (GH - 1));
      const objetivo = new THREE.Vector3(jj / (GW - 1) * 18 - 9, Math.max(0, GD[ii * GW + jj]) * K, ii / (GH - 1) * 24 - 12);
      return { mesh, objetivo };
    }
    LUGARES.belen = terreno(window.HGT, 'assets/terreno.jpg', 34.2, 1.8, 33.4, 2.4, 35.20, 31.70, 0.00042, () => { window.__mapaListo = true; });
    LUGARES.belen.lado = -1;
    if (window.HGT_MAD) {
      LUGARES.madrid = terreno(window.HGT_MAD, 'assets/terreno-madrid.jpg', -4.55, 1.6, 41.48, 1.93, -3.744, 40.381, 0.00042, () => { window.__madridListo = true; });
      LUGARES.madrid.lado = 1; LUGARES.madrid.mesh.visible = false;
    }
    BL = LUGARES.belen.objetivo;
    const gc = document.createElement('canvas'); gc.width = gc.height = 128; const g = gc.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,250,225,1)'); gr.addColorStop(.15, 'rgba(255,220,140,.9)'); gr.addColorStop(.45, 'rgba(255,180,80,.3)'); gr.addColorStop(1, 'rgba(255,170,60,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, fog: false }));
    glow.position.copy(BL).add(new THREE.Vector3(0, .08, 0)); scene.add(glow);
    lugarActual = 'belen';
    redimensiona(); addEventListener('resize', redimensiona);
    return true;
  }
  function redimensiona() {
    if (!renderer) return;
    const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 50 : 38; camera.updateProjectionMatrix();
    polvo.width = w; polvo.height = h;
  }
  function colocaCamara(dist, el, az, mira) {
    const e = el * Math.PI / 180, a = az * Math.PI / 180;
    camera.position.set(BL.x + dist * Math.cos(e) * Math.sin(a), BL.y + dist * Math.sin(e), BL.z + dist * Math.cos(e) * Math.cos(a));
    camera.lookAt(mira || new THREE.Vector3(BL.x, BL.y, BL.z + 0.4));
  }
  // trayectoria de la carta: del Mediterráneo a Belén
  function puntoVuelo(u) {
    const L = (LUGARES[lugarActual] || { lado: -1 }).lado;
    const P0 = BL.clone().add(new THREE.Vector3(L * 9.5, 2.3, -3.5)), P1 = BL.clone().add(new THREE.Vector3(L * 4.5, 3.9, 1.5));
    const P2 = new THREE.Vector3(BL.x, BL.y + 0.12, BL.z);
    const a = P0.clone().lerp(P1, u), b = P1.clone().lerp(P2, u); return a.lerp(b, u);
  }
  // la carta sale de Belén hacia el oeste (recorrido inverso)
  function sale() {
    return new Promise((res) => {
      const el = $('#sobre-sale');
      if (!renderer) { setTimeout(res, 2500); return; }
      vuelo = { inicio: performance.now(), dur: 3800, fin: res, el, inverso: true }; camModo = 'vuelo';
      el.classList.add('visible');
    });
  }
  function vuela(el, dur) {
    el = el || sobreVolando;
    return new Promise((res) => {
      if (!renderer) { setTimeout(res, 2500); return; }
      vuelo = { inicio: performance.now(), dur: dur || 6500, fin: res, el }; camModo = 'vuelo';
      el.classList.add('visible');
    });
  }

  // polvo dorado
  const polvo = $('#polvo'), pc = polvo.getContext('2d');
  const R2 = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);
  const motas = [...Array(70)].map(() => ({ x: R2(), y: R2(), z: .3 + R2() * .9, r: .6 + R2() * 2, f: R2() * 6.28, v: 6 + R2() * 16 }));
  function dibujaPolvo(t) {
    const w = polvo.width, h = polvo.height; pc.clearRect(0, 0, w, h);
    for (const m of motas) {
      const y = ((m.y * h - t * m.v * m.z) % h + h) % h, x = m.x * w + Math.sin(t * .4 + m.f) * 26 * m.z;
      const a = (.25 + .75 * (.5 + .5 * Math.sin(t * 1.3 + m.f))) * m.z * .7, r = m.r * 3 * m.z;
      const g = pc.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,226,160,${a})`); g.addColorStop(1, 'rgba(255,226,160,0)');
      pc.fillStyle = g; pc.beginPath(); pc.arc(x, y, r, 0, 6.283); pc.fill();
    }
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function bucle(now) {
    const t = (now - t0) / 1000;
    if (renderer) {
      if (camModo === 'vuelo' && vuelo) {
        const u = clamp((now - vuelo.inicio) / vuelo.dur), e0 = suave(u), e = vuelo.inverso ? 1 - e0 : e0;
        const L = (LUGARES[lugarActual] || { lado: -1 }).lado;
        colocaCamara(lerp(15, 10, e), lerp(46, 36, e), L * lerp(48, 10, e), new THREE.Vector3(BL.x + L * lerp(4, 0, e), BL.y, BL.z + lerp(-2, .4, e)));
        const p = puntoVuelo(e).project(camera);
        const x = (p.x * .5 + .5) * innerWidth, y = (-p.y * .5 + .5) * innerHeight, s = lerp(1.1, .45, e);
        vuelo.el.style.transform = `translate(${x}px,${y}px) rotate(${lerp(-14, 4, e) + Math.sin(t * 3) * 3}deg) scale(${s})`;
        glow.scale.setScalar(vuelo.inverso ? lerp(1.8, 1.0, clamp(u / .3)) : lerp(.6, 1.6, clamp((u - .8) / .2)));
        if (u >= 1) { vuelo.el.classList.remove('visible'); const f = vuelo.fin; vuelo = null; camModo = 'llegada'; f(); }
      } else {
        const L = (LUGARES[lugarActual] || { lado: -1 }).lado;
        const az = reduce ? L * 6 : L * 10 + Math.sin(t * .06) * 14;
        colocaCamara(11.5 + Math.sin(t * .05) * .8, 38, az);
        glow.scale.setScalar(1.1 * (1 + .15 * Math.sin(t * 3.2)));
      }
      renderer.render(scene, camera);
    }
    if (!reduce) dibujaPolvo(t);
    requestAnimationFrame(bucle);
  }

  // ---------- arranque ----------
  polvo.width = innerWidth; polvo.height = innerHeight;
  iniciaMapa();
  requestAnimationFrame(bucle);
  // ---------- viaje Belén → Madrid, todo en 3D (primer envío, de la parroquia) ----------
  let saltado = false;
  const esperaO = (p) => Promise.race([p, new Promise((r) => { const iv = setInterval(() => { if (saltado) { clearInterval(iv); r(); } }, 100); })]);
  async function viajeInicial() {
    const bS = $('#saltar'); bS.hidden = false; bS.onclick = () => { saltado = true; };
    const txtA = $('#sale-ante'), txt = $('#sale-txt');
    ir('s-sale');
    const t0m = performance.now(); while (!window.__mapaListo && performance.now() - t0m < 5000 && !saltado) await espera(100);
    if (!saltado) await esperaO(espera(1200));
    if (!saltado) await esperaO(sale());
    if (vuelo) { vuelo.el.classList.remove('visible'); vuelo = null; }
    // el salto: destello y cambio a Madrid
    const fl = $('#destello');
    if (!saltado) { fl.classList.add('on'); await espera(650); }
    cambiaLugar('madrid'); camModo = 'reposo';
    txtA.textContent = 'MADRID · NOCHEBUENA'; txt.innerHTML = '…y viaja hasta<br><em>Madrid</em>';
    fl.classList.remove('on');
    if (!saltado) { await esperaO(espera(700)); await esperaO(vuela($('#sobre-sale'), 5600)); }
    if (vuelo) { vuelo.el.classList.remove('visible'); vuelo = null; }
    camModo = 'reposo';
    if (!saltado) {
      txtA.textContent = 'CARABANCHEL'; txt.innerHTML = 'Ha llegado a la<br><em>Parroquia de Santa Casilda</em>';
      await esperaO(espera(2800));
    }
    bS.hidden = true;
    ir('s-llega');
  }

  if (q.has('escribir')) {
    ir('s-inicio');
  } else {
    $('#llega-para').textContent = R.generica ? 'Amigo, amiga' : R.para;
    $('#llega-de').textContent = R.generica ? 'Desde la Parroquia de Santa Casilda te la enviamos a ti.' : 'Te la envía ' + R.de + ' desde Belén.';
    document.title = (R.generica ? 'Tienes una carta desde Belén' : R.para + ', tienes una carta desde Belén');
    if (R.generica) {
      $('#llega-foto').hidden = false; $('#llega-ante').textContent = 'DE BELÉN A CARABANCHEL';
      viajeInicial();
    } else ir('s-llega');
  }
})();
