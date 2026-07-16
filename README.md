# FIELD / 100

一部由 100 个真实素材构成的交互式现场纪录，直接部署于 GitHub Pages。

新版把素材按内容严格分为四个连续章节，而不是集中堆成一个相册：

- 建筑外部：28 件，12 件组成横向移动序列，其余 16 件构成室外档案。
- 建筑内部：39 件，8 件构成主叙事拼贴，其余 31 件构成室内档案。
- 人物合照：10 件，独立人物章节。
- 参访现场：23 件，独立现场记录章节。

总计 72 张图片、28 个视频。所有原始文件都保留在 `assets/media/`；页面优先加载约 8.3 MB 的 WebP 预览图，只有打开查看器时才加载原始图片或视频。

## 视觉方向

`FIELD / 100` 把页面当作一部无声的现场纪录片：开场建立地点与尺度，随后依次穿过外部、内部、人物和参访现场。排版采用高压缩标题、非对称构图、滚动剪辑与四个清晰的色彩场域。视觉参考的是 MDX 公开表达的制作方法——镜头语言、叙事节奏、动效连续性与性能约束——没有复制其布局、品牌、代码或付费提示词。

完整研究边界见 `DESIGN_PROMPT.md`，本版制作级总提示词见 `MASTER_PROMPT.md`。

## 文件

- `index.html`：语义结构、四个素材章节、灯箱与 SEO 元数据。
- `styles.css`：视觉系统、章节构图、响应式与 reduced-motion 降级。
- `script.js`：素材分区、横向滚动、分区画廊、筛选与原图/视频查看器。
- `media-data.js`：100 个素材的浏览器数据清单。
- `assets/media-manifest.json`：可读的素材元数据。
- `assets/media/`：100 个原始文件、视频封面和 WebP 预览。
- `assets/og-field-100.png`：1200×630 社交分享封面。

旧版 Pressure Fold 已保存在本地 `_archive/pressure-fold-2026-07-16/`，并由 Git 忽略；仓库历史也可恢复旧版。

## 本地预览

```powershell
py -m http.server 4173 --bind 127.0.0.1
```

打开 `http://127.0.0.1:4173/`。

## 部署前检查

```powershell
node --check script.js
node --check media-data.js
git diff --check
```

推送到 `main` 后由 GitHub Pages 发布：

https://annoyingwinter.github.io/github-pages-starter/
