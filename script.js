/* ============================================================
  Flog Film LP スクリプト
  1. ヘッダー：スクロールで背景に影をつける
  2. ハンバーガーメニューの開閉（スマホ用）
  3. ナビリンククリックでメニューを閉じる
  4. スクロールフェードイン（IntersectionObserver）
  5. ギャラリースライダーの前へ・次へボタン（PC向け）
  6. お問い合わせフォームの件名を自動生成
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. ヘッダーのスクロール演出 ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 2. ハンバーガーメニュー ---------- */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mainNav = document.getElementById("mainNav");

  const closeMenu = () => {
    mainNav.classList.remove("is-open");
    hamburgerBtn.classList.remove("is-active");
    hamburgerBtn.setAttribute("aria-expanded", "false");
  };

  hamburgerBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    hamburgerBtn.classList.toggle("is-active", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  /* ---------- 3. ナビリンクをクリックしたらメニューを閉じる ---------- */
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- 4. スクロールフェードイン ---------- */
  // 主要セクション内の要素に fade-in クラスを付与して監視する
  const targets = document.querySelectorAll(
    ".section-title, .section-desc, .kicker, .service-card, .frame, .reason-item, .price-card, .about-photo, .about-text, .faq-item"
  );
  targets.forEach((el) => el.classList.add("fade-in"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  targets.forEach((el) => observer.observe(el));

  /* ---------- 5. ギャラリースライダーの前へ・次へボタン ----------
    スマホは指のフリック（ネイティブのタッチスクロール）でそのまま送れるため、
    ボタンはCSSでスマホ幅では非表示にしている（PCのマウス操作向け）。
    1回のクリックでちょうど1枚分（写真の幅＋gap）だけスクロールする。

    注意：scroll-snap-type: mandatory を付けたままJSでscrollBy/scrollLeftを
    操作すると、スナップ機能と競合してスクロールが無視されるブラウザがあるため、
    スクロール中だけ一時的にスナップを解除し、完了後に元に戻している。
  ------------------------------------------------------------ */
  const gallerySlider = document.querySelector(".contact-sheet");
  const prevBtn = document.querySelector(".gallery-arrow-prev");
  const nextBtn = document.querySelector(".gallery-arrow-next");

  if (gallerySlider && prevBtn && nextBtn) {
    let snapRestoreTimer = null;

    const scrollByOneFrame = (direction) => {
      const frame = gallerySlider.querySelector(".frame");
      if (!frame) return;
      const gap = parseFloat(getComputedStyle(gallerySlider).columnGap) || 0;
      const amount = frame.getBoundingClientRect().width + gap;

      gallerySlider.style.scrollSnapType = "none";
      gallerySlider.scrollBy({ left: direction * amount, behavior: "smooth" });

      clearTimeout(snapRestoreTimer);
      snapRestoreTimer = setTimeout(() => {
        gallerySlider.style.scrollSnapType = "";
      }, 500);
    };
    prevBtn.addEventListener("click", () => scrollByOneFrame(-1));
    nextBtn.addEventListener("click", () => scrollByOneFrame(1));
  }

  /* ---------- 6. お問い合わせフォームの件名を自動生成 ----------
    送信自体はNetlify Formsの通常フローに任せるため、ここではpreventDefaultせず、
    送信直前に隠しフィールド(#formSubject)へお名前を差し込むだけにする。
  ------------------------------------------------------------ */
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const formSubject = document.getElementById("formSubject");

  if (contactForm && nameInput && formSubject) {
    contactForm.addEventListener("submit", () => {
      const name = nameInput.value.trim();
      formSubject.value = name
        ? `【Flog Film】${name}様からお問い合わせ`
        : "【Flog Film】新しいお問い合わせ";
    });
  }
});
