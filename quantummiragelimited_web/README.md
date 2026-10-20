# Quantum Mirage — 游戏作品集（静态站点）

白底内容区 + 深色导航栏，`zh / en / tr` 三语，两款作品：**Buzlu Meyve Sebze Karoları**、**Kedi Kafesi Sim**。没有任何构建依赖，改完 `build.bat` 即成静态站。

## 快速开始

```bash
node build.mjs          # 生成站点到 site/
node tools/check.mjs    # 结构自检：单 h1、链接可达、语言按钮、卡片数量
node tools/serve.mjs    # 可选：http://127.0.0.1:4321/ 本地预览
```

然后直接打开 `site/index.html`（会按浏览器语言跳到 `zh/`、`en/` 或 `tr/`）。无需安装任何依赖，也不依赖本地服务器——`file://` 直接双击就能跑。

**不想敲命令行**：双击 `build.bat` 重新生成，双击 `preview.bat` 打开预览。没装 Node.js 时 `build.bat` 会提示去哪里下载。

## 目录结构

```
neon-anvil-portfolio/
├─ build.mjs              # 生成器（纯 Node，模板字符串拼 HTML）
├─ build.bat              # 双击 = 跑 node build.mjs
├─ preview.bat            # 双击 = 用默认浏览器打开 site/index.html
├─ .pages.yml             # Pages CMS 配置：把 content/games 变成可视化表单
├─ .github/workflows/deploy.yml  # push 后自动构建 + 发布 GitHub Pages
├─ content/
│  ├─ site.mjs            # 站点配置 + 三语文案（导航、首页、页脚…）
│  ├─ games/              # 一款游戏一个 JSON（18 个），文件名随意
│  └─ legal.mjs           # 隐私政策与使用条款全文（三语）
├─ lib/
│  ├─ games.mjs           # 读 content/games/*.json、校验、排序
│  └─ covers.mjs          # 封面图查找（cover 字段优先，其次按文件名）
├─ assets/
│  ├─ css/style.css       # 全部样式，暗色编辑风，含打印与降低动效适配
│  ├─ js/site.js          # 移动菜单、滚动揭示、目录高亮、语言记忆
│  └─ img/favicon.svg
├─ tools/
│  ├─ check.mjs           # 生成结果的静态校验脚本
│  ├─ covers.mjs          # 封面图清单：哪款已配图、哪款还在用占位
│  ├─ serve.mjs           # 零依赖静态预览服务器
│  └─ dump-shots.mjs      # 开发用：从浏览器截图结果里导出 PNG
└─ site/                  # ← 生成产物，可直接部署
   ├─ index.html          # 语言重定向壳
   ├─ zh/ en/ tr/         # 每语种 6 个页面
   ├─ assets/             # 从 ../assets 拷贝
   ├─ sitemap.xml robots.txt
```

`build.mjs` 每次都会清空 `site/` 重新生成，所以不要手改 `site/` 里的文件。

## 页面清单（每个语种 6 页，共 18 页）

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页：Hero、跑马灯、最新作品、工作室三条能力、引言、联系 CTA |
| `games.html` / `games-2.html` / `games-3.html` | 作品列表，每页 6 款，带上一页/下一页与页码 |
| `privacy.html` | 隐私政策：9 节，左侧粘性目录 + 滚动高亮 |
| `terms.html` | 使用条款：10 节，同上 |

同一语种内文件名固定，所以切换语言不会丢失所在页面（在 `games-2.html` 切到英文仍是 `en/games-2.html`）。

## 三语切换怎么做的

1. **构建期**：`build.mjs` 为 `zh / en / tr` 各生成一整套 HTML，`<html lang>`、`<title>`、`hreflang`、`og:locale` 都按语种写死——没有 JS 也能读，SEO 友好，也不会出现“先中文后英文”的闪烁。
2. **切换**：页头的分段按钮就是普通 `<a href="../en/games-2.html">`，点击时把偏好写进 `localStorage["na:lang"]`。
3. **首次访问**：`site/index.html` 读 `localStorage` → 浏览器语言（`zh*` → zh，`tr*` → tr，其余 en）→ 跳转。
4. **兜底**：`localStorage` 不可用（部分浏览器 `file://` 场景）时全部 `try/catch`，只会丢偏好，不影响浏览。

## 分页

`content/games/` 里一款一个 JSON，每页条数取 `content/site.mjs` 的 `gamesPerPage`（默认 6），页数由 `Math.ceil(games.length / gamesPerPage)` 自动算出：18 款 = 3 页，19 款自动变 4 页。分页链接、`rel="prev/next"`、`aria-label`、页头「共 N 款 · 第 1 / 3 页」全部自动生成。

## 日常维护：改文字、换图片

### 换封面图（不用改代码）

把图放进 `assets/img/games/`，文件名用**游戏 id 或游戏名都行**，重新 `node build.mjs` 就生效：

| 文件名 | 匹配到 |
| --- | --- |
| `ashen-vale.jpg` | Ashen Vale |
| `Ashen Vale.jpg` | Ashen Vale（大小写、空格不敏感） |
| `ashen_vale.png` | Ashen Vale（下划线、连字符等价） |

- 支持 `.jpg` `.jpeg` `.png` `.webp` `.avif`，同名时按这个顺序取第一个
- 建议 1200×900（4:3），压到 300KB 以内；右上角会叠「年份」胶囊，顶部留点余量
- 没有图的作品继续用「渐变 + 首字母」占位，两种可以混着用
- 想退回占位：删掉图片再生成即可
- 图片会自动拷进 `site/assets/img/games/`，不用手动复制

不确定该放哪些文件？跑一下清单，`·` 表示还在用占位图：

```bash
node tools/covers.mjs
```

### 换导航栏颜色

配色集中在 `assets/css/style.css` **顶部的 `:root`** 里，六个变量，不用去改具体规则：

| 变量 | 控制什么 | 默认值 |
| --- | --- | --- |
| `--header-bg` | 页面在最顶部时的导航栏背景 | `rgba(10, 10, 12, 0.66)` |
| `--header-bg-scrolled` | 向下滚动后的背景 | `rgba(10, 10, 12, 0.9)` |
| `--nav-ink` | 普通导航文字 | `var(--ink-2)` |
| `--nav-ink-hover` | 鼠标悬停文字 | `var(--ink)` |
| `--nav-ink-active` | 当前页文字 + 下划线 | `var(--acid)` |
| `--menu-bg` | 手机上展开的菜单面板 | `#0b0b0e` |

改完双击 `build.bat`（CSS 会被拷进 `site/assets/css/`），浏览器 **Ctrl+F5**。

现成配方：

```css
/* 1) 纯黑不透明（去掉半透明和毛玻璃观感） */
--header-bg: #000000;
--header-bg-scrolled: #000000;

/* 2) 深蓝半透明 */
--header-bg: rgba(12, 20, 40, 0.6);
--header-bg-scrolled: rgba(12, 20, 40, 0.92);

/* 3) 只把「当前页」从荧光绿换成白色 */
--nav-ink-active: #ffffff;
```

两个注意：

- `--header-bg` 默认带 `0.66` 透明度，并叠加了毛玻璃（`backdrop-filter: blur`）。要**纯色**就填不带透明的十六进制（`#0b0b0e`）；想保留毛玻璃就继续用 `rgba(...)`。
- 想做**亮色导航栏**，除了背景还要把 `--nav-ink` / `--nav-ink-hover` / `--nav-ink-active` 一起改成深色，否则文字会糊。只想换品牌色请改 `--nav-ink-active`；改 `--acid` 会连带按钮、标题高亮、页脚 hover 一起变。

### 换 logo

三种情况，按需要选：

**1) 换成自己的图片（推荐）**——把文件命名为 `logo.svg`（或 `.png` / `.webp` / `.jpg`）放进 `assets/img/`，重新生成即可。没有这个文件时自动用内置的 CSS 方块，所以删掉就还原。

- 正方形或横版都行：高度固定 **26px**，宽度按比例自适应（最大 150px）
- 建议 64×64 起（或宽 2 倍尺寸），透明背景，文件压到 50KB 以内
- 它只是图标（右边还有品牌名文字），别放「图标 + 文字」整张图；那种情况见下面第 4 条

**2) 只改那个方块的颜色 / 圆角**——在 `style.css` 里改 `.brand__mark`：

```css
.brand__mark {
  border-radius: 8px;                 /* 圆角，改成 50% 就是圆形 */
  background: linear-gradient(140deg, var(--acid), #7dffb2 70%, #7c5cff);
}
```

**3) 改品牌名文字**——`content/site.mjs` 的 `site.wordmark`（三种语言共用），副标题是各语言自己的 `brandSub`。

**4) logo 是「图标 + 文字」一体的横版图**——模板会同时显示图片和右边的文字，想只留图片：把 `content/site.mjs` 里三处 `wordmark` 和三处 `brandSub` 都改成空字符串 `""`。代价是顶栏品牌名变成纯图片，不能被选中/搜索到。

另外浏览器标签页图标是另一个文件：`assets/img/favicon.svg`，直接覆盖同名文件即可。

### 改文案：一个字段对应一个位置

| 想改什么 | 打开 | 字段 |
| --- | --- | --- |
| 工作室名 / 邮箱 / 域名 / 社交链接 | `content/site.mjs` | `site.*` |
| 首页大标题、导语、按钮、三个数字 | `content/site.mjs` | `ui.<语种>.hero`、`ui.<语种>.stats` |
| 首页三条能力、引言 | `content/site.mjs` | `ui.<语种>.studio` |
| 页脚、联系 CTA、导航文案 | `content/site.mjs` | `ui.<语种>.footer`、`ui.<语种>.ctaBand`、`ui.<语种>.nav` |
| 某款游戏的名称 / 年份 / 平台 / 简介 | `content/games/<id>.json` | 对应该文件 |
| 隐私政策 / 使用条款正文 | `content/legal.mjs` | `docs.privacy` / `docs.terms` |

`ui` 下有 `zh` / `en` / `tr` 三份，**改哪种语言就改哪一份**；三份结构一样，对着复制不容易漏。

### 用什么打开这些文件

`.mjs`、`.css`、`.html` 都是**纯文本**，不是程序。推荐用 [VS Code](https://code.visualstudio.com/)（免费，有高亮、能看出引号有没有配对）；临时改一两个字段，**记事本**也行。

Windows 上双击没反应，是因为没关联程序：右键文件 → **打开方式** → 选择「记事本」或 VS Code → 勾「始终使用此应用」。

三个坑：

- **别用 Word / WPS 打开**：它们会把直引号 `"` 换成中文引号 `“ ”`，文件直接坏掉；
- 保存要选 **UTF-8** 编码（记事本「另存为」对话框右下角），否则中文和土耳其语字符会变乱码；
- **别改扩展名**：`.json` 改成 `.txt`，生成器就找不到它了。

改完保存 → 双击 `build.bat` → 双击 `preview.bat` 看效果。写坏了也不会静默出错：`build.bat` 会停在一行中文提示上，例如

```
✗ content/games/harbor-lights.json：JSON 格式有问题 — Unexpected token } ...
✗ content/games/harbor-lights.json：缺少 "title"
✗ content/games/zz-dup.json：id "ashen-vale" 和 ashen-vale.json 重复了
```

### 改完自检

```bash
node build.mjs && node tools/check.mjs
```

`site/` 是生成物，每次重新生成会整个覆盖，别直接改里面的文件。

## 新增一款游戏

一款游戏 = `content/games/` 下的一个 JSON 文件。复制任意一个改字段即可（文件名随意，生成器按 `id` 认，不按文件名）：

```json
{
  "id": "harbor-lights",
  "title": "Harbor Lights",
  "year": 2025,
  "order": 19,
  "genre_zh": "叙事",
  "genre_en": "Narrative",
  "genre_tr": "Anlatı",
  "platforms": ["PC", "PS5"],
  "art_c1": "#38bdf8",
  "art_c2": "#0f172a",
  "art_pattern": "arcs",
  "blurb_zh": "……",
  "blurb_en": "…",
  "blurb_tr": "…",
  "cover": ""
}
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 唯一；小写英文 + 连字符，同时是卡片锚点 `#game-<id>`。和已有重复会直接报错 |
| `title` | ✅ | 游戏名 |
| `year` | | 发行年份，显示在封面右上角 |
| `order` | | 展示顺序，1 最前、数字越大越靠后；缺省排最后 |
| `genre_zh/en/tr` | | 类型，三语各一份 |
| `platforms` | | 平台数组，如 `["PC","PS5"]` |
| `art_c1` / `art_c2` | | 没有封面图时的渐变占位色（`#rgb` 或 `#rrggbb`） |
| `art_pattern` | | 占位纹理：`grid` `rings` `stripes` `dots` `arcs` |
| `blurb_zh/en/tr` | | 一句话简介，三语 |
| `cover` | | 封面图路径；留空则按文件名自动匹配（见上一节） |

改完 `node build.mjs`。分页自动重算，**首页「最新作品」取的是排序后的第一款**——想让新作上首页，把它的 `order` 设成 1。

写错了不会静默失败：`build.mjs` 会指出具体文件和问题（JSON 语法、缺 `title`、`id` 重复）。

## 用浏览器后台改内容（可选，Pages CMS）

不想碰 JSON，可以把仓库接到 [Pages CMS](https://pagescms.org)：网页表单里加游戏、传封面，保存即提交到 GitHub。

1. 把项目推到一个 GitHub 仓库（私有也行）。
2. 打开 [app.pagescms.org](https://app.pagescms.org)，用 GitHub 登录 → **Add repository** → 选这个仓库。
3. 根目录的 `.pages.yml` 会被自动识别，出现「游戏作品」集合：一款一条，字段都是中文标签，封面图是上传框。
4. 上传的图会进 `assets/img/`，`cover` 字段自动写入路径，无需手工命名。

注意：CMS 只管内容、不负责发布。提交后要么本地 `build.bat` 再传 `site/`，要么用下面的 GitHub Actions（提交即自动构建）。

字段名必须和 JSON 的 key 一致；以后加字段要 `.pages.yml` 和 JSON 两边都改。

## 部署

生成物在 `site/`，纯静态，任何静态托管都行。

**方案 1：GitHub Pages（推荐，提交即上线）**
仓库已带 `.github/workflows/deploy.yml`：push 到 `main` 会自动 `node build.mjs` → 自检 → 发布。
只需去仓库 **Settings → Pages → Source** 选 **GitHub Actions**。

**方案 2：手动上传**
双击 `build.bat`，把 `site/` 整个目录拖到 Netlify / 对象存储 / 自己的 Nginx。

**方案 3：Netlify / Vercel**
- Build command：`node build.mjs`
- Publish directory：`site`

上线前把 `content/site.mjs` 里的 `baseUrl` 换成真域名——它决定 canonical、hreflang 和 sitemap。

## 新增一个语种

1. `content/site.mjs`：`site.locales`、`localeNames`、`htmlLang` 各加一项，并在 `ui` 补一整套文案。
2. `content/legal.mjs`：补该语种的两份法律文本。
3. `build.mjs` 的 `og:locale` 三元表达式改成查表（或在 site 配置里加 `ogLocale` 映射）。

## 与 Publii 主题的对应关系

以后要做成 Publii 主题时，按这个映射搬即可：

| 现在 | Publii 主题 |
| --- | --- |
| `build.mjs` 里的 `header()` / `footer()` | `partials/header.hbs`、`partials/footer.hbs` |
| `homePage()` | `layouts/index.hbs` + `partials/hero.hbs` |
| `gamesPage()` | `layouts/tag.hbs` 或自定义 `layouts/games.hbs`（`{{#each posts}}`） |
| `legalPage()` | `layouts/page.hbs`（正文用 `{{{ post.text }}}`） |
| 分页 HTML | `{{> pagination}}` + `partials/pagination.hbs`（数据在 `@pagination`） |
| `content/site.mjs` | 主题 `config.json` 的 `customConfig` + `assets/languages/*.json` |
| `assets/css`、`assets/js` | 同名目录，Publii 会原样拷贝 |

页面里已经用了 Publii 常见的 `layouts / partials / assets` 心智模型，迁移主要是把模板字符串换成 `.hbs` 与 `{{ }}`。

## 上线前要改的

- `content/site.mjs` 的 `baseUrl`（现在是占位域名 `https://neonanvil.studio`），它影响 canonical、hreflang、sitemap。
- 工作室名、邮箱、社交链接、18 款游戏的名称与简介。
- **法律文本只是模板**：隐私政策与使用条款按常见结构写好，但不是法律意见，请法务按实际的数据处理、支付渠道、适用法域审一遍再发布。

## 已知边界（骨架刻意没做）

- 游戏详情页：卡片不可点击，只留了 `id="game-<slug>"` 锚点，接详情页时可直接改链接。
- 联系表单：CTA 走 `mailto:`，没有后端。
- 图片：封面支持真图（`assets/img/games/<id>.jpg`），没图时用 CSS 渐变 + 首字母占位；游戏详情页、截图画廊还没做。
- 无构建依赖、无 npm 包、无 CDN：完全离线可跑。
