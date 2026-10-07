/* ============================================================
   js/result.js
   结果页渲染 / 分享卡 / 图鉴 / 扭蛋 / 穿搭 CP
   ============================================================ */

(function(){
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  function esc(s){
    return String(s).replace(/[&<>"']/g, m=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  /* ---------- 属性数值动画 ---------- */
  function animateNumbers(){
    const nodes = document.querySelectorAll("[data-count]");
    nodes.forEach(el=>{
      const target = Number(el.dataset.count);
      if(isNaN(target)) return;
      const dur = 900;
      const start = performance.now();
      const from = 0;
      function tick(t){
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (target - from) * eased);
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });

    const bars = document.querySelectorAll("[data-w]");
    requestAnimationFrame(()=>{
      setTimeout(()=>{
        bars.forEach(el=>{
          el.style.width = el.dataset.w + "%";
        });
      }, 60);
    });
  }

  /* ---------- 主渲染 ---------- */
  function render(r, gaps, products){
    const root = document.getElementById("resultMain");
    const lucky = window.Scoring.calcDailyLucky(r);
    const tier = window.Scoring.calcTier(r);
    const formula = window.Scoring.buildFormula(r);
    const cp = window.Scoring.calcCP(r);
    const wardrobe = window.Scoring.calcWardrobeProfile(r.tags);

    const mbtiInfo = window.MBTI_TYPES_INFO[r.mbti] || { name:"风格观察者", keys:["理性","克制","审美"] };

    /* 属性条 */
    const attrHtml = Object.entries(r.attrs).map(([k, v])=>`
      <div class="attr-row">
        <span class="label">${k}</span>
        <div class="attr-track"><i class="attr-fill" data-w="${v}"></i></div>
        <span class="attr-num" data-count="${v}">0</span>
      </div>
    `).join("");

    /* TOP5 */
    const rankHtml = r.ranking.map((row, i)=>{
      const isTop = i === 0;
      return `
        <div class="rank-row${isTop ? " top" : ""}">
          <span class="rank-no">${String(i + 1).padStart(2, "0")}</span>
          <span class="rank-emoji">${row.persona.emoji}</span>
          <span class="rank-name">${esc(row.persona.name)}</span>
          <span class="rank-score">${row.score}</span>
        </div>
      `;
    }).join("");

    /* 衣柜分布 */
    const wardrobeHtml = wardrobe.map(w=>`
      <div class="wardrobe-row">
        <span class="label">${w.label}</span>
        <div class="wardrobe-bar"><i data-w="${w.score}"></i></div>
      </div>
    `).join("");

    /* 主缺口 */
    const mainGap = gaps[0] || { gap: window.PERSONAS[r.mainId].closet, why:"" };
    const otherGaps = gaps.slice(1);

    /* 公式 */
    const formulaHtml = `
      <div class="formula">
        ${formula.parts.map((p, i)=>`
          ${i > 0 ? `<div class="formula-op">+</div>` : ""}
          <div class="formula-item">${esc(p)}</div>
        `).join("")}
        <div class="formula-op">=</div>
        <div class="formula-result">${esc(formula.result)}</div>
      </div>
      ${formula.extra.length ? `
        <div class="wardrobe-why" style="margin-top:18px">
          ${formula.extra.map(x => `<p>· <span class="hl">${esc(x)}</span></p>`).join("")}
        </div>
      ` : ""}
    `;

    /* 商品 */
    const productHtml = products.map((p, i)=> renderProduct(p, i)).join("");

    /* 组装 HTML */
    root.innerHTML = `
      <!-- Hero -->
      <div class="r-hero">
        <div class="r-kicker">YOUR STYLE DNA</div>
        <div class="r-emoji">${r.main.emoji}</div>
        <h1 class="r-name">${esc(r.main.name)}</h1>
        <p class="r-keywords">${r.main.keywords.join(" × ")}</p>
        <div class="r-rarity"><span class="dot"></span>${r.main.rarity} · ${r.main.rarityText}</div>
        <p class="r-quote">${esc(r.main.tagline)}</p>
      </div>

      <div class="r-section">

        <!-- 属性面板 -->
        <div class="r-card">
          <div class="r-card-title">属性面板 <span class="cn">人格属性</span></div>
          <div class="attr-list">${attrHtml}</div>
        </div>

        <!-- TOP5 -->
        <div class="r-card">
          <div class="r-card-title">人格排行榜 <span class="cn">你的 TOP 5</span></div>
          <div class="rank-list">${rankHtml}</div>
        </div>

        <!-- MBTI -->
        <div class="mbti-card">
          <div class="mbti-kicker">STYLE MBTI</div>
          <div class="mbti-code">${r.mbti}</div>
          <div class="mbti-name">${esc(mbtiInfo.name)}</div>
          <div class="mbti-keys">
            ${mbtiInfo.keys.map(k=>`<span class="mbti-key">${esc(k)}</span>`).join("")}
          </div>
          <div class="mbti-note">娱乐性质的穿搭 MBTI，仅用于风格参考。最终人格中穿搭占 70%、MBTI 占 30%。</div>
        </div>

        <!-- 隐藏人格 -->
        <div class="hidden-card">
          <div class="hidden-kicker">HIDDEN PERSONA</div>
          <div class="hidden-head">
            <span class="hidden-emoji">${r.hidden.emoji}</span>
            <div class="hidden-name">${esc(r.hidden.name)}</div>
          </div>
          <p class="hidden-desc">${esc(r.hidden.tagline)}</p>
          <div class="hidden-split">
            <div class="hidden-bar">
              <span class="em">${r.main.emoji}</span>
              <div class="track"><i class="fill" data-w="70"></i></div>
              <span class="pct">70%</span>
            </div>
            <div class="hidden-bar">
              <span class="em">${r.hidden.emoji}</span>
              <div class="track"><i class="fill" data-w="30"></i></div>
              <span class="pct">30%</span>
            </div>
          </div>
        </div>

        <!-- 衣柜诊断 -->
        <div class="r-card">
          <div class="r-card-title">衣柜诊断 <span class="cn">你的衣橱画像</span></div>

          <div class="wardrobe-list">${wardrobeHtml}</div>

          <div class="wardrobe-alert">
            <div class="wardrobe-alert-icon">!</div>
            <div class="wardrobe-alert-text">
              <b>你的衣柜可能缺：${esc(mainGap.gap)}</b>
              ${otherGaps.length ? otherGaps.map(g=>`· ${esc(g.gap)}`).join("<br>") : ""}
            </div>
          </div>

          <div class="wardrobe-why">
            <p>${esc(mainGap.why || window.PERSONAS[r.mainId].closet)}</p>
            ${otherGaps.length ? otherGaps.map(g => `
              <p style="margin-top:12px">· <span class="hl">${esc(g.gap)}</span><br>${esc(g.why)}</p>
            `).join("") : ""}
          </div>
        </div>

        <!-- 穿搭公式 -->
        <div class="r-card">
          <div class="r-card-title">穿搭公式 <span class="cn">你的高分搭配</span></div>
          ${formulaHtml}
        </div>

        <!-- 幸运穿搭 -->
        <div class="r-card">
          <div class="r-card-title">今日幸运 <span class="cn">每日穿搭签</span></div>
          <div class="lucky">
            <div class="lucky-cell">
              <div class="lucky-label">幸运色</div>
              <div class="lucky-value">${esc(lucky.color)}</div>
            </div>
            <div class="lucky-cell">
              <div class="lucky-label">幸运单品</div>
              <div class="lucky-value">${esc(lucky.item)}</div>
            </div>
            <div class="lucky-cell">
              <div class="lucky-label">穿搭关键词</div>
              <div class="lucky-value">${esc(lucky.keyword)}</div>
            </div>
            <div class="lucky-cell">
              <div class="lucky-label">今日风格分</div>
              <div class="lucky-value">${lucky.score}</div>
            </div>
          </div>
        </div>

        <!-- 穿搭段位 -->
        <div class="rank-badge">
          <div>
            <div class="rank-badge-l">YOUR STYLE TIER</div>
            <div class="rank-badge-v">${esc(tier.name)}</div>
          </div>
          <div class="rank-badge-r">${esc(tier.tier)}</div>
        </div>

        <!-- 穿搭 CP -->
        <div class="r-card" style="margin-top:12px">
          <div class="r-card-title">穿搭 CP <span class="cn">你的风格搭档</span></div>
          <div class="cp-list">
            <div class="cp-row">
              <span class="cp-emoji">${cp.best.emoji}</span>
              <div>
                <div class="cp-role">最佳搭档</div>
                <div class="cp-persona">${esc(cp.best.name)}</div>
              </div>
            </div>
            <div class="cp-row">
              <span class="cp-emoji">${cp.pair.emoji}</span>
              <div>
                <div class="cp-role">最互补</div>
                <div class="cp-persona">${esc(cp.pair.name)}</div>
              </div>
            </div>
            <div class="cp-row">
              <span class="cp-emoji">${cp.overlap.emoji}</span>
              <div>
                <div class="cp-role">最容易撞风格</div>
                <div class="cp-persona">${esc(cp.overlap.name)}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- 商品 -->
      <div class="r-section">
        <div class="r-card-title" style="padding:26px 0 14px">为你挑了 3 件 <span class="cn">所以，你真正适合的是</span></div>
        <div id="productList">${productHtml}</div>
      </div>

      <!-- 扭蛋机 -->
      <div class="r-section">
        <div class="r-card">
          <div class="r-card-title">穿搭扭蛋 <span class="cn">抽一件今天适合你的</span></div>
          <div class="gacha">
            <button class="gacha-btn" id="gachaBtn">🎰 抽一件今天适合我的衣服</button>
            <div id="gachaResult"></div>
          </div>
        </div>
      </div>

      <!-- 分享卡 -->
      <div class="share-wrap">
        <button class="share-cta" id="shareCta">
          <div class="share-cta-kicker">SHARE YOUR STYLE</div>
          <div class="share-cta-title">生成分享卡 · 发给朋友</div>
        </button>
      </div>

      <!-- 底部 -->
      <div class="result-foot">
        <button class="restart-btn" id="restartBtn">再测一次</button>
        <p class="footnote">
          娱乐性穿搭人格测试，仅用于风格参考。<br>
          AI STYLE LAB · 你的穿搭风格实验室
        </p>
      </div>
    `;

    /* 绑定 */
    bindResultEvents(r, products);
    animateNumbers();
  }

  /* ---------- 商品卡 ---------- */
  function renderProduct(p, i){
    const phText = (p.name || "单品").slice(0, 2);
    const reasons = (p._reasons || []).map(x => `<div class="product-reason">${esc(x)}</div>`).join("");

    // 图片存在则使用，否则占位
    const media = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.style.display='none';this.parentNode.querySelector('.ph').style.display='block'">
         <div class="ph" style="display:none">${esc(phText)}</div>`
      : `<div class="ph">${esc(phText)}</div>`;

    return `
      <div class="product">
        <div class="product-media">
          ${media}
          <span class="product-index">0${i + 1}</span>
          <span class="product-match">匹配 ${p._match || 85}%</span>
        </div>
        <div class="product-body">
          <div class="product-name">${esc(p.name)}</div>
          <div class="product-reasons">${reasons}</div>
          <div class="product-foot">
            <div class="product-price"><small>¥</small>${p.price}</div>
            <button class="product-buy" data-url="${esc(p.url || "#")}" data-id="${esc(p.id)}">查看商品</button>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- 事件绑定 ---------- */
  function bindResultEvents(r, products){
    /* 商品按钮 */
    document.querySelectorAll(".product-buy").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const url = btn.dataset.url;
        if(url && url !== "#"){
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          window.App.toast("演示商品暂未设置购买链接");
        }
      });
    });

    /* 扭蛋机 */
    const gachaBtn = document.getElementById("gachaBtn");
    gachaBtn && gachaBtn.addEventListener("click", ()=>{
      const wrap = document.getElementById("gachaResult");
      wrap.innerHTML = `<div class="gacha-result"><div class="gacha-kicker">DRAWING...</div><div class="gacha-name">正在抽取...</div></div>`;
      setTimeout(()=>{
        // 从推荐商品中随机
        const pool = products.length ? products : window.DEFAULT_PRODUCTS;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        wrap.innerHTML = `
          <div class="gacha-result">
            <div class="gacha-kicker">YOUR LUCKY ITEM</div>
            <div class="gacha-name">${esc(pick.name)}</div>
            <div class="gacha-price">¥${pick.price}</div>
            <a class="gacha-buy" href="${esc(pick.url || "#")}" target="_blank" rel="noopener">查看商品</a>
          </div>
        `;
      }, 800);
    });

    /* 分享 */
    const shareCta = document.getElementById("shareCta");
    shareCta && shareCta.addEventListener("click", ()=>{
      openShareCard(r);
    });

    /* 重新测试 */
    const restartBtn = document.getElementById("restartBtn");
    restartBtn && restartBtn.addEventListener("click", ()=>{
      window.App.restart();
    });
  }

  /* ---------- 分享卡 ---------- */
  function openShareCard(r){
    const modal = document.getElementById("shareModal");
    const wrap = document.getElementById("shareCardWrap");

    const mbtiInfo = window.MBTI_TYPES_INFO[r.mbti] || { name:"风格观察者" };

    wrap.innerHTML = `
      <div class="share-card">
        <div class="share-inner">
          <div class="share-brand">AI STYLE LAB · STYLE DNA</div>
          <div class="share-emoji">${r.main.emoji}</div>
          <div class="share-name">${esc(r.main.name)}</div>
          <div class="share-mbti">${r.mbti} · ${esc(mbtiInfo.name)}</div>

          <div class="share-attrs">
            <div class="share-attr"><b>${r.attrs.温柔度}</b><span>温柔度</span></div>
            <div class="share-attr"><b>${r.attrs.氛围感}</b><span>氛围感</span></div>
            <div class="share-attr"><b>${r.attrs.甜美度}</b><span>甜美度</span></div>
          </div>

          <div class="share-hidden">
            <div class="share-hidden-label">HIDDEN PERSONA</div>
            <div class="share-hidden-name">${r.hidden.emoji} ${esc(r.hidden.name)}</div>
          </div>

          <div class="share-quote">“${esc(r.main.tagline)}”</div>

          <div class="share-tags">#穿搭人格 #${esc(r.main.name)} #我的穿搭风格</div>
        </div>
      </div>
    `;

    modal.classList.add("open");

    /* 关闭按钮 */
    modal.querySelectorAll("[data-close]").forEach(el=>{
      el.onclick = ()=> modal.classList.remove("open");
    });

    /* 分享按钮 */
    const nativeBtn = document.getElementById("shareNativeBtn");
    const textBtn = document.getElementById("shareTextBtn");

    const text = buildShareText(r);

    if(navigator.share){
      nativeBtn.style.display = "block";
      nativeBtn.onclick = async ()=>{
        try{
          await navigator.share({
            title: "我的穿搭人格 · " + r.main.name,
            text
          });
        }catch(e){}
      };
    } else {
      nativeBtn.style.display = "none";
    }

    textBtn.onclick = async ()=>{
      try{
        await navigator.clipboard.writeText(text);
        window.App.toast("已复制结果文字");
      }catch(e){
        window.App.toast("复制失败，请长按卡片保存");
      }
    };
  }

  function buildShareText(r){
    const mbtiInfo = window.MBTI_TYPES_INFO[r.mbti] || { name:"风格观察者" };
    return [
      `我的穿搭人格：${r.main.emoji} ${r.main.name}`,
      `MBTI：${r.mbti} · ${mbtiInfo.name}`,
      `属性：温柔度 ${r.attrs.温柔度} / 氛围感 ${r.attrs.氛围感} / 甜美度 ${r.attrs.甜美度}`,
      `隐藏人格：${r.hidden.emoji} ${r.hidden.name}`,
      `「${r.main.tagline}」`,
      ``,
      `来 AI STYLE LAB 测测你的穿搭人格吧`
    ].join("\n");
  }

  /* ---------- 图鉴 ---------- */
  function openCollection(){
    const modal = document.getElementById("collectionModal");
    const grid = document.getElementById("collectionGrid");
    const sub = document.getElementById("collectionSub");

    const collected = new Set(window.App.loadCollection());
    const all = Object.values(window.PERSONAS);

    sub.textContent = `已收集 ${collected.size} / ${all.length}`;

    grid.innerHTML = all.map(p=>{
      const got = collected.has(p.id);
      return `
        <div class="col-item${got ? "" : " locked"}">
          <span class="em">${got ? p.emoji : "❔"}</span>
          <span class="nm">${got ? esc(p.name) : "???"}</span>
          ${got ? `<span class="check">✓</span>` : ""}
        </div>
      `;
    }).join("");

    modal.classList.add("open");
    modal.querySelectorAll("[data-close]").forEach(el=>{
      el.onclick = ()=> modal.classList.remove("open");
    });
  }

  /* ---------- 导出 ---------- */
  window.Result = { render, openCollection };
})();
