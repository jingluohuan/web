
作者：[杵凌](https://github.com/chulingera2025) [邮箱](mailto:chulingera2025@gmail.com)

## 前言

关于 AI 环境搭建的教程层出不穷，但大多过于分散或时效性问题，也并不符合我自己习惯的一套。

一是为了便于自己日后遇到重装或是新设备安装时快速复现，二是同时也给有同样需求的朋友提供参考

>本指南仅针对个人场景，包含自用必装Skills以及相关推荐，基本可以覆盖到常见情况。
>仅提供Linux端命令（Mac OS适用），Windows用户请自行查阅实际命令

除多模态，本分享以[DeepSeek](https://www.deepseek.com/)的V4-Flash(0731)版本实践，目前可以完成本人指导完成至少80%以上的工作，剩下的由更大的模型，如[GPT-5.6 Sol](https://openai.com/)、[Claude Opus 5](https://www.anthropic.com/claude)等大参数模型审计后分配任务给V4-Flash实施。

>自荐一下-基于[Cloudflare Pingora](https://github.com/cloudflare/pingora)的反向代理网关项目[Raddy](https://github.com/chulingera2025/raddy) 欢迎Star和PR

如果你的执行模型非V4-Flash也不用担心。在使用OpenAi的Sol模型以及Claude的Opus5及以上版本，本指南的配置以及提示词也不会影响过多模型本身的能力，反而可以提升效率和准确率，可放心使用。

>本文章相关参考文献（文档）均会在底部进行标注与附录

## 开始

### 环境安装

本章节如果你已经安装过了，自行跳过，也可以按照流程再检查一遍
其他例如[opencode](https://github.com/anomalyco/opencode)、[pi](https://github.com/earendil-works/pi)、[omp](https://github.com/can1357/oh-my-pi)等在下一个章节Skills安装等均适用，根据各自实际情况安装，本文只展示[Claude Code](https://code.claude.com/docs/en/overview)以及[Codex CLI](https://learn.chatgpt.com/docs/codex/cli)

我们使用[CC-Switch](https://github.com/farion1231/cc-switch)进行第三方模型API的管理和切换

#### Claude Code

Claude Code的harness在业界属于是一套事实标准以及最佳实践，也是推荐主要执行模型使用的CLI，官方文档详见[Claude Code Doc](https://code.claude.com/docs/en/overview)

安装执行即可

```zsh
curl -fsSL https://claude.ai/install.sh | bash
```

安装完成后检查是否可用

```zsh
claude --version
```

![](https://blogcdn.cyrilhub.com/blogimg/20260811210719325.avif)


#### Codex CLI

Codex CLI 对于openai自家的模型支持度较高，使用gpt相关模型推荐直接在codex中调用，官方文档详见[chatgpt codex doc](https://learn.chatgpt.com/docs/codex/cli)

安装执行即可

```zsh
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

安装完成后检查是否可用

```zsh
codex -Version
```

![](https://blogcdn.cyrilhub.com/blogimg/20260811211146337.avif)

#### CC-Switch

[项目仓库地址](https://github.com/farion1231/cc-switch)

可通过已发布的[Release](https://github.com/farion1231/cc-switch/releases)版本进行对应系统的安装

![](https://blogcdn.cyrilhub.com/blogimg/20260811212025889.avif)

这里给出ArchLinux的安装方式（[AUR](https://aur.archlinux.org/)包 [cc-switch-bin](https://aur.archlinux.org/packages/cc-switch-bin)）

```zsh
yay -Sy cc-switch-bin
```

安装完成后，请自行配置好。

### Skills

关于基础的推荐，不做过多展示（实际情况不是越多越好），这里针对我个人全环境必装的三个做介绍。

>我个人称呼为Coding三板斧

在你的环境全部安装好之后，确保[node](https://nodejs.org/)已经安装

```zsh
node -v
```
输出版本号即可，若没有安装，自行找相关文档教程

#### Context7

[Context7官方链接](https://context7.com/)（[GitHub](https://github.com/upstash/context7)）

访问上方链接，注册登录，完成后执行以下命令安装

```zsh
npx ctx7@latest setup
```

在弹出的中选择CLI + Skills

```
How should your agent access Context7?
```

![](https://blogcdn.cyrilhub.com/blogimg/20260811213316581.avif)

然后会提示打开浏览器登录，回车打开，并输入八位识别码即可

授权完成后，回到终端，空格勾选上你需要用的到的agent端，建议全选，我这边按照自己实际安装的来勾选

![](https://blogcdn.cyrilhub.com/blogimg/20260811213605330.avif)

#### agent-browser

[项目地址](https://github.com/vercel-labs/agent-browser)

轻量高效的Agent无头浏览器

安装运行

```zsh
npm install -g agent-browser --allow-scripts=agent-browser
agent-browser install
```
>需要添加`--allow-scripts`

![](https://blogcdn.cyrilhub.com/blogimg/20260811214455668.avif)

然后在你的~/.agent目录下找到skills文件夹，里面创建agent-browser文件夹，并创建SKILL.md

文件内容直接复制该官方[SKILL.md](https://raw.githubusercontent.com/vercel-labs/agent-browser/refs/heads/main/skills/agent-browser/SKILL.md)

#### codegraph(核心)

[项目地址](https://github.com/colbymchenry/codegraph)

直接安装

```zsh
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
```

配置Agent（打开一个新的终端）

```zsh
codegraph install
```
>勾选你要安装的Agent，默认会勾选你已经安装有了的，一路回车

最后一步会提示是否加入CodeGraph Pro候选列表，选N可以不用填邮箱，无所谓的

使用方法也很简单，在你的项目目录运行

```
codegraph init
```
codegraph会自动编辑相关文件索引，并在文件更新的时候自动刷新

判断方法也很简单，随便找个项目使用`codegraph init`，然后让ai找逻辑看一下是否调用codegraph

#### mattpocock开发Skills集成（推荐）

[项目地址](https://github.com/mattpocock/skills)

涵盖最常用的 /grill-me /grill-with-docs等常用命令，即使你不显式调用，涉及到该情况也会触发Skills。实际开发中作为一个隐式的规范约束是一个很好的选择，相比[superpowers](https://github.com/obra/superpowers)，更轻，也更稳定。

对于任何Agent框架，执行

```zsh
npx skills@latest add mattpocock/skills
```

![](https://blogcdn.cyrilhub.com/blogimg/20260811220905451.avif)

直接全选`Mattpocock Skills`即可，回车，后面的操作按照下方示例

Additional agents单选claude code
Installation scope选择Global
Installation method选择Symlink

>Additional agents单选claude code会影响其他情况吗，并不会，因为最后都是安装到~/.agent/skills目录下，而目前绝大多数的编码代理Agent运行的时候会读取这个文件夹

![](https://blogcdn.cyrilhub.com/blogimg/20260811221434185.avif)

find-skills在一步会提示到是否安装，选择Yes

至此，结束。

>**没有编程基础的，或是不扎实的兄台，请把这个`Mattpocock Skills`让Ai给你好好分析一遍**
> /grill-me /grill-with-docs适合手动触发，其他的在不了解的情况下，无需手动触发，

### 自用提示词分享

提示词一开始也说了，不是越复杂越好，同时规范很重要。

>自用版本(参考)

```md
# AI Coding Guidelines

## Environment

- OS: Arch Linux
- GitHub username: chulingera2025 — `gh` CLI is already authenticated locally; use it directly for repo, PR, and issue operations instead of asking for credentials
- Python package installation: prefer a virtual environment (venv). For system-wide installs, use `yay` instead of `pip install` directly (e.g. `yay -Sy python-xlrd`)

## Dependency Management

- Regardless of language, always prefer the latest stable version of libraries/dependencies
- Before writing code that uses a dependency, verify actual API/usage via context7 (query real, current documentation) rather than relying on potentially outdated training knowledge

## Development Approach

- Default to autonomous AI-driven development: complete tasks end-to-end independently rather than only giving suggestions, unless explicitly asked to just advise or review

## Language

- Conversation with the user may be in any language, but all text within code — comments, docstrings, commit messages, variable/function names, error messages, documentation, etc. — must be English only

## Code Comment Standards

- All public functions/classes/methods must include doc comments (Docstring/JSDoc/Javadoc, per language convention) describing **purpose, parameters, return values, and exceptions**
- Add inline comments for complex or non-obvious logic to explain **why**, not just restate what the code does
- Use standard markers for pending items: `TODO`, `FIXME`, `HACK`
- Keep comments in sync with code; remove outdated or misleading ones
- Avoid meaningless line-by-line comments that just restate the code

```

>其中Environment，需要各位以自己实际的情况进行编写。
>全局提示词请使用**英文，英文，英文**，中文可能存在歧义.

因为有context7存在，所以在这个全局提示词的约束下，即使是本地部署的[qwen72b](https://github.com/QwenLM/Qwen)模型，也会经常调用context7去查询最新用法文档信息。

## 结语

整套环境的骨架其实只有三块：一个趁手的执行模型、一套按需安装的 Skills（隐式约束）、一份贴合自己习惯的提示词（显式约束）。模型决定下限，Skills 和提示词决定上限——这也是反复强调"不是越多越好"的原因。

后续的迭代方向就三条：Skills 按需增减，看见推荐先想自己用不用得上；提示词跟着真实工作流走，跑一段时间觉得别扭就改一版；模型用 CC-Switch 随时切换，日常执行交给DeepSeek-V4-Flash模型、关键任务交给大参数量的模型审计并派给执行模型执行，分工明确。

>不要怀疑DeepSeek-V4-Flash模型的能力，思考强度请始终开MAX，除了多模态…………

文中所有工具和文档链接已汇总在附录，遇到问题优先查对应项目的官方文档和 GitHub Issues，其次再问 AI。AI 工具迭代很快，如果某条命令或包名与文章不一致，以官方文档为准。

## 附录：参考文档

> 文中引用链接汇总，均为官方文档、软件包仓库或项目主页

### 官方文档

- [DeepSeek](https://www.deepseek.com/)
- [OpenAI](https://openai.com/)
- [Anthropic Claude](https://www.anthropic.com/claude)
- [Claude Code Doc](https://code.claude.com/docs/en/overview)
- [Codex CLI Doc](https://learn.chatgpt.com/docs/codex/cli)
- [Node.js](https://nodejs.org/)

### 工具与项目

- [CC-Switch](https://github.com/farion1231/cc-switch) / [Releases](https://github.com/farion1231/cc-switch/releases) / [cc-switch-bin（AUR）](https://aur.archlinux.org/packages/cc-switch-bin)
- [Context7](https://context7.com/) / [GitHub](https://github.com/upstash/context7)
- [agent-browser](https://github.com/vercel-labs/agent-browser)
- [codegraph](https://github.com/colbymchenry/codegraph)
- [Matt Pocock Skills](https://github.com/mattpocock/skills)
- [superpowers](https://github.com/obra/superpowers)
- [opencode](https://github.com/anomalyco/opencode) / [pi](https://github.com/earendil-works/pi) / [omp（Oh My Pi）](https://github.com/can1357/oh-my-pi)
- [Cloudflare Pingora](https://github.com/cloudflare/pingora)
- [yay（AUR 助手）](https://github.com/Jguer/yay)
- [Qwen](https://github.com/QwenLM/Qwen)
- [Raddy](https://github.com/chulingera2025/raddy)




