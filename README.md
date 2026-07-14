# Annoying Winter: Pressure Fold

一个零构建、可直接部署到 GitHub Pages 的电影化数字材料实验。

网站围绕同一个 Pressure Fold 展开。原生 WebGL2 顶点与片元着色器生成黑铬复合折片，滚动依次驱动 Edge、Fold、Stress、Rupture、Anatomy、Release 和 Rest。指针会向材料施压，Anatomy 会切开外壳并渲染五层截面，章节负责改变镜头、受力、分层与重组。全页保持单一深色视觉系统，并在 Impact 章节出现一次完整的酸性黄绿色反转。

## 技术构成

- 原生 HTML、CSS 与 JavaScript，无构建步骤。
- 原生 WebGL2、自定义网格、自定义 shader，无第三方运行时。
- 单一固定 canvas，桌面与移动端使用独立几何密度、DPR 上限和相机修正。
- 两个自托管 Anek Pressure 字重，配合中文系统字体回退。
- CSS 静态 Pressure Fold poster，可覆盖无 WebGL、shader 失败与 context lost 场景。
- 相对资源路径，可直接部署到 GitHub Pages 子路径。

## 本地预览

```powershell
py -m http.server 4173 --bind 127.0.0.1
```

打开 `http://127.0.0.1:4173/`。

## 交互与叙事

- 滚动控制同一套确定性 scene state 与 11 组相机关键帧，回滚可以恢复对应状态。
- 指针位置与压力影响折片旋转、镜头偏移和局部凹陷，反馈带有延迟恢复。
- Surface、Stress、Structure 模式为原生按钮，支持键盘、焦点与 `aria-pressed`。
- 章节状态条同步显示 Edge 到 Rest 的进程。
- 页面隐藏时暂停渲染，连续慢帧会自动降低渲染分辨率。

## 文件

- `index.html`：语义结构、叙事内容、模式按钮与 SEO 元数据。
- `styles.css`：OKLCH 视觉令牌、电影化长滚动构图、响应式布局和静态回退。
- `script.js`：WebGL2 几何、shader、滚动镜头、指针压力、质量降级和上下文恢复。
- `assets/fonts/`：自托管 Anek Pressure 字体。
- `favicon.svg`：站点图标。
- `PRODUCT.md`：受众、目标、品牌人格、反例和无障碍底线。
- `DESIGN.md`：符合 DESIGN.md 规范的设计系统与机器可读令牌。
- `.impeccable/design.json`：schemaVersion 2 设计 sidecar，包含动效、断点和组件预览。
- `MASTER_PROMPT.md`：原创 Pressure Fold 母提示词与 92 分终审提示词。
- `DESIGN_PROMPT.md`：MDX、HorizonX 公开研究与提示词来源边界。

## 可访问性与降级

- 目标为 WCAG 2.2 AA，保留 skip link、语义 landmarks、正确标题层级和清晰焦点。
- 主要导航、正文动作链接与模式按钮在粗指针设备上至少为 48px，桌面端基础目标至少为 44px。
- `prefers-reduced-motion` 会停用扫描循环，将滚动与状态切换收敛为即时更新。
- JavaScript 关闭后，主要内容、项目说明和联系路径仍可阅读。
- WebGL2 不可用时，五层 CSS poster 保持核心轮廓与构图。
- 页面无表单和用户输入攻击面，外部新窗口链接使用 `noopener noreferrer`。

## 部署

推送到 `main` 后，GitHub Pages 会自动发布：

https://annoyingwinter.github.io/github-pages-starter/

部署前建议执行：

```powershell
node --check script.js
git diff --check
```

随后在 1440px、390px、320px、手机横屏、reduced-motion 和 WebGL-off 条件下完成浏览器验收。
