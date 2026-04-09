'use client';
import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
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

const PMeta={Foundation:{c:"#0F4C75",a:"#3282B8"},Optimisation:{c:"#C65D07",a:"#E67E22"},Scaling:{c:"#1B7A3D",a:"#27AE60"},Maturity:{c:"#6C3483",a:"#8E44AD"}};
const CC={Google:"#4285F4",Meta:"#0668E1",Instagram:"#E1306C",WhatsApp:"#25D366",Referral:"#F39C12",All:"#607D8B","Google/Meta":"#7B68EE"};
const PRI={Critical:{bg:"#FDE8E8",fg:"#B91C1C"},High:{bg:"#FEF3C7",fg:"#92400E"},Medium:{bg:"#DBEAFE",fg:"#1E40AF"}};
const SI={"WHAT THIS IS":"📋","WHY IT MATTERS":"🎯","STEP-BY-STEP EXECUTION":"⚡","COMMON MISTAKES TO AVOID":"⚠️","HOW TO KNOW IT'S WORKING":"✅","ESTIMATED TIME":"⏱️","CURRENT STATUS SUMMARY":"📊","CRITICAL GAPS DETECTED":"🚨","RECOMMENDED PRIORITY ORDER (NEXT 14 DAYS)":"🎯","QUICK WINS (CAN DO TODAY)":"⚡","WHAT TO DEPRIORITIZE":"⏸️","OVERALL HEALTH SCORE":"💪"};
const SCo={"WHAT THIS IS":"#3282B8","WHY IT MATTERS":"#27AE60","STEP-BY-STEP EXECUTION":"#E67E22","COMMON MISTAKES TO AVOID":"#E74C3C","HOW TO KNOW IT'S WORKING":"#8E44AD","ESTIMATED TIME":"#2C3E50","CURRENT STATUS SUMMARY":"#3282B8","CRITICAL GAPS DETECTED":"#E74C3C","RECOMMENDED PRIORITY ORDER (NEXT 14 DAYS)":"#E67E22","QUICK WINS (CAN DO TODAY)":"#27AE60","WHAT TO DEPRIORITIZE":"#6B7B8D","OVERALL HEALTH SCORE":"#8E44AD"};

const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
const fD=d=>d.toLocaleDateString("en-IN",{day:"numeric",month:"short"});
const fDF=d=>d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const toI=d=>d.toISOString().split("T")[0];
const dB=(a,b)=>Math.ceil((b-a)/864e5);

function sched(tasks,sd){const m={};tasks.forEach(t=>{m[t.id]={...t};});const o={};const v=new Set();
function go(id){if(v.has(id))return o[id];v.add(id);const t=m[id];if(!t)return null;
if(t.status==="done"){o[id]={...t,startDate:null,endDate:null};return o[id];}
let e=new Date(sd);for(const d of t.deps){const dep=go(d);if(dep?.endDate){const a=addD(dep.endDate,1);if(a>e)e=a;}}
o[id]={...t,startDate:e,endDate:addD(e,t.dur-1)};return o[id];}
tasks.forEach(t=>go(t.id));
return Object.values(o).sort((a,b)=>{if(a.status==="done"&&b.status!=="done")return 1;if(a.status!=="done"&&b.status==="done")return-1;if(!a.startDate||!b.startDate)return 0;return a.startDate-b.startDate;});}

function parseSec(text){if(!text)return[];const rx=/→\s*([A-Z][A-Z\s\-'()0-9]+)/g;const ms=[...text.matchAll(rx)];
if(!ms.length)return[{title:null,content:text}];
return ms.map((m,i)=>({title:m[1].trim(),content:text.slice(m.index+m[0].length,i<ms.length-1?ms[i+1].index:text.length).trim()}));}

// ═══════════════════════════════════════════
// AUTH CREDENTIALS (hardcoded as requested)
// In production, use environment variables
// ═══════════════════════════════════════════
const VALID_EMAIL = "marketing@awwzo.com";
const VALID_PASS = "AwWzo@1@34%@%6";

// ═══════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (email.toLowerCase() === VALID_EMAIL && pass === VALID_PASS) {
      localStorage.setItem('awwzo-auth', 'true');
      onLogin();
    } else {
      setError('Invalid credentials');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background effects */}
      <div style={{position:'absolute',top:'-20%',left:'-10%',width:'50vw',height:'50vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(230,126,34,0.06) 0%,transparent 60%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'-30%',right:'-15%',width:'60vw',height:'60vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(50,130,184,0.05) 0%,transparent 60%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'8%',right:'12%',fontSize:60,opacity:0.04,animation:'float 4s ease-in-out infinite'}}>🐕</div>
      <div style={{position:'absolute',bottom:'15%',left:'8%',fontSize:50,opacity:0.04,animation:'float 5s ease-in-out infinite 1s'}}>🐾</div>

      <div style={{
        width: '100%', maxWidth: 400, padding: '0 20px', position: 'relative', zIndex: 1,
        animation: 'fadeIn 0.6s ease'
      }}>
        {/* Logo area */}
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{
            display:'inline-flex',alignItems:'center',justifyContent:'center',
            width:72,height:72,borderRadius:18,
            background:'linear-gradient(135deg,#E67E22 0%,#F39C12 100%)',
            marginBottom:16,boxShadow:'0 8px 32px rgba(230,126,34,0.3)'
          }}>
            <span style={{fontSize:32,filter:'brightness(0) invert(1)'}}>🐾</span>
          </div>
          <h1 style={{margin:0,fontSize:32,fontWeight:800,color:'#fff',letterSpacing:'-1.5px'}}>AWWZO</h1>
          <p style={{margin:'4px 0 0',fontSize:11,color:'#E67E22',fontWeight:600,letterSpacing:'3px',textTransform:'uppercase'}}>Mission Control</p>
          <p style={{margin:'12px 0 0',fontSize:13,color:'#4A5568'}}>Marketing Execution Dashboard</p>
        </div>

        {/* Login card */}
        <div style={{
          background:'rgba(255,255,255,0.03)',borderRadius:16,padding:'32px 28px',
          border:'1px solid rgba(255,255,255,0.06)',
          backdropFilter:'blur(20px)'
        }}>
          <div style={{marginBottom:20}}>
            <label style={{display:'block',fontSize:10,fontWeight:600,color:'#6B7B8D',letterSpacing:'1px',textTransform:'uppercase',marginBottom:6}}>Email</label>
            <input
              type="email" value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleLogin()}
              placeholder="your@email.com"
              style={{
                width:'100%',padding:'12px 14px',borderRadius:8,
                border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',
                color:'#fff',fontSize:14,fontFamily:'inherit',outline:'none',
                boxSizing:'border-box',transition:'border-color 0.2s'
              }}
              onFocus={e=>e.target.style.borderColor='rgba(230,126,34,0.4)'}
              onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{marginBottom:24}}>
            <label style={{display:'block',fontSize:10,fontWeight:600,color:'#6B7B8D',letterSpacing:'1px',textTransform:'uppercase',marginBottom:6}}>Password</label>
            <div style={{position:'relative'}}>
              <input
                type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleLogin()}
                placeholder="••••••••"
                style={{
                  width:'100%',padding:'12px 42px 12px 14px',borderRadius:8,
                  border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',
                  color:'#fff',fontSize:14,fontFamily:'inherit',outline:'none',
                  boxSizing:'border-box',transition:'border-color 0.2s'
                }}
                onFocus={e=>e.target.style.borderColor='rgba(230,126,34,0.4)'}
                onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}
              />
              <button onClick={()=>setShowPass(!showPass)} style={{
                position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',
                background:'transparent',border:'none',color:'#4A5568',cursor:'pointer',fontSize:16
              }}>{showPass?'🙈':'👁️'}</button>
            </div>
          </div>

          {error && (
            <div style={{
              padding:'10px 14px',borderRadius:8,background:'rgba(231,76,60,0.1)',
              border:'1px solid rgba(231,76,60,0.2)',color:'#E74C3C',fontSize:12,
              fontWeight:500,marginBottom:16,textAlign:'center',animation:'shake 0.4s ease'
            }}>{error}</div>
          )}

          <button onClick={handleLogin} style={{
            width:'100%',padding:'14px',borderRadius:10,border:'none',
            background:'linear-gradient(135deg,#E67E22 0%,#F39C12 100%)',
            color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit',
            boxShadow:'0 4px 20px rgba(230,126,34,0.3)',transition:'all 0.2s'
          }}
            onMouseEnter={e=>e.target.style.transform='translateY(-1px)'}
            onMouseLeave={e=>e.target.style.transform='translateY(0)'}
          >
            Sign In →
          </button>
        </div>

        <p style={{textAlign:'center',fontSize:10,color:'#2D3748',marginTop:20}}>
          Awwzo • Premium Dog Care • Bengaluru
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [mode, setMode] = useState("loading");
  const [tasks, setTasks] = useState(()=>TASKS.map(t=>({...t,status:"todo"})));
  const [sd, setSd] = useState(()=>toI(new Date()));
  const [view, setView] = useState("timeline");
  const [fCh, setFCh] = useState("All Channels");
  const [fPh, setFPh] = useState("All Phases");
  const [wD, setWD] = useState({});
  const [kpis, setKpis] = useState({leads:"",cpl:"",tourRate:"",convRate:"",cpa:"",roas:""});
  const [notes, setNotes] = useState({});
  const [eNote, setENote] = useState(null);
  const [aiP, setAiP] = useState("");
  const [aiR, setAiR] = useState("");
  const [aiL, setAiL] = useState(false);
  const [tOpen, setTOpen] = useState(null);
  const [tAi, setTAi] = useState({});
  const [tAiL, setTAiL] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [setupFilter, setSetupFilter] = useState("All");

  // Check auth
  useEffect(()=>{
    if(typeof window !== 'undefined' && localStorage.getItem('awwzo-auth')==='true') setAuthed(true);
  },[]);

  // Load data
  useEffect(()=>{
    if(!authed) return;
    try{const raw=localStorage.getItem('awwzo-v5');if(raw){const d=JSON.parse(raw);
    if(d.tasks)setTasks(d.tasks);if(d.sd)setSd(d.sd);if(d.wD)setWD(d.wD);if(d.kpis)setKpis(d.kpis);
    if(d.notes)setNotes(d.notes);if(d.tAi)setTAi(d.tAi);if(d.analysis)setAnalysis(d.analysis);
    if(d.mode==="dashboard"){setMode("dashboard");setView("analysis");}else setMode("setup");
    }else setMode("setup");}catch(e){setMode("setup");}
  },[authed]);

  const sv=useCallback((t,s,w,k,n,ta,an,m)=>{try{localStorage.setItem('awwzo-v5',JSON.stringify({tasks:t,sd:s,wD:w,kpis:k,notes:n,tAi:ta,analysis:an,mode:m}));}catch(e){}},[]);

  const tog=id=>{const nx=tasks.map(t=>t.id===id?{...t,status:t.status==="done"?"todo":"done"}:t);setTasks(nx);sv(nx,sd,wD,kpis,notes,tAi,analysis,mode);};

  const sc=sched(tasks,new Date(sd));
  const act=sc.filter(t=>t.status!=="done");
  const dn=sc.filter(t=>t.status==="done");
  const tDn=tasks.filter(t=>t.status==="done").length;
  const pc={};tasks.forEach(t=>{if(!pc[t.phase])pc[t.phase]={total:0,done:0};pc[t.phase].total++;if(t.status==="done")pc[t.phase].done++;});
  const endD=act.length>0?act.reduce((mx,t)=>t.endDate>mx?t.endDate:mx,act[0]?.endDate||new Date()):new Date();

  const callAI=async(system,userMsg)=>{
    const res=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system,messages:[{role:'user',content:userMsg}]})});
    const data=await res.json();return data.text||"Failed. Try again.";
  };

  const runAnalysis=async()=>{
    setMode("analysing");
    try{
      const doneL=tasks.filter(t=>t.status==="done").map(t=>`✓ ${t.task} (${t.channel})`).join("\n");
      const pendL=tasks.filter(t=>t.status==="todo").map(t=>`○ ${t.task} (${t.channel}, ${t.priority}) [deps: ${t.deps.map(d=>tasks.find(x=>x.id===d)?.task||d).join(", ")||"none"}]`).join("\n");
      const depIss=tasks.filter(t=>t.status==="done").flatMap(t=>t.deps.filter(d=>tasks.find(x=>x.id===d)?.status!=="done").map(d=>`"${t.task}" done but prereq "${tasks.find(x=>x.id===d)?.task}" NOT done`));

      const sys=`You are Awwzo's marketing strategy AI. Premium dog daycare/boarding/training, Bengaluru, 5.0 Google rating, 1L+ care hours, WhatsApp primary, parent.awwzo.com signup.

Analyse with EXACT → headers:
→ CURRENT STATUS SUMMARY (2-3 sentences)
→ CRITICAL GAPS DETECTED (what's broken and why, dependency issues)
→ RECOMMENDED PRIORITY ORDER (NEXT 14 DAYS) (top 5-7 tasks in order with reasons)
→ QUICK WINS (CAN DO TODAY) (2-3 tasks under 2 hours)
→ WHAT TO DEPRIORITIZE (2-3 tasks that can wait)
→ OVERALL HEALTH SCORE (score/10 + verdict)

Be specific to Awwzo. Reference task names. Plain text.`;

      const txt=await callAI(sys,`COMPLETED:\n${doneL||"None"}\n\nPENDING:\n${pendL}\n\n${depIss.length?`DEPENDENCY ISSUES:\n${depIss.join("\n")}`:"No dependency issues."}\n\nStart: ${sd}\n\nFull assessment.`);
      setAnalysis(txt);setMode("dashboard");setView("analysis");sv(tasks,sd,wD,kpis,notes,tAi,txt,"dashboard");
    }catch(e){setAnalysis("Connection failed.");setMode("dashboard");}
  };

  const askTask=async t=>{
    if(tAi[t.id]&&tOpen===t.id){setTOpen(null);return;}if(tAi[t.id]){setTOpen(t.id);return;}
    setTAiL(t.id);setTOpen(t.id);
    try{
      const sys=`You are Awwzo's marketing execution coach. Premium dog daycare/boarding/training, Bengaluru, 5.0 Google rating, 1L+ care hours, WhatsApp primary, parent.awwzo.com signup.

Complete guide with EXACT → headers:
→ WHAT THIS IS (2-3 sentences)
→ WHY IT MATTERS (3-4 Awwzo-specific benefits with numbers)
→ STEP-BY-STEP EXECUTION (5-10 actionable steps with exact settings/URLs)
→ COMMON MISTAKES TO AVOID (3-4 pitfalls for Indian pet care)
→ HOW TO KNOW IT'S WORKING (2-3 metrics, 7-14 days)
→ ESTIMATED TIME

Specific to Awwzo. Plain text.`;
      const depN=t.deps.map(d=>tasks.find(x=>x.id===d)?.task||d).join(", ")||"None";
      const txt=await callAI(sys,`Task: "${t.task}"\nChannel: ${t.channel}\nPriority: ${t.priority}\nPhase: ${t.phase} → ${t.group}\nDuration: ${t.dur}d\nDepends on: ${depN}\n\nComplete guide.`);
      const nx={...tAi,[t.id]:txt};setTAi(nx);sv(tasks,sd,wD,kpis,notes,nx,analysis,"dashboard");
    }catch(e){const nx={...tAi,[t.id]:"Failed."};setTAi(nx);}
    setTAiL(null);
  };

  const askG=async()=>{
    if(!aiP.trim())return;setAiL(true);setAiR("");
    try{
      const ctx=`Awwzo marketing AI. Premium dog care Bengaluru. Done:${tDn}/${tasks.length}. Phases:${Object.entries(pc).map(([p,c])=>`${p}:${c.done}/${c.total}`).join(",")}. KPIs:Leads=${kpis.leads||"?"},CPL=${kpis.cpl||"?"},CPA=${kpis.cpa||"?"},ROAS=${kpis.roas||"?"}. Next:${act.slice(0,12).map(t=>t.task).join("; ")}. Concise, specific. Under 300 words. Plain text.`;
      const txt=await callAI(ctx,aiP);setAiR(txt);
    }catch(e){setAiR("Failed.");}setAiL(false);
  };

  const filtered=[...act,...dn].filter(t=>{const cm=fCh==="All Channels"||t.channel===fCh||t.channel==="All"||t.channel?.includes(fCh);const pm=fPh==="All Phases"||t.phase===fPh;return cm&&pm;});
  const setupTasks=tasks.filter(t=>setupFilter==="All"||t.phase===setupFilter);

  const logout=()=>{localStorage.removeItem('awwzo-auth');setAuthed(false);};

  // ── NOT AUTHED → LOGIN ──
  if(!authed) return <LoginScreen onLogin={()=>setAuthed(true)} />;

  // ── LOADING ──
  if(mode==="loading") return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0F1923',color:'#6B7B8D'}}>Loading...</div>;

  // ── SETUP MODE ──
  if(mode==="setup") return (
    <div style={{background:"#0F1923",minHeight:"100vh",color:"#fff"}}>
      <div style={{maxWidth:680,margin:"0 auto",padding:"32px 20px"}}>
        <div style={{textAlign:"center",marginBottom:28,animation:"fadeIn .5s ease"}}>
          <h1 style={{margin:0,fontSize:26,fontWeight:800,letterSpacing:"-1px"}}>AWWZO</h1>
          <p style={{margin:"3px 0 0",fontSize:11,color:"#E67E22",fontWeight:600,letterSpacing:"2px",textTransform:"uppercase"}}>Mission Control Setup</p>
          <p style={{margin:"14px auto 0",fontSize:13,color:"#6B7B8D",lineHeight:1.6,maxWidth:440}}>Mark everything already completed. Then AI will analyse gaps and build your optimised plan.</p>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          <div style={{background:"rgba(255,255,255,.05)",borderRadius:7,padding:"6px 14px",border:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,color:"#6B7B8D",fontWeight:600}}>Start date:</span>
            <input type="date" value={sd} onChange={e=>setSd(e.target.value)} style={{background:"transparent",border:"none",color:"#fff",fontSize:13,fontFamily:"inherit",fontWeight:600,outline:"none",cursor:"pointer"}}/>
          </div>
          <div style={{background:"rgba(230,126,34,.12)",borderRadius:7,padding:"6px 14px",border:"1px solid rgba(230,126,34,.18)"}}>
            <span style={{fontSize:13,fontWeight:700,color:"#E67E22"}}>{tDn}</span><span style={{fontSize:10,color:"#6B7B8D"}}> / {tasks.length} done</span>
          </div>
        </div>
        <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:14,flexWrap:"wrap"}}>
          {["All","Foundation","Optimisation","Scaling","Maturity"].map(p=>(<button key={p} onClick={()=>setSetupFilter(p)} style={{padding:"4px 11px",borderRadius:4,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,fontFamily:"inherit",background:setupFilter===p?"rgba(230,126,34,.2)":"rgba(255,255,255,.05)",color:setupFilter===p?"#E67E22":"#6B7B8D"}}>{p}</button>))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {(()=>{let lg="";return setupTasks.map((t,i)=>{const gl=`${t.phase} → ${t.group}`;const sg=gl!==lg;lg=gl;const d=t.status==="done";const pm=PMeta[t.phase];
          return(<div key={t.id}>
            {sg&&<div style={{margin:i===0?"0 0 3px":"12px 0 3px",display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:2,background:pm?.a||"#607D8B"}}/><span style={{fontSize:9,fontWeight:700,color:pm?.a||"#aaa"}}>{gl}</span></div>}
            <div onClick={()=>tog(t.id)} style={{background:d?"rgba(39,174,96,.07)":"rgba(255,255,255,.02)",borderRadius:5,padding:"8px 10px",border:d?"1px solid rgba(39,174,96,.2)":"1px solid rgba(255,255,255,.05)",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:17,height:17,minWidth:17,borderRadius:3,border:d?"2px solid #27AE60":"2px solid #4A5568",background:d?"#27AE60":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:800}}>{d&&"✓"}</div>
              <span style={{flex:1,fontSize:11,fontWeight:500,color:d?"#27AE60":"#D1D8E0"}}>{t.task}</span>
              <span style={{fontSize:7,fontWeight:700,color:"#fff",background:CC[t.channel]||"#607D8B",padding:"1px 5px",borderRadius:2,opacity:.6}}>{t.channel}</span>
            </div>
          </div>);});})()}
        </div>
        <div style={{position:"sticky",bottom:0,padding:"14px 0",background:"linear-gradient(transparent,#0F1923 30%)",marginTop:6}}>
          <button onClick={runAnalysis} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#E67E22,#F39C12)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7,boxShadow:"0 4px 20px rgba(230,126,34,.3)"}}>
            <span style={{fontSize:16}}>✦</span> AI Analyse & Build My Plan
          </button>
          <p style={{textAlign:"center",fontSize:9,color:"#4A5568",marginTop:5}}>AI will detect gaps, flag issues, and create your optimised sequence</p>
        </div>
      </div>
    </div>
  );

  // ── ANALYSING ──
  if(mode==="analysing") return (
    <div style={{background:"#0F1923",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:"#fff"}}>
      <div style={{fontSize:36,marginBottom:14,animation:"pulse 2s ease-in-out infinite"}}>✦</div>
      <h2 style={{margin:"0 0 5px",fontSize:18,fontWeight:700}}>AI is analysing your setup</h2>
      <p style={{margin:0,fontSize:11,color:"#6B7B8D",textAlign:"center",maxWidth:300,lineHeight:1.5}}>Checking dependencies, identifying gaps, building your plan...</p>
      <div style={{marginTop:16,width:180,height:3,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}><div style={{width:"60%",height:"100%",background:"#E67E22",borderRadius:2,animation:"pulse 1.5s ease-in-out infinite"}}/></div>
    </div>
  );

  // ═══ DASHBOARD ═══
  return (
    <div style={{background:"#FAFBFC",minHeight:"100vh",color:"#1a1a2e"}}>
      {/* Header */}
      <div style={{background:"#0F1923",padding:"16px 18px 12px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:140,height:140,borderRadius:"50%",background:"radial-gradient(circle,rgba(230,126,34,.08) 0%,transparent 70%)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,position:"relative",zIndex:1}}>
          <div><div style={{display:"flex",alignItems:"baseline",gap:6}}><h1 style={{margin:0,fontSize:19,fontWeight:800,color:"#fff",letterSpacing:"-1px"}}>AWWZO</h1><span style={{fontSize:7,fontWeight:600,color:"#E67E22",letterSpacing:"2px",textTransform:"uppercase"}}>Mission Control</span></div></div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{background:"rgba(255,255,255,.04)",borderRadius:5,padding:"3px 8px",border:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{fontSize:6,color:"#5A6B7D"}}>START</div>
              <input type="date" value={sd} onChange={e=>{setSd(e.target.value);sv(tasks,e.target.value,wD,kpis,notes,tAi,analysis,"dashboard");}} style={{background:"transparent",border:"none",color:"#fff",fontSize:10,fontFamily:"inherit",fontWeight:600,outline:"none",cursor:"pointer"}}/>
            </div>
            <div style={{background:"rgba(230,126,34,.08)",borderRadius:5,padding:"3px 10px",textAlign:"center",border:"1px solid rgba(230,126,34,.1)"}}>
              <div style={{fontSize:16,fontWeight:800,color:"#E67E22"}}>{Math.round((tDn/tasks.length)*100)}%</div>
              <div style={{fontSize:6,color:"#5A6B7D"}}>{tDn}/{tasks.length}</div>
            </div>
            <button onClick={()=>{setMode("setup");sv(tasks,sd,wD,kpis,notes,tAi,analysis,"setup");}} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:4,padding:"5px 8px",color:"#6B7B8D",fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>↻ Re-setup</button>
            <button onClick={logout} style={{background:"rgba(231,76,60,.1)",border:"1px solid rgba(231,76,60,.2)",borderRadius:4,padding:"5px 8px",color:"#E74C3C",fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Logout</button>
          </div>
        </div>
        <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap",position:"relative",zIndex:1}}>
          {Object.entries(pc).map(([ph,c])=>{const p=PMeta[ph];const pct=Math.round((c.done/c.total)*100);return(
            <div key={ph} style={{flex:"1 1 90px",background:"rgba(255,255,255,.02)",borderRadius:3,padding:"3px 6px",border:"1px solid rgba(255,255,255,.03)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><span style={{fontSize:7,fontWeight:600,color:p.a}}>{ph}</span><span style={{fontSize:7,fontWeight:700,color:"#fff"}}>{pct}%</span></div>
              <div style={{height:2,background:"rgba(255,255,255,.04)",borderRadius:1}}><div style={{width:`${pct}%`,height:"100%",background:p.a,borderRadius:1,transition:"width .3s"}}/></div>
            </div>
          );})}
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #E8ECF0",overflowX:"auto"}}>
        {[{k:"analysis",l:"AI Analysis",i:"✦"},{k:"timeline",l:"Timeline",i:"◷"},{k:"ai",l:"Advisor",i:"💬"},{k:"weekly",l:"Weekly",i:"☑"},{k:"kpis",l:"KPIs",i:"◈"}].map(v=>(
          <button key={v.k} onClick={()=>setView(v.k)} style={{flex:1,padding:"9px 2px",border:"none",background:"transparent",cursor:"pointer",fontSize:9,fontWeight:view===v.k?700:500,color:view===v.k?"#0F1923":"#8896A6",borderBottom:view===v.k?"2.5px solid #E67E22":"2.5px solid transparent",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:2,whiteSpace:"nowrap"}}><span>{v.i}</span> {v.l}</button>
        ))}
      </div>

      <div style={{padding:"12px 14px 40px",maxWidth:820,margin:"0 auto"}}>
        {/* ANALYSIS */}
        {view==="analysis"&&(<>{analysis?(()=>{const secs=parseSec(analysis);return(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:14,color:"#E67E22"}}>✦</span><h2 style={{margin:0,fontSize:15,fontWeight:700}}>AI Strategic Analysis</h2></div>
          <button onClick={()=>{setMode("setup");sv(tasks,sd,wD,kpis,notes,tAi,"","setup");}} style={{padding:"3px 8px",borderRadius:3,border:"1px solid #D1D8E0",background:"#fff",color:"#6B7B8D",fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>↻ Re-analyse</button></div>
          {secs.map((s,i)=>(<div key={i} style={{background:"#fff",borderRadius:6,padding:"10px 12px",marginBottom:5,border:"1px solid #E8ECF0"}}>
            {s.title&&<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}><span style={{fontSize:12}}>{SI[s.title]||"→"}</span><span style={{fontSize:9,fontWeight:700,color:SCo[s.title]||"#2C3E50",letterSpacing:".2px",textTransform:"uppercase"}}>{s.title}</span></div>}
            <p style={{margin:0,fontSize:11,lineHeight:1.55,color:"#374151",whiteSpace:"pre-wrap"}}>{s.content}</p>
          </div>))}
        </div>);})():<p style={{color:"#8896A6",fontSize:11}}>No analysis yet. Use Re-setup.</p>}</>)}

        {/* TIMELINE */}
        {view==="timeline"&&(<>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:6}}>
            {["All Phases","Foundation","Optimisation","Scaling","Maturity"].map(p=>(<button key={p} onClick={()=>setFPh(p)} style={{padding:"3px 7px",borderRadius:3,border:"none",cursor:"pointer",fontSize:8,fontWeight:600,fontFamily:"inherit",background:fPh===p?(p==="All Phases"?"#0F1923":PMeta[p]?.c):"#F0F2F5",color:fPh===p?"#fff":"#6B7B8D"}}>{p}</button>))}
          </div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:10}}>
            {["All Channels","Google","Meta","Instagram","WhatsApp","Referral"].map(c=>(<button key={c} onClick={()=>setFCh(c)} style={{padding:"3px 7px",borderRadius:3,border:"none",cursor:"pointer",fontSize:8,fontWeight:600,fontFamily:"inherit",background:fCh===c?(CC[c]||"#607D8B"):"#F0F2F5",color:fCh===c?"#fff":"#6B7B8D"}}>{c}</button>))}
          </div>
          {(()=>{let lg="";return filtered.map((t,i)=>{const gl=`${t.phase} → ${t.group}`;const sg=gl!==lg;lg=gl;const d=t.status==="done";const pr=PRI[t.priority];const pm=PMeta[t.phase];
          const isO=tOpen===t.id;const isL=tAiL===t.id;const aiC=tAi[t.id];const secs=aiC?parseSec(aiC):[];
          return(<div key={t.id}>
            {sg&&<div style={{margin:i===0?"0 0 3px":"12px 0 3px",display:"flex",alignItems:"center",gap:4}}><div style={{width:5,height:5,borderRadius:2,background:pm?.a||"#607D8B"}}/><span style={{fontSize:8,fontWeight:700,color:pm?.c||"#333"}}>{gl}</span></div>}
            <div style={{background:d?"#F7FBF7":"#fff",borderRadius:5,padding:"8px 10px",marginBottom:3,border:`1px solid ${isO?(pm?.a||"#E67E22")+"30":d?"#D5E8D4":"#E8ECF0"}`,opacity:d?.5:1}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:7}}>
                <button onClick={()=>tog(t.id)} style={{width:16,height:16,minWidth:16,borderRadius:3,marginTop:1,border:d?"2px solid #27AE60":"2px solid #C4CDD5",background:d?"#27AE60":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:8,fontWeight:800}}>{d&&"✓"}</button>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:3,flexWrap:"wrap",marginBottom:1}}>
                    {!d&&t.startDate&&<span style={{fontSize:7,fontWeight:600,color:"#6B7B8D",background:"#F0F2F5",padding:"0px 4px",borderRadius:2}}>{fD(t.startDate)}–{fD(t.endDate)}</span>}
                    <span style={{fontSize:7,fontWeight:700,color:"#fff",background:CC[t.channel]||"#607D8B",padding:"0px 4px",borderRadius:2}}>{t.channel}</span>
                    <span style={{fontSize:7,fontWeight:600,color:pr.fg,background:pr.bg,padding:"0px 4px",borderRadius:2}}>{t.priority}</span>
                  </div>
                  <p style={{margin:0,fontSize:11,fontWeight:500,color:d?"#95A5A6":"#1a1a2e",textDecoration:d?"line-through":"none"}}>{t.task}</p>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3,flexWrap:"wrap"}}>
                    <button onClick={()=>askTask(t)} style={{padding:"2px 7px",borderRadius:3,border:"none",cursor:"pointer",background:isO?(pm?.a||"#E67E22"):"linear-gradient(135deg,#1a1a2e,#2d3748)",color:"#fff",fontSize:8,fontWeight:700,fontFamily:"inherit",display:"flex",alignItems:"center",gap:2}}>
                      {isL?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span>...</>:isO&&aiC?<>✦ Hide</>:<>✦ Ask AI</>}
                    </button>
                    {eNote===t.id?(<div style={{flex:1}}><textarea value={notes[t.id]||""} onChange={e=>{const n={...notes,[t.id]:e.target.value};setNotes(n);sv(tasks,sd,wD,kpis,n,tAi,analysis,"dashboard");}} placeholder="Note..." style={{width:"100%",minHeight:24,padding:3,borderRadius:3,border:"1px solid #C4CDD5",fontSize:8,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/><button onClick={()=>setENote(null)} style={{padding:"1px 5px",borderRadius:2,border:"none",background:"#0F1923",color:"#fff",fontSize:7,cursor:"pointer",fontFamily:"inherit"}}>Save</button></div>):(<button onClick={()=>setENote(t.id)} style={{padding:0,border:"none",background:"transparent",color:notes[t.id]?"#2471A3":"#C4CDD5",fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{notes[t.id]?`📝 ${notes[t.id].substring(0,25)}...`:"+ note"}</button>)}
                  </div>
                  {isO&&aiC&&(<div style={{marginTop:6,borderRadius:5,overflow:"hidden",border:`1px solid ${pm?.a||"#E67E22"}15`,background:"#FAFBFC",animation:"slideD .3s ease"}}>
                    <div style={{padding:"4px 8px",background:`${pm?.a||"#E67E22"}05`,borderBottom:`1px solid ${pm?.a||"#E67E22"}08`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:9}}>✦</span><span style={{fontSize:7,fontWeight:700,color:pm?.a||"#E67E22",textTransform:"uppercase"}}>Execution Guide</span></div>
                      <button onClick={()=>{const n={...tAi};delete n[t.id];setTAi(n);setTOpen(null);setTimeout(()=>askTask(t),100);}} style={{padding:"1px 5px",borderRadius:2,border:"1px solid #D1D8E0",background:"#fff",color:"#6B7B8D",fontSize:7,cursor:"pointer",fontFamily:"inherit"}}>↻</button>
                    </div>
                    {secs.map((s,si)=>(<div key={si} style={{padding:"5px 9px",borderBottom:si<secs.length-1?"1px solid #F0F2F5":"none"}}>
                      {s.title&&<div style={{display:"flex",alignItems:"center",gap:3,marginBottom:2}}><span style={{fontSize:9}}>{SI[s.title]||"→"}</span><span style={{fontSize:7,fontWeight:700,color:SCo[s.title]||"#2C3E50",textTransform:"uppercase"}}>{s.title}</span></div>}
                      <p style={{margin:0,fontSize:10,lineHeight:1.5,color:"#374151",whiteSpace:"pre-wrap"}}>{s.content}</p>
                    </div>))}
                  </div>)}
                  {isO&&isL&&(<div style={{marginTop:6,padding:10,borderRadius:5,background:"#FAFBFC",border:`1px solid ${pm?.a||"#E67E22"}10`,textAlign:"center"}}><span style={{fontSize:9,color:"#6B7B8D"}}><span style={{display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}>✦</span> Generating...</span></div>)}
                </div>
              </div>
            </div>
          </div>);});})()}
        </>)}

        {/* ADVISOR */}
        {view==="ai"&&(<>
          <h2 style={{margin:"0 0 3px",fontSize:14,fontWeight:700}}>💬 AI Advisor</h2>
          <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:8,marginTop:8}}>
            {["What should I focus on this week?","My CPL is ₹600 — how to fix?","I have 10 hours — reprioritize","Biggest risk right now?"].map(q=>(<button key={q} onClick={()=>setAiP(q)} style={{padding:"6px 8px",borderRadius:4,border:"1px solid #E8ECF0",background:"#fff",cursor:"pointer",fontSize:9,fontFamily:"inherit",color:"#1a1a2e",textAlign:"left"}}>{q}</button>))}
          </div>
          <div style={{display:"flex",gap:4}}>
            <input value={aiP} onChange={e=>setAiP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askG()} placeholder="Ask anything..." style={{flex:1,padding:"7px 8px",borderRadius:4,border:"1px solid #D1D8E0",fontSize:10,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
            <button onClick={askG} disabled={aiL} style={{padding:"7px 11px",borderRadius:4,border:"none",background:aiL?"#8896A6":"#0F1923",color:"#fff",fontSize:9,fontWeight:600,cursor:aiL?"default":"pointer",fontFamily:"inherit"}}>{aiL?"...":"Ask"}</button>
          </div>
          {aiR&&<div style={{marginTop:8,padding:10,background:"#fff",borderRadius:5,border:"1px solid #E8ECF0"}}><p style={{margin:0,fontSize:10,color:"#2D3748",whiteSpace:"pre-wrap",lineHeight:1.5}}>{aiR}</p></div>}
        </>)}

        {/* WEEKLY */}
        {view==="weekly"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><h2 style={{margin:0,fontSize:14,fontWeight:700}}>☑ Weekly Checklist</h2><button onClick={()=>{setWD({});sv(tasks,sd,{},kpis,notes,tAi,analysis,"dashboard");}} style={{padding:"3px 7px",borderRadius:3,border:"1px solid #E74C3C",background:"transparent",color:"#E74C3C",fontSize:7,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Reset</button></div>
          {WK.map(t=>{const d=wD[t.id];return(<div key={t.id} onClick={()=>{const n={...wD,[t.id]:!d};setWD(n);sv(tasks,sd,n,kpis,notes,tAi,analysis,"dashboard");}} style={{background:d?"#F7FBF7":"#fff",borderRadius:4,padding:"7px 9px",marginBottom:3,border:`1px solid ${d?"#D5E8D4":"#E8ECF0"}`,cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:15,height:15,minWidth:15,borderRadius:3,border:d?"2px solid #27AE60":"2px solid #C4CDD5",background:d?"#27AE60":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:8,fontWeight:800}}>{d&&"✓"}</div>
            <span style={{flex:1,fontSize:10,fontWeight:500,color:d?"#95A5A6":"#1a1a2e",textDecoration:d?"line-through":"none"}}>{t.task}</span>
            <span style={{fontSize:7,fontWeight:700,color:"#fff",background:CC[t.channel]||"#607D8B",padding:"1px 4px",borderRadius:2}}>{t.channel}</span>
          </div>);})}
        </>)}

        {/* KPIs */}
        {view==="kpis"&&(<>
          <h2 style={{margin:"0 0 7px",fontSize:14,fontWeight:700}}>◈ KPIs</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:5}}>
            {[{k:"leads",l:"Leads/wk",t:"15% MoM",i:"👥"},{k:"cpl",l:"CPL (₹)",t:"₹200–400",i:"💰"},{k:"tourRate",l:"Lead→Tour %",t:"30–40%",i:"🏠"},{k:"convRate",l:"Tour→Cust %",t:"50–60%",i:"🎯"},{k:"cpa",l:"CPA (₹)",t:"<₹1,500",i:"📉"},{k:"roas",l:"ROAS",t:">4:1",i:"📈"}].map(k=>(<div key={k.k} style={{background:"#fff",borderRadius:5,padding:9,border:"1px solid #E8ECF0"}}>
              <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:3}}><span style={{fontSize:11}}>{k.i}</span><span style={{fontSize:9,fontWeight:600}}>{k.l}</span></div>
              <input type="text" value={kpis[k.k]} onChange={e=>{const n={...kpis,[k.k]:e.target.value};setKpis(n);sv(tasks,sd,wD,n,notes,tAi,analysis,"dashboard");}} placeholder="..." style={{width:"100%",padding:"4px 6px",borderRadius:3,border:"1px solid #D1D8E0",fontSize:12,fontWeight:700,color:"#0F1923",fontFamily:"inherit",boxSizing:"border-box"}}/>
              <div style={{marginTop:1,fontSize:7,color:"#8896A6"}}>Target: <b>{k.t}</b></div>
            </div>))}
          </div>
        </>)}
      </div>
    </div>
  );
}
