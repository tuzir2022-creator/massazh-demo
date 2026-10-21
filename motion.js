/* Слой анимации для демо массажа: плавный скролл, заголовки по словам из-под маски, камни собираются в стопку, волна строк и шагов.
   Библиотеки лежат на сайте (vendor/). Нет библиотек, включено «уменьшить движение» или сбой - сайт остаётся обычным, весь текст виден. */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap || !window.ScrollTrigger) return;
  try {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("m-on");

    // плавный скролл на компьютере; на телефоне родной
    if (window.Lenis && matchMedia("(hover: hover) and (pointer: fine)").matches) {
      var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
          var id = a.getAttribute("href"); if (id.length < 2) return;
          var t = document.querySelector(id); if (!t) return;
          e.preventDefault(); lenis.scrollTo(t, { offset: -72 });
        });
      });
    }

    // заголовки: слова выезжают из-под маски (заголовок с вложенной вёрсткой не трогаем)
    document.querySelectorAll("main h1, main h2").forEach(function (h) {
      if (h.querySelector("*")) return;
      var text = h.textContent;
      h.setAttribute("aria-label", text);
      h.innerHTML = text.split(/( )/).map(function (w) {
        return w === " " || !w ? w : '<span class="m-w" aria-hidden="true"><i>' + w + "</i></span>";
      }).join("");
    });

    // первый экран
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero h1 .m-w > i", { yPercent: 110, duration: 1.1, stagger: 0.07 }, 0.1)
      .from(".hero .lead, .hero .cta, .hero .facts", { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.5)
      .from(".cairn span", { y: -70, opacity: 0, duration: 1, ease: "power3.out", stagger: { each: 0.22, from: "end" } }, 0.4);

    // остальные заголовки и вводные абзацы
    document.querySelectorAll("main section h2").forEach(function (h) {
      var w = h.querySelectorAll(".m-w > i"); if (!w.length) return;
      gsap.from(w, { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.05, scrollTrigger: { trigger: h, start: "top 88%" } });
    });
    gsap.utils.toArray(".sec-lead").forEach(function (el) {
      gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" } });
    });

    // группы: строки прайса, шаги, форма и контакты появляются волной
    [".rows", ".flow", ".self .narrow", ".about .narrow", ".contacts", "form"].forEach(function (sel) {
      gsap.utils.toArray(sel).forEach(function (box) {
        var kids = box.children; if (!kids.length) return;
        gsap.from(kids, { y: 32, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: box, start: "top 88%" } });
      });
    });
    gsap.from(".photo", { clipPath: "inset(100% 0% 0% 0% round 12px)", duration: 1.3, ease: "power4.inOut", scrollTrigger: { trigger: ".photo", start: "top 88%" } });

    addEventListener("load", function () { ScrollTrigger.refresh(); });
  } catch (err) {
    document.documentElement.classList.remove("m-on");
    if (window.gsap) gsap.set("main *", { clearProps: "all" });
    if (window.console) console.warn("motion.js:", err);
  }
})();
