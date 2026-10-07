/* ============================================================
   js/result.js
   结果页渲染 / 分享卡（Canvas 生成图片 + 微信长按保存）
   ============================================================ */

(function(){
  'use strict';

  /* ---------- 环境检测 ---------- */
  function isWeChat(){
    return /MicroMessenger/i.test(navigator.userAgent || "");
  }
  function isIOS(){
    const ua = navigator.userAgent || "";
    return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  }

  function esc(s){
    return String(s).replace(/[&<>"']/g, m=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  /* ============================================================
     属性数值动画
     ============================================================ */
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

  /* ============================================================
     主渲染
     ============================================================ */
  function render(r, gaps, products){
    const root = document.getElementById("resultMain");
    const lucky = window.Scoring.calcDailyLucky(r);
    const tier = window.Scoring.calcTier(r);
    const formula = window.Scoring.buildFormula(r);
    const cp = window.Scoring.calcCP(r);
    const wardrobe = window.Scoring.calcWardrobeProfile(r.tags);

    const mbtiInfo = window.MBTI_TYPES_INFO[r.mbti] || { name:"风格观察者", keys:["理性","克制","审美"] };

    const attrHtml = Object.entries(r.attrs).map(([k, v])=>`
      <div class="attr-row">
        <span class="label">${k}</span>
        <div class="attr-track"><i class="attr-fill" data-w="${v}"></i></div>
        <span class="attr-num" data-count="${v}">0</span>
      </div>
    `).join("");

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

    const wardrobeHtml = wardrobe.map(w=>`
      <div class="wardrobe-row">
        <span class="label">${w.label}</span>
        <div class="wardrobe-bar"><i data-w="${w.score}"></i></div>
      </div>
    `).join("");

    const mainGap = gaps[0] || { gap: window.PERSONAS[r.mainId].closet, why:"" };
    const otherGaps = gaps.slice(1);

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

    const productHtml = products.map((p, i)=> renderProduct(p, i)).join("");

    root.innerHTML = `
      <div class="r-hero">
        <div class="r-kicker">YOUR STYLE DNA</div>
        <div class="r-emoji">${r.main.emoji}</div>
        <h1 class="r-name">${esc(r.main.name)}</h1>
        <p class="r-keywords">${r.main.keywords.join(" × ")}</p>
        <div class="r-rarity"><span class="dot"></span>${r.main.rarity} · ${r.main.rarityText}</div>
        <p class="r-quote">${esc(r.main.tagline)}</p>
      </div>

      <div class="r-section">
        <div class="r-card">
          <div class="r-card-title">属性面板 <span class="cn">人格属性</span></div>
          <div class="attr-list">${attrHtml}</div>
        </div>

        <div class="r-card">
          <div class="r-card-title">人格排行榜 <span class="cn">你的 TOP 5</span></div>
          <div class="rank-list">${rankHtml}</div>
        </div>

        <div class="mbti-card">
          <div class="mbti-kicker">STYLE MBTI</div>
          <div class="mbti-code">${r.mbti}</div>
          <div class="mbti-name">${esc(mbtiInfo.name)}</div>
          <div class="mbti-keys">
            ${mbtiInfo.keys.map(k=>`<span class="mbti-key">${esc(k)}</span>`).join("")}
          </div>
          <div class="mbti-note">娱乐性质的穿搭 MBTI，仅用于风格参考。最终人格中穿搭占 70%、MBTI 占 30%。</div>
        </div>

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

        <div class="r-card">
          <div class="r-card-title">穿搭公式 <span class="cn">你的高分搭配</span></div>
          ${formulaHtml}
        </div>

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

        <div class="rank-badge">
          <div>
            <div class="rank-badge-l">YOUR STYLE TIER</div>
            <div class="rank-badge-v">${esc(tier.name)}</div>
          </div>
          <div class="rank-badge-r">${esc(tier.tier)}</div>
        </div>

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

      <div class="r-section">
        <div class="r-card-title" style="padding:26px 0 14px">为你挑了 3 件 <span class="cn">所以，你真正适合的是</span></div>
        <div id="productList">${productHtml}</div>
      </div>

      <div class="r-section">
        <div class="r-card">
          <div class="r-card-title">穿搭扭蛋 <span class="cn">抽一件今天适合你的</span></div>
          <div class="gacha">
            <button class="gacha-btn" id="gachaBtn">🎰 抽一件今天适合我的衣服</button>
            <div id="gachaResult"></div>
          </div>
        </div>
      </div>

      <div class="share-wrap">
        <button class="share-cta" id="shareCta">
          <div class="share-cta-kicker">SHARE YOUR STYLE</div>
          <div class="share-cta-title">生成分享卡 · 发给朋友</div>
        </button>
      </div>

      <div class="result-foot">
        <button class="restart-btn" id="restartBtn">再测一次</button>
        <p class="footnote">
          娱乐性穿搭人格测试，仅用于风格参考。<br>
          AI STYLE LAB · 你的穿搭风格实验室
        </p>
      </div>
    `;

    bindResultEvents(r, products);
    animateNumbers();
  }

  /* ============================================================
     商品卡
     ============================================================ */
  function renderProduct(p, i){
    const phText = (p.name || "单品").slice(0, 2);
    const reasons = (p._reasons || []).map(x => `<div class="product-reason">${esc(x)}</div>`).join("");

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

  /* ============================================================
     事件绑定
     ============================================================ */
  function bindResultEvents(r, products){
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

    const gachaBtn = document.getElementById("gachaBtn");
    gachaBtn && gachaBtn.addEventListener("click", ()=>{
      const wrap = document.getElementById("gachaResult");
      wrap.innerHTML = `<div class="gacha-result"><div class="gacha-kicker">DRAWING...</div><div class="gacha-name">正在抽取...</div></div>`;
      setTimeout(()=>{
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

    const shareCta = document.getElementById("shareCta");
    shareCta && shareCta.addEventListener("click", ()=>{
      openShareCard(r);
    });

    const restartBtn = document.getElementById("restartBtn");
    restartBtn && restartBtn.addEventListener("click", ()=>{
      window.App.restart();
    });
  }

  /* ============================================================
     Canvas 工具
     ============================================================ */
  function roundRectPath(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function wrapTextCanvas(ctx, text, x, y, maxW, lineH){
    const chars = String(text).split("");
    const lines = [];
    let line = "";
    for(const ch of chars){
      const test = line + ch;
      if(ctx.measureText(test).width > maxW && line){
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if(line) lines.push(line);
    lines.forEach((l, i)=>{
      ctx.fillText(l, x, y + i * lineH);
    });
    return lines.length;
  }

  function dataURLtoBlob(dataUrl){
    try{
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8 = new Uint8Array(n);
      while(n--){ u8[n] = bstr.charCodeAt(n); }
      return new Blob([u8], { type: mime });
    }catch(e){ return null; }
  }

  /* ============================================================
     用 Canvas 生成分享图片（带 toBlob 兜底）
     ============================================================ */
  function generateShareImage(r){
    return new Promise((resolve, reject)=>{
      try{
        const W = 750;
        const H = 1200;
        const dpr = 2;
        const canvas = document.createElement("canvas");
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        ctx.fillStyle = "#F8F6F2";
        ctx.fillRect(0, 0, W, H);

        const PAD = 30;
        roundRectPath(ctx, PAD, PAD, W - PAD * 2, H - PAD * 2, 26);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = "#F0EAE0";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.strokeStyle = "#B89562";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(120, 110);
        ctx.lineTo(220, 110);
        ctx.moveTo(W - 220, 110);
        ctx.lineTo(W - 120, 110);
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#B89562";
        ctx.font = "600 13px -apple-system,'PingFang SC','Microsoft YaHei',sans-serif";
        ctx.fillText("A I   S T Y L E   L A B", W / 2, 92);
        ctx.font = "400 10px -apple-system,'PingFang SC','Microsoft YaHei',sans-serif";
        ctx.fillText("·   S T Y L E   D N A   ·", W / 2, 118);

        ctx.font = "96px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
        ctx.fillStyle = "#1A1714";
        ctx.fillText(r.main.emoji, W / 2, 232);

        ctx.font = "500 54px 'Songti SC','STSong',Georgia,serif";
        ctx.fillStyle = "#1A1714";
        ctx.fillText(r.main.name, W / 2, 342);

        const mbtiInfo = window.MBTI_TYPES_INFO[r.mbti] || { name:"风格观察者" };
        ctx.font = "400 16px -apple-system,'PingFang SC','Microsoft YaHei',sans-serif";
        ctx.fillStyle = "#77716D";
        ctx.fillText(`${r.mbti}  ·  ${mbtiInfo.name}`, W / 2, 400);

        ctx.strokeStyle = "#ECE7E0";
        ctx.beginPath();
        ctx.moveTo(120, 458);
        ctx.lineTo(W - 120, 458);
        ctx.stroke();

        const attrs = [
          { l:"温柔度", v: r.attrs.温柔度 },
          { l:"氛围感", v: r.attrs.氛围感 },
          { l:"甜美度", v: r.attrs.甜美度 }
        ];
        const cellW = (W - 240) / 3;
        attrs.forEach((a, i)=>{
          const cx = 120 + cellW * (i + 0.5);
          ctx.font = "600 40px 'Songti SC','STSong',Georgia,serif";
          ctx.fillStyle = "#1A1714";
          ctx.fillText(String(a.v), cx, 528);
          ctx.font = "400 13px -apple-system,'PingFang SC','Microsoft YaHei',sans-serif";
          ctx.fillStyle = "#A8A29E";
          ctx.fillText(a.l, cx, 574);
        });

        ctx.strokeStyle = "#ECE7E0";
        ctx.beginPath();
        ctx.moveTo(120, 632);
        ctx.lineTo(W - 120, 632);
        ctx.stroke();

        ctx.font = "600 12px -apple-system,'PingFang SC','Microsoft YaHei',sans-serif";
        ctx.fillStyle = "#A8A29E";
        ctx.fillText("H I D D E N   P E R S O N A", W / 2, 682);

        ctx.font = "400 30px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
        ctx.fillText(r.hidden.emoji, W / 2 - 78, 740);
        ctx.font = "500 28px 'Songti SC','STSong',Georgia,serif";
        ctx.fillStyle = "#1A1714";
        ctx.textAlign = "left";
        ctx.fillText(r.hidden.name, W / 2 - 40, 742);
        ctx.textAlign = "center";

        ctx.font = "italic 400 16px 'Songti SC','STSong',Georgia,serif";
        ctx.fillStyle = "#77716D";
        const quote = `“${r.main.tagline}”`;
        wrapTextCanvas(ctx, quote, W / 2, 830, W - 240, 34);

        ctx.font = "400 13px -apple-system,'PingFang SC','Microsoft YaHei',sans-serif";
        ctx.fillStyle = "#A8A29E";
        ctx.fillText(`#穿搭人格  #${r.main.name}  #我的穿搭风格`, W / 2, 970);

        ctx.font = "600 11px -apple-system,'PingFang SC','Microsoft YaHei',sans-serif";
        ctx.fillStyle = "#B89562";
        ctx.fillText("A I   S T Y L E   L A B", W / 2, H - 70);

        /* ---- 优先 toBlob，失败走 toDataURL ---- */
        const finish = ()=>{
          try{
            if(typeof canvas.toBlob === "function"){
              canvas.toBlob(b=>{
                if(b) resolve(b);
                else fallback();
              }, "image/png", 0.95);
            } else {
              fallback();
            }
          }catch(e){
            fallback();
          }
        };

        const fallback = ()=>{
          try{
            const dataUrl = canvas.toDataURL("image/png");
            const blob = dataURLtoBlob(dataUrl);
            if(blob) resolve(blob);
            else reject(new Error("canvas export failed"));
          }catch(e){
            reject(e);
          }
        };

        finish();
      }catch(e){
        reject(e);
      }
    });
  }

  /* ============================================================
     全屏看图（微信 / iOS 长按保存用）
     ============================================================ */
  function showFullImage(url, opts){
    opts = opts || {};
    const exist = document.querySelector(".img-viewer");
    if(exist) exist.remove();

    const div = document.createElement("div");
    div.className = "img-viewer";
    div.innerHTML = `
      <button class="img-viewer-close">&times;</button>
      <img src="${url}" alt="分享卡">
      <div class="img-viewer-tip">${opts.tip || "长按图片保存到相册"}</div>
      <div class="img-viewer-sub">${opts.sub || "若无反应，可截图保存"}</div>
    `;
    document.body.appendChild(div);

    div.querySelector(".img-viewer-close").onclick = ()=> div.remove();
    div.addEventListener("click", (e)=>{
      if(e.target === div) div.remove();
    });
  }

  /* ============================================================
     保存图片（微信/iOS → 全屏长按；安卓/桌面 → 下载）
     ============================================================ */
  function saveImageToDevice(url, file){
    /* 微信里无论什么平台，都走全屏长按 */
    if(isWeChat()){
      showFullImage(url, {
        tip: "长按图片保存到相册",
        sub: "或点击右上角 ··· 发送给朋友"
      });
      return;
    }

    /* iOS Safari 也不支持 a.download 下载图片，走全屏长按 */
    if(isIOS()){
      showFullImage(url, {
        tip: "长按图片保存到相册",
        sub: "若无反应，可截图保存"
      });
      return;
    }

    /* 安卓 / 桌面：直接下载 */
    try{
      const a = document.createElement("a");
      a.href = url;
      a.download = (file && file.name) || "style-card.png";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.App.toast("图片已保存到下载目录");
    }catch(e){
      showFullImage(url, { tip: "长按图片保存到相册" });
    }
  }

  /* ============================================================
     分享卡弹窗
     ============================================================ */
  async function openShareCard(r){
    const modal = document.getElementById("shareModal");
    const wrap  = document.getElementById("shareCardWrap");
    const saveBtn   = document.getElementById("shareSaveBtn");
    const nativeBtn = document.getElementById("shareNativeBtn");

    if(!modal || !wrap) return;

    modal.classList.add("open");

    modal.querySelectorAll("[data-close]").forEach(el=>{
      el.onclick = ()=> modal.classList.remove("open");
    });

    wrap.className = "share-preview";
    wrap.innerHTML = `<div class="share-loading"><div class="spinner"></div>正在生成图片…</div>`;

    let imageBlob = null;
    let imageUrl  = null;
    let imageFile = null;

    try{
      imageBlob = await generateShareImage(r);
      imageUrl  = URL.createObjectURL(imageBlob);
      imageFile = new File(
        [imageBlob],
        `style-${r.main.name}-${Date.now()}.png`,
        { type: "image/png" }
      );

      wrap.innerHTML = `<img src="${imageUrl}" alt="分享卡" class="share-image">`;
    }catch(e){
      console.error(e);
      wrap.innerHTML = `<p style="color:#a8a29e;text-align:center;padding:40px 20px;font-size:13px">图片生成失败，请重试</p>`;
      return;
    }

    /* ---- 保存按钮 ---- */
    if(saveBtn){
      saveBtn.onclick = ()=> saveImageToDevice(imageUrl, imageFile);
    }

    /* ---- 分享按钮 ---- */
    const wx = isWeChat();
    const canShareFile = !!(navigator.canShare && navigator.canShare({ files: [imageFile] }));

    if(nativeBtn){
      if(wx){
        /* 微信里：引导长按保存 */
        nativeBtn.style.display = "block";
        nativeBtn.textContent = "分享给朋友";
        nativeBtn.onclick = ()=>{
          showFullImage(imageUrl, {
            tip: "长按图片保存到相册",
            sub: "保存后点击右上角 ··· 发送给朋友"
          });
        };
      } else if(canShareFile){
        /* 原生支持文件分享：走系统分享面板 */
        nativeBtn.style.display = "block";
        nativeBtn.textContent = "分享给朋友";
        nativeBtn.onclick = async ()=>{
          try{
            await navigator.share({
              files: [imageFile],
              title: "我的穿搭人格",
              text: `我的穿搭人格是 ${r.main.emoji} ${r.main.name}`
            });
          }catch(e){
            if(e && e.name !== "AbortError"){
              showFullImage(imageUrl, { tip: "长按图片保存到相册" });
            }
          }
        };
      } else if(navigator.share){
        /* 支持文字分享 */
        nativeBtn.style.display = "block";
        nativeBtn.textContent = "分享结果";
        nativeBtn.onclick = async ()=>{
          try{
            await navigator.share({
              title: "我的穿搭人格",
              text: buildShareText(r)
            });
          }catch(e){}
        };
      } else {
        /* 兜底：复制文字 */
        nativeBtn.style.display = "block";
        nativeBtn.textContent = "复制结果文字";
        nativeBtn.onclick = async ()=>{
          try{
            await navigator.clipboard.writeText(buildShareText(r));
            window.App.toast("已复制结果文字");
          }catch(e){
            window.App.toast("复制失败，请长按图片保存");
          }
        };
      }
    }
  }

  /* ============================================================
     分享文字
     ============================================================ */
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

  /* ============================================================
     人格图鉴
     ============================================================ */
  function openCollection(){
    const modal = document.getElementById("collectionModal");
    const grid  = document.getElementById("collectionGrid");
    const sub   = document.getElementById("collectionSub");

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

  /* ============================================================
     导出
     ============================================================ */
  window.Result = { render, openCollection };
})();
