# FIELD / 100 — Design System

## Art Direction Contract

1. 100 个真实素材是主角，界面只负责建立观看顺序。
2. 四个来源文件夹对应四个独立章节，禁止混排。
3. 页面从建筑尺度逐步靠近人的行动。
4. 每章有独立空间，但共享同一套排版与交互语法。
5. 图像预览可以裁切，查看器必须保留完整原始文件。
6. 视频只在用户打开后加载。
7. 桌面与移动端拥有不同的叙事动作。
8. 不虚构机构关系、成果、奖项、引语或数据。

## Color

- Ink: `#11120f` — 开场、室外与查看器。
- Paper: `#eef0e8` — 室内空间。
- White: `#f8f9f2` — 人物章节。
- Ultramarine: `#2739ff` — 论点与参访现场。
- Signal orange: `#ff4b20` — 转折、进度与结尾。

颜色承担章节切换，不用作无意义装饰。文字在对应底色上保持 AA 对比度。

## Type

- Display: self-hosted Anek 800 Condensed。
- Body/UI: self-hosted Anek 400 + 中文系统无衬线回退。
- 展示文字使用强压缩、大尺度、手工换行和少量描边。
- 正文保持 1.45–1.5 行高，宽度控制在约 31rem。

## Layout

- Hero：三个摄影平面 + 超大标题，作为全片预告。
- Thesis：群青全屏断点。
- Exterior：桌面垂直滚动映射横向镜头；移动端原生横向 snap。
- Interior：12 列非对称主拼贴 + 独立室内档案。
- People：10 件合照形成连续长卷。
- Field notes：23 件现场素材在群青场域独立展开。
- Outro：信号橙静止帧。

档案网格使用 dense placement 和不同跨度，避免等宽卡片墙。窄屏重排为一列或两列，不直接缩小桌面布局。

## Motion

- 主缓动：`cubic-bezier(.16,1,.3,1)`。
- Hero：有限视差与旋转回正。
- Exterior：单一连续横向 travel。
- People：桌面慢速漂移，悬停暂停；移动端改为手动滑动。
- reduced-motion：移除视差、自动漂移和滚动映射。

## Media Pipeline

- 原始文件：`assets/media/{category}/`。
- WebP 预览：`assets/media/thumbs/`，总计约 8.3 MB。
- 视频封面：`assets/media/posters/`。
- 浏览器清单：`media-data.js`。
- 可读清单：`assets/media-manifest.json`。

页面默认只请求预览；灯箱打开时才读取 `src` 原始文件。所有 `<video>` 都由交互后创建。

## Accessibility

- 语义章节、一个 H1、逻辑 H2 顺序。
- Skip link、可见焦点、键盘可打开媒体。
- Dialog 支持 Escape、左右方向键和显式关闭按钮。
- 所有媒体按钮具备中文 `aria-label`。
- JS 关闭时保留完整章节与叙事文本。
