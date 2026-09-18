'use client'
import { useState } from "react";
import Link from "next/link";

// ── 날짜 상수 ─────────────────────────────────────────────
const START_DATE = new Date(2026, 6, 2);   // 2026-07-02 Day 1
const TOTAL_WEEKS = 24;
const TOTAL_DAYS  = TOTAL_WEEKS * 7;       // 168일

const DEFAULT_INITIAL = { weight: 72.5, muscle: 30.5, fat: 18.4 }; // fat = 72.5 × 0.254
const MUSCLE_GOAL = 33.0;
const FAT_GOAL    = 14.0; // 목표 체지방률 ~20% × 70kg

// ── 운동 데이터 ──────────────────────────────────────────
const EX = {
  // 가슴
  덤벨벤치프레스:      { sets:{p1:"4×8-10",  p2:null,     p3:"3×10-15"}, tw:{p1:"각12~15kg",p2:null,p3:"각14~16kg"}, yt:"덤벨 벤치프레스 자세" },
  인클라인덤벨프레스:  { sets:{p1:"3×10-12", p2:"3×10-12",p3:"3×10-15"}, tw:{p1:"각10~12kg",p2:"각12~14kg",p3:"각12~14kg"}, yt:"인클라인 덤벨 프레스 자세" },
  바벨벤치프레스:      { sets:{p1:null,      p2:"5×5",    p3:"3×10-15"}, tw:{p1:null,p2:"60~70kg",p3:"60~70kg"}, yt:"바벨 벤치프레스 자세" },
  // 삼두
  케이블트라이셉스:    { sets:{p1:"3×10-12", p2:"3×10-12",p3:"3×10-15"}, tw:{p1:"각12~15kg",p2:"각15~18kg",p3:"각15~18kg"}, yt:"케이블 트라이셉스 푸시다운 자세" },
  오버헤드트라이셉스:  { sets:{p1:"3×10-12", p2:"3×10-12",p3:"3×10-15"}, tw:{p1:"10~12kg",  p2:"12~14kg",  p3:"12~14kg"},   yt:"오버헤드 트라이셉스 익스텐션 자세" },
  // 어깨
  숄더프레스:          { sets:{p1:"3×8-10",  p2:"3×8-10", p3:"3×10-15"}, tw:{p1:"각10~14kg",p2:"각14~18kg",p3:"각12~16kg"}, yt:"덤벨 숄더프레스 자세" },
  사이드레터럴:        { sets:{p1:"3×12-15", p2:"3×12-15",p3:"4×12-15"}, tw:{p1:"각6~8kg",  p2:"각8~10kg", p3:"각8~10kg"},  yt:"사이드 레터럴 레이즈 자세" },
  사이드레터럴고반복:  { sets:{p1:null,      p2:null,     p3:"4×15-20"}, tw:{p1:null,p2:null,p3:"각6~8kg"}, yt:"사이드 레터럴 레이즈 자세" },
  // 등
  랫풀다운:            { sets:{p1:"4×8-10",  p2:"3×10-12",p3:"3×10-15"}, tw:{p1:"50~60kg",p2:"55~65kg",p3:"55~65kg"}, yt:"랫풀다운 자세" },
  바벨로우:            { sets:{p1:"3×8-10",  p2:"5×5",    p3:"3×10-15"}, tw:{p1:"50~60kg",p2:"70~80kg",p3:"60~70kg"}, yt:"바벨 로우 자세" },
  시티드케이블로우:    { sets:{p1:"3×10-12", p2:"3×10-12",p3:"3×10-15"}, tw:{p1:"45~55kg",p2:"50~60kg",p3:"50~60kg"}, yt:"시티드 케이블 로우 자세" },
  페이스풀:            { sets:{p1:"3×12-15", p2:"3×12-15",p3:"3×12-15"}, tw:{p1:"각12~15kg",p2:"각15~18kg",p3:"각15~18kg"}, yt:"페이스풀 자세" },
  풀업:                { sets:{p1:null,      p2:"5×5",    p3:"3×8-12" }, tw:null, yt:"풀업 자세 방법" },
  // 이두
  덤벨컬:              { sets:{p1:"3×10-12", p2:"3×10-12",p3:"3×10-15"}, tw:{p1:"각10~12kg",p2:"각12~14kg",p3:"각12~14kg"}, yt:"덤벨 컬 자세" },
  해머컬:              { sets:{p1:"3×10-12", p2:"3×10-12",p3:"3×10-15"}, tw:{p1:"각10~12kg",p2:"각12~14kg",p3:"각12~14kg"}, yt:"해머컬 자세" },
  // 하체
  바벨스쿼트:          { sets:{p1:"4×8-10",  p2:"5×5",    p3:"3×10-15"}, tw:{p1:"60~70kg",p2:"80~90kg",p3:"70~80kg"}, yt:"바벨 스쿼트 자세" },
  레그프레스:          { sets:{p1:"3×10-12", p2:"3×10-12",p3:"3×10-15"}, tw:{p1:"80~100kg",p2:"100~120kg",p3:"90~110kg"}, yt:"레그프레스 자세" },
  루마니안데드리프트:  { sets:{p1:"3×8-10",  p2:"3×8-10", p3:"3×10-15"}, tw:{p1:"60~70kg",p2:"70~80kg",p3:"65~75kg"}, yt:"루마니안 데드리프트 자세" },
  레그컬:              { sets:{p1:"3×10-12", p2:"3×10-12",p3:"3×10-15"}, tw:{p1:"35~45kg",p2:"40~50kg",p3:"40~50kg"}, yt:"레그컬 자세" },
  레그익스텐션:        { sets:{p1:"3×12-15", p2:"3×12-15",p3:"3×12-15"}, tw:{p1:"30~40kg",p2:"35~45kg",p3:"35~45kg"}, yt:"레그익스텐션 자세" },
  카프레이즈:          { sets:{p1:"4×15-20", p2:"4×15-20",p3:"4×20-25"}, tw:{p1:"자체중량+덤벨",p2:"자체중량+덤벨",p3:"자체중량"}, yt:"카프레이즈 자세" },
  // 유산소
  Zone2유산소:         { sets:{p1:null,      p2:null,     p3:"20~30분"}, tw:null, yt:"Zone 2 유산소 운동 방법" },
  HIIT서킷:            { sets:{p1:null,      p2:null,     p3:"10~15분"}, tw:null, yt:"인터벌 서킷 트레이닝" },
};

// ── 부위별 교체 그룹 ─────────────────────────────────────
const GROUPS = {
  "가슴":   ["덤벨벤치프레스","인클라인덤벨프레스","바벨벤치프레스"],
  "삼두":   ["케이블트라이셉스","오버헤드트라이셉스"],
  "어깨":   ["숄더프레스","사이드레터럴","사이드레터럴고반복"],
  "등":     ["랫풀다운","바벨로우","시티드케이블로우","페이스풀","풀업"],
  "이두":   ["덤벨컬","해머컬"],
  "하체":   ["바벨스쿼트","레그프레스","루마니안데드리프트","레그컬","레그익스텐션","카프레이즈"],
  "유산소": ["Zone2유산소","HIIT서킷"],
};
const EX_GROUP = {};
Object.entries(GROUPS).forEach(([g,keys])=>keys.forEach(k=>{EX_GROUP[k]=g;}));

// ── Phase 정보 ────────────────────────────────────────────
// weeks: [시작주, 종료주], 각 phase의 마지막 주 = 디로드
const PHASE_INFO = [
  {
    phase:1, weeks:[1,8], label:"근비대 기초", color:"#4a90d9", bg:"#eef5fd",
    focus:"볼륨 축적 + 자세 완성", pKey:"p1",
    rpe:"RPE 7~8", rest:"휴식 60~90초",
    tip:"실패 2~3회 전에 세트 종료. 자세가 무너지면 무게를 줄이세요.",
    meal:{ kcal:2200, protein:130, carb:265, fat:70 },
    push:{ type:"Push", part:"가슴·어깨·삼두", exKeys:["덤벨벤치프레스","인클라인덤벨프레스","숄더프레스","사이드레터럴","케이블트라이셉스","오버헤드트라이셉스"] },
    pull:{ type:"Pull", part:"등·이두",         exKeys:["랫풀다운","바벨로우","시티드케이블로우","페이스풀","덤벨컬","해머컬"] },
    legs:{ type:"Legs", part:"하체",            exKeys:["바벨스쿼트","레그프레스","루마니안데드리프트","레그컬","레그익스텐션","카프레이즈"] },
  },
  {
    phase:2, weeks:[9,16], label:"근력 강화", color:"#2d7a4f", bg:"#eaf7f0",
    focus:"메인 리프트 5×5 + 점진적 과부하", pKey:"p2",
    rpe:"RPE 8~9", rest:"메인 90~120초 / 보조 60~90초",
    tip:"메인 리프트 매주 2.5~5% 증량 목표. 기록이 안 되면 무게 고정 후 횟수부터.",
    meal:{ kcal:2300, protein:140, carb:275, fat:72 },
    push:{ type:"Push", part:"가슴·어깨·삼두", exKeys:["바벨벤치프레스","인클라인덤벨프레스","숄더프레스","사이드레터럴","케이블트라이셉스","오버헤드트라이셉스"] },
    pull:{ type:"Pull", part:"등·이두",         exKeys:["바벨로우","풀업","랫풀다운","시티드케이블로우","덤벨컬","해머컬"] },
    legs:{ type:"Legs", part:"하체",            exKeys:["바벨스쿼트","레그프레스","루마니안데드리프트","레그컬","레그익스텐션","카프레이즈"] },
  },
  {
    phase:3, weeks:[17,24], label:"린매스업", color:"#b07d30", bg:"#fdf5e6",
    focus:"체지방 감량 + 근육 유지", pKey:"p3",
    rpe:"RPE 7~8", rest:"휴식 60초 (밀도 높이기)",
    tip:"칼로리 -300~500kcal. 단백질 130g 이상 유지가 핵심. Zone 2 유산소 주 3~4회.",
    meal:{ kcal:1900, protein:145, carb:200, fat:60 },
    push:{ type:"Push", part:"가슴·어깨·삼두 + 유산소", exKeys:["바벨벤치프레스","인클라인덤벨프레스","숄더프레스","사이드레터럴고반복","케이블트라이셉스","오버헤드트라이셉스","Zone2유산소"] },
    pull:{ type:"Pull", part:"등·이두 + 유산소",         exKeys:["랫풀다운","바벨로우","시티드케이블로우","페이스풀","덤벨컬","해머컬","Zone2유산소"] },
    legs:{ type:"Legs", part:"하체 + 유산소",            exKeys:["바벨스쿼트","레그프레스","루마니안데드리프트","레그컬","레그익스텐션","카프레이즈","Zone2유산소"] },
  },
];

// 7일 사이클: 0=PushA, 1=PullA, 2=LegsA, 3=PushB, 4=PullB, 5=LegsB, 6=Rest
const CYCLE_WORKOUT = ["push","pull","legs","push","pull","legs","rest"];
const CYCLE_LABEL   = ["Push A","Pull A","Legs A","Push B","Pull B","Legs B","Rest"];
const typeColor = { Push:"#4a90d9", Pull:"#2d7a4f", Legs:"#b07d30", Rest:"#bbb", 준비:"#ccc" };

// ── 날짜 헬퍼 ────────────────────────────────────────────
function dateKey(d) { return d.toISOString().slice(0,10); }
function getDaysPassed(date) {
  const d = date||new Date(); d.setHours ? undefined : null;
  const ref = new Date(date||new Date()); ref.setHours(0,0,0,0);
  return Math.floor((ref - START_DATE) / 86400000);
}
function getWeekNum(days) { return Math.floor(days/7)+1; }
function isDeloadWeek(days) { const w=getWeekNum(days); return w===8||w===16||w===24; }
function getPhaseByDays(days) {
  if (days < 56) return PHASE_INFO[0];
  if (days < 112) return PHASE_INFO[1];
  return PHASE_INFO[2];
}
function getCyclePlan(date, ph) {
  const days = getDaysPassed(date);
  if (days < 0) return { type:"준비", part:"운동 시작 전", exKeys:[], cycleDay:-1 };
  if (days >= TOTAL_DAYS) return { type:"Rest", part:"플랜 완료", exKeys:[], cycleDay:-1 };
  const cycleDay = days % 7;
  const wType = CYCLE_WORKOUT[cycleDay]; // "push"|"pull"|"legs"|"rest"
  if (wType === "rest") return { type:"Rest", part:"완전 휴식", exKeys:[], cycleDay, label:CYCLE_LABEL[cycleDay] };
  const plan = ph[wType];
  return { ...plan, cycleDay, label: CYCLE_LABEL[cycleDay] };
}
function getWeekDates(offset) {
  const today = new Date(); today.setHours(0,0,0,0);
  const sun = new Date(today); sun.setDate(today.getDate()-today.getDay()+offset*7);
  return Array.from({length:7},(_,i)=>{ const d=new Date(sun); d.setDate(sun.getDate()+i); return d; });
}

function exName(key) {
  const map = {
    덤벨벤치프레스:"덤벨 벤치프레스",인클라인덤벨프레스:"인클라인 덤벨 프레스",
    바벨벤치프레스:"바벨 벤치프레스",케이블트라이셉스:"케이블 트라이셉스 푸시다운",
    오버헤드트라이셉스:"오버헤드 트라이셉스 익스텐션",숄더프레스:"숄더 프레스",
    사이드레터럴:"사이드 레터럴 레이즈",사이드레터럴고반복:"사이드 레터럴 (고반복)",
    랫풀다운:"랫풀다운",바벨로우:"바벨 로우",시티드케이블로우:"시티드 케이블 로우",
    페이스풀:"페이스풀",풀업:"풀업",덤벨컬:"덤벨 컬",해머컬:"해머 컬",
    바벨스쿼트:"바벨 스쿼트",레그프레스:"레그 프레스",루마니안데드리프트:"루마니안 데드리프트",
    레그컬:"레그 컬",레그익스텐션:"레그 익스텐션",카프레이즈:"카프 레이즈",
    Zone2유산소:"Zone 2 유산소 (20~30분)",HIIT서킷:"HIIT 서킷 (10~15분)",
  };
  return map[key]||key;
}
function ytLink(key) {
  const ex=EX[key]; if(!ex) return null;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.yt)}`;
}
function load(k,d){ try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;} }
function save(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch{ /* storage unavailable, e.g. private mode */ } }

// ── 점진적 과부하 ────────────────────────────────────────
const CARDIO_KEYS    = new Set(["Zone2유산소","HIIT서킷"]);
const BODYWEIGHT_KEYS= new Set(["풀업","카프레이즈"]);
function isCardio(key) { return CARDIO_KEYS.has(key); }
function isBodyweight(key) { return BODYWEIGHT_KEYS.has(key); }

function getOverloadStatus(records) {
  if (!records||records.length===0) return null;
  const sorted = [...records].sort((a,b)=>a.date.localeCompare(b.date));
  const last = sorted[sorted.length-1];
  const maxW = Math.max(...sorted.map(r=>r.weight||0));
  const isPR = (last.weight||0)>=maxW && sorted.length>1;
  let streak=1;
  for(let i=sorted.length-2;i>=0;i--) {
    const a=sorted[i],b=sorted[i+1];
    if(a.weight===b.weight&&a.reps===b.reps) streak++; else break;
  }
  let trend=null;
  if(sorted.length>=2) {
    const prev=sorted[sorted.length-2];
    const wd=(last.weight||0)-(prev.weight||0), rd=(last.reps||0)-(prev.reps||0);
    if(wd>0||(wd===0&&rd>0)) trend="up"; else if(wd<0||rd<0) trend="down"; else trend="same";
  }
  return { last, isPR:isPR&&trend==="up", shouldIncrease:streak>=3, trend, streak };
}

// ── 공통 UI 컴포넌트 ─────────────────────────────────────
function ProgressBar({ pct, color, height=6 }) {
  return (
    <div style={{ height, background:"#f0f0f0", borderRadius:99 }}>
      <div style={{ height:"100%", borderRadius:99, background:color, width:`${Math.max(0,Math.min(100,pct))}%`, transition:"width .5s" }}/>
    </div>
  );
}
function Badge({ children, color="#555", bg="#f0f0f0" }) {
  return <span style={{ fontSize:10, color, background:bg, borderRadius:99, padding:"2px 7px", fontWeight:600, lineHeight:"18px", whiteSpace:"nowrap" }}>{children}</span>;
}

// ── 운동 행 ─────────────────────────────────────────────
function ExRow({ exKey, pKey, checked, onToggle, onSwapClick, isSwapped, overload, onLogClick }) {
  const ex=EX[exKey], sets=ex?.sets?.[pKey]||"", tw=ex?.tw?.[pKey]||null;
  const cardio=isCardio(exKey), bw=isBodyweight(exKey), group=EX_GROUP[exKey];
  const trendColor=overload?.trend==="up"?"#2d7a4f":overload?.trend==="down"?"#e74c3c":"#999";
  const trendIcon=overload?.trend==="up"?"↑":overload?.trend==="down"?"↓":overload?.trend==="same"?"→":null;
  const lastLabel=overload?.last
    ? cardio?`${overload.last.duration}분`:bw?`${overload.last.sets}×${overload.last.reps}회`:`${overload.last.weight}kg×${overload.last.reps}회`
    : null;

  return (
    <div style={{
      background:checked?"#f0faf5":"#fff",
      border:`1.5px solid ${checked?"#b6e5cc":isSwapped?"#c5dcf5":"#f0f0f0"}`,
      borderRadius:16, padding:"14px 12px", transition:"all .15s",
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
        <button onClick={onToggle} style={{
          width:28, height:28, borderRadius:"50%", flexShrink:0, border:"none",
          background:checked?"#2d7a4f":"#e8e8e8",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", marginTop:1, WebkitTapHighlightColor:"transparent",
        }}>
          {checked && <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4L4.5 7.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:4 }}>
            <span onClick={onToggle} style={{ fontSize:15, fontWeight:600, color:checked?"#aaa":"#111", textDecoration:checked?"line-through":"none", cursor:"pointer" }}>
              {exName(exKey)}
            </span>
            {overload?.isPR && <Badge color="#9a6b1a" bg="#fdf0d8">🏆 PR</Badge>}
            {overload?.shouldIncrease && !overload?.isPR && <Badge color="#c0392b" bg="#fde8e8">무게 올릴 때!</Badge>}
            {isSwapped && <Badge color="#2563b0" bg="#dbeafe">교체됨</Badge>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            {sets && <span style={{ fontSize:12, color:"#888", fontWeight:500 }}>{sets}</span>}
            {tw   && <span style={{ fontSize:12, color:"#4a90d9" }}>· {tw}</span>}
            {lastLabel && <span style={{ fontSize:12, color:trendColor, fontWeight:600 }}>{trendIcon} 지난번 {lastLabel}</span>}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0 }}>
          {onLogClick && (
            <button onClick={onLogClick} style={{
              height:30, border:`1.5px solid ${overload?.last?"#2d7a4f":"#d0d0d0"}`,
              background:overload?.last?"#eaf7f0":"#fafafa",
              borderRadius:10, padding:"0 10px", fontSize:11, cursor:"pointer",
              color:overload?.last?"#2d7a4f":"#888", fontWeight:600, WebkitTapHighlightColor:"transparent",
            }}>📝 기록</button>
          )}
          <div style={{ display:"flex", gap:5 }}>
            {ytLink(exKey) && (
              <a href={ytLink(exKey)} target="_blank" rel="noreferrer" style={{
                height:30, display:"flex", alignItems:"center",
                border:"1.5px solid #f0d0d0", background:"#fff8f8",
                borderRadius:10, padding:"0 8px", fontSize:11,
                color:"#c0392b", textDecoration:"none", fontWeight:600,
              }}>▶</a>
            )}
            {group && onSwapClick && (
              <button onClick={onSwapClick} style={{
                height:30, border:"1.5px solid #e0e0e0", background:"#fafafa",
                borderRadius:10, padding:"0 10px", fontSize:11, cursor:"pointer",
                color:"#666", WebkitTapHighlightColor:"transparent",
              }}>교체</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 기록 시트 ────────────────────────────────────────────
function LogSheet({ exKey, records, onSave, onClose }) {
  const cardio=isCardio(exKey), bw=isBodyweight(exKey);
  const sorted=[...(records||[])].sort((a,b)=>a.date.localeCompare(b.date));
  const last=sorted[sorted.length-1];
  const [weight,setWeight]=useState(last?.weight??"");
  const [reps,setReps]=useState(last?.reps??"");
  const [sets,setSets]=useState(last?.sets??"");
  const [duration,setDuration]=useState(last?.duration??"");

  const handleSave=()=>{
    const entry={ date:new Date().toISOString().slice(0,10),
      ...(cardio?{duration:parseFloat(duration)||0}:{weight:bw?0:(parseFloat(weight)||0),reps:parseInt(reps)||0,sets:parseInt(sets)||0}) };
    onSave(entry);
  };
  const inp={ width:"100%",border:"1.5px solid #e8e8e8",borderRadius:12,padding:"14px 10px",fontSize:16,boxSizing:"border-box",outline:"none",textAlign:"center",background:"#fafafa",WebkitAppearance:"none" };
  const lbl={ fontSize:11,color:"#999",marginBottom:6,fontWeight:500 };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:1001 }} onClick={onClose}>
      <div style={{ background:"#fff",borderRadius:"24px 24px 0 0",padding:"0 20px",paddingBottom:"max(24px,env(safe-area-inset-bottom))",width:"100%",maxWidth:480 }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"center",paddingTop:12,paddingBottom:8 }}>
          <div style={{ width:36,height:4,background:"#e0e0e0",borderRadius:99 }}/>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <div style={{ fontSize:17,fontWeight:700 }}>{exName(exKey)} 기록</div>
          <button onClick={onClose} style={{ width:32,height:32,border:"none",background:"#f0f0f0",borderRadius:"50%",fontSize:16,cursor:"pointer" }}>×</button>
        </div>
        {sorted.length>0 && (
          <div style={{ background:"#f8f8f8",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
            <div style={{ fontSize:11,color:"#aaa",fontWeight:600,marginBottom:8 }}>이전 기록</div>
            {sorted.slice(-3).reverse().map((r,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",marginBottom:i<2?6:0 }}>
                <span style={{ fontSize:13,color:i===0?"#555":"#bbb" }}>{r.date.slice(5)}</span>
                <span style={{ fontSize:13,fontWeight:i===0?700:400,color:i===0?"#111":"#bbb" }}>
                  {cardio?`${r.duration}분`:bw?`${r.sets}세트×${r.reps}회`:`${r.weight}kg×${r.reps}회×${r.sets}세트`}
                </span>
              </div>
            ))}
          </div>
        )}
        {cardio?(
          <div style={{ marginBottom:16 }}>
            <div style={lbl}>운동 시간 (분)</div>
            <input type="number" inputMode="decimal" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="25" style={inp}/>
          </div>
        ):(
          <div style={{ display:"grid",gridTemplateColumns:bw?"1fr 1fr":"1fr 1fr 1fr",gap:10,marginBottom:16 }}>
            {!bw&&<div><div style={lbl}>무게 (kg)</div><input type="number" inputMode="decimal" step="2.5" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="0" style={inp}/></div>}
            <div><div style={lbl}>횟수 (회)</div><input type="number" inputMode="numeric" value={reps} onChange={e=>setReps(e.target.value)} placeholder="0" style={inp}/></div>
            <div><div style={lbl}>세트</div><input type="number" inputMode="numeric" value={sets} onChange={e=>setSets(e.target.value)} placeholder="3" style={inp}/></div>
          </div>
        )}
        <button onClick={handleSave} style={{ width:"100%",background:"#111",color:"#fff",border:"none",borderRadius:14,padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer" }}>저장</button>
      </div>
    </div>
  );
}

// ── 교체 시트 ────────────────────────────────────────────
function SwapSheet({ slot, pKey, currentKeys, onSelect, onClose }) {
  const group=EX_GROUP[slot.exKey];
  const candidates=group?GROUPS[group]:[];
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff",borderRadius:"24px 24px 0 0",padding:"0 16px",paddingBottom:"max(24px,env(safe-area-inset-bottom))",width:"100%",maxWidth:480 }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"center",paddingTop:12,paddingBottom:8 }}><div style={{ width:36,height:4,background:"#e0e0e0",borderRadius:99 }}/></div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
          <div style={{ fontSize:17,fontWeight:700 }}>{group} 교체</div>
          <button onClick={onClose} style={{ width:32,height:32,border:"none",background:"#f0f0f0",borderRadius:"50%",fontSize:16,cursor:"pointer" }}>×</button>
        </div>
        <div style={{ fontSize:12,color:"#aaa",marginBottom:14 }}>같은 부위 운동으로 바꿀 수 있어요</div>
        <div style={{ display:"flex",flexDirection:"column",gap:8,maxHeight:"55vh",overflowY:"auto",paddingBottom:4 }}>
          {candidates.map(k=>{
            const isCur=k===slot.exKey, inPlan=currentKeys.includes(k)&&!isCur;
            const ex=EX[k]; const s=ex?.sets?.[pKey]||""; const t=ex?.tw?.[pKey]||null;
            return (
              <div key={k} onClick={()=>!inPlan&&onSelect(k)} style={{
                display:"flex",alignItems:"center",gap:10,padding:"13px 14px",borderRadius:14,
                background:isCur?"#f0faf5":"#fafafa",
                border:`1.5px solid ${isCur?"#2d7a4f":inPlan?"#f0f0f0":"#ebebeb"}`,
                cursor:inPlan?"default":"pointer",opacity:inPlan?0.4:1,
              }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:2 }}>
                    <span style={{ fontSize:14,fontWeight:600,color:"#111" }}>{exName(k)}</span>
                    {isCur&&<Badge color="#2d7a4f" bg="#eaf7f0">현재</Badge>}
                    {inPlan&&<Badge color="#aaa" bg="#f5f5f5">이미 포함</Badge>}
                  </div>
                  <div style={{ fontSize:12,color:"#aaa" }}>
                    {s&&<span>{s}</span>}
                    {t&&<span style={{ color:"#4a90d9",marginLeft:6 }}>· {t}</span>}
                  </div>
                </div>
                <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                  {ytLink(k)&&<a href={ytLink(k)} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:11,color:"#c0392b",background:"#fde8e8",borderRadius:8,padding:"3px 8px",textDecoration:"none",fontWeight:600 }}>▶</a>}
                  {!isCur&&!inPlan&&<span style={{ fontSize:20,color:"#ccc" }}>›</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 하단 네비 아이콘 ─────────────────────────────────────
function NavIcon({ id, active }) {
  const c=active?"#111":"#bbb";
  if(id==="home") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>;
  if(id==="week") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="8" cy="15" r="1" fill={c}/><circle cx="12" cy="15" r="1" fill={c}/><circle cx="16" cy="15" r="1" fill={c}/></svg>;
  if(id==="plan") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>;
  if(id==="progress") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
  return null;
}

// ── 메인 ────────────────────────────────────────────────
export default function FitnessTrackerDemo() {
  const [tab, setTab]         = useState("home");
  const [checks, setChecks]   = useState(()=>load("fit6c",{}));
  const [inbody, setInbody]   = useState(()=>load("fit6ib",[]));
  const [weekOff, setWeekOff] = useState(0);
  const [selPhase, setSelPhase] = useState(0); // 0-indexed for plan tab
  const [showIbForm, setShowIbForm]     = useState(false);
  const [editIdx, setEditIdx]           = useState(null);
  const [ibForm, setIbForm]             = useState({date:"",muscle:"",fat:"",weight:""});
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [goalWeightInput, setGoalWeightInput] = useState("");
  const [savedGoalWeight, setSavedGoalWeight] = useState(()=>load("fit6gw",null));
  const [swaps, setSwaps]       = useState(()=>load("fit6sw",{}));
  const [swapSlot, setSwapSlot] = useState(null);
  const [prLog, setPrLog]       = useState(()=>load("fit6log",{}));
  const [logTarget, setLogTarget] = useState(null);

  const today       = new Date(); today.setHours(0,0,0,0);
  const todayKey    = dateKey(today);
  const daysPassed  = getDaysPassed(new Date());
  const weekNum     = daysPassed >= 0 ? getWeekNum(daysPassed) : 0;
  const overallPct  = Math.min(100, Math.max(0, Math.round(daysPassed/TOTAL_DAYS*100)));
  const currentPhase= daysPassed>=0 ? getPhaseByDays(daysPassed) : PHASE_INFO[0];
  const todayPlan   = getCyclePlan(today, currentPhase);
  const deloadToday = daysPassed >= 0 && isDeloadWeek(daysPassed);

  const firstIb  = inbody[0]||DEFAULT_INITIAL;
  const latestIb = inbody.length>0?inbody[inbody.length-1]:DEFAULT_INITIAL;
  const goalW    = savedGoalWeight!==null?savedGoalWeight:parseFloat((firstIb.weight-2.5).toFixed(1));
  const wGap     = parseFloat((latestIb.weight-goalW).toFixed(1));
  const musclePct= Math.round(Math.max(0,(latestIb.muscle-firstIb.muscle)/(MUSCLE_GOAL-firstIb.muscle)*100));
  const fatPct   = Math.round(Math.max(0,(firstIb.fat-latestIb.fat)/(firstIb.fat-FAT_GOAL)*100));
  const wPct     = latestIb.weight<=goalW?100:Math.round(Math.max(0,(firstIb.weight-latestIb.weight)/(firstIb.weight-goalW)*100));

  const toggleCheck=(k,i)=>{
    const next={...checks}; const arr=next[k]?[...next[k]]:[];
    if(arr.includes(i)) arr.splice(arr.indexOf(i),1); else arr.push(i);
    next[k]=arr; setChecks(next); save("fit6c",next);
  };
  const openNew  = ()=>{ setEditIdx(null); setIbForm({date:todayKey,muscle:"",fat:"",weight:""}); setShowIbForm(true); };
  const openEdit = (i)=>{ const r=inbody[i]; setEditIdx(i); setIbForm({date:r.date,muscle:String(r.muscle),fat:String(r.fat),weight:String(r.weight)}); setShowIbForm(true); };
  const saveIb   = ()=>{
    const entry={date:ibForm.date||todayKey,muscle:parseFloat(ibForm.muscle)||latestIb.muscle,fat:parseFloat(ibForm.fat)||latestIb.fat,weight:parseFloat(ibForm.weight)||latestIb.weight};
    const next=editIdx!==null?inbody.map((r,i)=>i===editIdx?entry:r):[...inbody,entry].sort((a,b)=>a.date.localeCompare(b.date));
    setInbody(next); save("fit6ib",next); setShowIbForm(false);
  };
  const deleteIb  = (i)=>{ const next=inbody.filter((_,idx)=>idx!==i); setInbody(next); save("fit6ib",next); };
  const saveGoalW = ()=>{ const v=parseFloat(goalWeightInput); if(!isNaN(v)){setSavedGoalWeight(v);save("fit6gw",v);} setShowGoalEdit(false); };
  const swKey     = (dk,i)=>`${dk}_${i}`;
  const resolveKey= (dk,i,ok)=>swaps[swKey(dk,i)]||ok;
  const saveLog   = (exKey,entry)=>{
    const next={...prLog,[exKey]:[...(prLog[exKey]||[]).filter(r=>r.date!==entry.date),entry].sort((a,b)=>a.date.localeCompare(b.date))};
    setPrLog(next); save("fit6log",next); setLogTarget(null);
  };
  const doSwap=(newKey)=>{
    if(!swapSlot) return;
    const k=swKey(swapSlot.dayKey,swapSlot.index); const next={...swaps};
    if(newKey===swapSlot.originalKey) delete next[k]; else next[k]=newKey;
    setSwaps(next); save("fit6sw",next); setSwapSlot(null);
  };

  const weekDates=getWeekDates(weekOff);
  const CARD={ background:"#fff",borderRadius:20,padding:"18px 16px",marginBottom:12 };
  const BASE={ fontFamily:"'Apple SD Gothic Neo','Noto Sans KR',sans-serif",color:"#111",WebkitFontSmoothing:"antialiased" };

  const renderExRow=(origKey,i,dKey,ph)=>{
    const rk=resolveKey(dKey,i,origKey);
    const planForDay=getCyclePlan(new Date(dKey+"T00:00:00"),ph);
    const rks=(planForDay.exKeys||[]).map((ok,ii)=>resolveKey(dKey,ii,ok));
    return (
      <ExRow key={`${dKey}_${i}`} exKey={rk} pKey={ph.pKey}
        checked={(checks[dKey]||[]).includes(i)}
        onToggle={()=>toggleCheck(dKey,i)}
        isSwapped={rk!==origKey}
        onSwapClick={()=>setSwapSlot({dayKey:dKey,index:i,exKey:rk,originalKey:origKey,currentKeys:rks,pKey:ph.pKey})}
        overload={getOverloadStatus(prLog[rk])}
        onLogClick={()=>setLogTarget(rk)}
      />
    );
  };

  return (
    <div style={{ ...BASE,minHeight:"100vh",background:"#f4f4f2",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column" }}>

      {/* ── 갤러리 복귀 링크 ── */}
      <div style={{ padding:"10px 18px 0" }}>
        <Link href="/portfolio" style={{ fontSize:12,color:"#aaa",textDecoration:"none" }}>← 갤러리로 돌아가기</Link>
      </div>

      {/* ── 고정 헤더 ── */}
      <div style={{ position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:"1px solid #efefef",paddingTop:"env(safe-area-inset-top)" }}>
        <div style={{ padding:"14px 18px 12px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div>
              <div style={{ fontSize:11,color:"#aaa",letterSpacing:1.5,fontWeight:600,marginBottom:3 }}>PPL×2 · 6일 스플릿</div>
              <div style={{ fontSize:17,fontWeight:800,lineHeight:1.2 }}>
                골격근 {MUSCLE_GOAL}kg · 체지방 20% 이하
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ background:currentPhase.bg,color:currentPhase.color,borderRadius:99,padding:"4px 10px",fontSize:11,fontWeight:700,marginBottom:3 }}>
                Phase {currentPhase.phase} · {weekNum > 0 ? `${weekNum}주차` : "시작 전"}
              </div>
              <div style={{ fontSize:11,color:"#aaa" }}>
                {daysPassed<0?`D${daysPassed}`:daysPassed===0?"Day 1":`D+${daysPassed}`}
              </div>
            </div>
          </div>
          <ProgressBar pct={overallPct} color="#111" height={4}/>
          <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
            <span style={{ fontSize:10,color:"#ccc" }}>2026.07.02</span>
            <span style={{ fontSize:10,color:"#999",fontWeight:600 }}>{weekNum > 0 ? `${weekNum}/24주` : "준비 중"}</span>
            <span style={{ fontSize:10,color:"#ccc" }}>2026.12.16</span>
          </div>
        </div>
      </div>

      {/* ── 콘텐츠 ── */}
      <div style={{ flex:1,overflowY:"auto",padding:"16px 14px 100px" }}>

        {/* ══ 오늘 ══ */}
        {tab==="home" && (
          <div>
            {daysPassed < 0 && (
              <div style={{ background:"#eef5fd",borderRadius:16,padding:"16px",marginBottom:14,textAlign:"center" }}>
                <div style={{ fontSize:15,color:"#4a90d9",fontWeight:700 }}>7월 2일 Day 1부터 시작!</div>
                <div style={{ fontSize:12,color:"#888",marginTop:4 }}>식단 준비 기간이에요. 단백질 130g 이상부터 챙겨보세요.</div>
              </div>
            )}
            {deloadToday && (
              <div style={{ background:"#fdf5e6",borderRadius:16,padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:18 }}>🔄</span>
                <div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#b07d30" }}>디로드 주 ({weekNum}주차)</div>
                  <div style={{ fontSize:12,color:"#888" }}>모든 세트 -1, 무게 60%로 낮춰서 진행하세요</div>
                </div>
              </div>
            )}

            {/* 오늘 운동 카드 */}
            <div style={CARD}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:12,color:"#aaa",marginBottom:2 }}>
                    {todayPlan.label && <span style={{ fontWeight:600,color:typeColor[todayPlan.type]||"#aaa" }}>{todayPlan.label}</span>}
                    {daysPassed>=0 && <span style={{ marginLeft:4 }}>· 사이클 {(daysPassed%7)+1}/7일</span>}
                  </div>
                  <div style={{ fontSize:20,fontWeight:800 }}>{todayPlan.part}</div>
                </div>
                {todayPlan.type!=="준비" && (
                  <div style={{ background:typeColor[todayPlan.type]||"#ccc",color:"#fff",borderRadius:99,padding:"5px 13px",fontSize:12,fontWeight:700 }}>
                    {todayPlan.type}
                  </div>
                )}
              </div>

              {todayPlan.exKeys.length===0 ? (
                <div style={{ textAlign:"center",padding:"28px 0",color:"#bbb",fontSize:15 }}>
                  {daysPassed<0 ? "🗓 아직 시작 전이에요" : "😴 오늘은 완전 휴식일"}
                </div>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  {todayPlan.exKeys.map((ok,i)=>renderExRow(ok,i,todayKey,currentPhase))}
                  <div style={{ marginTop:4 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                      <span style={{ fontSize:12,color:"#aaa" }}>오늘 진행률</span>
                      <span style={{ fontSize:12,fontWeight:700,color:"#2d7a4f" }}>{(checks[todayKey]||[]).length}/{todayPlan.exKeys.length}</span>
                    </div>
                    <ProgressBar pct={Math.round(((checks[todayKey]||[]).length/todayPlan.exKeys.length)*100)} color="#2d7a4f" height={6}/>
                  </div>
                </div>
              )}
            </div>

            {/* Phase 정보 */}
            {daysPassed >= 0 && (
              <div style={{ background:currentPhase.bg,borderRadius:16,padding:"14px 16px",marginBottom:12 }}>
                <div style={{ fontSize:12,color:currentPhase.color,fontWeight:700,marginBottom:2 }}>
                  {currentPhase.rpe} · {currentPhase.rest}
                </div>
                <div style={{ fontSize:13,color:"#444",lineHeight:1.7 }}>💡 {currentPhase.tip}</div>
              </div>
            )}

            {/* 영양 목표 */}
            <div style={CARD}>
              <div style={{ fontSize:14,fontWeight:700,marginBottom:12 }}>오늘 영양 목표</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8 }}>
                {[{l:"칼로리",v:currentPhase.meal.kcal,u:"kcal",c:"#f39c12"},
                  {l:"단백질",v:currentPhase.meal.protein,u:"g",c:"#2d7a4f"},
                  {l:"탄수화물",v:currentPhase.meal.carb,u:"g",c:"#4a90d9"},
                  {l:"지방",v:currentPhase.meal.fat,u:"g",c:"#e74c3c"}].map(item=>(
                  <div key={item.l} style={{ textAlign:"center",background:"#f8f8f8",borderRadius:14,padding:"12px 4px" }}>
                    <div style={{ width:4,height:4,borderRadius:"50%",background:item.c,margin:"0 auto 6px" }}/>
                    <div style={{ fontSize:10,color:"#aaa",marginBottom:2 }}>{item.l}</div>
                    <div style={{ fontSize:16,fontWeight:800,color:"#111" }}>{item.v}</div>
                    <div style={{ fontSize:10,color:"#bbb" }}>{item.u}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12,fontSize:11,color:"#aaa",textAlign:"center" }}>
                단백질 {firstIb.weight} × 1.8g = <b style={{color:"#2d7a4f"}}>{Math.round(firstIb.weight*1.8)}g</b> 목표
              </div>
            </div>
          </div>
        )}

        {/* ══ 주간 ══ */}
        {tab==="week" && (
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <button onClick={()=>setWeekOff(w=>w-1)} style={{ width:40,height:40,border:"none",background:"#fff",borderRadius:12,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>‹</button>
              <div style={{ fontSize:14,fontWeight:700 }}>
                {weekDates[0].getMonth()+1}/{weekDates[0].getDate()} — {weekDates[6].getMonth()+1}/{weekDates[6].getDate()}
              </div>
              <button onClick={()=>setWeekOff(w=>w+1)} style={{ width:40,height:40,border:"none",background:"#fff",borderRadius:12,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>›</button>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {weekDates.map(d=>{
                const dKey=dateKey(d), dp=getDaysPassed(d), isToday=dKey===todayKey;
                const ph=dp>=0?getPhaseByDays(dp):PHASE_INFO[0];
                const plan=getCyclePlan(d,ph);
                const done=(checks[dKey]||[]).length, total=plan.exKeys.length;
                const deload=dp>=0&&isDeloadWeek(dp);
                return (
                  <div key={dKey} style={{ background:"#fff",borderRadius:18,border:`2px solid ${isToday?"#111":"transparent"}`,overflow:"hidden" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 14px" }}>
                      <div style={{ width:42,height:42,borderRadius:14,flexShrink:0,background:isToday?"#111":"#f5f5f3",color:isToday?"#fff":"#555",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                        <div style={{ fontSize:9,fontWeight:600,lineHeight:1 }}>{"일월화수목금토"[d.getDay()]}</div>
                        <div style={{ fontSize:16,fontWeight:800,lineHeight:1.3 }}>{d.getDate()}</div>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:3 }}>
                          <span style={{ fontSize:14,fontWeight:700 }}>{plan.part}</span>
                          {plan.type!=="준비" && <div style={{ background:typeColor[plan.type]||"#ccc",color:"#fff",borderRadius:99,padding:"2px 9px",fontSize:10,fontWeight:700 }}>{plan.type}</div>}
                          {deload && <Badge color="#b07d30" bg="#fdf5e6">디로드</Badge>}
                        </div>
                        {total>0 && (
                          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                            <ProgressBar pct={Math.round(done/total*100)} color="#2d7a4f" height={4}/>
                            <span style={{ fontSize:11,color:done===total?"#2d7a4f":"#bbb",fontWeight:700,flexShrink:0 }}>{done}/{total}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {isToday && plan.exKeys.length>0 && (
                      <div style={{ padding:"0 14px 14px",display:"flex",flexDirection:"column",gap:8 }}>
                        <div style={{ height:1,background:"#f5f5f5",marginBottom:4 }}/>
                        {plan.exKeys.map((ok,i)=>renderExRow(ok,i,dKey,ph))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ 플랜 ══ */}
        {tab==="plan" && (
          <div>
            {/* Phase 탭 */}
            <div style={{ display:"flex",gap:8,marginBottom:16 }}>
              {PHASE_INFO.map((ph,idx)=>(
                <button key={ph.phase} onClick={()=>setSelPhase(idx)} style={{
                  flex:1,border:"none",borderRadius:14,padding:"10px 4px",
                  fontSize:12,cursor:"pointer",fontWeight:selPhase===idx?700:500,
                  background:selPhase===idx?ph.color:"#fff",
                  color:selPhase===idx?"#fff":"#666",
                  boxShadow:selPhase===idx?"none":"0 1px 4px rgba(0,0,0,0.08)",
                }}>
                  <div style={{ fontSize:10,marginBottom:2,opacity:0.8 }}>{ph.weeks[0]}~{ph.weeks[1]}주</div>
                  {ph.label}
                </button>
              ))}
            </div>

            {(()=>{
              const ph=PHASE_INFO[selPhase];
              return (
                <div>
                  <div style={{ background:ph.bg,borderRadius:18,padding:"16px",marginBottom:14 }}>
                    <div style={{ fontSize:11,color:ph.color,fontWeight:700,marginBottom:3 }}>Phase {ph.phase} · {ph.weeks[0]}~{ph.weeks[1]}주차 · {ph.weeks[1]}주 디로드</div>
                    <div style={{ fontSize:18,fontWeight:800,color:"#111",marginBottom:5 }}>{ph.label}</div>
                    <div style={{ fontSize:13,color:"#555",marginBottom:8 }}>🎯 {ph.focus}</div>
                    <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                      <Badge color={ph.color} bg="rgba(255,255,255,0.7)">{ph.rpe}</Badge>
                      <Badge color={ph.color} bg="rgba(255,255,255,0.7)">{ph.rest}</Badge>
                    </div>
                  </div>

                  {/* Push / Pull / Legs */}
                  {[["push","Push","가슴·어깨·삼두"],["pull","Pull","등·이두"],["legs","Legs","하체"]].map(([wKey,wType,wPart])=>{
                    const workout=ph[wKey];
                    return (
                      <div key={wKey} style={{ ...CARD }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                          <div style={{ width:36,height:36,borderRadius:12,background:typeColor[wType]||"#ccc",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                            <span style={{ color:"#fff",fontSize:12,fontWeight:800 }}>{wType[0]}</span>
                          </div>
                          <div>
                            <div style={{ fontSize:15,fontWeight:800 }}>{wType}</div>
                            <div style={{ fontSize:11,color:"#aaa" }}>{wPart}</div>
                          </div>
                        </div>
                        <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
                          {workout.exKeys.map((k,idx)=>{
                            const ex=EX[k]; const sets=ex?.sets?.[ph.pKey]; const tw=ex?.tw?.[ph.pKey]; const link=ytLink(k);
                            const isMain=idx===0&&(wKey==="push"||wKey==="pull"||wKey==="legs")&&ph.phase===2;
                            return (
                              <div key={k} style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 0",borderBottom:idx<workout.exKeys.length-1?"1px solid #f5f5f5":"none" }}>
                                {isMain && <span style={{ width:4,height:4,borderRadius:"50%",background:"#2d7a4f",flexShrink:0 }}/>}
                                <div style={{ flex:1 }}>
                                  <span style={{ fontSize:13,color:"#333",fontWeight:isMain?700:500 }}>{exName(k)}</span>
                                  {isMain && <Badge color="#2d7a4f" bg="#eaf7f0" style={{marginLeft:6}}>메인 리프트</Badge>}
                                  {sets && <span style={{ fontSize:12,color:"#aaa",marginLeft:6 }}>{sets}</span>}
                                  {tw && <span style={{ fontSize:12,color:"#4a90d9",marginLeft:6 }}>· {tw}</span>}
                                </div>
                                {link && <a href={link} target="_blank" rel="noreferrer" style={{ fontSize:11,color:"#c0392b",background:"#fde8e8",borderRadius:8,padding:"3px 8px",textDecoration:"none",fontWeight:600,flexShrink:0 }}>▶</a>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* 영양 */}
                  <div style={CARD}>
                    <div style={{ fontSize:14,fontWeight:700,marginBottom:12 }}>영양 목표</div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8 }}>
                      {[{l:"칼로리",v:ph.meal.kcal,u:"kcal"},{l:"단백질",v:ph.meal.protein,u:"g"},{l:"탄수화물",v:ph.meal.carb,u:"g"},{l:"지방",v:ph.meal.fat,u:"g"}].map(item=>(
                        <div key={item.l} style={{ textAlign:"center",background:"#f8f8f8",borderRadius:12,padding:"10px 4px" }}>
                          <div style={{ fontSize:10,color:"#aaa",marginBottom:2 }}>{item.l}</div>
                          <div style={{ fontSize:15,fontWeight:800 }}>{item.v}</div>
                          <div style={{ fontSize:10,color:"#bbb" }}>{item.u}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background:ph.bg,borderRadius:14,padding:"12px 14px",fontSize:13,color:ph.color,lineHeight:1.7 }}>💡 {ph.tip}</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ══ 진행 현황 ══ */}
        {tab==="progress" && (
          <div>
            <div style={CARD}>
              <div style={{ fontSize:14,fontWeight:700,marginBottom:16 }}>목표 달성률</div>
              {[
                { label:"체중", value:latestIb.weight, goal:goalW, pct:wPct, color:"#4a90d9",
                  status:wGap>0?`목표까지 -${wGap}kg`:"🎉 달성!",
                  statusColor:wGap>0?"#e74c3c":"#2d7a4f",
                  extra:<button onClick={()=>{setGoalWeightInput(String(goalW));setShowGoalEdit(true);}} style={{ border:"1px solid #e0e0e0",background:"#fafafa",borderRadius:8,padding:"3px 10px",fontSize:11,cursor:"pointer",color:"#777" }}>수정</button>
                },
                { label:"골격근", value:latestIb.muscle, goal:MUSCLE_GOAL, pct:musclePct, color:"#2d7a4f",
                  status:latestIb.muscle<MUSCLE_GOAL?`+${(MUSCLE_GOAL-latestIb.muscle).toFixed(1)}kg 필요`:"🎉 달성!",
                  statusColor:latestIb.muscle<MUSCLE_GOAL?"#888":"#2d7a4f"
                },
                { label:"체지방", value:latestIb.fat, goal:FAT_GOAL, pct:fatPct, color:"#e74c3c",
                  status:latestIb.fat>FAT_GOAL?`-${(latestIb.fat-FAT_GOAL).toFixed(1)}kg 필요`:"🎉 달성!",
                  statusColor:latestIb.fat>FAT_GOAL?"#888":"#2d7a4f"
                },
              ].map((item,idx)=>(
                <div key={item.label} style={{ marginBottom:idx<2?20:0 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <span style={{ fontSize:13,fontWeight:700 }}>{item.label}</span>
                      {item.extra}
                    </div>
                    <span style={{ fontSize:13,fontWeight:700,color:item.statusColor }}>{item.status}</span>
                  </div>
                  <ProgressBar pct={item.pct} color={item.color} height={8}/>
                  <div style={{ display:"flex",justifyContent:"space-between",marginTop:5 }}>
                    <span style={{ fontSize:11,color:"#aaa" }}>현재 <b style={{color:"#111"}}>{item.value}kg</b></span>
                    <span style={{ fontSize:11,color:"#aaa" }}>목표 <b style={{color:item.color}}>{item.goal}kg</b></span>
                  </div>
                </div>
              ))}
              <div style={{ borderTop:"1px solid #f5f5f5",paddingTop:16,marginTop:16 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                  <span style={{ fontSize:13,fontWeight:700 }}>기간 진행</span>
                  <span style={{ fontSize:12,color:"#aaa" }}>{weekNum>0?`${weekNum}주차`:"시작 전"} / 24주</span>
                </div>
                <ProgressBar pct={overallPct} color="#111" height={8}/>
              </div>
            </div>

            {/* 인바디 기록 체크 포인트 */}
            <div style={CARD}>
              <div style={{ fontSize:14,fontWeight:700,marginBottom:12 }}>측정 체크포인트</div>
              {[{w:4,label:"4주차 중간 점검",desc:"체중 · 운동 중량 기록"},
                {w:8,label:"8주차 인바디 (Phase 1 종료)",desc:"체성분 재측정"},
                {w:16,label:"16주차 인바디 (Phase 2 종료)",desc:"체성분 재측정"},
                {w:24,label:"24주차 인바디 (최종 목표 비교)",desc:"최종 결과 확인"},
              ].map(cp=>{
                const done=weekNum>cp.w, current=weekNum===cp.w;
                return (
                  <div key={cp.w} style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:12 }}>
                    <div style={{ width:28,height:28,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:done?"#2d7a4f":current?"#111":"#f0f0f0",marginTop:2 }}>
                      {done?<svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4L4.5 7.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       :<span style={{ fontSize:10,fontWeight:700,color:current?"#fff":"#aaa" }}>{cp.w}주</span>}
                    </div>
                    <div style={{ flex:1,opacity:done?0.5:1 }}>
                      <div style={{ fontSize:13,fontWeight:700,color:current?"#111":"#333",marginBottom:2 }}>{cp.label}</div>
                      <div style={{ fontSize:11,color:"#aaa" }}>{cp.desc}</div>
                    </div>
                    {current && <Badge color="#111" bg="#f0f0f0">지금!</Badge>}
                  </div>
                );
              })}
            </div>

            {/* 인바디 기록 */}
            <div style={CARD}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                <div style={{ fontSize:14,fontWeight:700 }}>인바디 기록</div>
                <button onClick={openNew} style={{ border:"none",background:"#111",color:"#fff",borderRadius:99,padding:"7px 16px",fontSize:12,cursor:"pointer",fontWeight:700 }}>+ 추가</button>
              </div>
              {showIbForm && (
                <div style={{ background:"#f8f8f8",borderRadius:16,padding:"16px",marginBottom:14 }}>
                  {editIdx===null&&inbody.length===0&&<div style={{ fontSize:12,color:"#4a90d9",marginBottom:10,fontWeight:500 }}>※ 첫 기록이 기준 수치가 됩니다</div>}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:11,color:"#aaa",marginBottom:6,fontWeight:500 }}>측정일</div>
                    <input type="date" value={ibForm.date} onChange={e=>setIbForm(f=>({...f,date:e.target.value}))} style={{ width:"100%",border:"1.5px solid #e8e8e8",borderRadius:12,padding:"12px",fontSize:16,boxSizing:"border-box",background:"#fff",outline:"none" }}/>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12 }}>
                    {[["체중(kg)","weight","72.5"],["골격근(kg)","muscle","30.5"],["체지방(kg)","fat","18.4"]].map(([l,k,ph])=>(
                      <div key={k}>
                        <div style={{ fontSize:11,color:"#aaa",marginBottom:6,fontWeight:500 }}>{l}</div>
                        <input type="number" step="0.1" inputMode="decimal" value={ibForm[k]} placeholder={ph} onChange={e=>setIbForm(f=>({...f,[k]:e.target.value}))} style={{ width:"100%",border:"1.5px solid #e8e8e8",borderRadius:12,padding:"12px 8px",fontSize:16,boxSizing:"border-box",background:"#fff",outline:"none",textAlign:"center" }}/>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    <button onClick={saveIb} style={{ flex:1,background:"#2d7a4f",color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer" }}>저장</button>
                    <button onClick={()=>setShowIbForm(false)} style={{ flex:1,background:"#ececec",color:"#555",border:"none",borderRadius:12,padding:"13px",fontSize:14,cursor:"pointer" }}>취소</button>
                  </div>
                </div>
              )}
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {inbody.length===0 ? (
                  <div style={{ textAlign:"center",color:"#ccc",padding:"20px 0",fontSize:14 }}>첫 인바디 측정 후 기록해주세요</div>
                ) : (
                  [{...firstIb,isBase:true}, ...inbody].map((rec,i)=>{
                    const isBase=rec.isBase;
                    const prev=i>0?(i===1?firstIb:inbody[i-2]):null;
                    const wD=prev?parseFloat((rec.weight-prev.weight).toFixed(1)):null;
                    const mD=prev?parseFloat((rec.muscle-prev.muscle).toFixed(1)):null;
                    const fD=prev?parseFloat((rec.fat-prev.fat).toFixed(1)):null;
                    return (
                      <div key={i} style={{ padding:"13px 12px",background:isBase?"#f5f5f3":"#fafafa",borderRadius:14,border:isBase?"1.5px solid #ececec":"none" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ fontSize:12,color:"#aaa",width:50,flexShrink:0,fontWeight:isBase?700:400 }}>{isBase?"기준":rec.date.slice(5)}</div>
                          <div style={{ flex:1,display:"flex",gap:6 }}>
                            {[{l:"체중",v:rec.weight,c:"#555",d:wD,good:v=>v<0},{l:"골격근",v:rec.muscle,c:"#2d7a4f",d:mD,good:v=>v>0},{l:"체지방",v:rec.fat,c:"#e74c3c",d:fD,good:v=>v<0}].map(item=>(
                              <div key={item.l} style={{ flex:1,textAlign:"center" }}>
                                <div style={{ fontSize:10,color:"#aaa",marginBottom:1 }}>{item.l}</div>
                                <div style={{ fontSize:14,fontWeight:700,color:item.c }}>{item.v}</div>
                                {item.d!==null&&item.d!==0&&<div style={{ fontSize:10,color:item.good(item.d)?"#2d7a4f":"#e74c3c" }}>{item.d>0?"+":""}{item.d}</div>}
                              </div>
                            ))}
                          </div>
                          {!isBase && (
                            <div style={{ display:"flex",gap:6 }}>
                              <button onClick={()=>openEdit(i-1)} style={{ height:32,border:"1.5px solid #e8e8e8",background:"#fff",borderRadius:10,padding:"0 10px",fontSize:11,cursor:"pointer",color:"#555" }}>수정</button>
                              <button onClick={()=>deleteIb(i-1)} style={{ height:32,border:"none",background:"#fde8e8",borderRadius:10,padding:"0 10px",fontSize:11,cursor:"pointer",color:"#c0392b" }}>삭제</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 하단 네비 ── */}
      <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #efefef",paddingBottom:"env(safe-area-inset-bottom)",zIndex:100 }}>
        <div style={{ display:"flex" }}>
          {[["home","홈"],["week","주간"],["plan","플랜"],["progress","현황"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ flex:1,border:"none",background:"none",cursor:"pointer",padding:"10px 4px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,WebkitTapHighlightColor:"transparent" }}>
              <NavIcon id={k} active={tab===k}/>
              <span style={{ fontSize:10,fontWeight:tab===k?700:400,color:tab===k?"#111":"#bbb" }}>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 모달/시트 ── */}
      {logTarget && <LogSheet exKey={logTarget} records={prLog[logTarget]||[]} onSave={e=>saveLog(logTarget,e)} onClose={()=>setLogTarget(null)}/>}
      {swapSlot  && <SwapSheet slot={swapSlot} pKey={swapSlot.pKey} currentKeys={swapSlot.currentKeys} onSelect={doSwap} onClose={()=>setSwapSlot(null)}/>}
      {showGoalEdit && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:24 }}>
          <div style={{ background:"#fff",borderRadius:24,padding:"24px",width:"100%",maxWidth:320 }}>
            <div style={{ fontSize:17,fontWeight:700,marginBottom:6 }}>목표 체중 수정</div>
            <div style={{ fontSize:13,color:"#aaa",marginBottom:18,lineHeight:1.6 }}>현재 기준: {firstIb.weight}kg<br/>목표가 어려우면 조정해도 괜찮아요 💪</div>
            <input type="number" inputMode="decimal" step="0.1" value={goalWeightInput} onChange={e=>setGoalWeightInput(e.target.value)} style={{ width:"100%",border:"2px solid #e8e8e8",borderRadius:14,padding:"14px",fontSize:20,boxSizing:"border-box",outline:"none",textAlign:"center",marginBottom:14,fontWeight:700 }}/>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={saveGoalW} style={{ flex:1,background:"#111",color:"#fff",border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer" }}>저장</button>
              <button onClick={()=>setShowGoalEdit(false)} style={{ flex:1,background:"#f0f0f0",color:"#555",border:"none",borderRadius:14,padding:"14px",fontSize:15,cursor:"pointer" }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
