/* ===== Download Page Logic ===== */

// 资源数据 - 精选开发工具、源码模板、学习资料等
const DOWNLOADS = [
  // ========== 开发工具 ==========
  {
    id: 1, name: "VS Code 便携版", version: "1.93",
    desc: "微软开源的轻量级代码编辑器，集成Git、调试、智能补全，开发者必备神器",
    category: "tool", icon: "tool", size: "125 MB", downloads: 48320, date: "2026-09-01",
    tags: ["编辑器", "开源", "跨平台"], badge: "hot", platform: "Win/Mac/Linux",
    url: "https://code.visualstudio.com/"
  },
  {
    id: 2, name: "Node.js LTS", version: "20.17.0",
    desc: "基于 Chrome V8 的 JavaScript 运行时，服务端开发必装环境",
    category: "tool", icon: "tool", size: "32 MB", downloads: 35680, date: "2026-08-25",
    tags: ["JavaScript", "运行时", "后端"], badge: "free", platform: "Win/Mac/Linux",
    url: "https://nodejs.org/"
  },
  {
    id: 3, name: "Git for Windows", version: "2.46",
    desc: "分布式版本控制系统，开发者代码管理必备工具",
    category: "tool", icon: "tool", size: "58 MB", downloads: 28950, date: "2026-08-20",
    tags: ["版本控制", "Git"], platform: "Win",
    url: "https://git-scm.com/"
  },
  {
    id: 4, name: "Postman", version: "11.0",
    desc: "API 开发协作平台，接口调试、测试、文档一体化工具",
    category: "tool", icon: "tool", size: "186 MB", downloads: 22340, date: "2026-08-18",
    tags: ["API", "调试", "测试"], platform: "Win/Mac/Linux",
    url: "https://www.postman.com/"
  },
  {
    id: 5, name: "Docker Desktop", version: "4.34",
    desc: "容器化部署工具，一键打包应用，开发环境一致性解决方案",
    category: "tool", icon: "tool", size: "612 MB", downloads: 19870, date: "2026-08-15",
    tags: ["容器", "DevOps", "部署"], badge: "hot", platform: "Win/Mac/Linux",
    url: "https://www.docker.com/"
  },
  {
    id: 6, name: "Figma 桌面版", version: "124.3",
    desc: "团队协作 UI/UX 设计工具，前端切图、原型设计首选",
    category: "tool", icon: "tool", size: "145 MB", downloads: 15620, date: "2026-08-10",
    tags: ["设计", "UI", "原型"], platform: "Win/Mac",
    url: "https://www.figma.com/"
  },

  // ========== 源码 & 模板 ==========
  {
    id: 7, name: "Vue3 后台管理模板", version: "v2.0",
    desc: "基于 Vue3 + Element Plus 的后台管理系统模板，内置权限管理、动态路由、多主题",
    category: "template", icon: "template", size: "4.2 MB", downloads: 12480, date: "2026-09-02",
    tags: ["Vue3", "后台", "开源"], badge: "new", platform: "Web",
    url: "https://github.com/vuejs"
  },
  {
    id: 8, name: "React 博客系统源码", version: "v1.5",
    desc: "Next.js 14 + Tailwind CSS 个人博客完整源码，支持Markdown、评论、RSS",
    category: "template", icon: "template", size: "2.8 MB", downloads: 8960, date: "2026-08-28",
    tags: ["React", "Next.js", "博客"], badge: "hot", platform: "Web",
    url: "https://nextjs.org/"
  },
  {
    id: 9, name: "uni-app 小程序模板", version: "v1.2",
    desc: "跨端小程序开发模板，支持微信/支付宝/抖音小程序，包含电商、社交等模块",
    category: "template", icon: "template", size: "3.5 MB", downloads: 7230, date: "2026-08-22",
    tags: ["小程序", "uni-app", "移动端"], platform: "移动端",
    url: "https://uniapp.dcloud.net.cn/"
  },
  {
    id: 10, name: "HTML5 响应式官网模板", version: "v3.0",
    desc: "12套企业官网HTML模板合集，响应式设计，开箱即用",
    category: "template", icon: "template", size: "18 MB", downloads: 11240, date: "2026-08-16",
    tags: ["HTML", "官网", "响应式"], platform: "Web",
    url: "https://html5up.net/"
  },
  {
    id: 11, name: "ECharts 数据大屏模板", version: "v2.1",
    desc: "20套数据可视化大屏模板，ECharts 图表配置直接复用，酷炫效果",
    category: "template", icon: "template", size: "22 MB", downloads: 9870, date: "2026-08-12",
    tags: ["可视化", "ECharts", "大屏"], badge: "new", platform: "Web",
    url: "https://echarts.apache.org/"
  },

  // ========== 代码片段 & 工具函数 ==========
  {
    id: 12, name: "JavaScript 工具函数库", version: "v1.0",
    desc: "200+ 常用 JS 工具函数，防抖节流、深浅拷贝、日期处理、类型判断全覆盖",
    category: "code", icon: "code", size: "186 KB", downloads: 16750, date: "2026-09-01",
    tags: ["JavaScript", "工具函数"], badge: "free", platform: "JS",
    url: "https://github.com/lodash/lodash"
  },
  {
    id: 13, name: "CSS 动画效果库", version: "v2.0",
    desc: "100+ 纯 CSS 动画效果，悬停、加载、过渡、入场动画，复制即用",
    category: "code", icon: "code", size: "320 KB", downloads: 13420, date: "2026-08-26",
    tags: ["CSS", "动画"], platform: "CSS",
    url: "https://animate.style/"
  },
  {
    id: 14, name: "Python 爬虫模板集合", version: "v1.3",
    desc: "Requests/Scrapy/Selenium 三种爬虫框架模板，含代理池、验证码识别",
    category: "code", icon: "code", size: "1.5 MB", downloads: 10890, date: "2026-08-20",
    tags: ["Python", "爬虫"], badge: "hot", platform: "Python",
    url: "https://scrapy.org/"
  },
  {
    id: 15, name: "SQL 查询语句大全", version: "v1.0",
    desc: "常用 SQL 查询优化语句合集，索引优化、联表查询、窗口函数实战案例",
    category: "code", icon: "code", size: "95 KB", downloads: 8450, date: "2026-08-14",
    tags: ["SQL", "数据库"], platform: "SQL",
    url: "https://www.mysql.com/"
  },

  // ========== 电子书 & 学习资料 ==========
  {
    id: 16, name: "JavaScript高级程序设计（第4版）", version: "PDF",
    desc: "红宝书第四版，JS 进阶必读经典，涵盖 ES6+ 新特性",
    category: "book", icon: "book", size: "48 MB", downloads: 32100, date: "2026-08-30",
    tags: ["JavaScript", "电子书", "经典"], badge: "hot", platform: "PDF",
    url: "https://github.com/getify/You-Dont-Know-JS"
  },
  {
    id: 17, name: "CSS权威指南（第4版）", version: "PDF",
    desc: "CSS 学习圣经，从基础到高级布局（Flexbox/Grid）系统讲解",
    category: "book", icon: "book", size: "62 MB", downloads: 18900, date: "2026-08-25",
    tags: ["CSS", "电子书"], platform: "PDF",
    url: "https://developer.mozilla.org/zh-CN/docs/Web/CSS"
  },
  {
    id: 18, name: "深入理解计算机系统（第3版）", version: "PDF",
    desc: "CSAPP，计算机底层原理必读书籍，程序员内功修炼",
    category: "book", icon: "book", size: "128 MB", downloads: 15670, date: "2026-08-18",
    tags: ["计算机基础", "电子书"], platform: "PDF",
    url: "http://csapp.cs.cmu.edu/"
  },
  {
    id: 19, name: "算法导论（第3版）中文", version: "PDF",
    desc: "CLRS 算法经典教材，面试算法必刷，LeetCode 配套学习",
    category: "book", icon: "book", size: "96 MB", downloads: 21340, date: "2026-08-15",
    tags: ["算法", "电子书", "面试"], badge: "free", platform: "PDF",
    url: "https://leetcode.cn/"
  },
  {
    id: 20, name: "前端面试题精选合集", version: "2026版",
    desc: "2000+ 道大厂前端面试题解析，HTML/CSS/JS/Vue/React/网络全覆盖",
    category: "book", icon: "book", size: "12 MB", downloads: 26780, date: "2026-09-02",
    tags: ["面试", "前端", "2026"], badge: "new", platform: "PDF/MD",
    url: "https://github.com/haizlin/fe-interview"
  },

  // ========== 实用软件 ==========
  {
    id: 21, name: "Snipaste 截图工具", version: "2.8",
    desc: "Windows 最佳截图贴图工具，支持标注、取色、贴图置顶",
    category: "software", icon: "software", size: "15 MB", downloads: 24560, date: "2026-08-28",
    tags: ["截图", "效率"], badge: "free", platform: "Win/Mac",
    url: "https://www.snipaste.com/"
  },
  {
    id: 22, name: "Everything 文件搜索", version: "1.4",
    desc: "秒级文件搜索工具，速度远超系统自带搜索，Windows 用户必备",
    category: "software", icon: "software", size: "2 MB", downloads: 31200, date: "2026-08-22",
    tags: ["搜索", "效率"], platform: "Win",
    url: "https://www.voidtools.com/"
  },
  {
    id: 23, name: "Typora Markdown编辑器", version: "1.9",
    desc: "所见即所得 Markdown 编辑器，写文章、记笔记绝佳工具",
    category: "software", icon: "software", size: "98 MB", downloads: 28900, date: "2026-08-16",
    tags: ["Markdown", "笔记"], badge: "hot", platform: "Win/Mac/Linux",
    url: "https://typora.io/"
  },
  {
    id: 24, name: "uTools 效率工具", version: "3.2",
    desc: "国产效率神器，插件化工具集，翻译、JSON格式化、二维码等百种功能",
    category: "software", icon: "software", size: "75 MB", downloads: 19340, date: "2026-08-10",
    tags: ["效率", "插件"], platform: "Win/Mac/Linux",
    url: "https://u.tools/"
  },

  // ========== 字体 & 图标 ==========
  {
    id: 25, name: "JetBrains Mono 编程字体", version: "2.304",
    desc: "专为编程设计的免费字体，支持连字特性，代码阅读更舒适",
    category: "font", icon: "font", size: "4 MB", downloads: 14560, date: "2026-08-24",
    tags: ["字体", "编程"], platform: "跨平台",
    url: "https://www.jetbrains.com/lp/mono/"
  },
  {
    id: 26, name: "思源黑体（Source Han Sans）", version: "2.004",
    desc: "Adobe 与 Google 联合开发的开源中文字体，7字重全覆盖",
    category: "font", icon: "font", size: "86 MB", downloads: 11230, date: "2026-08-12",
    tags: ["字体", "中文", "开源"], platform: "跨平台",
    url: "https://github.com/adobe-fonts/source-han-sans"
  },
  {
    id: 27, name: "Font Awesome 图标库", version: "6.6",
    desc: "3000+ 矢量图标库，Web 开发最常用图标集，免费商用",
    category: "font", icon: "font", size: "15 MB", downloads: 17890, date: "2026-08-20",
    tags: ["图标", "Web"], platform: "Web",
    url: "https://fontawesome.com/"
  },

  // ========== 图片 & 素材 ==========
  {
    id: 28, name: "Unsplash 高清图片集", version: "精选包",
    desc: "500 张无版权高清图片合集，商务、自然、科技主题，PPT/设计可用",
    category: "media", icon: "media", size: "1.2 GB", downloads: 9870, date: "2026-08-26",
    tags: ["图片", "素材", "无版权"], platform: "JPG",
    url: "https://unsplash.com/"
  },
  {
    id: 29, name: "Lottie 动画素材包", version: "v2.0",
    desc: "200+ 免费 Lottie 动效文件，页面加载动画、空状态图直接使用",
    category: "media", icon: "media", size: "36 MB", downloads: 6340, date: "2026-08-14",
    tags: ["动画", "Lottie"], platform: "JSON",
    url: "https://lottiefiles.com/"
  },
  {
    id: 30, name: "IconPark 图标库", version: "2.4",
    desc: "字节跳动开源图标库，2400+ 高质量图标，支持主题自定义",
    category: "media", icon: "media", size: "8 MB", downloads: 8920, date: "2026-08-08",
    tags: ["图标", "开源"], platform: "SVG/React/Vue",
    url: "https://iconpark.oceanengine.com/"
  }
];

// 分类映射
const CATEGORIES = [
  { key: "all", name: "全部", icon: "📁" },
  { key: "tool", name: "开发工具", icon: "🛠️" },
  { key: "template", name: "源码模板", icon: "📋" },
  { key: "code", name: "代码片段", icon: "💻" },
  { key: "book", name: "电子书", icon: "📚" },
  { key: "software", name: "实用软件", icon: "⚡" },
  { key: "font", name: "字体图标", icon: "🔤" },
  { key: "media", name: "图片素材", icon: "🎨" }
];

let currentCategory = "all";
let currentSort = "newest";

// ===== 初始化 =====
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderDownloads();
  updateStats();
  bindEvents();
});

// ===== 渲染分类标签 =====
function renderCategories() {
  const tabs = document.getElementById("categoryTabs");
  const catCounts = {};
  DOWNLOADS.forEach(d => { catCounts[d.category] = (catCounts[d.category] || 0) + 1; });
  tabs.innerHTML = CATEGORIES.map(c => {
    const count = c.key === "all" ? DOWNLOADS.length : (catCounts[c.key] || 0);
    return `<button class="cat-tab ${c.key === currentCategory ? 'active' : ''}" data-cat="${c.key}">
      ${c.icon} ${c.name} <span style="opacity:.7;font-size:.8em">(${count})</span>
    </button>`;
  }).join("");
}

// ===== 渲染资源卡片（整块卡片可点击跳转） =====
function renderDownloads() {
  const grid = document.getElementById("downloadGrid");
  const empty = document.getElementById("emptyState");

  let list = [...DOWNLOADS];

  if (currentCategory !== "all") {
    list = list.filter(d => d.category === currentCategory);
  }

  switch (currentSort) {
    case "hot": list.sort((a, b) => b.downloads - a.downloads); break;
    case "name": list.sort((a, b) => a.name.localeCompare(b.name, "zh")); break;
    case "size": list.sort((a, b) => parseSize(b.size) - parseSize(a.size)); break;
    case "newest":
    default: list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (list.length === 0) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  grid.innerHTML = list.map(d => {
    const badge = d.badge ? `<span class="dl-badge ${d.badge}">${badgeText(d.badge)}</span>` : "";
    return `
    <a class="dl-card" href="${d.url}" target="_blank" rel="noopener noreferrer" data-id="${d.id}" title="点击前往下载 ${d.name}">
      ${badge}
      <div class="dl-card-header">
        <div class="dl-icon icon-${d.icon}">${iconForCat(d.icon)}</div>
        <div class="dl-info">
          <div class="dl-name">${d.name}<span class="dl-version">${d.version}</span></div>
        </div>
      </div>
      <div class="dl-desc">${d.desc}</div>
      <div class="dl-tags">
        ${d.tags.map(t => `<span class="dl-tag">${t}</span>`).join("")}
      </div>
      <div class="dl-meta">
        <span>💾 ${d.size}</span>
        <span>⬇️ ${formatNum(d.downloads)}</span>
        <span>📅 ${d.date}</span>
        <span>🖥️ ${d.platform}</span>
      </div>
      <div class="dl-footer">
        <span class="dl-go-btn">⬇️ 立即下载 <span class="dl-arrow">→</span></span>
      </div>
    </a>`;
  }).join("");
}

// ===== 更新统计 =====
function updateStats() {
  animateNum("totalCount", DOWNLOADS.length);
  animateNum("totalDownloads", DOWNLOADS.reduce((s, d) => s + d.downloads, 0));
  animateNum("totalCategories", CATEGORIES.length - 1);
}

function animateNum(id, target) {
  const el = document.getElementById(id);
  let start = 0;
  const duration = 1200;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNum(Math.floor(start + (target - start) * eased));
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = formatNum(target);
  }
  requestAnimationFrame(tick);
}

// ===== 事件绑定 =====
function bindEvents() {
  // 分类切换
  document.getElementById("categoryTabs").addEventListener("click", e => {
    const btn = e.target.closest(".cat-tab");
    if (!btn) return;
    document.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    renderDownloads();
  });

  // 排序
  document.getElementById("sortSelect").addEventListener("change", e => {
    currentSort = e.target.value;
    renderDownloads();
  });

  // 卡片点击 - 统计下载量
  document.getElementById("downloadGrid").addEventListener("click", e => {
    const card = e.target.closest(".dl-card");
    if (!card) return;
    const id = parseInt(card.dataset.id);
    const item = DOWNLOADS.find(d => d.id === id);
    if (item) {
      item.downloads += 1;
      showToast(`正在跳转到「${item.name}」下载页面...`, "success");
    }
  });
}

// ===== Toast =====
function showToast(msg, type = "") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast show " + type;
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// ===== 工具函数 =====
function iconForCat(icon) {
  const map = {
    code: "💻", tool: "🛠️", book: "📚", template: "📋",
    software: "⚡", font: "🔤", media: "🎨", other: "📦"
  };
  return map[icon] || "📦";
}

function badgeText(badge) {
  return { hot: "🔥 HOT", new: "✨ NEW", free: "🆓 免费" }[badge] || "";
}

function formatNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "w";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function parseSize(s) {
  const match = s.match(/([\d.]+)\s*(MB|KB|GB)/i);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === "GB") return num * 1024;
  if (unit === "MB") return num;
  return num / 1024;
}
