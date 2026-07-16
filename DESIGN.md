# 龙城科创社会实践 — Design System

## Art Direction Contract

1. 网站首先是一份社会实践记录，其次才是影像展示。
2. 72 件可见素材按参访现场、同学们和实践细节三个章节独立排布。
3. 文字必须讲清实践目的、参访地点、现场行动与青年视角。
4. 28 件建筑外部素材保留在仓库，不进入当前页面。
5. 图像预览可以裁切，查看器必须保留完整原始文件。
6. 视频只在用户打开后加载。
7. 不虚构机构关系、成果、奖项、引语、团队名称或精确日期。

## Current direction: Daylight Practice Archive

当前版本是一间被打开的“社会实践档案室”：首屏用同学、室内和实践细节组成三层摄影平面；黑底宣言说明为什么出发；米白长页讲述学院背景与三段参访路线；随后进入鼠尾草绿、暖黄与深绿三个影像区域。

## Color

- Ink: `#1b1915` — 宣言、结尾与查看器。
- Paper: `#f1eee4` — 首屏与实践介绍。
- Deep green: `#004d3f` — 实践记录。
- Signal red: `#e3442f` — 定位标签与强调。
- Warm yellow: `#f0c84b` — 人物章节与路线反馈。
- Sage: `#dce4d8` — 参访现场。

颜色承担内容切换，不用作无意义装饰。文字在对应底色上保持 AA 对比度。

## Type

- English/UI：自托管 Anek 800 Condensed 与 Anek 400。
- 中文展示：系统宋体回退；正文：中文系统无衬线回退。
- 标题使用大尺度、手工换行和克制的颜色切换。
- 长正文保持约 1.65 行高，路线说明保持短段落。

## Layout

- Hero：三层非外部摄影平面 + 超大中文标题。
- Purpose：黑底全屏实践宣言。
- Practice intro：背景简介、三项实践信息、三段参访路线和官方资料链接。
- On site：39 件素材组成 12 列非对称拼贴与档案。
- People：10 件合照形成连续长卷，之后接实践反思。
- Field notes：23 件现场素材在深绿场域独立展开。
- Outro：黑底总结，回应“把所见带回课堂”。

档案网格使用 dense placement 和不同跨度，避免等宽卡片墙。窄屏重排为一列或两列；三段路线改为纵向阅读。

## Motion

- 主缓动：`cubic-bezier(.16,1,.3,1)`。
- Hero：有限视差与旋转回正。
- People：桌面慢速漂移，悬停暂停；移动端改为手动滑动。
- reduced-motion：移除视差与自动漂移。

## Media Pipeline

- 原始文件：`assets/media/{category}/`。
- WebP 预览：`assets/media/thumbs/`。
- 视频封面：`assets/media/posters/`。
- 浏览器清单：`media-data.js`。
- 可读清单：`assets/media-manifest.json`。

页面默认只请求 72 件可见素材的预览；灯箱打开时才读取对应原始文件。所有 `<video>` 都由交互后创建。

## Accessibility

- 语义章节、一个 H1、逻辑 H2 顺序。
- Skip link、可见焦点、键盘可打开媒体。
- Dialog 支持 Escape、左右方向键和显式关闭按钮。
- 外链使用 `noopener noreferrer`。
- JS 关闭时仍保留完整实践叙事与资料来源。
