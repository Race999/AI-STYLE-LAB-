/* ============================================================
   js/scoring.js
   评分与规则引擎
   ============================================================ */

/* ---------- 1. MBTI ---------- */
function calcMBTI(answers){
  const s = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
  window.ALL_QUESTIONS.forEach((q, i)=>{
    if(q.kind !== "mbti") return;
    const opt = q.options[answers[i]];
    if(!opt || !opt.mbti) return;
    Object.entries(opt.mbti).forEach(([k, v])=>{ s[k] += v; });
  });
  return (
    (s.E >= s.I ? "E" : "I") +
    (s.S >= s.N ? "S" : "N") +
    (s.T >= s.F ? "T" : "F") +
    (s.J >= s.P ? "J" : "P")
  );
}

/* ---------- 2. 收集穿搭标签 ---------- */
function collectTags(answers){
  const tags = { need:[], scene:[], color:[], style:[], fit:[], wardrobe:[] };
  window.ALL_QUESTIONS.forEach((q, i)=>{
    if(q.kind !== "clothing") return;
    const opt = q.options[answers[i]];
    if(!opt || !opt.tags) return;
    Object.entries(opt.tags).forEach(([k, v])=>{
      if(!tags[k]) tags[k] = [];
      if(Array.isArray(v)) tags[k].push(...v);
      else tags[k].push(v);
    });
  });
  Object.keys(tags).forEach(k=>{
    tags[k] = [...new Set(tags[k])];
  });
  return tags;
}

/* ---------- 3. 人格评分（70% 穿搭 + 30% MBTI） ---------- */
function calcPersonaScores(answers, mbti){
  const clothing = {};
  Object.keys(window.PERSONAS).forEach(id => clothing[id] = 0);

  window.ALL_QUESTIONS.forEach((q, i)=>{
    if(q.kind !== "clothing") return;
    const opt = q.options[answers[i]];
    if(!opt || !opt.p) return;
    Object.entries(opt.p).forEach(([id, v])=>{
      clothing[id] = (clothing[id] || 0) + v;
    });
  });

  const mbtiScores = window.MBTI_SCORE_TABLE[mbti] || {};
  const maxC = Math.max(1, ...Object.values(clothing));
  const maxM = Math.max(1, ...Object.values(mbtiScores));

  const final = {};
  Object.keys(window.PERSONAS).forEach(id=>{
    final[id] = (clothing[id] || 0) / maxC * 70
              + (mbtiScores[id] || 0) / maxM * 30;
  });

  // 归一化到 0~100
  const maxF = Math.max(1, ...Object.values(final));
  Object.keys(final).forEach(id=>{
    final[id] = Math.round(final[id] / maxF * 100);
  });

  return { clothing, mbtiScores, final };
}

/* ---------- 4. 属性面板 ---------- */
function calcAttributes(personaId, tags){
  const base = { ...window.PERSONAS[personaId].baseAttr };
  const needs = tags.need || [];

  if(needs.includes("thin"))    base.显瘦力 = Math.min(99, base.显瘦力 + 8);
  if(needs.includes("waist"))   base.氛围感 = Math.min(99, base.氛围感 + 3);
  if(needs.includes("comfort")) base.舒适度 = Math.min(99, base.舒适度 + 8);
  if(needs.includes("tall"))    base.显瘦力 = Math.min(99, base.显瘦力 + 4);

  const colors = tags.color || [];
  if(colors.includes("light"))   base.甜美度 = Math.min(99, base.甜美度 + 5);
  if(colors.includes("neutral")) base.氛围感 = Math.min(99, base.氛围感 + 4);
  if(colors.includes("earth"))   base.温柔度 = Math.min(99, base.温柔度 + 4);

  return base;
}

/* ---------- 5. 生成缺口数据 ---------- */
function buildGapData(r){
  const t = r.tags;
  return {
    mbti: r.mbti,
    persona: r.main,
    hidden: r.hidden,
    attrs: r.attrs,
    needs:    t.need || [],
    scenes:   t.scene || [],
    colors:   t.color || [],
    styles:   t.style || [],
    fits:     t.fit || [],
    wardrobe: t.wardrobe || [],
    has: (arr, v) => Array.isArray(arr) && arr.includes(v)
  };
}

/* ---------- 6. 动态衣柜缺口 ---------- */
function generateClosetGaps(r){
  const d = buildGapData(r);
  const matched = window.WARDROBE_GAP_RULES
    .filter(rule => { try { return rule.match(d); } catch(e){ return false; } })
    .sort((a, b)=> b.weight - a.weight);

  const seen = new Set();
  const out = [];
  for(const rule of matched){
    if(seen.has(rule.gap)) continue;
    seen.add(rule.gap);
    out.push({ id:rule.id, gap:rule.gap, why:rule.why, keys:rule.keys || [] });
    if(out.length >= 3) break;
  }
  return out;
}

/* ---------- 7. 生成衣柜分布（用于"衣柜诊断"可视化） ---------- */
function calcWardrobeProfile(tags){
  const items = [
    { key:"basic",  label:"基础款",   weight: 70 },
    { key:"loose",  label:"宽松上衣", weight: 55 },
    { key:"knit",   label:"针织",     weight: 45 },
    { key:"dress",  label:"裙装",     weight: 40 },
    { key:"coat",   label:"外套",     weight: 35 },
    { key:"hoodie", label:"卫衣",     weight: 30 }
  ];

  const wardrobe = tags.wardrobe || [];
  const fits = tags.fit || [];

  // 基础分 + 从标签推断
  const out = items.map(it=>{
    let score = it.weight + Math.floor(Math.random() * 8); // 视觉基础
    if(it.key === "basic" && wardrobe.includes("basic"))     score += 18;
    if(it.key === "knit"  && wardrobe.includes("knit"))      score += 20;
    if(it.key === "dress" && wardrobe.includes("dress"))     score += 20;
    if(it.key === "coat"  && wardrobe.includes("coat"))      score += 20;
    if(it.key === "hoodie"&& wardrobe.includes("hoodie"))    score += 20;
    if(it.key === "loose" && fits.includes("loose"))         score += 18;
    if(it.key === "loose" && fits.includes("regular"))       score += 8;
    if(it.key === "basic" && fits.includes("slim"))          score -= 8;
    return { ...it, score: Math.max(20, Math.min(96, score)) };
  });

  // 归一化
  const max = Math.max(...out.map(o=>o.score));
  return out.map(o=>({ ...o, score: Math.round(o.score / max * 92) }));
}

/* ---------- 8. 段位 ---------- */
function calcTier(r){
  // 依据：风格稳定性 + 场景明确度 + 需求明确度
  const final = r.final || {};
  const values = Object.values(final).sort((a, b)=> b - a);
  const gap = values[0] - (values[1] || 0);              // 风格稳定性
  const sceneClarity = (r.tags.scene || []).length * 4;  // 场景明确度
  const needClarity  = (r.tags.need  || []).length * 4;  // 需求明确度
  const base = 60 + Math.min(30, gap * 1.6) + Math.min(8, sceneClarity + needClarity);

  const score = Math.max(40, Math.min(99, Math.round(base)));
  const level = window.TIER_LEVELS.find(l => score >= l.min && score < l.max) || window.TIER_LEVELS[0];
  return { score, name: level.name, tier: level.tier };
}

/* ---------- 9. 幸运穿搭（按日期确定性生成） ---------- */
function calcDailyLucky(r){
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  // 简单确定性哈希
  const hash = (n) => {
    let x = seed + n * 9973;
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = (x >> 16) ^ x;
    return Math.abs(x);
  };

  const color  = window.LUCKY_COLORS[hash(1) % window.LUCKY_COLORS.length];
  const item   = window.LUCKY_ITEMS[hash(2) % window.LUCKY_ITEMS.length];
  const kw     = window.LUCKY_KEYWORDS[hash(3) % window.LUCKY_KEYWORDS.length];
  const score  = 78 + (hash(4) % 22); // 78~99

  return { color, item, keyword: kw, score };
}

/* ---------- 10. 搭配推荐（用于"穿搭公式"） ---------- */
function buildFormula(r){
  const style = r.main.style;
  const cfg = window.FORMULA_BY_STYLE[style] || { parts:["上装","下装","外搭"], result:"你的风格" };

  // 追加个性化提示
  const extra = [];
  const needs = r.tags.need || [];
  if(needs.includes("waist")) extra.push("把上衣塞进腰头，强化腰线");
  if(needs.includes("hip"))   extra.push("下装避开紧身包臀，优先A字或直筒");
  if(needs.includes("arm"))   extra.push("上装选五分袖或落肩，避免无袖");
  if(needs.includes("tall"))  extra.push("鞋裤同色拉长腿部线条");

  return {
    parts: cfg.parts,
    result: cfg.result,
    extra
  };
}

/* ---------- 11. 匹配清单 ---------- */
function matchTopPersonas(final, topN){
  const ids = Object.keys(final).sort((a, b)=> final[b] - final[a]);
  return ids.slice(0, topN || 5).map((id, i)=>({
    rank: i + 1,
    id,
    persona: window.PERSONAS[id],
    score: final[id]
  }));
}

/* ---------- 12. 穿搭 CP ---------- */
function calcCP(r){
  const current = r.mainId;
  // 简易互补规则：按风格互补
  const styleComplement = {
    minimal: ["french", "korean"],
    sweet:   ["minimal", "french"],
    korean:  ["french", "sweet"],
    french:  ["minimal", "korean"]
  };

  const all = Object.values(window.PERSONAS);
  const sameStyle = all.filter(p => p.style === current && p.id !== current);
  const diffStyle = all.filter(p => (styleComplement[r.main.style] || []).includes(p.style));

  const best    = (diffStyle[0] || all[0]).id;
  const pair    = (diffStyle[1] || diffStyle[0] || all[1]).id;
  const overlap = (sameStyle[0]  || all[2]).id;

  return {
    best:    window.PERSONAS[best],
    pair:    window.PERSONAS[pair],
    overlap: window.PERSONAS[overlap]
  };
}

/* ---------- 13. 商品推荐 ---------- */
function recommendProducts(r, products){
  const needs  = r.tags.need  || [];
  const scenes = r.tags.scene || [];
  const colors = r.tags.color || [];
  const fits   = r.tags.fit   || [];
  const mainId = r.mainId;
  const mainStyle = r.main.style;
  const budget = Number(r.basicInfo.budget) || 200;

  const scored = products.map(p=>{
    const reasons = [];

    /* 人格匹配 40% */
    let personaScore = 0;
    if(Array.isArray(p.personas) && p.personas.includes(mainId)){
      personaScore = 40;
      reasons.push(`你的穿搭人格是 ${window.PERSONAS[mainId].name}`);
    }

    /* 风格匹配 20% */
    let styleScore = 0;
    if(Array.isArray(p.styles) && p.styles.includes(mainStyle)){
      styleScore = 20;
      reasons.push(`符合 ${window.CN.style[mainStyle] || mainStyle} 风格`);
    }

    /* 需求匹配 20% */
    let needScore = 0;
    (p.needs || []).forEach(n=>{
      if(needs.includes(n)){
        needScore += 20 / Math.max(1, needs.length);
        if(window.CN.need[n]) reasons.push(`你选择了「${window.CN.need[n]}」`);
      }
    });
    needScore = Math.min(20, needScore);

    /* 场景匹配 10% */
    let sceneScore = 0;
    (p.scenes || []).forEach(s=>{
      if(scenes.includes(s)){
        sceneScore += 10 / Math.max(1, scenes.length);
        if(window.CN.scene[s]) reasons.push(`适合「${window.CN.scene[s]}」场景`);
      }
    });
    sceneScore = Math.min(10, sceneScore);

    /* 版型 + 颜色匹配 10% */
    let fitColorScore = 0;
    (p.fits || []).forEach(f=>{
      if(fits.includes(f)) fitColorScore += 4;
    });
    (p.colors || []).forEach(c=>{
      if(colors.includes(c)) fitColorScore += 3;
    });
    fitColorScore = Math.min(10, fitColorScore);

    /* 预算 */
    const price = Number(p.price) || 0;
    let budgetBonus = 0;
    if(price <= budget){ budgetBonus = 4; reasons.push("在你的预算内"); }
    else if(price <= budget * 1.3){ budgetBonus = 1; reasons.push("略高于预算但值得"); }
    else { budgetBonus = -6; }

    const total = personaScore + styleScore + needScore + sceneScore + fitColorScore + budgetBonus;

    return {
      ...p,
      _score: total,
      _reasons: [...new Set(reasons)].slice(0, 4),
      _match: Math.min(99, Math.max(45, Math.round(60 + total * 0.9)))
    };
  }).sort((a, b)=> b._score - a._score);

  return scored.slice(0, 3);
}

/* ---------- 导出 ---------- */
window.Scoring = {
  calcMBTI,
  collectTags,
  calcPersonaScores,
  calcAttributes,
  generateClosetGaps,
  calcWardrobeProfile,
  calcTier,
  calcDailyLucky,
  buildFormula,
  matchTopPersonas,
  calcCP,
  recommendProducts
};