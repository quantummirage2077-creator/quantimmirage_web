// Site-wide configuration and interface strings for zh / en / tr.
// Keep this file dependency-free: it is imported by build.mjs only.

export const site = {
  baseUrl: "https://quantummiragelimited.com",
  wordmark: "QUANTUM MIRAGE",
  email: "hlh@quantummiragelimited.com",
  privacyEmail: "hlh@quantummiragelimited.com",
  founded: 2016,
  gamesPerPage: 6,
  locales: ["zh", "en", "tr"],
  social: [
    { label: "Discord", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Bluesky", href: "#" }
  ]
};

export const localeNames = { zh: "中文", en: "English", tr: "Türkçe" };
export const htmlLang = { zh: "zh-Hans", en: "en", tr: "tr" };

export const ui = {
  zh: {
    brandSub: "量子幻影",
    brandTagline: "Quantum Mirage",
    skip: "跳到主要内容",
    nav: { home: "首页", games: "作品", privacy: "隐私政策", terms: "使用条款" },
    navLabel: "主导航",
    menu: "菜单",
    langLabel: "语言",
    hero: {
      eyebrow: "独立工作室 · 上海 / 远程",
      title: "我们做",
      accent: "让人记住",
      tail: "的游戏。",
      lead:
        "十八款作品，三个平台，一支二十人的团队。我们相信手感、氛围和一句好台词，比任何营销预算都更能留住玩家。",
      cta1: "浏览作品",
      cta2: "关于工作室"
    },
    stats: [
      ["18", "已发行作品"],
      ["3", "覆盖平台"],
      ["12", "行业奖项"]
    ],
    featured: { kicker: "最新作品", cta: "查看作品" },
    studio: {
      kicker: "工作室",
      title: "小而稳，慢而准。",
      lead:
        "二十个人，三条产品线，一年最多两款作品。我们把预算放在打磨手感上，而不是发布会。",
      items: [
        {
          n: "01",
          h: "自研工具链",
          p: "我们维护自己的关卡与叙事编辑器，一个新点子能在一周内变成可玩原型。"
        },
        {
          n: "02",
          h: "一套管线，全平台",
          p: "PC、主机与移动共享同一套内容与本地化流程，发版节奏保持一致。"
        },
        {
          n: "03",
          h: "长期运营",
          p: "每款作品至少三年内容更新。我们卖的是长期陪伴，不是一次性买断。"
        }
      ],
      quote: { text: "先做好玩的那一分钟，再谈其余的一切。", who: "林砚 · 创意总监" }
    },
    ctaBand: {
      title: "有项目想聊？",
      lead: "发行、联合开发、美术外包——我们回信通常在两个工作日内。",
      button: "写信给我们"
    },
    games: {
      kicker: "作品目录",
      title: "全部作品",
      lead: "从 2016 年的首发作品到今年的新作，按发行时间倒序排列。",
      count: "共 {n} 款",
      meta: "共 {n} 款 · 第 {page} / {total} 页",
      prev: "上一页",
      next: "下一页",
      pageAria: "第 {n} 页",
      pagination: "分页"
    },
    footer: {
      site: "站点",
      studio: "工作室",
      contact: "联系",
      rights: "© 2026 Quantum Mirage. 保留所有权利。",
      note: "静态站点骨架 · 零依赖"
    },
    legal: { eyebrow: "法律条款", toc: "本页目录", updated: "最后更新", contact: "联系我们" },
    meta: {
      home: {
        title: "Quantum Mirage — 我们做让人记住的游戏",
        desc: "Quantum Mirage 是一家独立游戏工作室，目前发行《Buzlu Meyve Sebze Karoları》与《Kedi Kafesi Sim》两款作品。"
      },
      games: {
        title: "作品目录 — Quantum Mirage",
        desc: "Quantum Mirage 全部作品列表，按发行时间排列，含平台与类型信息。"
      },
      privacy: {
        title: "隐私政策 — Quantum Mirage",
        desc: "Quantum Mirage 如何使用、保留与保护您的个人信息，以及您享有的权利。"
      },
      terms: {
        title: "使用条款 — Quantum Mirage",
        desc: "访问本站与游玩 Quantum Mirage 作品时适用的使用条款。"
      }
    }
  },

  en: {
    brandSub: "Quantum Mirage Studio",
    brandTagline: "Quantum Mirage",
    skip: "Skip to content",
    nav: { home: "Home", games: "Games", privacy: "Privacy", terms: "Terms" },
    navLabel: "Main",
    menu: "Menu",
    langLabel: "Language",
    hero: {
      eyebrow: "Independent studio · Shanghai / remote",
      title: "We make games ",
      accent: "worth remembering.",
      tail: "",
      lead:
        "Eighteen games, three platforms, a team of twenty. We think feel, atmosphere and one well-written line keep players longer than any marketing budget.",
      cta1: "Browse the games",
      cta2: "About the studio"
    },
    stats: [
      ["18", "Games shipped"],
      ["3", "Platforms"],
      ["12", "Awards"]
    ],
    featured: { kicker: "Latest release", cta: "See the game" },
    studio: {
      kicker: "The studio",
      title: "Small on purpose. Slow on purpose.",
      lead:
        "Twenty people, three product lines, at most two releases a year. We spend the budget on feel, not on press events.",
      items: [
        {
          n: "01",
          h: "Our own toolchain",
          p: "We maintain the level and narrative editors our games ship with, so an idea becomes a playable prototype in a week."
        },
        {
          n: "02",
          h: "One pipeline, every platform",
          p: "PC, console and mobile share the same content and localisation pipeline, so releases stay in step."
        },
        {
          n: "03",
          h: "Long tails, on purpose",
          p: "Every title gets at least three years of updates. We sell company, not a one-off purchase."
        }
      ],
      quote: {
        text: "Get the first minute right; argue about the rest later.",
        who: "Lin Yan · Creative Director"
      }
    },
    ctaBand: {
      title: "Got something to build?",
      lead: "Publishing, co-development or art outsourcing — we usually reply within two business days.",
      button: "Say hello"
    },
    games: {
      kicker: "Catalogue",
      title: "All games",
      lead: "From our 2016 debut to this year’s release, newest first.",
      count: "{n} titles",
      meta: "{n} titles · page {page} of {total}",
      prev: "Previous",
      next: "Next",
      pageAria: "Page {n}",
      pagination: "Pagination"
    },
    footer: {
      site: "Site",
      studio: "Studio",
      contact: "Contact",
      rights: "© 2026 Quantum Mirage. All rights reserved.",
      note: "Static skeleton · zero dependencies"
    },
    legal: { eyebrow: "Legal", toc: "On this page", updated: "Last updated", contact: "Contact" },
    meta: {
      home: {
        title: "Quantum Mirage — games worth remembering",
        desc: "Quantum Mirage is an independent game studio. Two titles so far: Buzlu Meyve Sebze Karoları and Kedi Kafesi Sim."
      },
      games: {
        title: "Catalogue — Quantum Mirage",
        desc: "Every Quantum Mirage release, ordered by date, with platforms and genres."
      },
      privacy: {
        title: "Privacy Policy — Quantum Mirage",
        desc: "How Quantum Mirage collects, retains and protects personal data, and the rights you have."
      },
      terms: {
        title: "Terms of Use — Quantum Mirage",
        desc: "Terms that apply when you visit this site or play Quantum Mirage games."
      }
    }
  },

  tr: {
    brandSub: "Quantum Mirage Studio",
    brandTagline: "Quantum Mirage",
    skip: "İçeriğe geç",
    nav: { home: "Ana Sayfa", games: "Oyunlar", privacy: "Gizlilik", terms: "Koşullar" },
    navLabel: "Ana gezinme",
    menu: "Menü",
    langLabel: "Dil",
    hero: {
      eyebrow: "Bağımsız stüdyo · Şanghay / uzaktan",
      title: "",
      accent: "Akılda kalan",
      tail: " oyunlar yapıyoruz.",
      lead:
        "On sekiz oyun, üç platform, yirmi kişilik bir ekip. Hissin, atmosferin ve iyi yazılmış tek bir repliğin, oyuncuyu herhangi bir pazarlama bütçesinden daha uzun süre tuttuğuna inanıyoruz.",
      cta1: "Oyunlara göz at",
      cta2: "Stüdyo hakkında"
    },
    stats: [
      ["18", "Yayınlanan oyun"],
      ["3", "Platform"],
      ["12", "Ödül"]
    ],
    featured: { kicker: "Son çıkış", cta: "Oyunu gör" },
    studio: {
      kicker: "Stüdyo",
      title: "Bilinçli olarak küçük, bilinçli olarak yavaş.",
      lead:
        "Yirmi kişi, üç ürün hattı, yılda en fazla iki çıkış. Bütçeyi tanıtım etkinliklerine değil, hisse harcıyoruz.",
      items: [
        {
          n: "01",
          h: "Kendi araç zincirimiz",
          p: "Oyunlarımızla birlikte gelen bölüm ve anlatı editörlerini kendimiz geliştiriyoruz; bir fikir bir hafta içinde oynanabilir prototipe dönüşüyor."
        },
        {
          n: "02",
          h: "Tek hat, tüm platformlar",
          p: "PC, konsol ve mobil aynı içerik ve yerelleştirme hattını paylaşıyor; sürümler aynı ritimde çıkıyor."
        },
        {
          n: "03",
          h: "Bilinçli uzun ömür",
          p: "Her oyun en az üç yıl güncelleme alıyor. Tek seferlik bir satış değil, uzun bir birliktelik satıyoruz."
        }
      ],
      quote: {
        text: "Önce ilk dakikayı doğru yap; gerisini sonra tartışırız.",
        who: "Lin Yan · Yaratıcı Direktör"
      }
    },
    ctaBand: {
      title: "Birlikte bir şey yapalım mı?",
      lead: "Yayıncılık, ortak geliştirme veya sanat dış kaynağı — genellikle iki iş günü içinde yanıt veriyoruz.",
      button: "Merhaba deyin"
    },
    games: {
      kicker: "Katalog",
      title: "Tüm oyunlar",
      lead: "2016’daki ilk oyunumuzdan bu yılki çıkışa kadar, en yeniden eskiye.",
      count: "{n} oyun",
      meta: "{n} oyun · sayfa {page} / {total}",
      prev: "Önceki",
      next: "Sonraki",
      pageAria: "Sayfa {n}",
      pagination: "Sayfalama"
    },
    footer: {
      site: "Site",
      studio: "Stüdyo",
      contact: "İletişim",
      rights: "© 2026 Quantum Mirage. Tüm hakları saklıdır.",
      note: "Statik iskelet · sıfır bağımlılık"
    },
    legal: { eyebrow: "Hukuki", toc: "Bu sayfada", updated: "Son güncelleme", contact: "İletişim" },
    meta: {
      home: {
        title: "Quantum Mirage — akılda kalan oyunlar",
        desc: "Quantum Mirage bağımsız bir oyun stüdyosu. Şu anda iki oyunu var: Buzlu Meyve Sebze Karoları ve Kedi Kafesi Sim."
      },
      games: {
        title: "Katalog — Quantum Mirage",
        desc: "Quantum Mirage’in tüm oyunları, çıkış tarihine göre sıralı; platform ve tür bilgileriyle."
      },
      privacy: {
        title: "Gizlilik Politikası — Quantum Mirage",
        desc: "Quantum Mirage’in kişisel verileri nasıl topladığı, sakladığı ve koruduğu; sahip olduğunuz haklar."
      },
      terms: {
        title: "Kullanım Koşulları — Quantum Mirage",
        desc: "Bu siteyi ziyaret ederken ve Quantum Mirage oyunlarını oynarken geçerli kullanım koşulları."
      }
    }
  }
};
