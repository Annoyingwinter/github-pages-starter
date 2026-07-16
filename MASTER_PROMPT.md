# FIELD / 100 — Production Master Prompt

## 来源与边界

这不是 Marcelo Design X、MDX 或 HorizonX 的私有提示词。公开资料中没有可核验的“最高级一键提示词”；相反，Marcelo 的公开内容明确反对把成熟网站包装成 “one prompt website”。下面是针对本项目原创的制作级总提示词：它吸收公开可见的方法论——意图、研究、镜头语言、动效节奏、界面清晰度、性能预算与设备降级——但不复制任何第三方布局、文案、品牌、资产、代码或付费内容。

## 总提示词

```text
You are a coordinated production team: digital art director, documentary editor, interaction designer, type director, frontend engineer, accessibility specialist, and performance engineer.

Design, implement, and verify FIELD / 100 for Annoying Winter: a cinematic, interactive field record built from exactly 100 supplied files. Treat the browser as an editorial sequence, not a gallery template. The finished site must feel authored from first frame to last interaction.

CORE THESIS
“The future has a floorplan.”
The experience moves from scale to evidence:
1. arrive outside;
2. enter the interior;
3. turn toward people;
4. move closer to participation.

CONTENT CONTRACT — NON-NEGOTIABLE
- Use every supplied file.
- Keep the four source regions separate. Never combine all files into one master grid.
- Exterior: 28 files. Use 12 for the horizontal arrival sequence and the remaining 16 for the exterior archive.
- Interior: 39 files. Use 8 images for the spatial collage and the remaining 31 files for the interior archive.
- Group: 10 files. Use all 10 only in the people chapter.
- Field archive: 23 files. Use all 23 only in the final field-notes chapter.
- A cover may preview up to three files without changing chapter ownership.
- Do not invent names, partnerships, outcomes, awards, visitor quotes, or institutional claims.

ART DIRECTION
- Build one continuous editorial world with four distinct spatial fields, not four unrelated templates.
- Opening: black cinematic field, layered photographic planes, oversized FIELD / 100 typography.
- Thesis: ultramarine full-field interruption with one signal-orange line.
- Exterior: black stage, wide horizontal camera movement, architecture shown through scale and distance.
- Interior: warm mineral paper, dense but asymmetric collage, information becoming physical.
- People: clean white field, long human strip, faces and body language taking visual priority.
- Field notes: ultramarine archive, tighter crops and more immediate rhythm.
- Ending: signal-orange memory frame, minimal actions, unmistakable closure.
- Avoid generic cards, glass navigation, decorative grids, particles, blobs, orbit graphics, orange-on-black tech clichés, repeated 01/02/03 boxes, and universal fade-up reveals.

TYPOGRAPHY
- Use self-hosted Anek: 800 Condensed for display, 400 for navigation and body.
- Pair English display type with concise Chinese writing.
- Use scale, overlap, crop, and line breaks as editorial decisions.
- Keep body copy readable at 320px and 200% zoom.
- Never allow display text to cause horizontal document overflow.

MOTION AND INTERACTION
- Treat scroll as editing: hold, reveal, travel, cut, settle.
- On desktop, map native vertical scrolling to one horizontal exterior sequence; preserve direct control and reversible motion.
- On mobile, replace scroll mapping with a native horizontal snap strip. Do not shrink the desktop scene.
- Keep one primary motion event active at a time.
- Use quartic/quintic ease-out behavior. No bounce or elastic easing.
- Open every image or video in an accessible dialog.
- Load original images and video sources only after user intent. Before that, show optimized previews or video posters.
- Support Enter/Space on media, Escape to close, and arrow keys to move between items in the same region.
- Respect prefers-reduced-motion: remove parallax, automatic drift, and scroll-linked transforms while preserving the narrative.

IMAGE AND VIDEO PRESERVATION
- Preserve source identity, crop intent, people, architecture, signage, and color information.
- Do not retouch faces, generate replacements, add logos, or fabricate scene content.
- Thumbnail crops may be art-directed for rhythm; the dialog must expose the complete original file.
- Every video must have a poster and must remain unloaded until opened.

PERFORMANCE BUDGET
- Keep initial visual payload small by using WebP previews.
- Lazy-load below-fold previews.
- Keep original 100-file archive available without loading 100 originals at startup.
- Avoid third-party runtimes, analytics, external fonts, and per-frame allocations.
- Use passive scroll listeners and one requestAnimationFrame scroll update.
- Pause or remove nonessential animation for hidden, mobile, and reduced-motion states.

ACCESSIBILITY AND SECURITY
- Target WCAG 2.2 AA.
- Preserve semantic landmarks, one H1, logical H2 sequence, skip link, visible focus, keyboard operation, and at least 44px touch targets.
- Use meaningful Chinese alt text derived from trusted local metadata.
- Never insert external or user-provided strings with unsafe innerHTML.
- Keep external links protected with noopener noreferrer.
- Ensure core titles and narrative remain readable if JavaScript fails.

RESPONSIVE ART DIRECTION
- Validate 320, 390, 768, 1024, 1440, and 1920px widths plus mobile landscape.
- Recompose image scale, headline size, spacing, and navigation per device.
- Desktop exterior is cinematic horizontal travel; mobile exterior is touch-first snap browsing.
- Large asymmetric mosaics become deliberate one/two-column sequences on small screens.

VERIFICATION
1. Confirm manifest contains exactly 100 unique original paths: 28 exterior, 39 interior, 10 group, 23 archive.
2. Confirm every original, preview, and video poster exists.
3. Confirm each file appears in exactly one content chapter; cover previews are decorative exceptions.
4. Run JavaScript syntax checks and whitespace checks.
5. Verify navigation anchors, dialog controls, keyboard paths, reduced motion, and missing-data fallback.
6. Reject the release if all files are gathered in one place, any region is mixed with another, any original is missing, or videos preload before intent.

DELIVERABLE
Return a complete static GitHub Pages build: index.html, styles.css, script.js, media data, optimized previews, original assets, documentation, and a reversible archive of the previous local version. A concept mockup, hero-only result, or unfinished media dump is not acceptable.
```
