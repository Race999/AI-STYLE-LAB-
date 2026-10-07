/* ============================================================
   js/app.js
   测试流程 / 页面切换 / 盲盒动画
   ============================================================ */

(function(){
  'use strict';

  const KEY_COLLECTION = "ai_style_persona_collection_v1";
  const KEY_LAST       = "ai_style_last_result_v1";

  /* ---------- 状态 ---------- */
  const state = {
    currentQuestion: 0,
    answers: {},
    basicInfo: {},
    result: null,
    gaps: [],
    products: []
  };

  /* ---------- DOM ---------- */
  const $ = (sel) => document.querySelector(sel);

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg){
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> el.classList.remove("show"), 1800);
  }

  /* ---------- 页面切换 ---------- */
  function show(id){
    ["home","quiz","blind","result"].forEach(k=>{
      const el = document.getElementById(k);
      if(!el) return;
      el.style.display = (k === id) ? "block" : "none";
    });
    if(id === "quiz")   $("#quiz").style.display = "flex";
    if(id === "blind")  $("#blind").style.display = "flex";
    window.scrollTo(0, 0);
  }

  /* ---------- 首页 ---------- */
  function updateHomeCollection(){
    const set = loadCollection();
    const el = document.getElementById("homeCollection");
    if(!el) return;
    const count = set.length;
    if(count > 0){
      el.style.display = "flex";
      document.getElementById("collectionCount").textContent = count + " / 10";
    } else {
      el.style.display = "none";
    }
  }

  function startQuiz(){
    state.currentQuestion = 0;
    state.answers = {};
    state.basicInfo = {};
    state.result = null;
    state.gaps = [];
    state.products = [];

    show("quiz");
    renderQuestion();
  }

  /* ---------- 渲染题目 ---------- */
  function renderQuestion(){
    const q = window.ALL_QUESTIONS[state.currentQuestion];
    if(!q) return;

    const total = window.ALL_QUESTIONS.length;
    const idx = state.currentQuestion + 1;

    $("#quizNum").textContent =
      String(idx).padStart(2, "0") + " / " + total;

    const pct = (idx / total) * 100;
    $("#rulerFill").style.width = pct + "%";
    $("#rulerKnob").style.left = pct + "%";

    $("#backBtn").disabled = state.currentQuestion === 0;

    const nextBtn = $("#nextBtn");
    const isLast = state.currentQuestion === total - 1;
    nextBtn.textContent = isLast ? "查看我的穿搭人格" : "下一题";

    const body = $("#quizBody");

    /* ---- 信息题 ---- */
    if(q.kind === "info"){
      nextBtn.disabled = true;
      body.innerHTML = `
        <div class="q-kicker">最后一步</div>
        <h2 class="q-title">${q.title}</h2>
        <p class="q-sub">${q.subtitle}</p>
        <div class="input-group">
          <div class="input-box">
            <label>身高（cm）</label>
            <input id="inHeight" type="number" inputmode="numeric" placeholder="158">
          </div>
          <div class="input-box">
            <label>体重（斤）</label>
            <input id="inWeight" type="number" inputmode="numeric" placeholder="120">
          </div>
        </div>
        <div class="input-box">
          <label>你的预算（元）</label>
          <input id="inBudget" type="number" inputmode="numeric" placeholder="200">
        </div>
        <p class="input-hint">数据仅用于版型与商品推荐，不会上传到任何服务器。</p>
      `;
      ["inHeight","inWeight","inBudget"].forEach(id=>{
        const el = document.getElementById(id);
        el && el.addEventListener("input", checkInfo);
      });
      return;
    }

    /* ---- 选择题 ---- */
    const saved = state.answers[state.currentQuestion];
    nextBtn.disabled = (saved === undefined);

    let html = "";
    if(q.kind === "mbti")        html += `<div class="q-kicker">STYLE MBTI</div>`;
    else if(q.kind === "clothing") html += `<div class="q-kicker">STYLE PREFERENCE</div>`;

    html += `<h2 class="q-title">${q.title}</h2>`;
    html += `<div class="q-opts">`;

    q.options.forEach((opt, i)=>{
      const selected = saved === i;
      html += `
        <button class="opt${selected ? " selected" : ""}" data-idx="${i}">
          <span>${opt.text}</span>
          <span class="opt-check">✓</span>
        </button>
      `;
    });

    html += `</div>`;
    body.innerHTML = html;

    body.querySelectorAll(".opt").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const i = Number(btn.dataset.idx);
        selectOption(i);
      });
    });
  }

  function selectOption(i){
    state.answers[state.currentQuestion] = i;
    document.querySelectorAll(".opt").forEach((el, idx)=>{
      el.classList.toggle("selected", idx === i);
    });
    $("#nextBtn").disabled = false;

    // 轻微反馈后自动进入下一题
    setTimeout(()=>{
      const nextBtn = $("#nextBtn");
      if(!nextBtn.disabled) nextBtn.click();
    }, 260);
  }

  function checkInfo(){
    const h = Number(document.getElementById("inHeight").value);
    const w = Number(document.getElementById("inWeight").value);
    const b = Number(document.getElementById("inBudget").value);
    const ok = h >= 100 && h <= 220
            && w >= 50  && w <= 400
            && b >= 0   && b <= 100000;
    $("#nextBtn").disabled = !ok;
  }

  function goBack(){
    if(state.currentQuestion <= 0) return;
    state.currentQuestion--;
    renderQuestion();
  }

  function nextQuestion(){
    const q = window.ALL_QUESTIONS[state.currentQuestion];
    if(!q) return;

    /* ---- 信息题 ---- */
    if(q.kind === "info"){
      const h = Number(document.getElementById("inHeight").value);
      const w = Number(document.getElementById("inWeight").value);
      const b = Number(document.getElementById("inBudget").value);
      if(!(h >= 100 && h <= 220 && w >= 50 && w <= 400 && b >= 0 && b <= 100000)){
        toast("请检查身高、体重和预算");
        return;
      }
      state.basicInfo = { height:h, weight:w, budget:b };
      finishQuiz();
      return;
    }

    /* ---- 选择题 ---- */
    if(state.answers[state.currentQuestion] === undefined){
      toast("请选择一个答案");
      return;
    }

    state.currentQuestion++;
    renderQuestion();
  }

  /* ---------- 完成测试，进入盲盒 ---------- */
  function finishQuiz(){
    // 计算
    const mbti = window.Scoring.calcMBTI(state.answers);
    const tags = window.Scoring.collectTags(state.answers);
    const { final } = window.Scoring.calcPersonaScores(state.answers, mbti);
    const ranking = window.Scoring.matchTopPersonas(final, 5);

    const mainId = ranking[0].id;
    const hiddenId = ranking[1] ? ranking[1].id : mainId;

    const attrs = window.Scoring.calcAttributes(mainId, tags);

    state.result = {
      mbti,
      mainId,
      hiddenId,
      main: window.PERSONAS[mainId],
      hidden: window.PERSONAS[hiddenId],
      attrs,
      tags,
      basicInfo: { ...state.basicInfo },
      final,
      ranking
    };

    state.gaps = window.Scoring.generateClosetGaps(state.result);
    state.products = window.Scoring.recommendProducts(
      state.result,
      (Array.isArray(window.EMBEDDED_PRODUCTS) && window.EMBEDDED_PRODUCTS.length)
        ? window.EMBEDDED_PRODUCTS
        : window.DEFAULT_PRODUCTS
    );

    // 保存收藏
    saveCollection(mainId);
    saveLastResult(state.result);

    show("blind");
    startBlindbox();
  }

  /* ---------- 盲盒动画 ---------- */
  function startBlindbox(){
    const stage = document.getElementById("blindStage");
    const r = state.result;

    const step = (html, ms) => new Promise(res => {
      stage.innerHTML = html;
      requestAnimationFrame(()=>{
        stage.querySelectorAll(".blind-line").forEach(el=>{
          requestAnimationFrame(()=> el.classList.add("show"));
        });
      });
      setTimeout(res, ms);
    });

    (async ()=>{
      /* 1. 开场 */
      await step(`
        <div class="blind-line blind-kicker">ANALYZING YOUR STYLE DNA</div>
        <div class="blind-line blind-title">正在分析你的穿搭 DNA</div>
      `, 900);

      /* 2. MBTI 四字母闪烁 */
      const code = r.mbti.split("");
      stage.innerHTML = `
        <div class="blind-line blind-kicker">STYLE MBTI</div>
        <div class="mbti-flash" id="mbtiFlash">
          ${code.map(c => `<span>${c}</span>`).join("")}
        </div>
      `;
      requestAnimationFrame(()=>{
        stage.querySelectorAll(".blind-line").forEach(el=> el.classList.add("show"));
      });
      const spans = stage.querySelectorAll("#mbtiFlash span");
      for(let i=0;i<spans.length;i++){
        await new Promise(res=>setTimeout(res,220));
        spans[i].classList.add("on");
      }
      await new Promise(res=>setTimeout(res,650));

      /* 3. 权重比例 */
      await step(`
        <div class="blind-line blind-kicker">MATCHING</div>
        <div class="ratio-bar">
          <div class="ratio-row"><span>穿搭人格</span><b>70%</b></div>
          <div class="ratio-row"><span>MBTI 匹配</span><b>30%</b></div>
        </div>
      `, 900);

      /* 4. 3-2-1 */
      for(let n=3; n>=1; n--){
        stage.innerHTML = `<div class="blind-count">${n}</div>`;
        await new Promise(res=>setTimeout(res, 420));
      }

      /* 5. 揭晓 */
      stage.innerHTML = `
        <div class="reveal">
          <div class="reveal-kicker">YOUR STYLE PERSONA</div>
          <div class="reveal-emoji">${r.main.emoji}</div>
          <div class="reveal-name">${r.main.name}</div>
          <div class="reveal-tag">${r.main.keywords.join(" · ")}</div>
        </div>
      `;
      await new Promise(res=>setTimeout(res, 1400));

      /* 进入结果页 */
      if(window.Result && window.Result.render){
        window.Result.render(state.result, state.gaps, state.products);
      }
      show("result");
    })();
  }

  /* ---------- localStorage ---------- */
  function loadCollection(){
    try{
      const raw = localStorage.getItem(KEY_COLLECTION);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    }catch(e){ return []; }
  }
  function saveCollection(personaId){
    const set = new Set(loadCollection());
    set.add(personaId);
    try{ localStorage.setItem(KEY_COLLECTION, JSON.stringify([...set])); }catch(e){}
  }
  function saveLastResult(r){
    try{
      const copy = {
        mainId: r.mainId,
        hiddenId: r.hiddenId,
        mbti: r.mbti,
        attrs: r.attrs,
        time: Date.now()
      };
      localStorage.setItem(KEY_LAST, JSON.stringify(copy));
    }catch(e){}
  }

  /* ---------- 重新测试 ---------- */
  function restart(){
    state.currentQuestion = 0;
    state.answers = {};
    state.basicInfo = {};
    state.result = null;
    state.gaps = [];
    state.products = [];
    updateHomeCollection();
    show("home");
  }

  /* ---------- 全局 API ---------- */
  window.App = {
    state,
    startQuiz,
    nextQuestion,
    goBack,
    restart,
    toast,
    show,
    loadCollection,
    updateHomeCollection
  };

  /* ---------- 绑定事件 ---------- */
  function bind(){
    const startBtn = document.getElementById("startBtn");
    const backBtn  = document.getElementById("backBtn");
    const nextBtn  = document.getElementById("nextBtn");

    startBtn && startBtn.addEventListener("click", startQuiz);
    backBtn  && backBtn.addEventListener("click", goBack);
    nextBtn  && nextBtn.addEventListener("click", nextQuestion);
  }

  /* ---------- 启动 ---------- */
  window.__BOOT__ = function(){
    bind();
    updateHomeCollection();
    show("home");
  };
})();
