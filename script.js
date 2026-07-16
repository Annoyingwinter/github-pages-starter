(() => {
  "use strict";

  const items = Array.isArray(window.MEDIA_ITEMS) ? window.MEDIA_ITEMS : [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const labels = {
    interior: "参访现场 / VISIT",
    group: "同学们 / PEOPLE",
    archive: "实践记录 / FIELD NOTES"
  };
  const visibleItems = items.filter((item) => item.category !== "exterior");
  const interiorItems = items.filter((item) => item.category === "interior");
  const groupItems = items.filter((item) => item.category === "group");
  const archiveItems = items.filter((item) => item.category === "archive");
  const interiorImages = interiorItems.filter((item) => item.type === "image");
  const interiorFeature = [4, 0, 12, 7, 17, 2, 19, 10].map((index) => interiorImages[index]).filter(Boolean);

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const pad = (value) => String(value).padStart(3, "0");
  const itemNumber = (item) => visibleItems.indexOf(item) + 1;
  let activeItems = visibleItems;
  let lightboxIndex = 0;
  let ticking = false;

  function createImage(item, eager = false) {
    const image = document.createElement("img");
    image.src = item.thumb || item.poster || item.src;
    image.alt = `${labels[item.category]}现场素材 ${pad(itemNumber(item))}`;
    image.decoding = "async";
    image.loading = eager ? "eager" : "lazy";
    image.width = item.width || 1200;
    image.height = item.height || 900;
    return image;
  }

  function mediaFigure(item, className, caption = true, source = items) {
    const figure = document.createElement("figure");
    figure.className = className;
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `打开 ${labels[item.category]} 素材 ${pad(itemNumber(item))}`);
    figure.dataset.index = String(items.indexOf(item));
    figure.append(createImage(item));

    if (item.type === "video") {
      const badge = document.createElement("span");
      badge.className = "play-badge";
      badge.textContent = "▶";
      badge.setAttribute("aria-hidden", "true");
      figure.append(badge);
    }

    if (caption) {
      const figcaption = document.createElement("figcaption");
      const name = document.createElement("span");
      const type = document.createElement("span");
      name.textContent = `F.${pad(itemNumber(item))}`;
      type.textContent = item.type === "video" ? "MOTION" : labels[item.category].split(" / ")[0];
      figcaption.append(name, type);
      figure.append(figcaption);
    }

    const open = () => openLightbox(items.indexOf(item), source);
    figure.addEventListener("click", open);
    figure.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
    return figure;
  }

  function buildFeatures() {
    const inside = $("[data-feature='interior']");
    const people = $("[data-feature='people']");
    if (inside) {
      interiorFeature.forEach((item) => inside.append(mediaFigure(item, "feature-card", true, interiorItems)));
    }
    if (people) {
      groupItems.forEach((item) => people.append(mediaFigure(item, "people-card", true, groupItems)));
    }
  }

  function regionClass(item, index) {
    if (index % 11 === 0 || (item.width / item.height > 1.55 && index % 3 === 0)) return "is-wide";
    if (item.height > item.width * 1.2 || index % 13 === 0) return "is-tall";
    if (index % 7 === 0) return "is-small";
    return "";
  }

  function buildRegionGrids() {
    const sources = {
      interior: interiorItems.filter((item) => !interiorFeature.includes(item)),
      archive: archiveItems
    };
    $$('[data-region-grid]').forEach((grid) => {
      const category = grid.dataset.regionGrid;
      const source = sources[category] || [];
      const completeChapter = category === "interior" ? interiorItems : archiveItems;
      source.forEach((item, index) => {
        grid.append(mediaFigure(item, `region-card ${regionClass(item, index)}`.trim(), true, completeChapter));
      });
    });
  }

  function openLightbox(sourceIndex, source = items) {
    const item = items[sourceIndex];
    if (!item) return;
    activeItems = source;
    lightboxIndex = Math.max(0, activeItems.indexOf(item));
    renderLightbox();
    const dialog = $(".lightbox");
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("is-locked");
  }

  function renderLightbox() {
    const item = activeItems[lightboxIndex];
    const stage = $(".lightbox__stage");
    if (!item || !stage) return;
    stage.replaceChildren();
    let media;
    if (item.type === "video") {
      media = document.createElement("video");
      media.src = item.src;
      media.poster = item.poster || item.thumb;
      media.controls = true;
      media.autoplay = !reduceMotion;
      media.playsInline = true;
    } else {
      media = document.createElement("img");
      media.src = item.src;
      media.alt = `${labels[item.category]}现场原始素材 ${pad(itemNumber(item))}`;
      media.decoding = "async";
    }
    stage.append(media);
    $(".lightbox__meta > p").textContent = `${labels[item.category]} · ${item.type === "video" ? "VIDEO" : "IMAGE"}`;
    $(".lightbox__index").textContent = `${pad(lightboxIndex + 1)} / ${pad(activeItems.length)}`;
  }

  function moveLightbox(direction) {
    if (!activeItems.length) return;
    lightboxIndex = (lightboxIndex + direction + activeItems.length) % activeItems.length;
    renderLightbox();
  }

  function closeLightbox() {
    const dialog = $(".lightbox");
    if (dialog.open) dialog.close();
    $(".lightbox__stage").replaceChildren();
    document.body.classList.remove("is-locked");
  }

  function setupLightbox() {
    const dialog = $(".lightbox");
    $(".lightbox__close").addEventListener("click", closeLightbox);
    $("[data-lightbox='prev']").addEventListener("click", () => moveLightbox(-1));
    $("[data-lightbox='next']").addEventListener("click", () => moveLightbox(1));
    dialog.addEventListener("close", () => {
      $(".lightbox__stage").replaceChildren();
      document.body.classList.remove("is-locked");
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (!dialog.open) return;
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    });
  }

  function updateScroll() {
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    $(".scroll-meter i").style.transform = `scaleY(${y / max})`;

    if (!reduceMotion) {
      const heroProgress = Math.min(1, y / Math.max(1, window.innerHeight));
      const frameA = $(".hero-frame--a");
      const frameB = $(".hero-frame--b");
      const frameC = $(".hero-frame--c");
      if (frameA) frameA.style.transform = `translate3d(0,${heroProgress * 9}vh,0) rotate(${2.2 - heroProgress * 4}deg) scale(${1 + heroProgress * .08})`;
      if (frameB) frameB.style.transform = `translate3d(0,${heroProgress * -12}vh,0) rotate(${-4 + heroProgress * 7}deg)`;
      if (frameC) frameC.style.transform = `translate3d(${heroProgress * -5}vw,${heroProgress * -6}vh,0) rotate(${7 - heroProgress * 8}deg)`;

    }
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScroll);
    }
  }

  function runBoot() {
    const boot = $(".boot");
    const count = $(".boot__count");
    if (!boot || !count) return;
    if (reduceMotion) {
      count.textContent = "072";
      boot.classList.add("is-done");
      return;
    }
    const start = performance.now();
    const duration = 850;
    function step(now) {
      const progress = Math.min(1, (now - start) / duration);
      count.textContent = pad(Math.round(progress * 72));
      if (progress < 1) requestAnimationFrame(step);
      else window.setTimeout(() => boot.classList.add("is-done"), 160);
    }
    requestAnimationFrame(step);
  }

  function init() {
    buildFeatures();
    buildRegionGrids();
    setupLightbox();
    runBoot();
    updateScroll();
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
  }

  init();
})();
