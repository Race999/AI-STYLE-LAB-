/* ============================================================
   js/data.js
   所有静态数据：人格、题目、商品、规则、中文映射
   ============================================================ */

/* ---------- 1. 10 种穿搭人格 ---------- */
window.PERSONAS = {
  cream_rabbit:{
    id:"cream_rabbit", name:"奶油兔", emoji:"🐰",
    mbti:"INFP", style:"sweet",
    rarity:"SSR", rarityText:"治愈系",
    keywords:["温柔","浪漫","细腻"],
    tagline:"你不是故意温柔，只是你的穿搭总有一种让人忍不住靠近的感觉。",
    desc:"柔和、轻盈、没有攻击性。你适合浅色、柔软材质和有一点甜度的搭配。",
    closet:"你缺一件高腰A字裙，把宽松上衣收出比例。",
    baseAttr:{ 温柔度:96, 氛围感:88, 甜美度:94, 舒适度:70, 显瘦力:72 }
  },
  moon_cat:{
    id:"moon_cat", name:"月光猫", emoji:"🐱",
    mbti:"INTJ", style:"minimal",
    rarity:"SR", rarityText:"清冷系",
    keywords:["克制","清冷","高级"],
    tagline:"你不需要用力，安静本身就是一种气场。",
    desc:"安静但有氛围感。你适合线条干净、颜色克制、材质有质感的穿搭。",
    closet:"你需要一件线条利落的西装或风衣，把清冷感撑起来。",
    baseAttr:{ 温柔度:62, 氛围感:94, 甜美度:55, 舒适度:68, 显瘦力:86 }
  },
  honey_fox:{
    id:"honey_fox", name:"蜜糖狐", emoji:"🦊",
    mbti:"ENFJ", style:"sweet",
    rarity:"SSR", rarityText:"撩人系",
    keywords:["温柔","撩人","聪明"],
    tagline:"温柔只是你的表面，偶尔你也想漂亮得有攻击性。",
    desc:"平时温柔，需要时可以很有吸引力。你适合收腰、有女人味但不俗气的单品。",
    closet:"你缺一件收腰连衣裙或短款小开衫，把腰线做出来。",
    baseAttr:{ 温柔度:84, 氛围感:90, 甜美度:86, 舒适度:66, 显瘦力:82 }
  },
  gummy_bear:{
    id:"gummy_bear", name:"软糖熊", emoji:"🐻",
    mbti:"ISFP", style:"korean",
    rarity:"R", rarityText:"松弛系",
    keywords:["舒服","松弛","自然"],
    tagline:"你把「舒服」穿成了别人羡慕的状态。",
    desc:"舒服、松弛、自然，是你的第一原则。你适合宽松但有比例的日常款。",
    closet:"你缺一条直筒牛仔裤，用来托住所有宽松上衣。",
    baseAttr:{ 温柔度:82, 氛围感:72, 甜美度:74, 舒适度:96, 显瘦力:68 }
  },
  butterfly:{
    id:"butterfly", name:"蝴蝶小姐", emoji:"🦋",
    mbti:"ENFP", style:"french",
    rarity:"UR", rarityText:"氛围感天花板",
    keywords:["氛围","浪漫","有故事感"],
    tagline:"你不是穿衣服，你是在穿一种气氛。",
    desc:"你适合有氛围、有女人味、有视觉重点的穿搭。裙装和设计感单品很适合你。",
    closet:"你缺一件有设计感的半身裙，比普通基础款更能放大你的氛围感。",
    baseAttr:{ 温柔度:86, 氛围感:96, 甜美度:88, 舒适度:72, 显瘦力:74 }
  },
  forest_deer:{
    id:"forest_deer", name:"森林小鹿", emoji:"🦌",
    mbti:"ISFJ", style:"korean",
    rarity:"SR", rarityText:"治愈系",
    keywords:["干净","自然","文艺"],
    tagline:"你身上的干净感，比精致更难模仿。",
    desc:"干净、自然、不刻意。你适合低饱和、柔软、带一点文艺感的韩系日常。",
    closet:"你缺一件米色针织开衫，它比卫衣更容易穿出温柔感。",
    baseAttr:{ 温柔度:90, 氛围感:80, 甜美度:78, 舒适度:86, 显瘦力:76 }
  },
  panda:{
    id:"panda", name:"糯米熊猫", emoji:"🐼",
    mbti:"ISFP", style:"minimal",
    rarity:"R", rarityText:"低饱和系",
    keywords:["简单","软糯","基础"],
    tagline:"越简单越见功力的那种人，就是你。",
    desc:"你适合基础款、软材质、低饱和色。越简单越能穿出你的舒服气质。",
    closet:"你缺一条高腰直筒裤，基础款上衣靠它就能变好看。",
    baseAttr:{ 温柔度:88, 氛围感:70, 甜美度:72, 舒适度:92, 显瘦力:70 }
  },
  tiger:{
    id:"tiger", name:"酷感小虎", emoji:"🐯",
    mbti:"ESTP", style:"minimal",
    rarity:"SR", rarityText:"利落系",
    keywords:["利落","强势","利刃感"],
    tagline:"你的衣服比你本人更不好惹。",
    desc:"你适合利落、直线条、有力量感的穿搭。黑白灰和硬挺版型是你的优势。",
    closet:"你缺一件短款外套或工装裤，把酷感做得更完整。",
    baseAttr:{ 温柔度:45, 氛围感:82, 甜美度:40, 舒适度:64, 显瘦力:92 }
  },
  dolphin:{
    id:"dolphin", name:"海盐海豚", emoji:"🐬",
    mbti:"ESFP", style:"minimal",
    rarity:"R", rarityText:"清爽系",
    keywords:["清爽","日常","轻快"],
    tagline:"你的穿搭总给人一种「很好相处」的感觉。",
    desc:"清爽、通勤、带一点松弛感。你适合干净颜色和方便活动的日常搭配。",
    closet:"你缺一件清爽衬衫，比复杂设计款更适合你的日常。",
    baseAttr:{ 温柔度:70, 氛围感:78, 甜美度:62, 舒适度:88, 显瘦力:76 }
  },
  swan:{
    id:"swan", name:"珍珠天鹅", emoji:"🦢",
    mbti:"ENTJ", style:"french",
    rarity:"UR", rarityText:"高级通勤系",
    keywords:["优雅","线条","质感"],
    tagline:"你不是在追求高级，你本身就是。",
    desc:"优雅、有线条、有质感。你适合法式收腰、垂坠面料和高级通勤路线。",
    closet:"你缺一件收腰西装或伞裙，把优雅和比例同时做出来。",
    baseAttr:{ 温柔度:72, 氛围感:94, 甜美度:60, 舒适度:58, 显瘦力:88 }
  }
};

/* ---------- 2. MBTI 附加信息 ---------- */
window.MBTI_TYPES_INFO = {
  INFP:{ name:"治愈系浪漫主义者", keys:["敏感","浪漫","审美","理想主义"] },
  ENFP:{ name:"自由灵魂的冒险家",   keys:["热情","好奇","灵感","感染力"] },
  INFJ:{ name:"静水之下的洞察者",   keys:["深度","共情","洞察","坚持"] },
  ENFJ:{ name:"温柔而坚定的引导者", keys:["温暖","组织","鼓舞","责任"] },
  ISFP:{ name:"安静的感知者",       keys:["细腻","当下","感受","松弛"] },
  ESFP:{ name:"闪耀的现场玩家",     keys:["活力","感染","乐观","分享"] },
  ISTP:{ name:"冷静的手艺人",       keys:["理性","务实","专注","克制"] },
  ESTP:{ name:"行动派的掌舵者",     keys:["果断","现实","掌控","刺激"] },
  INTP:{ name:"沉思的逻辑学家",     keys:["好奇","分析","独立","概念"] },
  ENTP:{ name:"灵感的辩论家",       keys:["机敏","跳跃","创新","不服"] },
  INTJ:{ name:"冷静的战略家",       keys:["深度","远见","独立","掌控"] },
  ENTJ:{ name:"坚定的指挥官",       keys:["果断","格局","目标","高效"] },
  ISFJ:{ name:"柔软的守护者",       keys:["体贴","周全","安静","坚持"] },
  ESFJ:{ name:"人群中的温暖者",     keys:["热情","周全","照顾","链接"] },
  ISTJ:{ name:"稳重的执行者",       keys:["可靠","规则","细致","稳定"] },
  ESTJ:{ name:"清晰的经营者",       keys:["务实","组织","效率","决断"] }
};

window.MBTI_EMOJI = {
  INFP:"🌙",ENFP:"✨",INFJ:"🔮",ENFJ:"🌞",
  ISFP:"🌿",ESFP:"🎈",ISTP:"⚙️",ESTP:"🔥",
  INTP:"📘",ENTP:"💡",INTJ:"♟️",ENTJ:"👑",
  ISFJ:"🍀",ESFJ:"🍬",ISTJ:"📎",ESTJ:"🏛️"
};

/* ---------- 3. MBTI → 10 人格 加分表 ---------- */
window.MBTI_SCORE_TABLE = {
  INFP:{cream_rabbit:10,moon_cat:4,honey_fox:5,gummy_bear:8,butterfly:9,forest_deer:8,panda:8,tiger:2,dolphin:5,swan:3},
  ENFP:{cream_rabbit:9,moon_cat:4,honey_fox:8,gummy_bear:7,butterfly:10,forest_deer:7,panda:8,tiger:4,dolphin:7,swan:4},
  INFJ:{cream_rabbit:9,moon_cat:7,honey_fox:7,gummy_bear:6,butterfly:7,forest_deer:7,panda:6,tiger:3,dolphin:4,swan:6},
  ENFJ:{cream_rabbit:8,moon_cat:5,honey_fox:10,gummy_bear:5,butterfly:8,forest_deer:6,panda:5,tiger:5,dolphin:6,swan:7},
  ISFP:{cream_rabbit:7,moon_cat:3,honey_fox:4,gummy_bear:10,butterfly:8,forest_deer:8,panda:10,tiger:4,dolphin:7,swan:2},
  ESFP:{cream_rabbit:7,moon_cat:3,honey_fox:6,gummy_bear:8,butterfly:9,forest_deer:6,panda:8,tiger:7,dolphin:10,swan:3},
  ISTP:{cream_rabbit:4,moon_cat:6,honey_fox:4,gummy_bear:7,butterfly:4,forest_deer:5,panda:6,tiger:9,dolphin:6,swan:5},
  ESTP:{cream_rabbit:2,moon_cat:3,honey_fox:6,gummy_bear:5,butterfly:5,forest_deer:2,panda:3,tiger:10,dolphin:8,swan:5},
  INTP:{cream_rabbit:6,moon_cat:9,honey_fox:4,gummy_bear:6,butterfly:5,forest_deer:5,panda:7,tiger:5,dolphin:4,swan:6},
  ENTP:{cream_rabbit:5,moon_cat:7,honey_fox:7,gummy_bear:5,butterfly:7,forest_deer:4,panda:5,tiger:8,dolphin:6,swan:7},
  INTJ:{cream_rabbit:4,moon_cat:10,honey_fox:5,gummy_bear:4,butterfly:4,forest_deer:4,panda:5,tiger:6,dolphin:3,swan:8},
  ENTJ:{cream_rabbit:3,moon_cat:7,honey_fox:7,gummy_bear:3,butterfly:5,forest_deer:3,panda:3,tiger:8,dolphin:5,swan:10},
  ISFJ:{cream_rabbit:8,moon_cat:5,honey_fox:6,gummy_bear:8,butterfly:6,forest_deer:10,panda:9,tiger:3,dolphin:5,swan:4},
  ESFJ:{cream_rabbit:8,moon_cat:4,honey_fox:9,gummy_bear:7,butterfly:7,forest_deer:8,panda:7,tiger:5,dolphin:8,swan:5},
  ISTJ:{cream_rabbit:5,moon_cat:8,honey_fox:5,gummy_bear:6,butterfly:4,forest_deer:8,panda:7,tiger:6,dolphin:5,swan:7},
  ESTJ:{cream_rabbit:4,moon_cat:6,honey_fox:7,gummy_bear:4,butterfly:4,forest_deer:6,panda:5,tiger:8,dolphin:7,swan:9}
};

/* ---------- 4. 题目 ---------- */
window.MBTI_QUESTIONS = [
  { title:"到了一个完全陌生的聚会，你会：", options:[
    { text:"主动认识别人", mbti:{E:2} },
    { text:"先观察一会儿", mbti:{I:2} }
  ]},
  { title:"买了一件特别好看的衣服，你会：", options:[
    { text:"很想穿出去让别人看到", mbti:{E:2} },
    { text:"自己喜欢就够了", mbti:{I:2} }
  ]},
  { title:"旅行的时候，你更喜欢：", options:[
    { text:"热闹、人多、有活动", mbti:{E:1} },
    { text:"安静、小众、慢慢逛", mbti:{I:1} }
  ]},
  { title:"买衣服时你第一眼更关注：", options:[
    { text:"面料、版型、实不实用", mbti:{S:2} },
    { text:"整体氛围、感觉、故事感", mbti:{N:2} }
  ]},
  { title:"看到一套穿搭，你更容易注意：", options:[
    { text:"「这件衣服好不好搭？」", mbti:{S:2} },
    { text:"「这个人好有感觉！」", mbti:{N:2} }
  ]},
  { title:"如果有两条裙子，你会选：", options:[
    { text:"一条百搭耐穿的", mbti:{S:1} },
    { text:"一条特别有设计感的", mbti:{N:1} }
  ]},
  { title:"两件衣服价格一样，你会选：", options:[
    { text:"更显瘦、版型更好的", mbti:{T:2} },
    { text:"更有氛围、更喜欢的", mbti:{F:2} }
  ]},
  { title:"朋友问你：「这件衣服好看吗？」你会：", options:[
    { text:"直接告诉她哪里不合适", mbti:{T:2} },
    { text:"先考虑她穿上会不会开心", mbti:{F:2} }
  ]},
  { title:"你买衣服最怕：", options:[
    { text:"买回来不好搭", mbti:{T:1} },
    { text:"买回来没有当初心动", mbti:{F:1} }
  ]},
  { title:"明天要出去玩，你什么时候决定穿什么？", options:[
    { text:"前一天就搭好了", mbti:{J:2} },
    { text:"明天看心情", mbti:{P:2} }
  ]},
  { title:"整理衣柜时，你更倾向于：", options:[
    { text:"喜欢分类、搭配好", mbti:{J:2} },
    { text:"能找到衣服就行", mbti:{P:2} }
  ]},
  { title:"买衣服的时候，你更常：", options:[
    { text:"先想好怎么搭再买", mbti:{J:1} },
    { text:"喜欢就先买了再说", mbti:{P:1} }
  ]}
];

window.CLOTHING_QUESTIONS = [
  { title:"你平时更喜欢哪种穿搭？", options:[
    { text:"简约通勤", p:{moon_cat:3,tiger:2,swan:2,dolphin:1}, tags:{style:"minimal", color:"neutral"} },
    { text:"甜美温柔", p:{cream_rabbit:3,butterfly:2,honey_fox:2}, tags:{style:"sweet", color:"light"} },
    { text:"韩系休闲", p:{gummy_bear:3,forest_deer:2,panda:2,dolphin:1}, tags:{style:"korean", color:"earth"} },
    { text:"法式气质", p:{swan:3,butterfly:2,honey_fox:2,moon_cat:1}, tags:{style:"french", color:"light"} }
  ]},
  { title:"你最常穿衣服的场景是？", options:[
    { text:"上班 / 通勤", p:{moon_cat:2,honey_fox:2,swan:2,dolphin:1}, tags:{scene:"work"} },
    { text:"约会 / 聚会", p:{cream_rabbit:2,honey_fox:2,butterfly:2}, tags:{scene:"date"} },
    { text:"逛街 / 日常", p:{gummy_bear:2,panda:2,dolphin:2}, tags:{scene:"daily"} },
    { text:"旅行 / 拍照", p:{forest_deer:2,dolphin:2,gummy_bear:1}, tags:{scene:"travel"} },
    { text:"正式场合", p:{swan:3,moon_cat:1,honey_fox:1}, tags:{scene:"formal"} },
    { text:"居家 / 放松", p:{panda:3,gummy_bear:2,cream_rabbit:1}, tags:{scene:"home"} }
  ]},
  { title:"买衣服时，你最在意什么？", options:[
    { text:"显瘦", p:{moon_cat:2,honey_fox:2,tiger:2,swan:2}, tags:{need:"thin"} },
    { text:"显高", p:{moon_cat:2,butterfly:2,tiger:2,dolphin:1,swan:2}, tags:{need:"tall"} },
    { text:"遮胯 / 修饰腿型", p:{cream_rabbit:1,gummy_bear:2,forest_deer:3,panda:1}, tags:{need:"hip"} },
    { text:"舒服好穿", p:{gummy_bear:3,panda:2,dolphin:2}, tags:{need:"comfort"} },
    { text:"显腰线", p:{honey_fox:2,butterfly:2,swan:2,cream_rabbit:1}, tags:{need:"waist"} },
    { text:"修饰手臂", p:{forest_deer:2,panda:2,moon_cat:1}, tags:{need:"arm"} }
  ]},
  { title:"你更喜欢哪种版型？", options:[
    { text:"修身，突出身材曲线", p:{honey_fox:2,swan:2,tiger:1,butterfly:1}, tags:{fit:"slim"} },
    { text:"微宽松，比较自然", p:{moon_cat:1,gummy_bear:2,forest_deer:2,dolphin:1}, tags:{fit:"regular"} },
    { text:"宽松，穿着舒服", p:{gummy_bear:3,panda:2,dolphin:1}, tags:{fit:"loose"} },
    { text:"根据衣服决定", p:{butterfly:1,honey_fox:1,forest_deer:1}, tags:{fit:"mix"} }
  ]},
  { title:"你平时更常穿什么颜色？", options:[
    { text:"黑白灰", p:{moon_cat:2,tiger:2,swan:1,panda:1}, tags:{color:"neutral"} },
    { text:"米色 / 卡其", p:{forest_deer:2,gummy_bear:2,cream_rabbit:1}, tags:{color:"earth"} },
    { text:"粉色 / 浅色", p:{cream_rabbit:2,butterfly:2,honey_fox:1}, tags:{color:"light"} },
    { text:"喜欢亮色", p:{butterfly:2,dolphin:2,tiger:1}, tags:{color:"bright"} }
  ]},
  { title:"下面哪句话更像你？", options:[
    { text:"越简单越高级", p:{moon_cat:3,panda:1,tiger:1,swan:1}, tags:{style:"minimal"} },
    { text:"喜欢温柔有女人味", p:{cream_rabbit:3,honey_fox:2,butterfly:1}, tags:{style:"sweet"} },
    { text:"舒服最重要", p:{gummy_bear:3,panda:2,dolphin:2,forest_deer:1}, tags:{style:"korean"} },
    { text:"喜欢有设计感的衣服", p:{butterfly:2,swan:2,honey_fox:1,tiger:1}, tags:{style:"french"} }
  ]},
  { title:"你比较希望衣服解决什么问题？", options:[
    { text:"显腰线", p:{honey_fox:2,butterfly:1,swan:1,cream_rabbit:1}, tags:{need:"waist"} },
    { text:"遮住胯部", p:{forest_deer:2,gummy_bear:1,panda:1}, tags:{need:"hip"} },
    { text:"修饰手臂", p:{panda:2,forest_deer:1,moon_cat:1}, tags:{need:"arm"} },
    { text:"整体显高显瘦", p:{moon_cat:2,tiger:2,swan:1,dolphin:1}, tags:{need:"overall"} }
  ]},
  { title:"你的衣柜里最多的是？", options:[
    { text:"基础款", p:{moon_cat:2,panda:2,dolphin:1}, tags:{wardrobe:"basic"} },
    { text:"裙装", p:{cream_rabbit:2,butterfly:2,swan:1}, tags:{wardrobe:"dress"} },
    { text:"针织 / 开衫", p:{cream_rabbit:2,forest_deer:2,gummy_bear:1}, tags:{wardrobe:"knit"} },
    { text:"外套 / 西装", p:{moon_cat:1,tiger:1,swan:2,honey_fox:1}, tags:{wardrobe:"coat"} },
    { text:"卫衣 / 运动", p:{gummy_bear:2,dolphin:2,panda:1}, tags:{wardrobe:"hoodie"} }
  ]}
];

window.ALL_QUESTIONS = [
  ...window.MBTI_QUESTIONS.map(q => ({ kind:"mbti", ...q })),
  ...window.CLOTHING_QUESTIONS.map(q => ({ kind:"clothing", ...q })),
  { kind:"info", title:"最后，告诉我你的基本信息", subtitle:"用于给你更合适的版型建议" }
];

/* ---------- 5. 商品库 ---------- */
window.DEFAULT_PRODUCTS = [
  {
    id:"p1", name:"奶油色高腰A字半身裙", price:129,
    image:"images/products/cream-skirt.jpg",
    url:"#", styles:["sweet","french"], personas:["cream_rabbit","butterfly","honey_fox","forest_deer"],
    scenes:["date","daily"], needs:["hip","waist","thin"], fits:["regular","slim"], colors:["light"]
  },
  {
    id:"p2", name:"法式收腰连衣裙", price:169,
    image:"images/products/french-dress.jpg",
    url:"#", styles:["french","sweet"], personas:["butterfly","swan","honey_fox"],
    scenes:["date","formal"], needs:["waist","thin"], fits:["slim"], colors:["light"]
  },
  {
    id:"p3", name:"奶油色柔软针织开衫", price:99,
    image:"images/products/knit-cardigan.jpg",
    url:"#", styles:["sweet","korean"], personas:["cream_rabbit","forest_deer","honey_fox"],
    scenes:["daily","work"], needs:["comfort","arm"], fits:["regular"], colors:["light","earth"]
  },
  {
    id:"p4", name:"黑色高腰直筒西装裤", price:159,
    image:"images/products/black-pants.jpg",
    url:"#", styles:["minimal"], personas:["moon_cat","tiger","swan","dolphin"],
    scenes:["work","formal"], needs:["hip","thin","tall"], fits:["regular"], colors:["neutral"]
  },
  {
    id:"p5", name:"米色收腰风衣外套", price:289,
    image:"images/products/trench-coat.jpg",
    url:"#", styles:["french","minimal"], personas:["swan","moon_cat","honey_fox"],
    scenes:["work","travel"], needs:["waist","thin","tall"], fits:["regular"], colors:["earth"]
  },
  {
    id:"p6", name:"燕麦色简约衬衫", price:89,
    image:"images/products/oat-shirt.jpg",
    url:"#", styles:["minimal","korean"], personas:["moon_cat","panda","dolphin"],
    scenes:["work","daily"], needs:["comfort"], fits:["regular","loose"], colors:["neutral","earth"]
  },
  {
    id:"p7", name:"浅紫百褶半身裙", price:119,
    image:"images/products/pleated-skirt.jpg",
    url:"#", styles:["sweet","french"], personas:["cream_rabbit","butterfly","forest_deer"],
    scenes:["date","daily"], needs:["waist","hip"], fits:["regular"], colors:["light"]
  },
  {
    id:"p8", name:"黑色收腰西装外套", price:239,
    image:"images/products/black-blazer.jpg",
    url:"#", styles:["minimal","french"], personas:["tiger","swan","moon_cat"],
    scenes:["work","formal"], needs:["waist","thin","tall"], fits:["slim"], colors:["neutral"]
  },
  {
    id:"p9", name:"灰色宽松卫衣", price:79,
    image:"images/products/grey-hoodie.jpg",
    url:"#", styles:["korean"], personas:["gummy_bear","panda","dolphin"],
    scenes:["daily","home"], needs:["comfort"], fits:["loose"], colors:["neutral"]
  },
  {
    id:"p10", name:"米白直筒阔腿裤", price:139,
    image:"images/products/white-pants.jpg",
    url:"#", styles:["minimal","korean"], personas:["moon_cat","dolphin","panda"],
    scenes:["work","travel"], needs:["tall","thin","comfort"], fits:["loose","regular"], colors:["light","neutral"]
  }
];

/* ---------- 6. 衣柜缺口规则 ---------- */
window.WARDROBE_GAP_RULES = [
  { id:"thin_no_slim", weight:96,
    match:d => d.has(d.needs,"thin") && !d.has(d.fits,"slim"),
    gap:"一件不紧身但能显瘦的上衣",
    why:"你想要显瘦，但不喜欢修身版型——那就要靠垂坠面料和纵向线条，而不是靠紧。",
    keys:["垂坠","V领","深色","纵向"] },
  { id:"tall_highwaist", weight:95,
    match:d => d.has(d.needs,"tall"),
    gap:"一条高腰下装",
    why:"显高最省力的办法不是穿高跟鞋，而是把腰线整体抬高 3–5cm。",
    keys:["高腰","直筒","拖地","同色系"] },
  { id:"hip_cover", weight:94,
    match:d => d.has(d.needs,"hip"),
    gap:"一条A字裙或直筒裤",
    why:"遮胯最忌讳紧身包臀。A字和直筒能把胯线藏进版型里。",
    keys:["A字","直筒","高腰","垂坠"] },
  { id:"waist_line", weight:93,
    match:d => d.has(d.needs,"waist"),
    gap:"一条腰带，或一件自带收腰设计的上衣",
    why:"你要的是「看起来有腰」，不是「勒出腰」。自带收腰或加腰带都行。",
    keys:["收腰","腰带","高腰","短款"] },
  { id:"arm_cover", weight:92,
    match:d => d.has(d.needs,"arm"),
    gap:"一件五分袖或落肩设计的衬衫",
    why:"修饰手臂的关键是「遮到最细的地方」——五分袖和落肩比无袖更好用。",
    keys:["五分袖","落肩","宽松袖"] },
  { id:"comfort_loose", weight:91,
    match:d => d.has(d.needs,"comfort") && d.has(d.fits,"loose"),
    gap:"一件可以从上班穿到周末的松弛感单品",
    why:"你想要舒服又要宽松，那一件「体面但不紧绷」的单品，比一堆家居服更实用。",
    keys:["松弛","针织","直筒","软面料"] },
  { id:"thin_tall", weight:88,
    match:d => d.has(d.needs,"thin") && d.has(d.needs,"tall"),
    gap:"一条高腰直筒裤",
    why:"显高和显瘦可以同时做到——高腰 + 直筒是最稳定的组合。",
    keys:["高腰","直筒","深色","拖地"] },
  { id:"comfort_hip", weight:87,
    match:d => d.has(d.needs,"comfort") && d.has(d.needs,"hip"),
    gap:"一条宽松但显比例的A字裙",
    why:"你要舒服又要遮胯，A字裙比阔腿裤更好控比例。",
    keys:["A字","松紧腰","垂坠","中长"] },
  { id:"waist_hip", weight:86,
    match:d => d.has(d.needs,"waist") && d.has(d.needs,"hip"),
    gap:"一条自带腰线的连衣裙",
    why:"腰线和胯部同时要处理时，连衣裙比上下装更好控。",
    keys:["收腰","连衣裙","A字","伞裙"] },
  { id:"scene_work_minimal", weight:82,
    match:d => d.has(d.scenes,"work") && d.has(d.styles,"minimal"),
    gap:"一件通勤不出错的西装或衬衫",
    why:"你常穿通勤，又偏好简约——外套和衬衫是拉高整体质感的关键。",
    keys:["西装","衬衫","通勤","简约"] },
  { id:"scene_date_light", weight:81,
    match:d => d.has(d.scenes,"date") && d.has(d.colors,"light"),
    gap:"一件约会专用的浅色单品",
    why:"约会场景里，浅色比黑色更容易被记住，也更上镜。",
    keys:["浅色","约会","裙装","针织"] },
  { id:"scene_travel_comfort", weight:80,
    match:d => d.has(d.scenes,"travel") && d.has(d.needs,"comfort"),
    gap:"一件好穿又上镜的衬衫",
    why:"旅行要同时满足「坐得舒服」和「拍照好看」，衬衫是性价比最高的选择。",
    keys:["衬衫","旅行","宽松","浅色"] },
  { id:"scene_formal_french", weight:80,
    match:d => d.has(d.scenes,"formal") && d.has(d.styles,"french"),
    gap:"一件收腰连衣裙或伞裙",
    why:"正式场合走法式路线，收腰和伞摆是最不容易出错的结构。",
    keys:["收腰","伞裙","连衣裙","垂坠"] },
  { id:"color_bright_base", weight:76,
    match:d => d.has(d.colors,"bright"),
    gap:"一件能压住亮色的黑白灰基础款",
    why:"你喜欢亮色，但亮色需要「托底」——黑白灰就是你的安全垫。",
    keys:["基础款","黑白灰","简约"] },
  { id:"color_neutral_vibe", weight:75,
    match:d => d.has(d.colors,"neutral") && d.attrs.氛围感 >= 85,
    gap:"一件有氛围感的浅色单品",
    why:"你常穿黑白灰，但你的氛围感很高——加一件浅色，整体会立刻不一样。",
    keys:["浅色","氛围","针织","裙装"] },
  { id:"color_earth_gentle", weight:74,
    match:d => d.has(d.colors,"earth") && d.attrs.温柔度 >= 85,
    gap:"一件米色针织开衫",
    why:"大地色 + 高温柔度，开衫是最能放大你气质的一件。",
    keys:["米色","开衫","针织","温柔"] },
  { id:"wardrobe_basic_vibe", weight:72,
    match:d => d.has(d.wardrobe,"basic") && d.attrs.氛围感 >= 80,
    gap:"一件有设计感的主角单品",
    why:"你衣柜里基础款很多，但你的氛围感不低——缺一件能「站出来」的主角单品。",
    keys:["设计感","主角","氛围","裙装"] },
  { id:"wardrobe_no_dress_sweet", weight:71,
    match:d => !d.has(d.wardrobe,"dress") && d.attrs.甜美度 >= 80,
    gap:"一条百褶裙或A字裙",
    why:"你甜美度很高，但衣柜里没有裙装——这是你最容易补上、也最容易出效果的一件。",
    keys:["百褶","A字","裙装","甜美"] },
  { id:"wardrobe_no_coat_work", weight:70,
    match:d => !d.has(d.wardrobe,"coat") && d.has(d.scenes,"work"),
    gap:"一件短款西装或风衣",
    why:"你常穿通勤，但没有外套——外套是通勤穿搭里最能拉开差距的单品。",
    keys:["西装","风衣","通勤","短款"] },
  { id:"wardrobe_knit_gentle", weight:69,
    match:d => !d.has(d.wardrobe,"knit") && d.attrs.温柔度 >= 82,
    gap:"一件柔软针织上衣",
    why:"你温柔度高，但没有针织单品——针织是最能放大温柔气质的材质。",
    keys:["针织","柔软","温柔","浅色"] },
  { id:"mbti_contrast", weight:65,
    match:d => {
      const map = {
        INFP:["tiger","swan"],ENFP:["moon_cat","panda"],
        INFJ:["butterfly","tiger"],ENFJ:["moon_cat","panda"],
        ISFP:["tiger","swan"],ESFP:["moon_cat","panda"],
        ISTP:["butterfly","cream_rabbit"],ESTP:["moon_cat","cream_rabbit"],
        INTP:["butterfly","cream_rabbit"],ENTP:["forest_deer","panda"],
        INTJ:["butterfly","cream_rabbit"],ENTJ:["forest_deer","panda"],
        ISFJ:["tiger","swan"],ESFJ:["moon_cat","tiger"],
        ISTJ:["butterfly","honey_fox"],ESTJ:["butterfly","cream_rabbit"]
      };
      return map[d.mbti] && map[d.mbti].includes(d.hidden.id);
    },
    gap:"一件和你隐藏人格呼应的单品",
    why:"你的主人格和隐藏人格差异比较大——加一件隐藏人格方向的单品，能让你在不同场合切换得更自然。",
    keys:["反差","隐藏人格","风格切换"] },
  { id:"fallback_persona", weight:40,
    match:() => true,
    gap:"一件最能代表你人格的主打单品",
    why:"如果只能补一件，先补最能代表你穿搭人格的那件。",
    keys:["主打","人格","代表性"] }
];

/* ---------- 7. 中文映射 ---------- */
window.CN = {
  need:  { thin:"显瘦", tall:"显高", hip:"遮胯", comfort:"舒服", waist:"显腰线", arm:"修饰手臂", overall:"显高显瘦" },
  color: { neutral:"黑白灰", earth:"米色/卡其", light:"浅色", bright:"亮色" },
  scene: { work:"通勤", date:"约会", daily:"日常", travel:"旅行", formal:"正式场合", home:"居家" },
  fit:   { slim:"修身", regular:"微宽松", loose:"宽松", mix:"混搭" },
  style: { minimal:"简约", sweet:"甜美", korean:"韩系", french:"法式" }
};

/* ---------- 8. 穿搭公式配置 ---------- */
window.FORMULA_BY_STYLE = {
  minimal:{
    parts:["纯色针织 / 衬衫","高腰直筒裤或A字裙","线条简洁的西装或风衣"],
    result:"简约高级感"
  },
  sweet:{
    parts:["柔软针织 / 泡泡袖衬衫","百褶裙或A字裙","短款小开衫"],
    result:"温柔浪漫感"
  },
  korean:{
    parts:["宽松卫衣 / 衬衫","直筒牛仔裤或工装裤","Oversize衬衫当外套"],
    result:"自然松弛感"
  },
  french:{
    parts:["V领 / 方领上衣","收腰连衣裙或伞裙","短款小香风或西装"],
    result:"法式氛围感"
  }
};

/* ---------- 9. 段位配置（娱乐性） ---------- */
window.TIER_LEVELS = [
  { min: 0,  max: 60,  name:"青铜", tier:"入门玩家" },
  { min: 60, max: 72,  name:"白银", tier:"基础玩家" },
  { min: 72, max: 82,  name:"黄金", tier:"氛围感玩家" },
  { min: 82, max: 90,  name:"铂金", tier:"风格稳定者" },
  { min: 90, max: 96,  name:"钻石", tier:"穿搭高手" },
  { min: 96, max: 999, name:"王者", tier:"风格天花板" }
];

/* ---------- 10. 幸运穿搭配置 ---------- */
window.LUCKY_COLORS = ["奶油白","雾霾蓝","燕麦色","莫兰迪粉","深可可","石灰色","香槟金","墨黑"];
window.LUCKY_ITEMS = ["高腰A字裙","收腰西装","柔软针织","直筒西装裤","百褶半身裙","白衬衫","针织开衫","风衣外套"];
window.LUCKY_KEYWORDS = ["轻盈","清透","松弛","利落","氛围","克制","浪漫","干净"];