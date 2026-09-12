
// ========== 配置 ==========
const CONFIG = {
  // 背景图 API（dmoe.cc）
  bgApi: 'https://www.dmoe.cc/random.php',
  // 文章数据
  postsUrl: 'assets/data/posts.json',
  postsDir: 'assets/posts/',
  // 打字机副标题文案（循环打字/删除）
  typewriterPhrases: [
    '牢仔科技官方的网站~',
    '分享前端 Python Minceraft 技术',
    '一只初三猫猫的成长笔记喵~',
    '你也可以加入牢仔科技的喵~',
    '用代码创造有趣的东西喵~',
  ],
  typeSpeed: 120,
  deleteSpeed: 60,
  pauseEnd: 1800,
  pauseStart: 500,
  // CMS 配置：修改此处切换 CMS 源
  cmsSource: 'local', // 'local' | 'ghost' | 'strapi' | 'custom'
  cmsApiUrl: '',      // 填入你的 CMS API 地址，例如 https://cms.example.com/ghost/api/v3/content
  cmsApiKey: '',
  // 评论配置
  comments: {
    type: 'local',  // 'local'（前端演示）| 'giscus'（GitHub Discussions）
    // Giscus 配置（前往 https://giscus.app 获取）
    giscus: {
      repo: '',           // 'username/repo'
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      theme: 'preferred_color_scheme'
    }
  },
  blogName: 'ITlaozai',
  blogDesc: '一只初三猫猫的博客技术小站',
  siteUrl: window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/'),
  useCache: true,
  cacheTtl: 5 * 60 * 1000
};

// ========== 状态 ==========
let allPosts = [];
let homeCurrentPosts = [];
let postsCache = {};

// ========== 工具 ==========
function $(sel, el = document) { return el.querySelector(sel); }
function $$(sel, el = document) { return [...el.querySelectorAll(sel)]; }

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function highlight(text, keyword) {
  if (!keyword) return escapeHtml(text);
  const re = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return escapeHtml(text).replace(re, '<mark>$1</mark>');
}

function estimateReadingTime(text) {
  const words = (text || '').replace(/[#*`>\-!\[\]()]/g, '').length;
  return Math.max(1, Math.ceil(words / 400));
}

// ========== 主题切换 ==========
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);

  $$('#themeToggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  $$('.theme-icon').forEach(i => i.textContent = theme === 'dark' ? '☀️' : '🌙');
  const hlLight = $('#hljs-light'), hlDark = $('#hljs-dark');
  if (hlLight && hlDark) {
    hlLight.disabled = theme === 'dark';
    hlDark.disabled = theme === 'light';
  }
}

// ========== 导航栏 ==========
function initNav() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const menu = $('#navMenu');

  if (navbar && !navbar.classList.contains('navbar-solid')) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => menu.classList.toggle('open'));
  }

  // RSS 按钮
  $$('#rssBtn').forEach(b => b.addEventListener('click', generateRSS));
}

// ========== 背景图 ==========
async function setRandomBg() {
  const heroBg = $('#heroBg');
  if (!heroBg) return;
  heroBg.style.opacity = '0';

  // 加时间戳防缓存，确保每次刷新都是不同图片
  const url = `${CONFIG.bgApi}?t=${Date.now()}`;
  const tempImg = new Image();
  tempImg.onload = () => {
    heroBg.style.backgroundImage = `url("${url}")`;
    heroBg.style.opacity = '1';
  };
  tempImg.onerror = () => {
    // 加载失败时使用渐变兜底
    heroBg.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)';
    heroBg.style.opacity = '1';
  };
  tempImg.src = url;
}

// ========== 打字机效果 ==========
let _typeTimer = null;
function startTypewriter() {
  const target = $('#heroSubtitle .typed-text');
  if (!target) return;
  const phrases = CONFIG.typewriterPhrases || [];
  if (!phrases.length) return;

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      target.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        _typeTimer = setTimeout(tick, CONFIG.pauseEnd);
        return;
      }
      _typeTimer = setTimeout(tick, CONFIG.typeSpeed);
    } else {
      charIdx--;
      target.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        _typeTimer = setTimeout(tick, CONFIG.pauseStart);
        return;
      }
      _typeTimer = setTimeout(tick, CONFIG.deleteSpeed);
    }
  }
  if (_typeTimer) clearTimeout(_typeTimer);
  tick();
}

// ========== 加载文章数据 ==========
async function loadPosts() {
  if (postsCache._posts && Date.now() - postsCache._postsTime < CONFIG.cacheTtl) {
    return postsCache._posts;
  }
  try {
    const res = await fetch(CONFIG.postsUrl + '?v=' + Date.now());
    if (!res.ok) throw new Error('加载文章列表失败');
    const posts = await res.json();
    posts.sort((a,b) => new Date(b.date) - new Date(a.date));
    postsCache._posts = posts;
    postsCache._postsTime = Date.now();
    return posts;
  } catch(e) {
    console.error(e);
    return [];
  }
}

// ========== 首页 ==========
async function initHome() {
  initTheme(); initNav(); setRandomBg(); startTypewriter();

  $('#bgSwitch').addEventListener('click', setRandomBg);

  allPosts = await loadPosts();
  homeCurrentPosts = shufflePick(allPosts, 6);
  renderLatestPosts(homeCurrentPosts);

  const shuffleBtn = $('#shufflePostsBtn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      // 动画：先淡出
      const grid = $('#latestPosts');
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(10px)';
      setTimeout(() => {
        homeCurrentPosts = shufflePick(allPosts, 6, homeCurrentPosts.map(p => p.id));
        renderLatestPosts(homeCurrentPosts);
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
        showToast('已为你换一批文章 ✨');
      }, 300);
    });
  }
}

// 随机挑选 n 篇文章，可排除已有ID（尽量不重复）
function shufflePick(arr, n, excludeIds = []) {
  const pool = arr.filter(p => !excludeIds.includes(p.id));
  const source = pool.length >= n ? pool : arr;
  const copy = [...source];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function renderLatestPosts(posts) {
  const container = $('#latestPosts');
  if (!container) return;
  container.innerHTML = posts.map(p => postCardHTML(p, true)).join('');
  $$('.post-card', container).forEach((el, i) => {
    el.addEventListener('click', () => {
      location.href = `article.html?id=${encodeURIComponent(posts[i].id)}`;
    });
  });
}

function postCardHTML(p, grid = false) {
  const catName = {frontend:'前端',backend:'后端',devops:'DevOps',tools:'工具',game:'游戏',network:'网络',tutorial:'教程',security:'安全',design:'设计',tech:'科技',life:'随笔',other:'其他'}[p.category] || p.category || '其他';
  const cover = p.cover
    ? `background-image:url('${p.cover}');background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,#6366f1,#8b5cf6)`;
  return `
    <article class="post-card">
      <div class="post-card-image" style="${cover}"></div>
      <div class="post-card-body">
        <span class="post-cat-tag">${escapeHtml(catName)}</span>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.excerpt || '')}</p>
        <div class="post-meta">
          <span>📅 ${formatDate(p.date)}</span>
          <span>⏱ ${p.readingTime || 5}分钟</span>
        </div>
      </div>
    </article>
  `;
}

// ========== 博客列表页 ==========
async function initBlog() {
  initTheme(); initNav();
  allPosts = await loadPosts();

  // URL 参数
  const params = new URLSearchParams(location.search);
  let currentCat = params.get('cat');
  let currentTag = params.get('tag');
  let currentKeyword = '';

  renderPosts();
  renderSidebar();

  // 搜索
  const searchInput = $('#searchInput');
  const sidebarSearch = $('#sidebarSearch');
  const doSearch = debounce(() => {
    currentKeyword = (searchInput.value || sidebarSearch.value || '').trim();
    sidebarSearch.value = currentKeyword;
    searchInput.value = currentKeyword;
    renderPosts();
  }, 300);
  searchInput.addEventListener('input', doSearch);
  sidebarSearch.addEventListener('input', doSearch);

  function renderPosts() {
    let posts = [...allPosts];
    const filterBox = $('#activeFilter');
    let filterText = '';

    if (currentCat) {
      posts = posts.filter(p => p.category === currentCat);
      const catName = {frontend:'前端',backend:'后端',devops:'DevOps',tools:'工具',game:'游戏',network:'网络',tutorial:'教程',security:'安全',design:'设计',tech:'科技',life:'随笔',other:'其他'}[currentCat] || currentCat;
      filterText = `📂 分类：${catName} <span class="clear" data-action="clear-cat">✕</span>`;
    }
    if (currentTag) {
      posts = posts.filter(p => (p.tags || []).includes(currentTag));
      filterText = `🏷️ 标签：${currentTag} <span class="clear" data-action="clear-tag">✕</span>`;
    }
    if (currentKeyword) {
      const kw = currentKeyword.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(kw) ||
        (p.excerpt || '').toLowerCase().includes(kw) ||
        (p.tags || []).some(t => t.toLowerCase().includes(kw))
      );
    }

    filterBox.innerHTML = filterText;
    filterBox.style.display = filterText ? 'inline-flex' : 'none';
    filterBox.querySelectorAll('.clear').forEach(c => {
      c.addEventListener('click', () => {
        if (c.dataset.action === 'clear-cat') currentCat = null;
        if (c.dataset.action === 'clear-tag') currentTag = null;
        const url = new URL(location); url.searchParams.delete('cat'); url.searchParams.delete('tag');
        history.replaceState({}, '', url);
        renderPosts(); renderSidebar();
      });
    });

    const info = $('#searchInfo');
    if (currentKeyword) {
      info.innerHTML = `找到 <strong>${posts.length}</strong> 篇关于 "<strong>${escapeHtml(currentKeyword)}</strong>" 的文章`;
    } else {
      info.innerHTML = `共 <strong>${posts.length}</strong> 篇文章`;
    }

    const list = $('#postsList');
    const noRes = $('#noResults');
    if (posts.length === 0) {
      list.innerHTML = '';
      noRes.style.display = 'block';
      return;
    }
    noRes.style.display = 'none';

    list.innerHTML = posts.map(p => {
      const catName = {frontend:'前端',backend:'后端',devops:'DevOps',tools:'工具',game:'游戏',network:'网络',tutorial:'教程',security:'安全',design:'设计',tech:'科技',life:'随笔',other:'其他'}[p.category] || p.category || '其他';
      const cover = p.cover
        ? `background-image:url('${p.cover}');background-size:cover;background-position:center`
        : `background:linear-gradient(135deg,#6366f1,#8b5cf6)`;
      return `
        <article class="post-card" data-id="${p.id}">
          <div class="post-card-image" style="${cover}"></div>
          <div class="post-card-body">
            <span class="post-cat-tag">${escapeHtml(catName)}</span>
            <h3>${highlight(p.title, currentKeyword)}</h3>
            <p>${highlight(p.excerpt || '', currentKeyword)}</p>
            <div class="post-meta">
              <span>📅 ${formatDate(p.date)} · ⏱ ${p.readingTime||5}分钟</span>
              <div class="post-tags">
                ${(p.tags||[]).map(t => `<span>${highlight(t,currentKeyword)}</span>`).join('')}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    $$('.post-card', list).forEach(el => {
      el.addEventListener('click', () => location.href = `article.html?id=${encodeURIComponent(el.dataset.id)}`);
    });
  }

  function renderSidebar() {
    const catLabels = {frontend:'前端',backend:'后端',devops:'DevOps',tools:'工具',game:'游戏',network:'网络',tutorial:'教程',security:'安全',design:'设计',tech:'科技',life:'随笔',other:'其他'};
    // 分类
    const catMap = {};
    allPosts.forEach(p => { catMap[p.category] = (catMap[p.category]||0)+1; });
    $('#catList').innerHTML = `<li data-cat="" style="color:var(--primary);font-weight:600">全部分类 <span class="count">${allPosts.length}</span></li>` +
      Object.entries(catMap).map(([c,n]) => `<li data-cat="${c}">${escapeHtml(catLabels[c]||c)} <span class="count">${n}</span></li>`).join('');
    $$('#catList li').forEach(li => {
      li.addEventListener('click', () => {
        currentCat = li.dataset.cat || null;
        currentTag = null;
        const url = new URL(location);
        if (currentCat) url.searchParams.set('cat', currentCat); else url.searchParams.delete('cat');
        url.searchParams.delete('tag');
        history.replaceState({}, '', url);
        renderPosts();
      });
    });

    // 标签
    const tagMap = {};
    allPosts.forEach(p => (p.tags||[]).forEach(t => tagMap[t] = (tagMap[t]||0)+1));
    $('#tagCloud').innerHTML = Object.entries(tagMap).map(([t,n]) => `<span data-tag="${escapeHtml(t)}">${escapeHtml(t)} <small>(${n})</small></span>`).join('');
    $$('#tagCloud span').forEach(el => {
      el.addEventListener('click', () => {
        currentTag = el.dataset.tag;
        currentCat = null;
        const url = new URL(location); url.searchParams.set('tag', currentTag); url.searchParams.delete('cat');
        history.replaceState({}, '', url);
        renderPosts(); renderSidebar();
      });
    });

    // 最新文章
    $('#recentList').innerHTML = allPosts.slice(0,5).map(p => `
      <li><a href="article.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.title)}</a><span class="date">${formatDate(p.date)}</span></li>
    `).join('');
  }
}

function debounce(fn, wait) {
  let t; return function(...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
}

// ========== 文章详情页 ==========
async function initArticle() {
  initTheme(); initNav();

  const params = new URLSearchParams(location.search);
  const postId = params.get('id');
  if (!postId) {
    showArticleError('未指定文章 ID'); return;
  }

  allPosts = await loadPosts();
  const post = allPosts.find(p => p.id === postId);
  if (!post) { showArticleError(`未找到文章：${escapeHtml(postId)}`); return; }

  document.title = `${post.title} - ${CONFIG.blogName}`;

  try {
    const md = await fetchMarkdown(post.file || (post.id + '.md'));
    renderArticle(post, md);
    loadComments(post);
  } catch(e) {
    console.error(e);
    showArticleError('文章内容加载失败，请检查文件路径');
  }
}

async function fetchMarkdown(filename) {
  const url = CONFIG.postsDir + filename + '?v=' + Date.now();
  const res = await fetch(url);
  if (!res.ok) throw new Error('Markdown 文件未找到');
  return await res.text();
}

function showArticleError(msg) {
  $('#loadingSpinner').style.display = 'none';
  $('#articleContent').style.display = 'block';
  $('#articleContent').innerHTML = `
    <div style="text-align:center;padding:80px 20px">
      <div style="font-size:60px">😵</div>
      <h2 style="margin:16px 0">${msg}</h2>
      <a href="blog.html" class="btn btn-primary" style="display:inline-block;margin-top:16px">返回博客列表</a>
    </div>
  `;
}

function renderArticle(post, md) {
  // 配置 marked
  marked.setOptions({
    highlight: function(code, lang) {
      if (window.hljs && lang && hljs.getLanguage(lang)) {
        try { return hljs.highlight(code, {language:lang}).value; } catch(e) {}
      }
      if (window.hljs) { try { return hljs.highlightAuto(code).value; } catch(e) {} }
      return escapeHtml(code);
    },
    breaks: true,
    gfm: true
  });

  const html = marked.parse(md);
  const readingTime = estimateReadingTime(md);

  $('#loadingSpinner').style.display = 'none';
  $('#articleContent').style.display = 'block';
  const catName = {frontend:'前端',backend:'后端',devops:'DevOps',tools:'工具',game:'游戏',network:'网络',tutorial:'教程',security:'安全',design:'设计',tech:'科技',life:'随笔',other:'其他'}[post.category] || post.category || '其他';
  const cover = post.cover
    ? `<div class="article-cover" style="background-image:url('${post.cover}');background-size:cover;background-position:center;margin-bottom:24px;border-radius:var(--radius);height:280px"></div>`
    : '';
  $('#articleContent').innerHTML = `
    <a href="blog.html" class="article-back">← 返回文章列表</a>
    ${cover}
    <header class="article-header">
      <div class="article-meta">
        <span class="cat-tag">${escapeHtml(catName)}</span>
        <span>📅 ${formatDate(post.date)}</span>
        <span class="reading-time">⏱ ${readingTime} 分钟阅读</span>
      </div>
      <h1>${escapeHtml(post.title)}</h1>
      <p style="color:var(--text-light);font-size:1.05rem">${escapeHtml(post.excerpt||'')}</p>
    </header>
    <div class="article-body">${html}</div>
    <div class="article-tags">
      <strong>🏷️ 标签：</strong>
      ${(post.tags||[]).map(t => `<span style="padding:4px 12px;background:var(--bg-alt);border-radius:50px;font-size:.85rem;cursor:pointer" onclick="location.href='blog.html?tag=${encodeURIComponent(t)}'">${escapeHtml(t)}</span>`).join('')}
    </div>
  `;

  // 代码高亮
  if (window.hljs) {
    $$('#articleContent pre code').forEach(b => hljs.highlightElement(b));
  }

  // 应用主题下的代码样式
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const hlLight = $('#hljs-light'), hlDark = $('#hljs-dark');
  if (hlLight && hlDark) {
    hlLight.disabled = currentTheme === 'dark';
    hlDark.disabled = currentTheme === 'light';
  }

  $('#commentSection').style.display = 'block';
}

// ========== 评论系统 ==========
function loadComments(post) {
  const cfg = CONFIG.comments;

  if (cfg.type === 'local' || !cfg.giscus.repo) {
    initLocalComments(post.id);
    return;
  }

  if (cfg.type === 'giscus' && cfg.giscus.repo) {
    $('#commentList').innerHTML = '';
    initGiscus();
  }
}

function initLocalComments(postId) {
  const key = `comments_${postId}`;
  const container = $('#commentList');
  const form = {
    name: $('#commentName'),
    email: $('#commentEmail'),
    text: $('#commentText'),
    btn: $('#submitComment')
  };

  renderLocal();

  form.btn.addEventListener('click', () => {
    const name = form.name.value.trim();
    const text = form.text.value.trim();
    if (!name || !text) {
      alert('请填写昵称和评论内容');
      return;
    }
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    comments.unshift({
      id: Date.now(),
      name, email: form.email.value.trim(),
      text, date: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(comments));
    form.name.value = ''; form.email.value = ''; form.text.value = '';
    renderLocal();
  });

  function renderLocal() {
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    if (comments.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">还没有评论，来抢沙发吧~ 💬</p>';
      return;
    }
    container.innerHTML = comments.map(c => `
      <div class="comment-item">
        <div class="comment-header">
          <span class="comment-author">👤 ${escapeHtml(c.name)}</span>
          <span class="comment-date">${formatDate(c.date)}</span>
        </div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
      </div>
    `).join('');
  }
}

function initGiscus() {
  const g = CONFIG.comments.giscus;
  const container = $('#giscusContainer');
  container.style.display = 'block';
  container.innerHTML = '';
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true; script.crossOrigin = 'anonymous';
  script.dataset.repo = g.repo;
  script.dataset.repoId = g.repoId;
  script.dataset.category = g.category;
  script.dataset.categoryId = g.categoryId;
  script.dataset.mapping = g.mapping;
  script.dataset.theme = g.theme;
  script.dataset.reactionsEnabled = '1';
  script.dataset.emitMetadata = '0';
  container.appendChild(script);
}

// ========== RSS 生成 ==========
function generateRSS() {
  if (allPosts.length === 0) {
    alert('文章加载中，请稍后再试');
    return;
  }
  const items = allPosts.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${CONFIG.siteUrl}article.html?id=${p.id}</link>
      <description><![CDATA[${p.excerpt || ''}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid isPermaLink="false">${p.id}</guid>
      <category>${p.category || ''}</category>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${CONFIG.blogName}</title>
  <link>${CONFIG.siteUrl}</link>
  <description>${CONFIG.blogDesc}</description>
  <language>zh-CN</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${CONFIG.siteUrl}rss.xml" rel="self" type="application/rss+xml"/>
  ${items}
</channel>
</rss>`;

  const blob = new Blob([rss], {type:'application/rss+xml'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'rss.xml';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ========== 技能条动画 ==========
function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width || '0%';
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.3});
  fills.forEach(f => obs.observe(f));
}

// ========== 页面入口路由 ==========
document.addEventListener('DOMContentLoaded', () => {
  initSkillBars();
});
