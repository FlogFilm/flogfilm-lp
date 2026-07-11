/* ============================================================
  Flog Film LP スクリプト
  1. ヘッダー：スクロールで背景に影をつける
  2. ハンバーガーメニューの開閉（スマホ用）
  3. ナビリンククリックでメニューを閉じる
  4. スクロールフェードイン（IntersectionObserver）
  5. お問い合わせフォームの簡易送信演出（バックエンド未実装）
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

  /* ---------- 5. お問い合わせフォーム（見た目のみ） ----------
    Netlify Forms 等と連携する際は、この送信処理を削除し、
    通常のフォーム送信（またはfetchでのPOST）に置き換えてください。
  ------------------------------------------------------------ */
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formNote.textContent = "送信ありがとうございます。内容を確認のうえ、担当者よりご連絡いたします。";
      contactForm.reset();
    });
  }
});
