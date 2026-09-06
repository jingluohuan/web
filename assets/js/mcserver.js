/* MC 服务器页面交互脚本 */
(function () {
  'use strict';

  // ===== 数字滚动动画 =====
  function animateNumber(el, target, suffix = '') {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(start + (target - start) * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  // ===== 初始化统计数字 =====
  function initStats() {
    const onlineVal = document.querySelector('[data-target="online"]');
    const playersVal = document.querySelector('[data-target="players"]');
    const fill = document.getElementById('mcProgressFill');
    if (onlineVal) animateNumber(onlineVal,100, '%');
    if (playersVal) animateNumber(playersVal, 3, '/50');
    setTimeout(() => { if (fill) fill.style.width = '20%'; }, 200);
  }

  // ===== 节点复制 IP =====
  function initNodes() {
    document.querySelectorAll('.mc-node-card[data-ip]').forEach(card => {
      card.addEventListener('click', () => {
        const ip = card.getAttribute('data-ip');
        copyText(ip, '服务器地址 ' + ip + ' 已复制 ✨');
      });
    });
    // Hero 主IP复制
    const mainIp = document.getElementById('mcMainIp');
    if (mainIp) {
      mainIp.addEventListener('click', () => {
        copyText(mainIp.textContent.trim(), '主服务器地址已复制 ✨');
      });
      mainIp.style.cursor = 'pointer';
    }
  }

  function copyText(text, msg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast(msg), () => fallback(text, msg));
    } else {
      fallback(text, msg);
    }
  }
  function fallback(text, msg) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast(msg); } catch (e) { toast('复制失败，请手动复制'); }
    document.body.removeChild(ta);
  }
  function toast(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
    } else {
      let t = document.getElementById('mcToast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'mcToast';
        t.style.cssText = 'position:fixed;left:50%;top:80px;transform:translateX(-50%) translateY(-20px);background:rgba(40,40,60,.9);color:#fff;padding:12px 22px;border-radius:999px;font-size:14px;z-index:9999;opacity:0;transition:all .3s;backdrop-filter:blur(10px);box-shadow:0 8px 24px rgba(0,0,0,.2);pointer-events:none;';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
      clearTimeout(t._tm);
      t._tm = setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(-50%) translateY(-20px)';
      }, 2200);
    }
  }

  // ===== FAQ 折叠 =====
  function initFaq() {
    document.querySelectorAll('.mc-faq-item .mc-faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.mc-faq-item.open').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  // ===== 返回顶部 =====
  function initBackTop() {
    const btn = document.getElementById('mcBackTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) btn.classList.add('show');
      else btn.classList.remove('show');
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ===== 入场动画 =====
  function initReveal() {
    const items = document.querySelectorAll('.mc-status-card, .mc-node-card, .mc-feature-card, .mc-player-card, .mc-step-card, .mc-rule-card, .mc-contact-card');
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = '';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    items.forEach(el => io.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStats();
    initNodes();
    initFaq();
    initBackTop();
    initReveal();
    // 默认打开第一个 FAQ
    const first = document.querySelector('.mc-faq-item');
    if (first) first.classList.add('open');
  });
})();
