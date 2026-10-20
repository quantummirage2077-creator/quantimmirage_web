/* Neon Anvil — progressive enhancement. Plain ES2017, no modules, no deps. */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");

  /* ---------------------------------------------------------- mobile nav */

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setNav(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setNav(false);
    });
  }

  /* ------------------------------------------------- language persistence */

  try {
    var current = document.querySelector(".lang__btn[aria-current='true']");
    if (current) {
      var currentLang = (current.getAttribute("lang") || "").slice(0, 2);
      if (currentLang) localStorage.setItem("na:lang", currentLang);
    }
  } catch (error) {
    /* storage unavailable (file:// in some browsers): ignore */
  }

  document.querySelectorAll("a[lang][hreflang]").forEach(function (link) {
    link.addEventListener("click", function () {
      var lang = (link.getAttribute("hreflang") || "").slice(0, 2);
      try {
        if (lang) localStorage.setItem("na:lang", lang);
      } catch (error) {
        /* private mode: preference simply is not remembered */
      }
    });
  });

  /* ------------------------------------------------------- header shading */

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------- reveal on scroll */

  var revealables = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (!("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------ legal toc spy */

  var tocLinks = document.querySelectorAll(".legal__toc a");
  var sections = document.querySelectorAll(".legal__section");

  if (tocLinks.length && sections.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (link) {
      map[link.getAttribute("href")] = link;
    });

    tocLinks[0].classList.add("is-current");

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tocLinks.forEach(function (link) {
            link.classList.remove("is-current");
          });
          var link = map["#" + entry.target.id];
          if (link) link.classList.add("is-current");
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }
})();
