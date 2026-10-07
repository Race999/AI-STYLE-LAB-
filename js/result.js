/* ============================================================
   商品占位图（极简线条 SVG）
   ============================================================ */
.ph-svg{
  width:100%;height:100%;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#F7F3ED 0%,#EDE6DA 100%);
  color:#B7AC9C;
}
.ph-svg .ph-icon{ width:72px;height:72px;opacity:.72; }
.ph-svg .ph-icon svg{ width:100%;height:100%;display:block; }

/* ============================================================
   3D 穿搭公仔展示区
   ============================================================ */
.character-stage-wrap{
  padding:0 22px;
  margin-top:6px;
  margin-bottom:14px;
  opacity:0;
  transform:translateY(10px);
  animation:charReveal .8s cubic-bezier(.2,.7,.3,1) .15s forwards;
}
@keyframes charReveal{ to{opacity:1;transform:translateY(0)} }

.character-kicker{
  font-size:10px;letter-spacing:3px;
  color:var(--gold);font-weight:700;
  text-align:center;margin-bottom:12px;
}
.character-stage{
  position:relative;
  width:100%;height:440px;
  background:radial-gradient(120% 90% at 50% 0%, #FBF9F5 0%, #F0E9DD 60%, #E9E0D0 100%);
  border-radius:22px;
  overflow:hidden;
  border:1px solid var(--line-2);
  box-shadow:0 6px 26px rgba(23,23,23,.06), inset 0 0 0 1px rgba(255,255,255,.6);
  touch-action:none;
  -webkit-user-select:none;user-select:none;
  cursor:grab;
}
.character-stage:active{cursor:grabbing}
.character-stage canvas{
  display:block;
  width:100% !important;
  height:100% !important;
  touch-action:none;
  outline:none;
}
.character-loading{
  position:absolute;inset:0;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:12px;
  color:var(--text-3);font-size:13px;
  letter-spacing:.5px;
  pointer-events:none;
  transition:opacity .35s ease;
}
.character-loading .spinner{
  width:18px;height:18px;
  border:2px solid #ECE7E0;
  border-top-color:var(--gold);
  border-radius:50%;
  animation:spin .9s linear infinite;
}
.character-loading.hide{opacity:0}
.character-hint{
  text-align:center;
  font-size:11px;
  color:var(--text-3);
  margin-top:14px;
  letter-spacing:1.5px;font-weight:500;
}
@media(max-width:400px){
  .character-stage{height:380px}
}
