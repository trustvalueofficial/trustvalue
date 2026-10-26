// @ts-nocheck
export function bootAboutPage(root) {
if (!root) return;
window.TV_RIG = {"w":365,"h":760,"cut":111,"neck":300,"mouth":[{"p0":[99.0,198.5],"p1":[185.5,295.2],"p2":[272.0,197.5],"w":14.0},{"p0":[106.0,246.4],"p1":[184.0,302.0],"p2":[262.0,247.6],"w":14.0}],"orbs":[[76.9,56.1],[293.8,56.5]]};
var RIG = window.TV_RIG, KEY = 'tv-about-quests-v1';
var $ = function (s, r) { return (r || root).querySelector(s); };
var qq = function (s, r) { return Array.prototype.slice.call((r || root).querySelectorAll(s)); };
var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
var fmt = function (n, d) { return n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d }); };
var K = { 1: -0.85, 2: -0.42, 3: 0.05, 4: 1, 5: 1.32 };
function mouthD(c, k) {
var my = (c.p0[1] + c.p2[1]) / 2, qy = my + (c.p1[1] - my) * k;
return 'M' + c.p0[0] + ' ' + c.p0[1] + 'Q' + c.p1[0] + ' ' + qy.toFixed(1) + ' ' + c.p2[0] + ' ' + c.p2[1];
}
function setMood(rig, m) {
if (!rig) return;
var paths = qq('.rig__mouth path', rig), k1 = K[m], k0 = parseFloat(rig.dataset.k || '1');
rig.dataset.mood = m; rig.dataset.k = k1;
rig.style.animation = 'none'; void rig.offsetWidth; rig.style.animation = '';
if (reduce) { paths.forEach(function (p, i) { p.setAttribute('d', mouthD(RIG.mouth[i], k1)); }); return; }
var t0 = performance.now();
(function step(t) {
var u = Math.min(1, (t - t0) / 420), e = 1 - Math.pow(1 - u, 3), k = k0 + (k1 - k0) * e;
paths.forEach(function (p, i) { p.setAttribute('d', mouthD(RIG.mouth[i], k)); });
if (u < 1) requestAnimationFrame(step);
})(t0);
}
var Q = { 1: 'Make U angry', 2: 'Make U smile', 3: 'Play a story', 4: 'See the future', 5: 'Pick your side' };
var done = {};
try { done = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { done = {}; }
function count() { var n = 0; for (var i = 1; i <= 5; i++) if (done[i]) n++; return n; }
function paintQuests(animate) {
var n = count(), xp = n * 100, el = $('[data-xp]');
if (el) el.textContent = fmt(xp, 0);
qq('.seg').forEach(function (s) { var i = s.dataset.q; s.classList.toggle('is-done', !!done[i]); s.setAttribute('aria-label', 'Quest ' + i + ': ' + Q[i] + (done[i] ? ', done' : '')); });
qq('[data-quest-count]').forEach(function (e) { e.textContent = n; });
qq('[data-rank]').forEach(function (e) { e.textContent = n === 5 ? 'Trust Insider' : 'Quests ' + n + '/5'; });
var qd = $('.quest-done'); if (qd) qd.classList.toggle('is-win', n === 5);
var qt = $('[data-quest-text]'); if (qt) qt.textContent = n === 5 ? 'All five quests done. You are a Trust Insider.' : 'Quests done: ' + n + ' of 5. ' + (n ? 'Keep going.' : 'Start with the Mood Lab.');
if (animate) { var b = $('.hud__xp'); if (b) { b.classList.remove('is-bump'); void b.offsetWidth; b.classList.add('is-bump'); } }
}
function quest(i) {
if (done[i]) return;
done[i] = true;
try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
paintQuests(true);
toast('+100 XP', 'Quest done: ' + Q[i]);
if (count() === 5) setTimeout(function () { toast('Badge unlocked', 'Trust Insider', true); confetti(); }, 600);
}
qq('[data-quest="5"]').forEach(function (a) { a.addEventListener('click', function () { quest(5); }); });
function toast(big, small, badge) {
var t = document.createElement('div');
t.className = 'toast' + (badge ? ' toast--badge' : '');
t.innerHTML = '<span class="coin" aria-hidden="true"></span><span><b></b> <span></span></span>';
$('b', t).textContent = big; $('span span', t).textContent = small;
var box = $('.toasts'); box.appendChild(t);
while (box.children.length > 2) box.removeChild(box.firstChild);
setTimeout(function () { t.classList.add('is-out'); setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 320); }, 2600);
}
function confetti() {
if (reduce) return;
var c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
var dpr = Math.min(2, window.devicePixelRatio || 1), W = c.width = innerWidth * dpr, H = c.height = innerHeight * dpr, g = c.getContext('2d');
var cols = ['#FF5A0A', '#FFAA00', '#F12A0A', '#1240C8', '#0A8754'], P = [];
for (var i = 0; i < 150; i++) P.push({ x: W / 2, y: H * 0.4, vx: (Math.random() - 0.5) * 16 * dpr, vy: (-4 - Math.random() * 13) * dpr, s: (5 + Math.random() * 6) * dpr, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35, c: cols[i % 5] });
var t0 = performance.now();
(function f(t) {
var k = (t - t0) / 1800; g.clearRect(0, 0, W, H);
P.forEach(function (p) { p.vy += 0.35 * dpr; p.x += p.vx; p.y += p.vy; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.globalAlpha = Math.max(0, 1 - k); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66); g.restore(); });
if (k < 1) requestAnimationFrame(f); else c.remove();
})(t0);
}
var SIM = { n24: 412, avg24: 4.21, n30: 38, avg30: 4.05, index: 1042.6, ones90: 9, n90: 104 };
var NAME = { 1: 'Angry Star', 2: 'Let down', 3: 'Mixed', 4: 'Good', 5: 'Recommend' };
var SAY = {
1: "Ouch, an Angry Star! Tell them what went wrong.",
2: "Let down. Honest beats polite, every time.",
3: "Mixed? Useful too. It shows what to check.",
4: "Good! Solid ratings help good stuff get found.",
5: "Recommend! You just lifted the index."
};
var labRig = $('#lab .rig'), say = $('#lab-say'), picked = null, FOOT = $('#lab-foot').textContent;
function simulate(r) {
var tv = (SIM.n24 * SIM.avg24 + r) / (SIM.n24 + 1), r30 = (SIM.n30 * SIM.avg30 + r) / (SIM.n30 + 1);
var idx = SIM.index * r30 / SIM.avg30, d = idx - SIM.index;
return { tv: tv, idx: idx, d: d, share: ((SIM.ones90 + (r === 1 ? 1 : 0)) / (SIM.n90 + 1)) * 100 };
}
function showLab(r, commit) {
setMood(labRig, r);
say.textContent = SAY[r]; say.classList.remove('is-new'); void say.offsetWidth; say.classList.add('is-new');
if (!commit) return;
picked = r;
var s = simulate(r), up = s.d >= 0;
$('#lab-tv').textContent = fmt(s.tv, 1);
var dt = s.tv - SIM.avg24;
$('#lab-tv-d').textContent = (SIM.n24 + 1) + ' ratings · ' + (dt >= 0 ? '▲ +' : '▼ −') + Math.abs(dt).toFixed(3);
$('#lab-idx').textContent = fmt(s.idx, 1);
var dl = $('#lab-idx-d'); dl.textContent = (up ? '▲ +' : '▼ −') + fmt(Math.abs(s.d), 1) + ' today'; dl.className = 'delta ' + (up ? 'up' : 'down');
var ft = $('#lab-foot');
ft.classList.toggle('is-alert', r === 1);
ft.textContent = r === 1 ? '1-star share in the last 90 days: 8.7% → ' + fmt(s.share, 1) + '%. At 10%, the page shows a Trust Alert.' : FOOT;
qq('.mb').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.r === r)); });
$('#lab-live').textContent = 'You picked ' + NAME[r] + '. TrustValue ' + fmt(s.tv, 1) + ', Trust Index ' + fmt(s.idx, 1) + '.';
plotYou(s.idx);
if (r === 1) quest(1);
if (r === 5) quest(2);
}
qq('.mb').forEach(function (b) {
var r = +b.dataset.r;
b.addEventListener('click', function () { showLab(r, true); });
b.addEventListener('mouseenter', function () { if (picked !== r) { setMood(labRig, r); } });
b.addEventListener('mouseleave', function () { setMood(labRig, picked || 4); });
});
function plotYou(v) {
qq('[data-v1]').forEach(function (ch) {
var g = ch.dataset, pct = function (x) { return (+g.v1 - x) / (+g.v1 - +g.v0) * 100; };
var y = pct(v), ny = pct(SIM.index);
var you = $('.pin--you', ch), ln = $('.you-line', ch), tx = $('.you-tx', ch), nt = $('.now-tx', ch);
you.style.top = y.toFixed(2) + '%'; you.hidden = false;
you.style.animation = 'none'; void you.offsetWidth; you.style.animation = '';
ln.style.top = Math.min(y, ny).toFixed(2) + '%'; ln.style.height = Math.abs(y - ny).toFixed(2) + '%'; ln.hidden = false;
if (tx) { tx.style.top = y.toFixed(2) + '%'; tx.textContent = 'After your rating: ' + fmt(v, 1); tx.hidden = false; }
if (nt) nt.hidden = true;
});
$('#chart-say').textContent = 'Your simulated rating moved today\'s index from 1,042.6 to ' + fmt(v, 1) + '. Real indices move only with real, verified ratings.';
}
qq('.mood').forEach(function (m) {
m.addEventListener('click', function () { var r = $('.rig', m); setMood(r, +r.dataset.mood); });
});
qq('.story').forEach(function (st) {
var btn = $('.play', st), steps = qq('.chap li', st), rig = $('.rig', st), moods = (st.dataset.moods || '').split(',');
if (!btn) return;
btn.addEventListener('click', function () {
btn.disabled = true;
steps.forEach(function (s) { s.classList.remove('is-on'); });
steps.forEach(function (s, i) {
setTimeout(function () {
steps.forEach(function (o) { o.classList.toggle('is-on', o === s); });
if (rig && moods[i]) setMood(rig, +moods[i]);
if (i === steps.length - 1) { btn.disabled = false; $('span', btn).textContent = 'Play again'; quest(3); }
}, reduce ? 0 : i * 1300);
});
});
});
var ff = $('#ff');
if (ff) ff.addEventListener('click', function () {
var stops = qq('.stop'), fill = $('.road__fill');
ff.disabled = true;
stops.forEach(function (s, i) {
setTimeout(function () {
s.classList.add('is-on');
if (fill) fill.style.width = (i / (stops.length - 1) * 100) + '%';
if (i === stops.length - 1) { ff.disabled = false; quest(4); }
}, reduce ? 0 : i * 700);
});
});
var sh = $('#share'), URL = window.location.origin + '/about';
function showLink() { var f = $('#share-fallback'), i = $('#share-url'); f.hidden = false; i.focus(); i.select(); }
function copyLink() {
if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(URL).then(function () { toast('Link copied', 'Send it to a friend'); }, showLink);
else showLink();
}
if (sh) sh.addEventListener('click', function () {
var data = { title: 'TrustValue.ai', text: 'The trust score for everything you buy. Rate with proof and see what you move.', url: URL };
if (navigator.share) { try { navigator.share(data).catch(function (e) { if (!e || e.name !== 'AbortError') copyLink(); }); } catch (e) { copyLink(); } }
else copyLink();
});
paintQuests(false);
setMood(labRig, 4);

}
