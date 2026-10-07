/* ============================================================
   js/result.js
   结果页渲染 / SVG 人格公仔 / 分享卡
   ============================================================ */

(function(){
  'use strict';

  /* ============================================================
     10 套人格配色
     ============================================================ */
  var DOLL_PALETTES = {
    cream_rabbit:{
      skin:'#F8E4D2', hair:'#3A2618',
      top:'#F5EBDA', skirt:'#B99A7A',
      belt:'#5A3A28', buckle:'#C9A96E',
      shoe:'#4A3428', bag:'#8B5A3C'
    },
    moon_cat:{
      skin:'#F8E4D2', hair:'#1A1714',
      top:'#3A3A3A', skirt:'#1A1714',
      belt:'#0A0A0A', buckle:'#B89562',
      shoe:'#1A1714', bag:'#2A2825'
    },
    honey_fox:{
      skin:'#F8E4D2', hair:'#8B4A28',
      top:'#E8B48A', skirt:'#C68B5A',
      belt:'#7A4A28', buckle:'#C9A96E',
      shoe:'#6A3A20', bag:'#B86838'
    },
    gummy_bear:{
      skin:'#F8E4D2', hair:'#6A4A38',
      top:'#D4C4B0', skirt:'#B0A090',
      belt:'#6A5A4A', buckle:'#B89562',
      shoe:'#4A3A2A', bag:'#8A7A60'
    },
    butterfly:{
      skin:'#F8E4D2', hair:'#8B5A48',
      top:'#F4D5E0', skirt:'#E8B0C0',
      belt:'#8B5060', buckle:'#D9C09A',
      shoe:'#8B5060', bag:'#D4A0B0'
    },
    forest_deer:{
      skin:'#F8E4D2', hair:'#5A4030',
      top:'#C9D6C0', skirt:'#8B9A7A',
      belt:'#5A4A30', buckle:'#B89562',
      shoe:'#4A3A20', bag:'#7A8A60'
    },
    panda:{
      skin:'#F8E4D2', hair:'#1A1714',
      top:'#F0EAE1', skirt:'#C4C0B8',
      belt:'#6A5A50', buckle:'#B7AC9C',
      shoe:'#4A4844', bag:'#B7AC9C'
    },
    tiger:{
      skin:'#F8E4D2', hair:'#1A1714',
      top:'#1A1714', skirt:'#0A0A0A',
      belt:'#000000', buckle:'#D9C09A',
      shoe:'#1A1714', bag:'#2A241D'
    },
    dolphin:{
      skin:'#F8E4D2', hair:'#4A6A78',
      top:'#E8F0F4', skirt:'#B8D4E0',
      belt:'#5A7A88', buckle:'#C9A96E',
      shoe:'#3A5A68', bag:'#8BAFC0'
    },
    swan:{
      skin:'#F8E4D2', hair:'#8B6848',
      top:'#F8F4EC', skirt:'#E0D2BE',
      belt:'#8B7858', buckle:'#C9A96E',
      shoe:'#6A5848', bag:'#E0D2BE'
    }
  };

  /* ============================================================
     SVG 人格公仔
     ============================================================ */
  function makeDollSVG(personaId){
    var p = DOLL_PALETTES[personaId] || DOLL_PALETTES.cream_rabbit;
    var uid = 'd_' + personaId + '_' + Date.now();

    return '<svg viewBox="0 0 240 420" xmlns="http://www.w3.org/2000/svg" class="doll-svg" preserveAspectRatio="xMidYMid meet">' +
      '<defs>' +
        '<radialGradient id="' + uid + '_pod" cx="50%" cy="50%">' +
          '<stop offset="0%" stop-color="#FBF5EB"/>' +
          '<stop offset="100%" stop-color="#E8DBC4"/>' +
        '</radialGradient>' +
        '<linearGradient id="' + uid + '_skin" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="' + p.skin + '"/>' +
          '<stop offset="100%" stop-color="#E8CCB2"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + uid + '_top" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="' + p.top + '"/>' +
          '<stop offset="100%" stop-color="' + shade(p.top, -12) + '"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + uid + '_skirt" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="' + p.skirt + '"/>' +
          '<stop offset="100%" stop-color="' + shade(p.skirt, -18) + '"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + uid + '_hair" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="' + shade(p.hair, 18) + '"/>' +
          '<stop offset="100%" stop-color="' + p.hair + '"/>' +
        '</linearGradient>' +
      '</defs>' +

      /* 展示台 */
      '<ellipse cx="120" cy="395" rx="82" ry="8" fill="url(#' + uid + '_pod)"/>' +
      '<ellipse cx="120" cy="390" rx="82" ry="6" fill="#F4EADC" stroke="#D8C8A8" stroke-width="0.8"/>' +
      '<ellipse cx="120" cy="390" rx="82" ry="6" fill="none" stroke="#C9A96E" stroke-width="0.4" opacity="0.5"/>' +

      /* 腿 */
      '<path d="M 106 322 Q 104 350 106 378 L 113 378 Q 111 350 113 322 Z" fill="url(#' + uid + '_skin)"/>' +
      '<path d="M 127 322 Q 129 350 127 378 L 134 378 Q 132 350 134 322 Z" fill="url(#' + uid + '_skin)"/>' +

      /* 鞋 */
      '<ellipse cx="110" cy="382" rx="13" ry="5.5" fill="' + p.shoe + '"/>' +
      '<ellipse cx="130" cy="382" rx="13" ry="5.5" fill="' + p.shoe + '"/>' +
      '<ellipse cx="110" cy="380" rx="13" ry="4" fill="' + shade(p.shoe, 10) + '"/>' +
      '<ellipse cx="130" cy="380" rx="13" ry="4" fill="' + shade(p.shoe, 10) + '"/>' +
      '<line x1="101" y1="377" x2="119" y2="377" stroke="' + shade(p.shoe, -20) + '" stroke-width="1.2"/>' +
      '<line x1="121" y1="377" x2="139" y2="377" stroke="' + shade(p.shoe, -20) + '" stroke-width="1.2"/>' +
      '<circle cx="110" cy="377" r="1.2" fill="' + p.buckle + '"/>' +
      '<circle cx="130" cy="377" r="1.2" fill="' + p.buckle + '"/>' +

      /* 裙子（A 字） */
      '<path d="M 88 218 Q 82 268 76 330 Q 82 334 96 336 Q 120 338 144 336 Q 158 334 164 330 Q 158 268 152 218 Z" fill="url(#' + uid + '_skirt)"/>' +
      '<path d="M 88 218 Q 86 240 84 260" stroke="' + shade(p.skirt, -25) + '" stroke-width="0.6" fill="none" opacity="0.4"/>' +
      '<path d="M 96 218 Q 94 250 92 280" stroke="' + shade(p.skirt, -25) + '" stroke-width="0.6" fill="none" opacity="0.3"/>' +
      '<path d="M 152 218 Q 154 240 156 260" stroke="' + shade(p.skirt, -25) + '" stroke-width="0.6" fill="none" opacity="0.4"/>' +
      '<path d="M 144 218 Q 146 250 148 280" stroke="' + shade(p.skirt, -25) + '" stroke-width="0.6" fill="none" opacity="0.3"/>' +

      /* 腰带 */
      '<rect x="86" y="214" width="68" height="5.5" rx="1" fill="' + p.belt + '"/>' +
      '<rect x="118" y="214.5" width="4" height="4.5" rx="0.6" fill="' + p.buckle + '"/>' +

      /* 上衣 */
      '<path d="M 90 148 Q 82 178 86 218 L 154 218 Q 158 178 150 148 Z" fill="url(#' + uid + '_top)"/>' +

      /* 袖子 */
      '<path d="M 90 152 Q 80 178 84 204 L 92 204 Q 90 178 98 156 Z" fill="url(#' + uid + '_top)"/>' +
      '<path d="M 150 152 Q 160 178 156 204 L 148 204 Q 150 178 142 156 Z" fill="url(#' + uid + '_top)"/>' +

      /* 手臂 */
      '<path d="M 88 200 Q 84 224 88 248" stroke="url(#' + uid + '_skin)" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M 152 200 Q 156 224 152 248" stroke="url(#' + uid + '_skin)" stroke-width="7" fill="none" stroke-linecap="round"/>' +

      /* 手 */
      '<ellipse cx="88" cy="250" rx="4.5" ry="6" fill="url(#' + uid + '_skin)"/>' +
      '<ellipse cx="152" cy="250" rx="4.5" ry="6" fill="url(#' + uid + '_skin)"/>' +

      /* 小方包 */
      '<rect x="154" y="228" width="24" height="21" rx="4" fill="' + p.bag + '"/>' +
      '<rect x="154" y="228" width="24" height="6" rx="3" fill="' + shade(p.bag, 12) + '"/>' +
      '<path d="M 160 228 Q 166 220 172 228" stroke="' + p.bag + '" stroke-width="2.5" fill="none"/>' +
      '<circle cx="166" cy="240" r="1.6" fill="' + p.buckle + '"/>' +

      /* 脖子 */
      '<rect x="113" y="128" width="14" height="26" fill="url(#' + uid + '_skin)"/>' +

      /* 头部 */
      '<ellipse cx="120" cy="88" rx="42" ry="46" fill="url(#' + uid + '_skin)"/>' +

      /* 头发后盖 */
      '<path d="M 78 78 Q 72 28 120 26 Q 168 28 162 78 Q 164 92 156 96 Q 162 46 120 42 Q 78 46 84 96 Q 76 92 78 78 Z" fill="url(#' + uid + '_hair)"/>' +

      /* 刘海 */
      '<path d="M 84 74 Q 94 54 118 58 Q 110 70 106 90 Q 90 90 84 74 Z" fill="url(#' + uid + '_hair)"/>' +
      '<path d="M 156 74 Q 146 54 122 58 Q 130 70 134 90 Q 150 90 156 74 Z" fill="url(#' + uid + '_hair)"/>' +

      /* 鬓角碎发 */
      '<path d="M 78 88 Q 74 108 76 126 Q 80 128 82 126 Q 80 108 82 90 Z" fill="url(#' + uid + '_hair)"/>' +
      '<path d="M 162 88 Q 166 108 164 126 Q 160 128 158 126 Q 160 108 158 90 Z" fill="url(#' + uid + '_hair)"/>' +

      /* 低马尾 */
      '<path d="M 154 84 Q 168 108 165 142 Q 162 172 158 192 Q 154 195 152 192 Q 156 172 158 142 Q 158 112 148 90 Z" fill="url(#' + uid + '_hair)"/>' +
      '<path d="M 152 192 Q 148 200 150 206 Q 155 208 158 204 Q 159 198 156 192 Z" fill="url(#' + uid + '_hair)"/>' +

      /* 眼睛 */
      '<ellipse cx="102" cy="90" rx="7" ry="8" fill="#2A1A10"/>' +
      '<ellipse cx="138" cy="90" rx="7" ry="8" fill="#2A1A10"/>' +
      '<circle cx="104" cy="88" r="2.4" fill="#FFFFFF"/>' +
      '<circle cx="140" cy="88" r="2.4" fill="#FFFFFF"/>' +
      '<circle cx="100" cy="93" r="0.9" fill="#FFFFFF" opacity="0.7"/>' +
      '<circle cx="136" cy="93" r="0.9" fill="#FFFFFF" opacity="0.7"/>' +

      /* 眉毛 */
      '<path d="M 93 76 Q 102 71 110 76" stroke="#3A2618" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M 130 76 Q 138 71 147 76" stroke="#3A2618" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +

      /* 腮红 */
      '<ellipse cx="88" cy="104" rx="9" ry="5" fill="#E8B8A8" opacity="0.4"/>' +
      '<ellipse cx="152" cy="104" rx="9" ry="5" fill="#E8B8A8" opacity="0.4"/>' +

      /* 鼻子 */
      '<circle cx="120" cy="104" r="1.3" fill="#D8B8A0" opacity="0.55"/>' +

      /* 嘴巴 */
      '<path d="M 114 115 Q 120 120 126 115" stroke="#B87060" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +

      /* 珍珠耳钉 */
      '<circle cx="80" cy="99" r="2.4" fill="#F5EFE2" stroke="#D8C8B0" stroke-width="0.4"/>' +
      '<circle cx="160" cy="99" r="2.4" fill="#F5EFE2" stroke="#D8C8B0" stroke-width="0.4"/>' +

      /* AI 徽章 */
      '<g transform="translate(102, 172)">' +
        '<path d="M 0 -4.5 L 1.1 -1.1 L 4.5 0 L 1.1 1.1 L 0 4.5 L -1.1 1.1 L -4.5 0 L -1.1 -1.1 Z" fill="#C9A96E"/>' +
      '</g>' +
    '</svg>';
  }

  function shade(hex, percent){
    var h = hex.replace('#', '');
    var r = parseInt(h.substring(0, 2), 16);
    var g = parseInt(h.substring(2, 4), 16);
    var b = parseInt(h.substring(4, 6), 16);
    r = Math.max(0, Math.min(255, r + Math.round(255 * percent / 100)));
    g = Math.max(0, Math.min(255, g + Math.round(255 * percent / 100)));
    b = Math.max(0, Math.min(255, b + Math.round(255 * percent / 100)));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* ============================================================
     工具
     ============================================================ */
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return { "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m];
    });
  }
  function isWeChat(){ return /MicroMessenger/i.test(navigator.userAgent || ""); }
  function isIOS(){ return /iPad|iPhone|iPod/.test(navigator.userAgent || "") && !window.MSStream; }

  /* ============================================================
     属性动画
     ============================================================ */
  function animateNumbers(){
    document.querySelectorAll("[data-count]").forEach(function(el){
      var target = Number(el.dataset.count);
      if(isNaN(target)) return;
      var dur = 900, start = performance.now();
      function tick(t){
        var p = Math.min(1, (t - start) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    requestAnimationFrame(function(){
      setTimeout(function(){
        document.querySelectorAll("[data-w]").forEach(function(el){
          el.style.width = el.dataset.w + "%";
        });
      }, 60);
    });
  }

  /* ============================================================
     主渲染
     ============================================================ */
  function render(r, gaps, products){
    var root = document.getElementById("resultMain");
    var lucky = window.Scoring.calcDailyLucky(r);
    var tier = window.Scoring.calcTier(r);
    var formula = window.Scoring.buildFormula(r);
    var cp = window.Scoring.calcCP(r);
    var wardrobe = window.Scoring.calcWardrobeProfile(r.tags);
    var mbtiInfo = window.MBTI_TYPES_INFO[r.mbti] || { name:"风格观察者", keys:["理性","克制","审美"] };

    var attrHtml = Object.keys(r.attrs).map(function(k){
      return '<div class="attr-row"><span class="label">' + k + '</span>' +
        '<div class="attr-track"><i class="attr-fill" data-w="' + r.attrs[k] + '"></i></div>' +
        '<span class="attr-num" data-count="' + r.attrs[k] + '">0</span></div>';
    }).join("");

    var rankHtml = r.ranking.map(function(row, i){
      return '<div class="rank-row' + (i === 0 ? ' top' : '') + '">' +
        '<span class="rank-no">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<span class="rank-emoji">' + row.persona.emoji + '</span>' +
        '<span class="rank-name">' + esc(row.persona.name) + '</span>' +
        '<span class="rank-score">' + row.score + '</span></div>';
    }).join("");

    var wardrobeHtml = wardrobe.map(function(w){
      return '<div class="wardrobe-row"><span class="label">' + w.label + '</span>' +
        '<div class="wardrobe-bar"><i data-w="' + w.score + '"></i></div></div>';
    }).join("");

    var mainGap = gaps[0] || { gap: window.PERSONAS[r.mainId].closet, why:"" };
    var otherGaps = gaps.slice(1);

    var formulaHtml = '<div class="formula">' +
      formula.parts.map(function(p, i){
        return (i > 0 ? '<div class="formula-op">+</div>' : '') +
          '<div class="formula-item">' + esc(p) + '</div>';
      }).join("") +
      '<div class="formula-op">=</div>' +
      '<div class="formula-result">' + esc(formula.result) + '</div></div>';

    var productHtml = products.map(function(p, i){ return renderProduct(p, i); }).join("");

    root.innerHTML =
      '<div class="r-hero">' +
        '<div class="r-kicker">YOUR STYLE DNA</div>' +
        '<div class="r-emoji">' + r.main.emoji + '</div>' +
        '<h1 class="r-name">' + esc(r.main.name) + '</h1>' +
        '<p class="r-keywords">' + (r.main.keywords || []).join(" × ") + '</p>' +
        '<div class="r-rarity"><span class="dot"></span>' + (r.main.rarity || "SSR") + ' · ' + (r.main.rarityText || "你的专属风格") + '</div>' +
        '<p class="r-quote">' + esc(r.main.tagline || r.main.desc || "") + '</p>' +
      '</div>' +

      '<div class="character-stage-wrap">' +
        '<div class="character-kicker">YOUR STYLE FIGURE</div>' +
        '<div class="character-stage doll-stage">' +
          makeDollSVG(r.mainId) +
        '</div>' +
        '<div class="character-hint">这是我的穿搭人格公仔</div>' +
      '</div>' +

      '<div class="r-section">' +
        '<div class="r-card"><div class="r-card-title">属性面板 <span class="cn">人格属性</span></div><div class="attr-list">' + attrHtml + '</div></div>' +
        '<div class="r-card"><div class="r-card-title">人格排行榜 <span class="cn">你的 TOP 5</span></div><div class="rank-list">' + rankHtml + '</div></div>' +
        '<div class="mbti-card">' +
          '<div class="mbti-kicker">STYLE MBTI</div>' +
          '<div class="mbti-code">' + r.mbti + '</div>' +
          '<div class="mbti-name">' + esc(mbtiInfo.name) + '</div>' +
          '<div class="mbti-keys">' + mbtiInfo.keys.map(function(k){ return '<span class="mbti-key">' + esc(k) + '</span>'; }).join("") + '</div>' +
          '<div class="mbti-note">娱乐性质的穿搭 MBTI，仅用于风格参考。</div>' +
        '</div>' +
        '<div class="hidden-card">' +
          '<div class="hidden-kicker">HIDDEN PERSONA</div>' +
          '<div class="hidden-head"><span class="hidden-emoji">' + r.hidden.emoji + '</span><div class="hidden-name">' + esc(r.hidden.name) + '</div></div>' +
          '<p class="hidden-desc">' + esc(r.hidden.tagline || r.hidden.desc || "") + '</p>' +
          '<div class="hidden-split">' +
            '<div class="hidden-bar"><span class="em">' + r.main.emoji + '</span><div class="track"><i class="fill" data-w="70"></i></div><span class="pct">70%</span></div>' +
            '<div class="hidden-bar"><span class="em">' + r.hidden.emoji + '</span><div class="track"><i class="fill" data-w="30"></i></div><span class="pct">30%</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="r-card">' +
          '<div class="r-card-title">衣柜诊断 <span class="cn">你的衣橱画像</span></div>' +
          '<div class="wardrobe-list">' + wardrobeHtml + '</div>' +
          '<div class="wardrobe-alert"><div class="wardrobe-alert-icon">!</div>' +
            '<div class="wardrobe-alert-text"><b>你的衣柜可能缺：' + esc(mainGap.gap) + '</b>' +
            (otherGaps.length ? otherGaps.map(function(g){ return '<br>· ' + esc(g.gap); }).join("") : '') +
            '</div></div>' +
          '<div class="wardrobe-why"><p>' + esc(mainGap.why || "") + '</p></div>' +
        '</div>' +
        '<div class="r-card"><div class="r-card-title">穿搭公式 <span class="cn">你的高分搭配</span></div>' + formulaHtml + '</div>' +
        '<div class="r-card"><div class="r-card-title">今日幸运 <span class="cn">每日穿搭签</span></div>' +
          '<div class="lucky">' +
            '<div class="lucky-cell"><div class="lucky-label">幸运色</div><div class="lucky-value">' + esc(lucky.color) + '</div></div>' +
            '<div class="lucky-cell"><div class="lucky-label">幸运单品</div><div class="lucky-value">' + esc(lucky.item) + '</div></div>' +
            '<div class="lucky-cell"><div class="lucky-label">穿搭关键词</div><div class="lucky-value">' + esc(lucky.keyword) + '</div></div>' +
            '<div class="lucky-cell"><div class="lucky-label">今日风格分</div><div class="lucky-value">' + lucky.score + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="rank-badge"><div><div class="rank-badge-l">YOUR STYLE TIER</div><div class="rank-badge-v">' + esc(tier.name) + '</div></div><div class="rank-badge-r">' + esc(tier.tier) + '</div></div>' +
      '</div>' +

      '<div class="r-section"><div class="r-card-title" style="padding:26px 0 14px">为你挑了 3 件</div><div id="productList">' + productHtml + '</div></div>' +

      '<div class="share-wrap"><button class="share-cta" id="shareCta">' +
        '<div class="share-cta-kicker">SHARE YOUR STYLE</div>' +
        '<div class="share-cta-title">生成分享卡 · 发给朋友</div>' +
      '</button></div>' +

      '<div class="result-foot">' +
        '<button class="restart-btn" id="restartBtn">再测一次</button>' +
        '<p class="footnote">娱乐性穿搭人格测试，仅用于风格参考。</p>' +
      '</div>';

    var rb = document.getElementById("restartBtn");
    if(rb) rb.addEventListener("click", function(){ window.App.restart(); });
    var sc = document.getElementById("shareCta");
    if(sc) sc.addEventListener("click", function(){ openShareCard(r); });

    animateNumbers();
  }

  function renderProduct(p, i){
    var reasons = (p._reasons || []).map(function(x){ return '<div class="product-reason">' + esc(x) + '</div>'; }).join("");
    return '<div class="product">' +
      '<div class="product-media"><div class="ph-svg"><div class="ph-icon"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M26 12 L22 22 L18 52 Q18 54 20 54 L44 54 Q46 54 46 52 L42 22 L38 12 Z"/></svg></div></div>' +
        '<span class="product-index">0' + (i + 1) + '</span>' +
        '<span class="product-match">匹配 ' + (p._match || 85) + '%</span>' +
      '</div>' +
      '<div class="product-body">' +
        '<div class="product-name">' + esc(p.name) + '</div>' +
        '<div class="product-reasons">' + reasons + '</div>' +
        '<div class="product-foot">' +
          '<div class="product-price"><small>¥</small>' + p.price + '</div>' +
          '<button class="product-buy" data-url="' + esc(p.url || "#") + '">查看商品</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ============================================================
     分享（先简化：只复制文字，不做图）
     ============================================================ */
  function openShareCard(r){
    var mbtiInfo = window.MBTI_TYPES_INFO[r.mbti] || { name:"风格观察者" };
    var text = "我的穿搭人格：" + r.main.emoji + " " + r.main.name + "\n" +
      "MBTI：" + r.mbti + " · " + mbtiInfo.name + "\n" +
      "属性：温柔度 " + r.attrs.温柔度 + " / 氛围感 " + r.attrs.氛围感 + " / 甜美度 " + r.attrs.甜美度 + "\n" +
      "隐藏人格：" + r.hidden.emoji + " " + r.hidden.name + "\n" +
      "「" + (r.main.tagline || "") + "」\n\n" +
      "来 AI STYLE LAB 测测你的穿搭人格吧";
    if(navigator.share){
      navigator.share({ title:"我的穿搭人格", text: text }).catch(function(){});
    } else if(navigator.clipboard){
      navigator.clipboard.writeText(text).then(function(){ window.App.toast("已复制结果文字"); });
    } else {
      window.App.toast("请长按页面截图分享");
    }
  }

  function openCollection(){}

  window.Result = {
    render: render,
    openCollection: openCollection
  };
})();
