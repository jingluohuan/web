# 牢仔科技 · 个人技术博客

一个简洁现代、功能完整的个人技术博客网站，零框架依赖、纯静态部署。

## ✨ 功能特性

- 🎨 **简洁现代 UI**：蓝紫色调设计，支持暗色模式切换
- 🖼️ **随机背景图**：每次刷新首页自动更换随机图（dmoe.cc API）
- 📝 **Markdown 文章**：使用 marked.js 解析，highlight.js 代码高亮
- 🔍 **站内搜索**：实时搜索标题、摘要、标签，关键词高亮
- 🏷️ **分类与标签**：支持按分类、标签筛选文章
- 🌙 **暗色模式**：自动跟随系统，支持手动切换
- 📱 **响应式设计**：完美适配桌面/平板/手机
- 🔌 **CMS 预留接口**：可接入 Ghost / Strapi 等 Headless CMS

### 部署

直接将整个项目目录上传到任意静态托管平台：
- GitHub Pages
- Vercel / Netlify
- 腾讯云 / 阿里云 对象存储
- Nginx 静态目录
- Cloudflare Pages
## 📝 写文章

1. 将 Markdown 文件放入 `assets/posts/` 目录
2. 在 `assets/data/posts.json` 中添加文章元数据：

```json
{
  "id": "文章唯一ID",
  "title": "文章标题",
  "excerpt": "文章摘要",
  "date": "2026-09-01",
  "category": "frontend | backend | devops | life",
  "tags": ["标签1", "标签2"],
  "file": "对应的-markdown-文件名.md",
  "readingTime": 8
}
```

## ⚙️ 配置说明

编辑 `assets/js/main.js` 开头的 `CONFIG` 对象：

| 配置项 | 说明 |
|--------|------|
| `bgApi` | 背景图 API 地址 |
| `cmsSource` | CMS 源（local/ghost/strapi/custom） |
| `cmsApiUrl` | CMS API 地址 |
| `comments.type` | 评论类型（local/giscus） |
| `comments.giscus` | Giscus 配置（前往 https://giscus.app 获取） |
| `blogName` | 博客名称 |
| `siteUrl` | 博客地址（RSS 用） |

## 📂 目录结构

```
personal-blog/
├── index.html          # 首页
├── blog.html           # 博客列表页
├── article.html        # 文章详情页
├── about.html          # 关于页
├── contact.html        # 联系页
└── assets/
    ├── css/style.css   # 样式
    ├── js/main.js      # 主脚本
    ├── data/posts.json # 文章列表数据
    └── posts/          # Markdown 文章
        ├── hello-world.md
        └── ...
```

## 🛠️ 技术栈

- HTML5 / CSS3 / Vanilla JavaScript
- [marked.js](https://marked.js.org/) - Markdown 解析
- [highlight.js](https://highlightjs.org/) - 代码高亮
- [dmoe.cc](https://www.dmoe.cc) - 随机背景图 API

## 📄 License

MIT
