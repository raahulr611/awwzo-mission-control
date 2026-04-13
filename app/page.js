'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// ═══ TASKS ═══
const TASKS=[
{id:"t1",task:"Install Meta Pixel on parent.awwzo.com",channel:"Meta",priority:"Critical",phase:"Foundation",group:"Setup & Tracking",dur:2,deps:[]},
{id:"t2",task:"Install Google Ads conversion tag + GTM",channel:"Google",priority:"Critical",phase:"Foundation",group:"Setup & Tracking",dur:2,deps:[]},
{id:"t3",task:"Set up all 5 conversion actions in Google Ads",channel:"Google",priority:"Critical",phase:"Foundation",group:"Setup & Tracking",dur:2,deps:["t2"]},
{id:"t4",task:"Set up UTM parameter templates for all links",channel:"All",priority:"Medium",phase:"Foundation",group:"Setup & Tracking",dur:1,deps:[]},
{id:"t5",task:"Build 7 custom/lookalike audiences in Meta Ads Manager",channel:"Meta",priority:"High",phase:"Foundation",group:"Audience Building",dur:3,deps:["t1"]},
{id:"t6",task:"Upload existing customer list for exclusion + lookalike seed",channel:"Meta",priority:"High",phase:"Foundation",group:"Audience Building",dur:1,deps:["t1"]},
{id:"t7",task:"Build negative keyword list and apply to all campaigns",channel:"Google",priority:"High",phase:"Foundation",group:"Audience Building",dur:2,deps:["t3"]},
{id:"t8",task:"Create Google Ads campaign structure (3 campaigns)",channel:"Google",priority:"High",phase:"Foundation",group:"Campaign Launch",dur:3,deps:["t3"]},
{id:"t9",task:"Launch Google Search: Boarding + Daycare campaigns",channel:"Google",priority:"Critical",phase:"Foundation",group:"Campaign Launch",dur:2,deps:["t8","t7"]},
{id:"t10",task:"Launch Google Search: Training campaign",channel:"Google",priority:"High",phase:"Foundation",group:"Campaign Launch",dur:2,deps:["t9"]},
{id:"t11",task:"Launch Meta awareness campaign (Happy Dogs)",channel:"Meta",priority:"High",phase:"Foundation",group:"Campaign Launch",dur:2,deps:["t5","t6"]},
{id:"t12",task:"Build Google Display retargeting campaign",channel:"Google",priority:"Medium",phase:"Foundation",group:"Campaign Launch",dur:2,deps:["t9"]},
{id:"t13",task:"Start Instagram content calendar execution",channel:"Instagram",priority:"High",phase:"Foundation",group:"Content & WhatsApp",dur:3,deps:[]},
{id:"t14",task:"Begin boosting top-performing Instagram posts",channel:"Instagram",priority:"Medium",phase:"Foundation",group:"Content & WhatsApp",dur:1,deps:["t13"]},
{id:"t15",task:"Build WhatsApp Welcome sequence (4 messages)",channel:"WhatsApp",priority:"High",phase:"Foundation",group:"Content & WhatsApp",dur:3,deps:[]},
{id:"t16",task:"Build WhatsApp Post-Tour follow-up sequence",channel:"WhatsApp",priority:"High",phase:"Foundation",group:"Content & WhatsApp",dur:3,deps:["t15"]},
{id:"t17",task:"Create referral code system + tracking spreadsheet",channel:"Referral",priority:"High",phase:"Foundation",group:"Referral Setup",dur:3,deps:[]},
{id:"t18",task:"Soft launch referral program with 20 loyal customers",channel:"Referral",priority:"High",phase:"Foundation",group:"Referral Setup",dur:5,deps:["t17"]},
{id:"t19",task:"Full referral program launch — announce everywhere",channel:"Referral",priority:"High",phase:"Foundation",group:"Referral Setup",dur:3,deps:["t18"]},
{id:"t20",task:"Add referral program to parent portal",channel:"Referral",priority:"High",phase:"Foundation",group:"Referral Setup",dur:2,deps:["t17"]},
{id:"t21",task:"First performance review — adjust bids, pause low CTR",channel:"Google",priority:"High",phase:"Foundation",group:"Reviews",dur:1,deps:["t9"]},
{id:"t22",task:"Refine WhatsApp sequences based on response data",channel:"WhatsApp",priority:"Medium",phase:"Foundation",group:"Reviews",dur:2,deps:["t16"]},
{id:"t23",task:"Comprehensive review — establish baseline KPIs",channel:"All",priority:"Critical",phase:"Foundation",group:"Reviews",dur:2,deps:["t21"]},
{id:"t24",task:"Transition Google Ads to Maximise Conversions",channel:"Google",priority:"High",phase:"Foundation",group:"Reviews",dur:1,deps:["t23"]},
{id:"t25",task:"Phase 1 retrospective — document all learnings",channel:"All",priority:"High",phase:"Foundation",group:"Reviews",dur:1,deps:["t23"]},
{id:"t26",task:"A/B test 3 ad creative variants on Meta",channel:"Meta",priority:"High",phase:"Optimisation",group:"Creative Testing",dur:7,deps:["t11"]},
{id:"t27",task:"A/B test 2 RSA variants per Google campaign",channel:"Google",priority:"High",phase:"Optimisation",group:"Creative Testing",dur:7,deps:["t24"]},
{id:"t28",task:"Create and test 2 landing page variants",channel:"All",priority:"High",phase:"Optimisation",group:"Creative Testing",dur:5,deps:["t25"]},
{id:"t29",task:"Identify winning creatives — review",channel:"All",priority:"High",phase:"Optimisation",group:"Creative Testing",dur:1,deps:["t26","t27"]},
{id:"t30",task:"Scale winning campaigns by 20% budget increase",channel:"Google/Meta",priority:"High",phase:"Optimisation",group:"Scaling",dur:2,deps:["t29"]},
{id:"t31",task:"Launch seasonal boarding campaign",channel:"All",priority:"High",phase:"Optimisation",group:"Scaling",dur:3,deps:["t29"]},
{id:"t32",task:"Introduce referral leaderboard (monthly prizes)",channel:"Referral",priority:"Medium",phase:"Optimisation",group:"Scaling",dur:3,deps:["t19"]},
{id:"t33",task:"Build WhatsApp Post-Stay Delight sequence",channel:"WhatsApp",priority:"Medium",phase:"Optimisation",group:"Scaling",dur:3,deps:["t22"]},
{id:"t34",task:"Move Google Ads to Target CPA bidding",channel:"Google",priority:"High",phase:"Optimisation",group:"Advanced Bidding",dur:2,deps:["t30"]},
{id:"t35",task:"Build value-based lookalike from converted customers",channel:"Meta",priority:"High",phase:"Optimisation",group:"Advanced Bidding",dur:2,deps:["t30"]},
{id:"t36",task:"Mid-year comprehensive review",channel:"All",priority:"Critical",phase:"Optimisation",group:"Advanced Bidding",dur:2,deps:["t34","t35"]},
{id:"t37",task:"Phase 2 retrospective + Phase 3 planning",channel:"All",priority:"High",phase:"Optimisation",group:"Advanced Bidding",dur:1,deps:["t36"]},
{id:"t38",task:"Test Google Performance Max campaign",channel:"Google",priority:"Medium",phase:"Scaling",group:"New Channels",dur:5,deps:["t34"]},
{id:"t39",task:"Launch Instagram Reels-only awareness campaign",channel:"Instagram",priority:"Medium",phase:"Scaling",group:"New Channels",dur:3,deps:["t37"]},
{id:"t40",task:"Expand WhatsApp with post-stay upsell sequences",channel:"WhatsApp",priority:"Medium",phase:"Scaling",group:"New Channels",dur:3,deps:["t33"]},
{id:"t41",task:"Launch hyper-local neighborhood targeting ads",channel:"Google/Meta",priority:"High",phase:"Scaling",group:"Geo Expansion",dur:4,deps:["t37"]},
{id:"t42",task:"Produce and launch video testimonial campaign",channel:"Meta",priority:"High",phase:"Scaling",group:"Geo Expansion",dur:5,deps:["t37"]},
{id:"t43",task:"Add referral gamification — top referrer prize",channel:"Referral",priority:"Medium",phase:"Scaling",group:"Geo Expansion",dur:2,deps:["t32"]},
{id:"t44",task:"Build holiday landing pages (Diwali/Christmas/NY)",channel:"All",priority:"High",phase:"Scaling",group:"Holiday Prep",dur:5,deps:["t37"]},
{id:"t45",task:"Launch holiday pre-booking campaigns",channel:"All",priority:"Critical",phase:"Scaling",group:"Holiday Prep",dur:3,deps:["t44"]},
{id:"t46",task:"WhatsApp holiday boarding early-bird sequence",channel:"WhatsApp",priority:"High",phase:"Scaling",group:"Holiday Prep",dur:2,deps:["t44"]},
{id:"t47",task:"Phase 3 retrospective + holiday readiness check",channel:"All",priority:"High",phase:"Scaling",group:"Holiday Prep",dur:1,deps:["t45"]},
{id:"t48",task:"Full WhatsApp automation — all sequences hands-off",channel:"WhatsApp",priority:"High",phase:"Maturity",group:"Automation",dur:5,deps:["t40"]},
{id:"t49",task:"Advanced Meta audiences: value-based lookalikes",channel:"Meta",priority:"Medium",phase:"Maturity",group:"Automation",dur:3,deps:["t35"]},
{id:"t50",task:"Competitor analysis deep-dive refresh",channel:"All",priority:"Medium",phase:"Maturity",group:"Automation",dur:3,deps:["t47"]},
{id:"t51",task:"Customer LTV analysis — highest-value segments",channel:"All",priority:"High",phase:"Maturity",group:"Analytics",dur:4,deps:["t47"]},
{id:"t52",task:"Channel attribution modeling — true CPA per channel",channel:"All",priority:"High",phase:"Maturity",group:"Analytics",dur:4,deps:["t51"]},
{id:"t53",task:"Test new content formats (long-form, community)",channel:"Instagram",priority:"Medium",phase:"Maturity",group:"Analytics",dur:5,deps:["t47"]},
{id:"t54",task:"Year-end performance report",channel:"All",priority:"Critical",phase:"Maturity",group:"Year-End",dur:3,deps:["t52"]},
{id:"t55",task:"Year 2 budget planning",channel:"All",priority:"Critical",phase:"Maturity",group:"Year-End",dur:3,deps:["t54"]},
{id:"t56",task:"Strategy refinement document for Year 2",channel:"All",priority:"High",phase:"Maturity",group:"Year-End",dur:2,deps:["t55"]},
{id:"t57",task:"Final retrospective — celebrate & document",channel:"All",priority:"High",phase:"Maturity",group:"Year-End",dur:1,deps:["t56"]},
];

const WK=[
{id:"w1",task:"Google Ads: review search terms, add negatives, pause low CTR",channel:"Google"},
{id:"w2",task:"Meta Ads: check frequency, CPM, CTR. Pause fatigued creatives",channel:"Meta"},
{id:"w3",task:"WhatsApp: review sequences, respond to pending leads",channel:"WhatsApp"},
{id:"w4",task:"Instagram: check engagement, pick top post to boost",channel:"Instagram"},
{id:"w5",task:"Content: confirm this week's posts are scheduled",channel:"Instagram"},
{id:"w6",task:"Update KPI dashboard with last week's numbers",channel:"All"},
{id:"w7",task:"Referral: new referrals, pending rewards, follow-ups",channel:"Referral"},
{id:"w8",task:"Quick competitor scan",channel:"All"},
];

// ═══ INDIAN HOLIDAYS 2026-27 ═══
const HOLIDAYS=[
{date:"2026-04-14",title:"Ambedkar Jayanti",type:"holiday"},
{date:"2026-04-21",title:"Ram Navami",type:"holiday"},
{date:"2026-05-01",title:"May Day",type:"holiday"},
{date:"2026-05-24",title:"Buddha Purnima",type:"holiday"},
{date:"2026-06-27",title:"Eid ul-Fitr (Tentative)",type:"holiday"},
{date:"2026-07-07",title:"Rath Yatra",type:"holiday"},
{date:"2026-08-15",title:"Independence Day 🇮🇳",type:"holiday"},
{date:"2026-08-17",title:"Janmashtami",type:"holiday"},
{date:"2026-09-03",title:"Eid ul-Adha (Tentative)",type:"holiday"},
{date:"2026-09-14",title:"Ganesh Chaturthi",type:"holiday"},
{date:"2026-10-02",title:"Gandhi Jayanti",type:"holiday"},
{date:"2026-10-07",title:"Navratri Begins",type:"holiday"},
{date:"2026-10-15",title:"Dussehra",type:"holiday"},
{date:"2026-11-04",title:"Diwali 🪔",type:"holiday"},
{date:"2026-11-05",title:"Diwali (Day 2)",type:"holiday"},
{date:"2026-11-15",title:"Guru Nanak Jayanti",type:"holiday"},
{date:"2026-12-25",title:"Christmas 🎄",type:"holiday"},
{date:"2027-01-01",title:"New Year 🎆",type:"holiday"},
{date:"2027-01-14",title:"Makar Sankranti / Pongal",type:"holiday"},
{date:"2027-01-26",title:"Republic Day 🇮🇳",type:"holiday"},
{date:"2027-03-14",title:"Holi 🎨",type:"holiday"},
];

// ═══ DEFAULT WEEKLY CONTENT ═══
const WEEKLY_CONTENT=[
{day:1,title:"Happy Dogs Reel",type:"Content",channel:"Instagram",notes:"Shoot in morning, edit PM"},
{day:2,title:"Educational Carousel",type:"Content",channel:"Instagram",notes:"Tips or dog care advice"},
{day:3,title:"Behind-the-Scenes Reel",type:"Content",channel:"Instagram",notes:"Trainer-led content"},
{day:4,title:"Testimonial / Trust Post",type:"Content",channel:"Instagram",notes:"Customer photos + review"},
{day:5,title:"Happy Dogs Reel",type:"Content",channel:"Instagram",notes:"Boost top Reel of the week"},
{day:6,title:"User-Generated Content",type:"Content",channel:"Instagram",notes:"Light day, pre-shot content"},
];

const RECURRING_REVIEWS=[
{dayOfWeek:1,title:"Weekly Monday Checklist",type:"Review",channel:"All",notes:"2.5 hours — all 8 checklist items"},
];

const PM={Foundation:{c:"#0F4C75",a:"#3282B8"},Optimisation:{c:"#C65D07",a:"#E67E22"},Scaling:{c:"#1B7A3D",a:"#27AE60"},Maturity:{c:"#6C3483",a:"#8E44AD"},Custom:{c:"#1A5276",a:"#2E86C1"}};
const CC={Google:"#4285F4",Meta:"#0668E1",Instagram:"#E1306C",WhatsApp:"#25D366",Referral:"#F39C12",All:"#607D8B","Google/Meta":"#7B68EE"};
const PRI={Critical:{bg:"#FDE8E8",fg:"#B91C1C"},High:{bg:"#FEF3C7",fg:"#92400E"},Medium:{bg:"#DBEAFE",fg:"#1E40AF"},Low:{bg:"#F0F2F5",fg:"#6B7B8D"}};
const CAL_COLORS={Content:"#E1306C","Ad Campaign":"#4285F4",WhatsApp:"#25D366",Referral:"#F39C12",Holiday:"#E74C3C",Review:"#607D8B",Custom:"#8E44AD"};
const SI={"WHAT THIS IS":"📋","WHY IT MATTERS":"🎯","STEP-BY-STEP EXECUTION":"⚡","COMMON MISTAKES TO AVOID":"⚠️","HOW TO KNOW IT'S WORKING":"✅","ESTIMATED TIME":"⏱️","CURRENT STATUS SUMMARY":"📊","CRITICAL GAPS DETECTED":"🚨","RECOMMENDED PRIORITY ORDER":"🎯","QUICK WINS":"⚡","WHAT TO DEPRIORITIZE":"⏸️","OVERALL HEALTH SCORE":"💪","INSIGHTS FROM LEARNINGS":"🧠","KPI TREND ANALYSIS":"📈","CHANNEL PERFORMANCE":"📊","CALENDAR HEALTH CHECK":"📅"};
const SCo={"WHAT THIS IS":"#3282B8","WHY IT MATTERS":"#27AE60","STEP-BY-STEP EXECUTION":"#E67E22","COMMON MISTAKES TO AVOID":"#E74C3C","HOW TO KNOW IT'S WORKING":"#8E44AD","ESTIMATED TIME":"#2C3E50","CURRENT STATUS SUMMARY":"#3282B8","CRITICAL GAPS DETECTED":"#E74C3C","RECOMMENDED PRIORITY ORDER":"#E67E22","QUICK WINS":"#27AE60","WHAT TO DEPRIORITIZE":"#6B7B8D","OVERALL HEALTH SCORE":"#8E44AD","INSIGHTS FROM LEARNINGS":"#2C3E50","KPI TREND ANALYSIS":"#E67E22","CHANNEL PERFORMANCE":"#3282B8","CALENDAR HEALTH CHECK":"#8E44AD"};

const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
const fD=d=>d.toLocaleDateString("en-IN",{day:"numeric",month:"short"});
const fDF=d=>d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const toI=d=>d.toISOString().split("T")[0];
const dB=(a,b)=>Math.ceil((b-a)/864e5);
const S={xs:12,sm:13,base:15,lg:17,xl:20,xxl:26,huge:34,tag:11,label:12,check:24,radius:10,rSm:6,pad:16,padL:24};
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];

function sched(tasks,sd){const m={};tasks.forEach(t=>{m[t.id]={...t};});const o={};const v=new Set();
function go(id){if(v.has(id))return o[id];v.add(id);const t=m[id];if(!t)return null;
if(t.status==="done"){o[id]={...t,startDate:null,endDate:null};return o[id];}
let e=new Date(sd);for(const d of(t.deps||[])){const dep=go(d);if(dep?.endDate){const a=addD(dep.endDate,1);if(a>e)e=a;}}
o[id]={...t,startDate:e,endDate:addD(e,(t.dur||1)-1)};return o[id];}
tasks.forEach(t=>go(t.id));
return Object.values(o).sort((a,b)=>{if(a.status==="done"&&b.status!=="done")return 1;if(a.status!=="done"&&b.status==="done")return-1;if(!a.startDate||!b.startDate)return 0;return a.startDate-b.startDate;});}

function parseSec(text){if(!text)return[];const rx=/→\s*(.+)/g;const ms=[...text.matchAll(rx)];
if(!ms.length)return[{title:null,content:text}];
return ms.map((m,i)=>({title:m[1].trim(),content:text.slice(m.index+m[0].length,i<ms.length-1?ms[i+1].index:text.length).trim()}));}

const VALID_EMAIL="marketing@awwzo.com";
const VALID_PASS="AwWzo@1@34%@%6";

async function dbLoad(email){try{const r=await fetch(`/api/data?email=${encodeURIComponent(email)}`);const j=await r.json();return j.data||null;}catch(e){return null;}}
async function dbSave(email,data){try{await fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,data})});}catch(e){}}

// ═══ Calendar helpers ═══
function getMonthDays(year,month){
  const first=new Date(year,month,1);
  const last=new Date(year,month+1,0);
  const days=[];
  const startDay=first.getDay();
  for(let i=0;i<startDay;i++) days.push(null);
  for(let d=1;d<=last.getDate();d++) days.push(new Date(year,month,d));
  return days;
}

function getEventsForDate(dateStr,calEvents,calRecurring){
  const events=[];
  const d=new Date(dateStr);
  const dow=d.getDay();
  // Custom events
  (calEvents||[]).forEach(e=>{if(e.date===dateStr)events.push(e);if(e.endDate&&e.date<=dateStr&&e.endDate>=dateStr)events.push({...e,isRange:true});});
  // Holidays
  HOLIDAYS.forEach(h=>{if(h.date===dateStr)events.push(h);});
  // Recurring content (Mon=1 to Sat=6)
  WEEKLY_CONTENT.forEach(w=>{if(w.day===dow)events.push({...w,date:dateStr,recurring:true});});
  // Weekly review
  RECURRING_REVIEWS.forEach(r=>{if(r.dayOfWeek===dow)events.push({...r,date:dateStr,recurring:true});});
  return events;
}

function getWeekSummary(weekDates,calEvents){
  const summary={Content:0,"Ad Campaign":0,WhatsApp:0,Referral:0,Holiday:0,Review:0,Custom:0};
  weekDates.forEach(d=>{if(!d)return;const ds=toI(d);const evts=getEventsForDate(ds,calEvents);evts.forEach(e=>{if(summary[e.type]!==undefined)summary[e.type]++;});});
  return summary;
}

function getUpcomingHolidays(){
  const today=toI(new Date());
  return HOLIDAYS.filter(h=>h.date>=today).slice(0,3).map(h=>({...h,daysAway:dB(new Date(),new Date(h.date))}));
}

function calendarSummaryForAI(calEvents){
  const today=new Date();
  const next14=toI(addD(today,14));
  const todayStr=toI(today);
  const upcoming=(calEvents||[]).filter(e=>e.date>=todayStr&&e.date<=next14);
  const holidays=HOLIDAYS.filter(h=>h.date>=todayStr&&h.date<=toI(addD(today,60)));
  const weekContent=WEEKLY_CONTENT.map(w=>`${DAYS[w.day]}: ${w.title} (${w.channel})`).join(", ");
  let summary=`CALENDAR (next 14 days):\n`;
  if(upcoming.length>0) summary+=upcoming.map(e=>`${e.date}: ${e.title} (${e.type}, ${e.channel||"—"})`).join("\n");
  else summary+="No custom events scheduled.\n";
  summary+=`\n\nRECURRING WEEKLY CONTENT: ${weekContent}`;
  summary+=`\n\nUPCOMING HOLIDAYS (next 60 days):\n${holidays.length>0?holidays.map(h=>`${h.date}: ${h.title} (${dB(today,new Date(h.date))} days away)`).join("\n"):"None in next 60 days"}`;
  return summary;
}

// ═══ LOGIN ═══
function LoginScreen({onLogin}){
  const[email,setEmail]=useState('');const[pass,setPass]=useState('');const[error,setError]=useState('');const[showP,setShowP]=useState(false);
  const go=()=>{if(email.toLowerCase()===VALID_EMAIL&&pass===VALID_PASS){localStorage.setItem('awwzo-auth',email.toLowerCase());onLogin(email.toLowerCase());}else{setError('Invalid credentials');setTimeout(()=>setError(''),3000);}};
  return(
    <div style={{minHeight:'100vh',background:'#0A0F1A',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'-20%',left:'-10%',width:'50vw',height:'50vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(230,126,34,0.06) 0%,transparent 60%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'-30%',right:'-15%',width:'60vw',height:'60vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(50,130,184,0.05) 0%,transparent 60%)',pointerEvents:'none'}}/>
      <div style={{width:'100%',maxWidth:420,padding:'0 24px',position:'relative',zIndex:1,animation:'fadeIn 0.6s ease'}}>
        <div style={{textAlign:'center',marginBottom:44}}>
          <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:80,height:80,borderRadius:20,background:'linear-gradient(135deg,#E67E22 0%,#F39C12 100%)',marginBottom:20,boxShadow:'0 8px 32px rgba(230,126,34,0.3)'}}><span style={{fontSize:36,filter:'brightness(0) invert(1)'}}>🐾</span></div>
          <h1 style={{margin:0,fontSize:36,fontWeight:800,color:'#fff',letterSpacing:'-1.5px'}}>AWWZO</h1>
          <p style={{margin:'6px 0 0',fontSize:13,color:'#E67E22',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase'}}>Mission Control</p>
          <p style={{margin:'16px 0 0',fontSize:S.base,color:'#4A5568'}}>Marketing Execution Dashboard</p>
        </div>
        <div style={{background:'rgba(255,255,255,0.03)',borderRadius:20,padding:'36px 32px',border:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{marginBottom:24}}>
            <label style={{display:'block',fontSize:S.label,fontWeight:600,color:'#6B7B8D',letterSpacing:'1px',textTransform:'uppercase',marginBottom:8}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="your@email.com" style={{width:'100%',padding:'14px 16px',borderRadius:S.radius,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:'#fff',fontSize:S.base,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:28}}>
            <label style={{display:'block',fontSize:S.label,fontWeight:600,color:'#6B7B8D',letterSpacing:'1px',textTransform:'uppercase',marginBottom:8}}>Password</label>
            <div style={{position:'relative'}}>
              <input type={showP?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="••••••••" style={{width:'100%',padding:'14px 48px 14px 16px',borderRadius:S.radius,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:'#fff',fontSize:S.base,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>
              <button onClick={()=>setShowP(!showP)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'transparent',border:'none',color:'#4A5568',cursor:'pointer',fontSize:18}}>{showP?'🙈':'👁️'}</button>
            </div>
          </div>
          {error&&<div style={{padding:'12px 16px',borderRadius:S.radius,background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.2)',color:'#E74C3C',fontSize:S.sm,fontWeight:500,marginBottom:20,textAlign:'center',animation:'shake 0.4s ease'}}>{error}</div>}
          <button onClick={go} style={{width:'100%',padding:'16px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#E67E22 0%,#F39C12 100%)',color:'#fff',fontSize:S.lg,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 4px 20px rgba(230,126,34,0.3)'}}>Sign In →</button>
        </div>
      </div>
    </div>
  );
}

// ═══ MODALS ═══
function AddTaskModal({onAdd,onClose}){
  const[name,setName]=useState('');const[ch,setCh]=useState('All');const[pri,setPri]=useState('Medium');
  const[sDate,setSDate]=useState(toI(new Date()));const[eDate,setEDate]=useState(toI(addD(new Date(),2)));const[comment,setComment]=useState('');
  const submit=()=>{if(!name.trim())return;onAdd({id:`custom-${Date.now()}`,task:name.trim(),channel:ch,priority:pri,phase:"Custom",group:"Custom Tasks",dur:Math.max(1,dB(new Date(sDate),new Date(eDate))+1),deps:[],status:"todo",customStartDate:sDate,customEndDate:eDate,comment,isCustom:true});onClose();};
  return(<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,padding:20}}>
    <div style={{background:'#fff',borderRadius:16,padding:28,width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h3 style={{margin:0,fontSize:S.xl,fontWeight:700}}>Add New Task</h3><button onClick={onClose} style={{background:'transparent',border:'none',fontSize:24,cursor:'pointer',color:'#8896A6'}}>×</button></div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Task Name *</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="What needs to be done?" style={{width:'100%',padding:'12px 14px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.base,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Channel</label><select value={ch} onChange={e=>setCh(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',background:'#fff'}}>{["Google","Meta","Instagram","WhatsApp","Referral","All"].map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Priority</label><select value={pri} onChange={e=>setPri(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',background:'#fff'}}>{["Critical","High","Medium","Low"].map(p=><option key={p}>{p}</option>)}</select></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Start Date</label><input type="date" value={sDate} onChange={e=>setSDate(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',boxSizing:'border-box'}}/></div>
          <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>End Date</label><input type="date" value={eDate} onChange={e=>setEDate(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',boxSizing:'border-box'}}/></div>
        </div>
        <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Comment</label><textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Any context..." rows={3} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',resize:'vertical',boxSizing:'border-box'}}/></div>
        <button onClick={submit} style={{width:'100%',padding:'14px',borderRadius:S.radius,border:'none',background:'linear-gradient(135deg,#E67E22,#F39C12)',color:'#fff',fontSize:S.base,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Add Task</button>
      </div>
    </div>
  </div>);
}

function LearningModal({task,existing,onSave,onClose}){
  const[result,setResult]=useState(existing?.result||'');const[worked,setWorked]=useState(existing?.worked||'');
  const[didnt,setDidnt]=useState(existing?.didnt||'');const[metric,setMetric]=useState(existing?.metric||'');
  const submit=()=>{onSave(task.id,{result,worked,didnt,metric,date:new Date().toISOString()});onClose();};
  return(<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,padding:20}}>
    <div style={{background:'#fff',borderRadius:16,padding:28,width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><h3 style={{margin:0,fontSize:S.lg,fontWeight:700}}>📝 Log Learning / Result</h3><button onClick={onClose} style={{background:'transparent',border:'none',fontSize:24,cursor:'pointer',color:'#8896A6'}}>×</button></div>
      <p style={{margin:'0 0 20px',fontSize:S.sm,color:'#6B7B8D'}}>{task.task}</p>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>What was the result?</label><textarea value={result} onChange={e=>setResult(e.target.value)} placeholder="Describe the outcome..." rows={2} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',resize:'vertical',boxSizing:'border-box'}}/></div>
        <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>What worked?</label><textarea value={worked} onChange={e=>setWorked(e.target.value)} rows={2} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',resize:'vertical',boxSizing:'border-box'}}/></div>
        <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>What didn't work?</label><textarea value={didnt} onChange={e=>setDidnt(e.target.value)} rows={2} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',resize:'vertical',boxSizing:'border-box'}}/></div>
        <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Key Metric</label><input value={metric} onChange={e=>setMetric(e.target.value)} placeholder="e.g., CPL dropped from ₹600 to ₹350" style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',boxSizing:'border-box'}}/></div>
        <button onClick={submit} style={{width:'100%',padding:'14px',borderRadius:S.radius,border:'none',background:'#27AE60',color:'#fff',fontSize:S.base,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Save Learning</button>
      </div>
    </div>
  </div>);
}

// ═══ ADD CALENDAR EVENT MODAL ═══
function AddCalEventModal({date,onAdd,onClose}){
  const[title,setTitle]=useState('');const[type,setType]=useState('Content');const[ch,setCh]=useState('Instagram');
  const[eDate,setEDate]=useState(date||toI(new Date()));const[endDate,setEndDate]=useState('');const[time,setTime]=useState('');
  const[notes,setNotes]=useState('');const[status,setStatus]=useState('Planning');
  const submit=()=>{if(!title.trim())return;onAdd({id:`cal-${Date.now()}`,title:title.trim(),type,channel:ch,date:eDate,endDate:endDate||undefined,time:time||undefined,notes,status});onClose();};
  return(<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,padding:20}}>
    <div style={{background:'#fff',borderRadius:16,padding:28,width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><h3 style={{margin:0,fontSize:S.xl,fontWeight:700}}>📅 Add Calendar Event</h3><button onClick={onClose} style={{background:'transparent',border:'none',fontSize:24,cursor:'pointer',color:'#8896A6'}}>×</button></div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Title *</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What's happening?" style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.base,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Type</label><select value={type} onChange={e=>setType(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',background:'#fff'}}>{["Content","Ad Campaign","WhatsApp","Referral","Review","Custom"].map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Channel</label><select value={ch} onChange={e=>setCh(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',background:'#fff'}}>{["Google","Meta","Instagram","WhatsApp","Referral","All"].map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Date</label><input type="date" value={eDate} onChange={e=>setEDate(e.target.value)} style={{width:'100%',padding:'10px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',boxSizing:'border-box'}}/></div>
          <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>End Date</label><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{width:'100%',padding:'10px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',boxSizing:'border-box'}}/></div>
          <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Time</label><input type="time" value={time} onChange={e=>setTime(e.target.value)} style={{width:'100%',padding:'10px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',boxSizing:'border-box'}}/></div>
        </div>
        <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Status</label><select value={status} onChange={e=>setStatus(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',background:'#fff'}}>{["Planning","Ready","Live","Completed","Cancelled"].map(s=><option key={s}>{s}</option>)}</select></div>
        <div><label style={{display:'block',fontSize:S.xs,fontWeight:600,color:'#6B7B8D',marginBottom:6,textTransform:'uppercase'}}>Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Details..." rows={2} style={{width:'100%',padding:'12px',borderRadius:S.rSm,border:'1px solid #D1D8E0',fontSize:S.sm,fontFamily:'inherit',resize:'vertical',boxSizing:'border-box'}}/></div>
        <button onClick={submit} style={{width:'100%',padding:'14px',borderRadius:S.radius,border:'none',background:'linear-gradient(135deg,#E67E22,#F39C12)',color:'#fff',fontSize:S.base,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Add Event</button>
      </div>
    </div>
  </div>);
}

// ═══ MAIN ═══
export default function Home(){
  const[userEmail,setUserEmail]=useState(null);
  const[mode,setMode]=useState("loading");
  const[tasks,setTasks]=useState(()=>TASKS.map(t=>({...t,status:"todo"})));
  const[sd,setSd]=useState(()=>toI(new Date()));
  const[view,setView]=useState("timeline");
  const[fCh,setFCh]=useState("All Channels");
  const[fPh,setFPh]=useState("All Phases");
  const[wD,setWD]=useState({});
  const[kpis,setKpis]=useState({leads:"",cpl:"",tourRate:"",convRate:"",cpa:"",roas:""});
  const[kpiHistory,setKpiHistory]=useState([]);
  const[notes,setNotes]=useState({});
  const[eNote,setENote]=useState(null);
  const[learnings,setLearnings]=useState({});
  const[aiP,setAiP]=useState("");const[aiR,setAiR]=useState("");const[aiL,setAiL]=useState(false);
  const[tOpen,setTOpen]=useState(null);const[tAi,setTAi]=useState({});const[tAiL,setTAiL]=useState(null);
  const[analysis,setAnalysis]=useState("");
  const[setupFilter,setSetupFilter]=useState("All");
  const[showAddTask,setShowAddTask]=useState(false);
  const[showLearning,setShowLearning]=useState(null);
  const[saving,setSaving]=useState(false);
  const saveTimer=useRef(null);
  // Calendar state
  const[calEvents,setCalEvents]=useState([]);
  const[calMonth,setCalMonth]=useState(new Date().getMonth());
  const[calYear,setCalYear]=useState(new Date().getFullYear());
  const[calView,setCalView]=useState("month"); // month | week
  const[showAddCal,setShowAddCal]=useState(null); // null or date string
  const[calSelected,setCalSelected]=useState(null); // selected date to show detail

  useEffect(()=>{if(typeof window!=='undefined'){const stored=localStorage.getItem('awwzo-auth');if(stored)setUserEmail(stored);}},[]);

  useEffect(()=>{if(!userEmail)return;(async()=>{const data=await dbLoad(userEmail);if(data){
    if(data.tasks)setTasks(data.tasks);if(data.sd)setSd(data.sd);if(data.wD)setWD(data.wD);
    if(data.kpis)setKpis(data.kpis);if(data.kpiHistory)setKpiHistory(data.kpiHistory);
    if(data.notes)setNotes(data.notes);if(data.learnings)setLearnings(data.learnings);
    if(data.tAi)setTAi(data.tAi);if(data.analysis)setAnalysis(data.analysis);
    if(data.calEvents)setCalEvents(data.calEvents);
    if(data.mode==="dashboard"){setMode("dashboard");setView("analysis");}else setMode("setup");
  }else setMode("setup");})();
  },[userEmail]);

  const sv=useCallback((t,s,w,k,kh,n,lr,ta,an,m,ce)=>{
    const payload={tasks:t,sd:s,wD:w,kpis:k,kpiHistory:kh,notes:n,learnings:lr,tAi:ta,analysis:an,mode:m,calEvents:ce};
    try{localStorage.setItem('awwzo-local',JSON.stringify(payload));}catch(e){}
    if(saveTimer.current)clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(async()=>{if(userEmail){setSaving(true);await dbSave(userEmail,payload);setSaving(false);}},1500);
  },[userEmail]);

  const tog=id=>{const nx=tasks.map(t=>t.id===id?{...t,status:t.status==="done"?"todo":"done"}:t);setTasks(nx);sv(nx,sd,wD,kpis,kpiHistory,notes,learnings,tAi,analysis,mode,calEvents);};
  const addCustomTask=t=>{const nx=[...tasks,t];setTasks(nx);sv(nx,sd,wD,kpis,kpiHistory,notes,learnings,tAi,analysis,mode,calEvents);};
  const deleteTask=id=>{const nx=tasks.filter(t=>t.id!==id);setTasks(nx);sv(nx,sd,wD,kpis,kpiHistory,notes,learnings,tAi,analysis,mode,calEvents);};
  const saveLearning=(id,data)=>{const nx={...learnings,[id]:data};setLearnings(nx);sv(tasks,sd,wD,kpis,kpiHistory,notes,nx,tAi,analysis,mode,calEvents);};
  const addCalEvent=e=>{const nx=[...calEvents,e];setCalEvents(nx);sv(tasks,sd,wD,kpis,kpiHistory,notes,learnings,tAi,analysis,mode,nx);};
  const deleteCalEvent=id=>{const nx=calEvents.filter(e=>e.id!==id);setCalEvents(nx);sv(tasks,sd,wD,kpis,kpiHistory,notes,learnings,tAi,analysis,mode,nx);};

  const saveKpis=(newKpis)=>{
    const today=toI(new Date());const last=kpiHistory.length>0?kpiHistory[kpiHistory.length-1]:null;
    let nh=kpiHistory;
    if(!last||last.date!==today)nh=[...kpiHistory,{date:today,...newKpis}];
    else nh=kpiHistory.map((h,i)=>i===kpiHistory.length-1?{date:today,...newKpis}:h);
    setKpiHistory(nh);setKpis(newKpis);sv(tasks,sd,wD,newKpis,nh,notes,learnings,tAi,analysis,mode,calEvents);
  };

  const sc=sched(tasks,new Date(sd));
  const act=sc.filter(t=>t.status!=="done");const dn=sc.filter(t=>t.status==="done");
  const tDn=tasks.filter(t=>t.status==="done").length;
  const pc={};tasks.forEach(t=>{if(!pc[t.phase])pc[t.phase]={total:0,done:0};pc[t.phase].total++;if(t.status==="done")pc[t.phase].done++;});
  const endD=act.length>0?act.reduce((mx,t)=>t.endDate>mx?t.endDate:mx,act[0]?.endDate||new Date()):new Date();

  const callAI=async(system,userMsg)=>{const res=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system,messages:[{role:'user',content:userMsg}]})});const data=await res.json();return data.text||"Failed.";};

  // Enhanced AI Analysis with calendar
  const runAnalysis=async()=>{setMode("analysing");try{
    const doneL=tasks.filter(t=>t.status==="done").map(t=>{const lr=learnings[t.id];let line=`✓ ${t.task} (${t.channel})`;if(lr){line+=`\n  Result: ${lr.result||"—"}\n  Worked: ${lr.worked||"—"}\n  Metric: ${lr.metric||"—"}`;}return line;}).join("\n\n");
    const pendL=tasks.filter(t=>t.status==="todo").map(t=>`○ ${t.task} (${t.channel}, ${t.priority})${t.isCustom?" [CUSTOM]":""}${t.comment?` — ${t.comment}`:""}`).join("\n");
    const depIss=tasks.filter(t=>t.status==="done"&&!t.isCustom).flatMap(t=>(t.deps||[]).filter(d=>tasks.find(x=>x.id===d)?.status!=="done").map(d=>`"${t.task}" done but prereq "${tasks.find(x=>x.id===d)?.task}" NOT done`));
    const kpiStr=kpiHistory.length>0?kpiHistory.map(h=>`${h.date}: Leads=${h.leads||"?"}, CPL=${h.cpl||"?"}, CPA=${h.cpa||"?"}, ROAS=${h.roas||"?"}`).join("\n"):"No KPI history.";
    const calStr=calendarSummaryForAI(calEvents);

    const sys=`You are Awwzo's senior marketing strategist AI. Premium dog daycare/boarding/training, Bengaluru, 5.0 Google rating, 1L+ care hours, WhatsApp primary, parent.awwzo.com signup.

You have COMPLETE data: tasks, learnings, KPI history, calendar events, and upcoming holidays. Use ALL of it.

Structure with EXACT → headers (one per line, nothing else on the header line):
→ CURRENT STATUS SUMMARY
→ CRITICAL GAPS DETECTED
→ INSIGHTS FROM LEARNINGS
→ KPI TREND ANALYSIS
→ CHANNEL PERFORMANCE
→ CALENDAR HEALTH CHECK
→ RECOMMENDED PRIORITY ORDER
→ QUICK WINS
→ WHAT TO DEPRIORITIZE
→ OVERALL HEALTH SCORE

For CALENDAR HEALTH CHECK: analyse if content is scheduled consistently, if upcoming holidays have campaign prep, if there are heavy/empty days, and if the calendar aligns with the marketing strategy.

Be specific to Awwzo. Reference actual task names. Plain text only.`;

    const txt=await callAI(sys,`COMPLETED WITH LEARNINGS:\n${doneL||"None"}\n\nPENDING:\n${pendL}\n\n${depIss.length?`DEPENDENCY ISSUES:\n${depIss.join("\n")}`:"No dep issues."}\n\nKPI HISTORY:\n${kpiStr}\n\n${calStr}\n\nStart: ${sd}\n\nFull assessment.`);
    setAnalysis(txt);setMode("dashboard");setView("analysis");sv(tasks,sd,wD,kpis,kpiHistory,notes,learnings,tAi,txt,"dashboard",calEvents);
  }catch(e){setAnalysis("Connection failed.");setMode("dashboard");}};

  const askTask=async t=>{
    if(tAi[t.id]&&tOpen===t.id){setTOpen(null);return;}if(tAi[t.id]){setTOpen(t.id);return;}
    setTAiL(t.id);setTOpen(t.id);
    try{const sys=`You are Awwzo's marketing execution coach. Premium dog daycare/boarding/training, Bengaluru, 5.0 Google rating, 1L+ care hours, WhatsApp primary, parent.awwzo.com signup.\n\nComplete guide with EXACT → headers (one per line):\n→ WHAT THIS IS\n→ WHY IT MATTERS\n→ STEP-BY-STEP EXECUTION\n→ COMMON MISTAKES TO AVOID\n→ HOW TO KNOW IT'S WORKING\n→ ESTIMATED TIME\n\nSpecific to Awwzo. Plain text.`;
    const depN=(t.deps||[]).map(d=>tasks.find(x=>x.id===d)?.task||d).join(", ")||"None";
    const txt=await callAI(sys,`Task: "${t.task}"\nChannel: ${t.channel}\nPriority: ${t.priority}\nPhase: ${t.phase} → ${t.group}\nDuration: ${t.dur||1}d\nDepends on: ${depN}${t.comment?`\nContext: ${t.comment}`:""}\n\nComplete guide.`);
    const nx={...tAi,[t.id]:txt};setTAi(nx);sv(tasks,sd,wD,kpis,kpiHistory,notes,learnings,nx,analysis,"dashboard",calEvents);
    }catch(e){const nx={...tAi,[t.id]:"Failed."};setTAi(nx);}setTAiL(null);};

  const askG=async()=>{if(!aiP.trim())return;setAiL(true);setAiR("");try{
    const lrS=Object.entries(learnings).map(([id,lr])=>{const t=tasks.find(x=>x.id===id);return`${t?.task||id}: Result="${lr.result}", Metric="${lr.metric}"`;}).join("\n");
    const calStr=calendarSummaryForAI(calEvents);
    const ctx=`Awwzo marketing AI. Premium dog care Bengaluru. Done:${tDn}/${tasks.length}. KPIs:Leads=${kpis.leads||"?"},CPL=${kpis.cpl||"?"},CPA=${kpis.cpa||"?"},ROAS=${kpis.roas||"?"}.\nLearnings:\n${lrS||"None"}\n${calStr}\nNext tasks:${act.slice(0,10).map(t=>t.task).join("; ")}.\nConcise, Awwzo-specific. Under 300 words. Plain text.`;
    const txt=await callAI(ctx,aiP);setAiR(txt);}catch(e){setAiR("Failed.");}setAiL(false);};

  const filtered=[...act,...dn].filter(t=>{const cm=fCh==="All Channels"||t.channel===fCh||t.channel==="All"||t.channel?.includes(fCh);const pm=fPh==="All Phases"||t.phase===fPh;return cm&&pm;});
  const setupTasks=tasks.filter(t=>setupFilter==="All"||t.phase===setupFilter);
  const logout=()=>{localStorage.removeItem('awwzo-auth');setUserEmail(null);};

  // Calendar computed
  const monthDays=getMonthDays(calYear,calMonth);
  const todayStr=toI(new Date());
  const upcomingH=getUpcomingHolidays();

  if(!userEmail) return <LoginScreen onLogin={e=>setUserEmail(e)}/>;
  if(mode==="loading") return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0F1923',color:'#6B7B8D',fontSize:S.base}}>Loading...</div>;

  // ═══ SETUP ═══
  if(mode==="setup") return(
    <div style={{background:"#0F1923",minHeight:"100vh",color:"#fff"}}>
      <div style={{maxWidth:720,margin:"0 auto",padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:36,animation:"fadeIn .5s ease"}}>
          <h1 style={{margin:0,fontSize:S.huge,fontWeight:800,letterSpacing:"-1px"}}>AWWZO</h1>
          <p style={{margin:"6px 0 0",fontSize:S.sm,color:"#E67E22",fontWeight:600,letterSpacing:"2px",textTransform:"uppercase"}}>Mission Control Setup</p>
          <p style={{margin:"18px auto 0",fontSize:S.base,color:"#8896A6",lineHeight:1.6,maxWidth:480}}>Mark everything already completed. Then AI will analyse gaps and build your optimised plan.</p>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:24,flexWrap:"wrap"}}>
          <div style={{background:"rgba(255,255,255,.05)",borderRadius:S.radius,padding:"10px 18px",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:S.sm,color:"#6B7B8D",fontWeight:600}}>Start date:</span>
            <input type="date" value={sd} onChange={e=>setSd(e.target.value)} style={{background:"transparent",border:"none",color:"#fff",fontSize:S.base,fontFamily:"inherit",fontWeight:600,outline:"none",cursor:"pointer"}}/>
          </div>
          <div style={{background:"rgba(230,126,34,.12)",borderRadius:S.radius,padding:"10px 18px",border:"1px solid rgba(230,126,34,.2)"}}>
            <span style={{fontSize:S.lg,fontWeight:700,color:"#E67E22"}}>{tDn}</span><span style={{fontSize:S.sm,color:"#6B7B8D"}}> / {tasks.length} done</span>
          </div>
        </div>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:20,flexWrap:"wrap"}}>
          {["All","Foundation","Optimisation","Scaling","Maturity","Custom"].map(p=>(<button key={p} onClick={()=>setSetupFilter(p)} style={{padding:"8px 16px",borderRadius:S.rSm,border:"none",cursor:"pointer",fontSize:S.sm,fontWeight:600,fontFamily:"inherit",background:setupFilter===p?"rgba(230,126,34,.2)":"rgba(255,255,255,.06)",color:setupFilter===p?"#E67E22":"#6B7B8D"}}>{p}</button>))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {(()=>{let lg="";return setupTasks.map((t,i)=>{const gl=`${t.phase} → ${t.group}`;const sg=gl!==lg;lg=gl;const d=t.status==="done";const pm=PM[t.phase]||PM.Custom;
          return(<div key={t.id}>{sg&&<div style={{margin:i===0?"0 0 6px":"20px 0 6px",display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:3,background:pm?.a}}/><span style={{fontSize:S.sm,fontWeight:700,color:pm?.a}}>{gl}</span></div>}
            <div onClick={()=>tog(t.id)} style={{background:d?"rgba(39,174,96,.08)":"rgba(255,255,255,.03)",borderRadius:S.rSm,padding:"12px 14px",border:d?"1px solid rgba(39,174,96,.25)":"1px solid rgba(255,255,255,.06)",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:S.check,height:S.check,minWidth:S.check,borderRadius:S.rSm,border:d?"2px solid #27AE60":"2px solid #4A5568",background:d?"#27AE60":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:S.sm,fontWeight:800}}>{d&&"✓"}</div>
              <span style={{flex:1,fontSize:S.base,fontWeight:500,color:d?"#27AE60":"#D1D8E0"}}>{t.task}</span>
              <span style={{fontSize:S.tag,fontWeight:700,color:"#fff",background:CC[t.channel]||"#607D8B",padding:"3px 10px",borderRadius:4,opacity:.7}}>{t.channel}</span>
            </div>
          </div>);});})()}
        </div>
        <div style={{position:"sticky",bottom:0,padding:"20px 0",background:"linear-gradient(transparent,#0F1923 30%)",marginTop:10}}>
          <button onClick={runAnalysis} style={{width:"100%",padding:"18px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#E67E22,#F39C12)",color:"#fff",fontSize:S.xl,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 4px 24px rgba(230,126,34,.35)"}}><span style={{fontSize:22}}>✦</span> AI Analyse & Build My Plan</button>
        </div>
      </div>
    </div>
  );

  if(mode==="analysing") return(<div style={{background:"#0F1923",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:"#fff"}}><div style={{fontSize:48,marginBottom:20,animation:"pulse 2s ease-in-out infinite"}}>✦</div><h2 style={{margin:"0 0 8px",fontSize:S.xl,fontWeight:700}}>AI is analysing everything</h2><p style={{margin:0,fontSize:S.base,color:"#6B7B8D",textAlign:"center",maxWidth:340}}>Tasks, learnings, KPIs, calendar...</p></div>);

  // ═══ DASHBOARD ═══
  return(
    <div style={{background:"#FAFBFC",minHeight:"100vh",color:"#1a1a2e"}}>
      {showAddTask&&<AddTaskModal onAdd={addCustomTask} onClose={()=>setShowAddTask(false)}/>}
      {showLearning&&<LearningModal task={showLearning} existing={learnings[showLearning.id]} onSave={saveLearning} onClose={()=>setShowLearning(null)}/>}
      {showAddCal!==null&&<AddCalEventModal date={showAddCal} onAdd={addCalEvent} onClose={()=>setShowAddCal(null)}/>}

      {/* Header */}
      <div style={{background:"#0F1923",padding:"20px 24px 16px",position:"relative",overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,position:"relative",zIndex:1}}>
          <div>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}><h1 style={{margin:0,fontSize:S.xxl,fontWeight:800,color:"#fff",letterSpacing:"-1px"}}>AWWZO</h1><span style={{fontSize:S.tag,fontWeight:600,color:"#E67E22",letterSpacing:"2px",textTransform:"uppercase"}}>Mission Control</span></div>
            {saving&&<span style={{fontSize:10,color:"#E67E22",marginTop:2,display:"block"}}>Saving...</span>}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{background:"rgba(230,126,34,.1)",borderRadius:S.rSm,padding:"6px 16px",textAlign:"center"}}>
              <div style={{fontSize:S.xxl,fontWeight:800,color:"#E67E22"}}>{Math.round((tDn/tasks.length)*100)}%</div>
              <div style={{fontSize:10,color:"#5A6B7D"}}>{tDn}/{tasks.length}</div>
            </div>
            <button onClick={()=>{setMode("setup");sv(tasks,sd,wD,kpis,kpiHistory,notes,learnings,tAi,analysis,"setup",calEvents);}} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:S.rSm,padding:"8px 14px",color:"#6B7B8D",fontSize:S.xs,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>↻ Re-setup</button>
            <button onClick={logout} style={{background:"rgba(231,76,60,.1)",border:"1px solid rgba(231,76,60,.2)",borderRadius:S.rSm,padding:"8px 14px",color:"#E74C3C",fontSize:S.xs,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Logout</button>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap",position:"relative",zIndex:1}}>
          {Object.entries(pc).map(([ph,c])=>{const p=PM[ph]||PM.Custom;const pct=Math.round((c.done/c.total)*100);return(
            <div key={ph} style={{flex:"1 1 120px",background:"rgba(255,255,255,.03)",borderRadius:S.rSm,padding:"8px 12px",border:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:S.xs,fontWeight:600,color:p.a}}>{ph}</span><span style={{fontSize:S.xs,fontWeight:700,color:"#fff"}}>{pct}%</span></div>
              <div style={{height:4,background:"rgba(255,255,255,.06)",borderRadius:2}}><div style={{width:`${pct}%`,height:"100%",background:p.a,borderRadius:2,transition:"width .3s"}}/></div>
            </div>);})}
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #E8ECF0",overflowX:"auto"}}>
        {[{k:"analysis",l:"Analysis",i:"✦"},{k:"timeline",l:"Timeline",i:"◷"},{k:"calendar",l:"Calendar",i:"📅"},{k:"ai",l:"Advisor",i:"💬"},{k:"weekly",l:"Weekly",i:"☑"},{k:"kpis",l:"KPIs",i:"◈"}].map(v=>(
          <button key={v.k} onClick={()=>setView(v.k)} style={{flex:1,padding:"13px 4px",border:"none",background:"transparent",cursor:"pointer",fontSize:S.xs,fontWeight:view===v.k?700:500,color:view===v.k?"#0F1923":"#8896A6",borderBottom:view===v.k?"3px solid #E67E22":"3px solid transparent",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:3,whiteSpace:"nowrap"}}><span style={{fontSize:S.sm}}>{v.i}</span> {v.l}</button>
        ))}
      </div>

      <div style={{padding:"20px 20px 48px",maxWidth:900,margin:"0 auto"}}>

        {/* ═══ ANALYSIS ═══ */}
        {view==="analysis"&&(<>{analysis?(()=>{const secs=parseSec(analysis);return(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:20,color:"#E67E22"}}>✦</span><h2 style={{margin:0,fontSize:S.xl,fontWeight:700}}>AI Strategic Analysis</h2></div>
            <button onClick={()=>{setMode("setup");sv(tasks,sd,wD,kpis,kpiHistory,notes,learnings,tAi,"","setup",calEvents);}} style={{padding:"8px 14px",borderRadius:S.rSm,border:"1px solid #D1D8E0",background:"#fff",color:"#6B7B8D",fontSize:S.xs,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>↻ Re-analyse</button>
          </div>
          {secs.map((s,i)=>(<div key={i} style={{background:"#fff",borderRadius:S.radius,padding:"16px 20px",marginBottom:8,border:"1px solid #E8ECF0"}}>
            {s.title&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{fontSize:18}}>{SI[s.title]||"→"}</span><span style={{fontSize:S.sm,fontWeight:700,color:SCo[s.title]||"#2C3E50",textTransform:"uppercase"}}>{s.title}</span></div>}
            <p style={{margin:0,fontSize:S.base,lineHeight:1.7,color:"#374151",whiteSpace:"pre-wrap"}}>{s.content}</p>
          </div>))}
        </div>);})():<p style={{color:"#8896A6",fontSize:S.base}}>No analysis yet. Use Re-setup.</p>}</>)}

        {/* ═══ TIMELINE ═══ */}
        {view==="timeline"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["All Phases","Foundation","Optimisation","Scaling","Maturity","Custom"].map(p=>(<button key={p} onClick={()=>setFPh(p)} style={{padding:"6px 14px",borderRadius:S.rSm,border:"none",cursor:"pointer",fontSize:S.xs,fontWeight:600,fontFamily:"inherit",background:fPh===p?(p==="All Phases"?"#0F1923":(PM[p]||PM.Custom).c):"#F0F2F5",color:fPh===p?"#fff":"#6B7B8D"}}>{p}</button>))}
            </div>
            <button onClick={()=>setShowAddTask(true)} style={{padding:"8px 16px",borderRadius:S.rSm,border:"none",background:"linear-gradient(135deg,#E67E22,#F39C12)",color:"#fff",fontSize:S.sm,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Add Task</button>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {["All Channels","Google","Meta","Instagram","WhatsApp","Referral"].map(c=>(<button key={c} onClick={()=>setFCh(c)} style={{padding:"6px 14px",borderRadius:S.rSm,border:"none",cursor:"pointer",fontSize:S.xs,fontWeight:600,fontFamily:"inherit",background:fCh===c?(CC[c]||"#607D8B"):"#F0F2F5",color:fCh===c?"#fff":"#6B7B8D"}}>{c}</button>))}
          </div>
          {(()=>{let lg="";return filtered.map((t,i)=>{const gl=`${t.phase} → ${t.group}`;const sg=gl!==lg;lg=gl;const d=t.status==="done";const pr=PRI[t.priority]||PRI.Medium;const pm=PM[t.phase]||PM.Custom;
          const isO=tOpen===t.id;const isL=tAiL===t.id;const aiC=tAi[t.id];const secs=aiC?parseSec(aiC):[];const hasLr=!!learnings[t.id];
          return(<div key={t.id}>
            {sg&&<div style={{margin:i===0?"0 0 8px":"20px 0 8px",display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:3,background:pm?.a}}/><span style={{fontSize:S.sm,fontWeight:700,color:pm?.c}}>{gl}</span></div>}
            <div style={{background:d?"#F7FBF7":"#fff",borderRadius:S.radius,padding:"14px 16px",marginBottom:6,border:`1px solid ${isO?(pm?.a)+"35":d?"#D5E8D4":"#E8ECF0"}`,opacity:d?.65:1}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <button onClick={()=>tog(t.id)} style={{width:S.check,height:S.check,minWidth:S.check,borderRadius:S.rSm,marginTop:2,border:d?"2px solid #27AE60":"2px solid #C4CDD5",background:d?"#27AE60":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:S.sm,fontWeight:800}}>{d&&"✓"}</button>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
                    {!d&&t.startDate&&<span style={{fontSize:S.tag,fontWeight:600,color:"#6B7B8D",background:"#F0F2F5",padding:"2px 8px",borderRadius:4}}>{fD(t.startDate)} – {fD(t.endDate)}</span>}
                    <span style={{fontSize:S.tag,fontWeight:700,color:"#fff",background:CC[t.channel]||"#607D8B",padding:"2px 8px",borderRadius:4}}>{t.channel}</span>
                    <span style={{fontSize:S.tag,fontWeight:600,color:pr.fg,background:pr.bg,padding:"2px 8px",borderRadius:4}}>{t.priority}</span>
                    {t.isCustom&&<span style={{fontSize:S.tag,fontWeight:600,color:"#2E86C1",background:"#EBF5FB",padding:"2px 8px",borderRadius:4}}>Custom</span>}
                    {hasLr&&<span style={{fontSize:S.tag,fontWeight:600,color:"#27AE60",background:"#E8F8F5",padding:"2px 8px",borderRadius:4}}>📊 Results</span>}
                  </div>
                  <p style={{margin:0,fontSize:S.base,fontWeight:500,color:d?"#95A5A6":"#1a1a2e",textDecoration:d?"line-through":"none"}}>{t.task}</p>
                  {t.comment&&<p style={{margin:"4px 0 0",fontSize:S.xs,color:"#8896A6",fontStyle:"italic"}}>{t.comment}</p>}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,flexWrap:"wrap"}}>
                    <button onClick={()=>askTask(t)} style={{padding:"6px 14px",borderRadius:S.rSm,border:"none",cursor:"pointer",background:isO?(pm?.a):"linear-gradient(135deg,#1a1a2e,#2d3748)",color:"#fff",fontSize:S.xs,fontWeight:700,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                      {isL?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span> Generating...</>:isO&&aiC?<>✦ Hide</>:<>✦ Ask AI</>}
                    </button>
                    {d&&<button onClick={()=>setShowLearning(t)} style={{padding:"6px 14px",borderRadius:S.rSm,border:"1px solid #27AE60",background:hasLr?"#E8F8F5":"transparent",color:"#27AE60",fontSize:S.xs,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{hasLr?"📝 Edit":"📝 Log Result"}</button>}
                    {t.isCustom&&<button onClick={()=>{if(confirm("Delete?"))deleteTask(t.id);}} style={{padding:"6px 10px",borderRadius:S.rSm,border:"1px solid #E74C3C",background:"transparent",color:"#E74C3C",fontSize:S.xs,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>}
                    {eNote===t.id?(<div style={{flex:1}}><textarea value={notes[t.id]||""} onChange={e=>{const n={...notes,[t.id]:e.target.value};setNotes(n);sv(tasks,sd,wD,kpis,kpiHistory,n,learnings,tAi,analysis,"dashboard",calEvents);}} placeholder="Note..." style={{width:"100%",minHeight:50,padding:8,borderRadius:S.rSm,border:"1px solid #C4CDD5",fontSize:S.xs,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/><button onClick={()=>setENote(null)} style={{marginTop:4,padding:"4px 12px",borderRadius:4,border:"none",background:"#0F1923",color:"#fff",fontSize:S.tag,cursor:"pointer",fontFamily:"inherit"}}>Save</button></div>):(<button onClick={()=>setENote(t.id)} style={{padding:0,border:"none",background:"transparent",color:notes[t.id]?"#2471A3":"#C4CDD5",fontSize:S.xs,cursor:"pointer",fontFamily:"inherit"}}>{notes[t.id]?`📝 ${notes[t.id].substring(0,40)}...`:"+ Note"}</button>)}
                  </div>
                  {d&&hasLr&&!isO&&(<div style={{marginTop:8,padding:"10px 14px",borderRadius:S.rSm,background:"#F0FFF4",border:"1px solid #C6F6D5"}}><div style={{fontSize:S.xs,fontWeight:600,color:"#27AE60",marginBottom:4}}>📊 Learning</div>{learnings[t.id].result&&<p style={{margin:"0 0 2px",fontSize:S.xs,color:"#374151"}}><b>Result:</b> {learnings[t.id].result}</p>}{learnings[t.id].metric&&<p style={{margin:0,fontSize:S.xs,color:"#374151"}}><b>Metric:</b> {learnings[t.id].metric}</p>}</div>)}
                  {isO&&aiC&&(<div style={{marginTop:12,borderRadius:S.radius,overflow:"hidden",border:`1px solid ${pm?.a}20`,background:"#FAFBFC"}}>
                    <div style={{padding:"10px 16px",background:`${pm?.a}08`,borderBottom:`1px solid ${pm?.a}12`,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:16}}>✦</span><span style={{fontSize:S.xs,fontWeight:700,color:pm?.a,textTransform:"uppercase"}}>Execution Guide</span></div><button onClick={()=>{const n={...tAi};delete n[t.id];setTAi(n);setTOpen(null);setTimeout(()=>askTask(t),100);}} style={{padding:"4px 10px",borderRadius:4,border:"1px solid #D1D8E0",background:"#fff",color:"#6B7B8D",fontSize:S.tag,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>↻</button></div>
                    {secs.map((s,si)=>(<div key={si} style={{padding:"12px 16px",borderBottom:si<secs.length-1?"1px solid #F0F2F5":"none"}}>{s.title&&<div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}><span style={{fontSize:16}}>{SI[s.title]||"→"}</span><span style={{fontSize:S.xs,fontWeight:700,color:SCo[s.title]||"#2C3E50",textTransform:"uppercase"}}>{s.title}</span></div>}<p style={{margin:0,fontSize:S.sm,lineHeight:1.65,color:"#374151",whiteSpace:"pre-wrap"}}>{s.content}</p></div>))}
                  </div>)}
                  {isO&&isL&&(<div style={{marginTop:12,padding:20,borderRadius:S.radius,background:"#FAFBFC",textAlign:"center"}}><span style={{fontSize:S.sm,color:"#6B7B8D"}}><span style={{display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}>✦</span> Generating...</span></div>)}
                </div>
              </div>
            </div>
          </div>);});})()}
        </>)}

        {/* ═══ CALENDAR ═══ */}
        {view==="calendar"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>{if(calMonth===0){setCalMonth(11);setCalYear(calYear-1);}else setCalMonth(calMonth-1);}} style={{background:"#fff",border:"1px solid #E8ECF0",borderRadius:S.rSm,padding:"8px 12px",cursor:"pointer",fontSize:S.base,fontFamily:"inherit"}}>←</button>
              <h2 style={{margin:0,fontSize:S.xl,fontWeight:700,minWidth:180,textAlign:"center"}}>{MONTHS[calMonth]} {calYear}</h2>
              <button onClick={()=>{if(calMonth===11){setCalMonth(0);setCalYear(calYear+1);}else setCalMonth(calMonth+1);}} style={{background:"#fff",border:"1px solid #E8ECF0",borderRadius:S.rSm,padding:"8px 12px",cursor:"pointer",fontSize:S.base,fontFamily:"inherit"}}>→</button>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>setShowAddCal(toI(new Date()))} style={{padding:"8px 16px",borderRadius:S.rSm,border:"none",background:"linear-gradient(135deg,#E67E22,#F39C12)",color:"#fff",fontSize:S.sm,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Add Event</button>
              <button onClick={()=>{setCalMonth(new Date().getMonth());setCalYear(new Date().getFullYear());}} style={{padding:"8px 14px",borderRadius:S.rSm,border:"1px solid #D1D8E0",background:"#fff",color:"#6B7B8D",fontSize:S.xs,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Today</button>
            </div>
          </div>

          {/* Upcoming holidays */}
          {upcomingH.length>0&&(<div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {upcomingH.map(h=>(<div key={h.date} style={{background:"#FDE8E8",borderRadius:S.rSm,padding:"8px 14px",border:"1px solid #FCA5A5",display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:14}}>🎉</span>
              <span style={{fontSize:S.xs,fontWeight:600,color:"#B91C1C"}}>{h.title}</span>
              <span style={{fontSize:S.tag,color:"#DC2626",fontWeight:500}}>{h.daysAway}d away</span>
            </div>))}
          </div>)}

          {/* Calendar legend */}
          <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
            {Object.entries(CAL_COLORS).map(([type,color])=>(<div key={type} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:color}}/>
              <span style={{fontSize:S.tag,color:"#6B7B8D"}}>{type}</span>
            </div>))}
          </div>

          {/* Calendar grid */}
          <div style={{background:"#fff",borderRadius:S.radius,border:"1px solid #E8ECF0",overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:"1px solid #E8ECF0"}}>
              {DAYS.map(d=>(<div key={d} style={{padding:"10px 4px",textAlign:"center",fontSize:S.xs,fontWeight:700,color:"#6B7B8D",background:"#F8F9FA"}}>{d}</div>))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
              {monthDays.map((day,i)=>{
                if(!day) return <div key={`e${i}`} style={{minHeight:80,background:"#FAFBFC",borderRight:"1px solid #F0F2F5",borderBottom:"1px solid #F0F2F5"}}/>;
                const ds=toI(day);const isToday=ds===todayStr;
                const evts=getEventsForDate(ds,calEvents);
                const hasWarning=evts.length>=4;
                return(<div key={ds} onClick={()=>setCalSelected(calSelected===ds?null:ds)} style={{minHeight:80,padding:"4px 6px",borderRight:"1px solid #F0F2F5",borderBottom:"1px solid #F0F2F5",background:calSelected===ds?"#EBF5FB":isToday?"#FFF7ED":"#fff",cursor:"pointer",position:"relative"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:S.xs,fontWeight:isToday?800:500,color:isToday?"#E67E22":"#374151",background:isToday?"#E67E22":"transparent",color:isToday?"#fff":"#374151",width:isToday?22:undefined,height:isToday?22:undefined,borderRadius:"50%",display:isToday?"flex":"inline",alignItems:"center",justifyContent:"center",fontSize:S.tag}}>{day.getDate()}</span>
                    {hasWarning&&<span style={{fontSize:10}} title="Heavy day!">⚠️</span>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:1,marginTop:2}}>
                    {evts.slice(0,3).map((e,ei)=>(<div key={ei} style={{fontSize:9,padding:"1px 4px",borderRadius:2,background:CAL_COLORS[e.type]||"#607D8B",color:"#fff",fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{e.title}</div>))}
                    {evts.length>3&&<div style={{fontSize:8,color:"#8896A6",fontWeight:600}}>+{evts.length-3} more</div>}
                  </div>
                </div>);
              })}
            </div>
          </div>

          {/* Day detail panel */}
          {calSelected&&(()=>{
            const evts=getEventsForDate(calSelected,calEvents);
            return(<div style={{marginTop:16,background:"#fff",borderRadius:S.radius,padding:"16px 20px",border:"1px solid #E8ECF0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <h3 style={{margin:0,fontSize:S.lg,fontWeight:700}}>{fDF(new Date(calSelected+"T12:00:00"))}</h3>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setShowAddCal(calSelected)} style={{padding:"6px 12px",borderRadius:S.rSm,border:"none",background:"#E67E22",color:"#fff",fontSize:S.xs,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Add</button>
                  <button onClick={()=>setCalSelected(null)} style={{padding:"6px 12px",borderRadius:S.rSm,border:"1px solid #D1D8E0",background:"#fff",color:"#6B7B8D",fontSize:S.xs,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
                </div>
              </div>
              {evts.length===0?<p style={{margin:0,fontSize:S.sm,color:"#8896A6"}}>No events on this day.</p>:
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {evts.map((e,ei)=>(<div key={ei} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",borderRadius:S.rSm,background:"#F8F9FA",border:"1px solid #F0F2F5"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:CAL_COLORS[e.type]||"#607D8B",marginTop:4,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:S.base,fontWeight:600,color:"#1a1a2e"}}>{e.title}</span>
                      <span style={{fontSize:S.tag,color:"#fff",background:CAL_COLORS[e.type]||"#607D8B",padding:"1px 6px",borderRadius:3,fontWeight:600}}>{e.type}</span>
                      {e.channel&&<span style={{fontSize:S.tag,color:"#fff",background:CC[e.channel]||"#607D8B",padding:"1px 6px",borderRadius:3,fontWeight:600}}>{e.channel}</span>}
                      {e.recurring&&<span style={{fontSize:S.tag,color:"#6B7B8D",background:"#F0F2F5",padding:"1px 6px",borderRadius:3,fontWeight:500}}>Recurring</span>}
                      {e.status&&!e.recurring&&<span style={{fontSize:S.tag,color:"#6B7B8D",background:"#F0F2F5",padding:"1px 6px",borderRadius:3}}>{e.status}</span>}
                    </div>
                    {e.time&&<p style={{margin:"2px 0 0",fontSize:S.xs,color:"#6B7B8D"}}>🕐 {e.time}</p>}
                    {e.notes&&<p style={{margin:"4px 0 0",fontSize:S.xs,color:"#6B7B8D"}}>{e.notes}</p>}
                  </div>
                  {e.id&&e.id.startsWith("cal-")&&<button onClick={()=>deleteCalEvent(e.id)} style={{background:"transparent",border:"none",color:"#E74C3C",cursor:"pointer",fontSize:14}}>×</button>}
                </div>))}
              </div>}
            </div>);
          })()}
        </>)}

        {/* ═══ ADVISOR ═══ */}
        {view==="ai"&&(<>
          <h2 style={{margin:"0 0 6px",fontSize:S.xl,fontWeight:700}}>💬 AI Marketing Advisor</h2>
          <p style={{margin:"0 0 16px",fontSize:S.sm,color:"#6B7B8D"}}>Reads tasks, learnings, KPIs, and your calendar.</p>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
            {["What should I focus on this week?","My CPL is ₹600 — how do I bring it down?","What's coming up on my calendar that I should prepare for?","Based on my learnings, what patterns do you see?","I only have 10 hours — reprioritize for me"].map(q=>(<button key={q} onClick={()=>setAiP(q)} style={{padding:"12px 16px",borderRadius:S.rSm,border:"1px solid #E8ECF0",background:"#fff",cursor:"pointer",fontSize:S.sm,fontFamily:"inherit",color:"#1a1a2e",textAlign:"left"}}>{q}</button>))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={aiP} onChange={e=>setAiP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askG()} placeholder="Ask anything..." style={{flex:1,padding:"12px 14px",borderRadius:S.rSm,border:"1px solid #D1D8E0",fontSize:S.sm,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
            <button onClick={askG} disabled={aiL} style={{padding:"12px 20px",borderRadius:S.rSm,border:"none",background:aiL?"#8896A6":"#0F1923",color:"#fff",fontSize:S.sm,fontWeight:600,cursor:aiL?"default":"pointer",fontFamily:"inherit"}}>{aiL?"...":"Ask AI"}</button>
          </div>
          {aiR&&<div style={{marginTop:14,padding:20,background:"#fff",borderRadius:S.radius,border:"1px solid #E8ECF0"}}><p style={{margin:0,fontSize:S.sm,color:"#2D3748",whiteSpace:"pre-wrap",lineHeight:1.65}}>{aiR}</p></div>}
        </>)}

        {/* ═══ WEEKLY ═══ */}
        {view==="weekly"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h2 style={{margin:0,fontSize:S.xl,fontWeight:700}}>☑ Weekly Checklist</h2><button onClick={()=>{setWD({});sv(tasks,sd,{},kpis,kpiHistory,notes,learnings,tAi,analysis,"dashboard",calEvents);}} style={{padding:"8px 14px",borderRadius:S.rSm,border:"1px solid #E74C3C",background:"transparent",color:"#E74C3C",fontSize:S.xs,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Reset</button></div>
          {WK.map(t=>{const d=wD[t.id];return(<div key={t.id} onClick={()=>{const n={...wD,[t.id]:!d};setWD(n);sv(tasks,sd,n,kpis,kpiHistory,notes,learnings,tAi,analysis,"dashboard",calEvents);}} style={{background:d?"#F7FBF7":"#fff",borderRadius:S.rSm,padding:"14px 16px",marginBottom:6,border:`1px solid ${d?"#D5E8D4":"#E8ECF0"}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:S.check,height:S.check,minWidth:S.check,borderRadius:S.rSm,border:d?"2px solid #27AE60":"2px solid #C4CDD5",background:d?"#27AE60":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:S.sm,fontWeight:800}}>{d&&"✓"}</div>
            <span style={{flex:1,fontSize:S.base,fontWeight:500,color:d?"#95A5A6":"#1a1a2e",textDecoration:d?"line-through":"none"}}>{t.task}</span>
            <span style={{fontSize:S.tag,fontWeight:700,color:"#fff",background:CC[t.channel]||"#607D8B",padding:"3px 10px",borderRadius:4}}>{t.channel}</span>
          </div>);})}
        </>)}

        {/* ═══ KPIs ═══ */}
        {view==="kpis"&&(<>
          <h2 style={{margin:"0 0 6px",fontSize:S.xl,fontWeight:700}}>◈ KPI Tracker</h2>
          <p style={{margin:"0 0 16px",fontSize:S.sm,color:"#6B7B8D"}}>Updates saved with timestamps for AI trend analysis.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10}}>
            {[{k:"leads",l:"Total Leads This Week",t:"15% MoM growth",i:"👥"},{k:"cpl",l:"Cost Per Lead (₹)",t:"₹200–400",i:"💰"},{k:"tourRate",l:"Lead-to-Tour Rate (%)",t:"30–40%",i:"🏠"},{k:"convRate",l:"Tour-to-Customer Rate (%)",t:"50–60%",i:"🎯"},{k:"cpa",l:"Cost Per Acquisition (₹)",t:"< ₹1,500",i:"📉"},{k:"roas",l:"ROAS",t:"> 4:1",i:"📈"}].map(k=>(<div key={k.k} style={{background:"#fff",borderRadius:S.radius,padding:S.padL,border:"1px solid #E8ECF0"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{fontSize:20}}>{k.i}</span><span style={{fontSize:S.sm,fontWeight:600}}>{k.l}</span></div>
              <input type="text" value={kpis[k.k]} onChange={e=>{const n={...kpis,[k.k]:e.target.value};saveKpis(n);}} placeholder="Enter value..." style={{width:"100%",padding:"10px 12px",borderRadius:S.rSm,border:"1px solid #D1D8E0",fontSize:S.xl,fontWeight:700,color:"#0F1923",fontFamily:"inherit",boxSizing:"border-box"}}/>
              <div style={{marginTop:6,fontSize:S.xs,color:"#8896A6"}}>Target: <span style={{fontWeight:600}}>{k.t}</span></div>
            </div>))}
          </div>
          {kpiHistory.length>1&&(<div style={{marginTop:20}}>
            <h3 style={{fontSize:S.lg,fontWeight:700,marginBottom:10}}>📈 KPI History</h3>
            <div style={{background:"#fff",borderRadius:S.radius,border:"1px solid #E8ECF0",overflow:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:S.xs}}>
                <thead><tr style={{background:"#F8F9FA"}}>{["Date","Leads","CPL","Tour%","Conv%","CPA","ROAS"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#6B7B8D",borderBottom:"1px solid #E8ECF0"}}>{h}</th>)}</tr></thead>
                <tbody>{kpiHistory.slice(-8).reverse().map((h,i)=><tr key={i} style={{borderBottom:"1px solid #F0F2F5"}}><td style={{padding:"8px 12px",fontWeight:500}}>{h.date}</td><td style={{padding:"8px 12px"}}>{h.leads||"—"}</td><td style={{padding:"8px 12px"}}>{h.cpl||"—"}</td><td style={{padding:"8px 12px"}}>{h.tourRate||"—"}</td><td style={{padding:"8px 12px"}}>{h.convRate||"—"}</td><td style={{padding:"8px 12px"}}>{h.cpa||"—"}</td><td style={{padding:"8px 12px"}}>{h.roas||"—"}</td></tr>)}</tbody>
              </table>
            </div>
          </div>)}
        </>)}
      </div>
    </div>
  );
}
