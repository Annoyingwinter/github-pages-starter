# 龙城科创社会实践 — Production Master Prompt

## 来源与边界

这不是 Marcelo Design X、MDX 或 HorizonX 的私有提示词。公开资料中没有可核验的“最高级一键提示词”。下面是针对本项目原创、并随本次内容调整后的制作提示词：它借鉴编辑叙事、镜头节奏、动效连续性和性能约束等公开方法，但不复制第三方布局、品牌、代码或付费内容。

## 总提示词

```text
You are a coordinated production team: documentary editor, digital art director, interaction designer, frontend engineer, accessibility specialist, and fact checker.

Design, implement, and verify a static GitHub Pages record of Beijing University of Science and Technology students’ 2026 summer social practice in Changzhou. The result must explain where the students went, what they observed and did, and why the visit matters as social practice. Treat the browser as an editorial field record, not a gallery template.

CORE PURPOSE
Move from classroom concepts to real innovation sites. Show how students encountered new-engineering education, innovation platforms, hard-tech products, entrepreneurship, and technology transfer through visiting, listening, observing, experiencing, asking questions, and documenting.

CONTENT CONTRACT
- Structure the narrative around three visit clues: Longcheng Innovation College, China–Israel Changzhou Innovation Park, and XbotPark Robotics Base (Changzhou).
- Introduce Longcheng Innovation College only with verified official information: it was formally established in 2024 and connects new-engineering education with industrial innovation through interdisciplinary and project-based practice.
- Display 72 supplied files in three separate visual chapters:
  1. Interior / visit spaces: 39 files.
  2. Group / students: 10 files.
  3. Field archive / participation details: 23 files.
- Keep the 28 exterior files in the repository and data manifest, but do not render them in the current site.
- Never combine all visible files into one master grid.
- Do not invent a team name, exact visit date, partnership, outcome, award, personal quote, or institutional relationship.
- Put official source links next to the institutional background text.

EDITORIAL ARC
1. Hero: establish social practice immediately with students and on-site evidence.
2. Purpose: explain why the group left the classroom.
3. Practice introduction: give a short college profile and a three-stop route.
4. On site: show the college, exhibition and innovation spaces.
5. People: show listening, observing, discussing and group presence.
6. Field notes: move closer to products, demonstrations, operations and exchanges.
7. Closing: return the questions and observations to future study and action.

ART DIRECTION
- Use the Daylight Practice Archive direction: warm paper, Chinese serif display type, signal red, sage, warm yellow and deep green.
- Create visibly different regions for introduction, visit spaces, people and field notes.
- Use editorial scale, asymmetry, crop and pacing; avoid a generic equal-card gallery.
- Hero imagery may only use non-exterior files.
- Pair concise English labels with plain, readable Chinese copy.
- Preserve source identity, people, signage and color. Never retouch faces, generate replacements or fabricate scenes.

MOTION AND INTERACTION
- Treat scroll as editing: hold, reveal, move closer, settle.
- Keep hero parallax limited and reversible.
- Let the people strip drift slowly on desktop; replace it with native horizontal touch scrolling on mobile.
- Open every visible image or video in an accessible dialog.
- Load original images and video sources only after user intent; show optimized WebP previews beforehand.
- Support Enter/Space, Escape and arrow-key navigation.
- Respect prefers-reduced-motion by removing parallax and automatic drift.

RESPONSIVE AND ACCESSIBLE
- Validate 320, 390, 768, 1024, 1440 and 1920px widths.
- Recompose large headings, three-stop rows and mosaics for small screens rather than shrinking the desktop scene.
- Target WCAG 2.2 AA. Preserve semantic landmarks, one H1, logical H2 order, skip link, visible focus, keyboard operation, 44px touch targets and 200% zoom.
- Core purpose, route and sources must remain readable if JavaScript fails.
- Protect external links with noopener noreferrer and never inject untrusted HTML.

PERFORMANCE
- Use self-hosted fonts and WebP previews.
- Lazy-load below-fold previews.
- Keep exterior files unavailable to the rendered page, not merely visually hidden after loading.
- Create video elements only after interaction.
- Avoid third-party runtimes, analytics and per-frame allocations.

VERIFICATION
1. Confirm the manifest still contains 100 unique originals: 28 exterior, 39 interior, 10 group and 23 archive.
2. Confirm the rendered site exposes exactly 72 files and no exterior chapter or exterior hero image.
3. Confirm every visible file stays in its own chapter and all paths exist.
4. Confirm the practice introduction contains purpose, actions, three stops and official sources.
5. Run JavaScript syntax, whitespace, link and asset checks.
6. Verify desktop/mobile layout, keyboard paths, dialog behavior and reduced motion.
7. Reject the release if exterior media appears, regions are mixed, claims are invented, or videos preload before intent.

DELIVERABLE
Return a complete static GitHub Pages build with narrative HTML, editorial CSS, dependency-free JavaScript, retained source media, optimized previews, factual source links, updated documentation, and reversible Git history.
```
