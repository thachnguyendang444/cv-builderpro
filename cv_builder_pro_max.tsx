import { useState, useEffect, useRef } from "react";

// ============ STORAGE ============
async function sget(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sset(k,v){try{await window.storage.set(k,JSON.stringify(v));}catch(e){console.error(e);}}

// ============ HELPERS ============
function initials(n){return(n||'').split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?';}

function contacts(d,col){
  col=col||'#555';
  var items=[];
  if(d.email)items.push('<span style="color:'+col+';font-size:11px">✉ '+d.email+'</span>');
  if(d.phone)items.push('<span style="color:'+col+';font-size:11px">📱 '+d.phone+'</span>');
  if(d.address)items.push('<span style="color:'+col+';font-size:11px">📍 '+d.address+'</span>');
  if(d.linkedin)items.push('<span style="color:'+col+';font-size:11px">🔗 '+d.linkedin+'</span>');
  if(d.website)items.push('<span style="color:'+col+';font-size:11px">🌐 '+d.website+'</span>');
  return items.join('');
}

function secTitle(label,acc){
  return '<div style="font-size:9.5px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:'+acc+';border-bottom:2px solid '+acc+';padding-bottom:4px;margin-bottom:10px">'+label+'</div>';
}

function leftCol(d,acc,tx,mu){
  tx=tx||'#222'; mu=mu||'#555';
  var html='';
  if(d.summary)html+=secTitle('Giới thiệu',acc)+'<p style="font-size:11.5px;color:'+mu+';line-height:1.65;margin-bottom:18px">'+d.summary+'</p>';
  if(d.skills&&d.skills.length){
    html+=secTitle('Kỹ năng',acc);
    html+=d.skills.map(function(s){return '<div style="margin-bottom:8px"><div style="font-size:11px;font-weight:600;color:'+tx+';margin-bottom:3px">'+s.name+'</div><div style="height:4px;background:#00000015;border-radius:2px"><div style="height:100%;background:'+acc+';border-radius:2px;width:'+s.level+'%"></div></div></div>';}).join('');
    html+='<div style="height:14px"></div>';
  }
  if(d.langs&&d.langs.length){
    html+=secTitle('Ngôn ngữ',acc);
    html+=d.langs.map(function(l){return '<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:5px;color:'+mu+'"><span>'+l.lang+'</span><span style="font-weight:700;color:'+acc+'">'+l.level+'</span></div>';}).join('');
  }
  return html;
}

function rightCol(d,acc,tx,mu){
  tx=tx||'#1a1a2e'; mu=mu||'#555';
  var html='';
  if(d.exps&&d.exps.length){
    html+=secTitle('Kinh nghiệm',acc);
    html+=d.exps.map(function(e){
      var s='<div style="margin-bottom:13px"><div style="font-size:12.5px;font-weight:700;color:'+tx+'">'+(e.pos||'Chức vụ')+'</div>';
      s+='<div style="font-size:11px;font-weight:600;color:'+acc+'">'+(e.company||'Công ty')+'</div>';
      if(e.from||e.to)s+='<div style="font-size:10px;color:'+mu+';margin:2px 0">'+(e.from||'')+' — '+(e.to||'')+'</div>';
      if(e.desc)s+='<div style="font-size:11px;color:'+mu+';line-height:1.5">'+e.desc+'</div>';
      return s+'</div>';
    }).join('');
    html+='<div style="height:14px"></div>';
  }
  if(d.edus&&d.edus.length){
    html+=secTitle('Học vấn',acc);
    html+=d.edus.map(function(e){
      var s='<div style="margin-bottom:12px"><div style="font-size:12.5px;font-weight:700;color:'+tx+'">'+(e.school||'Trường')+'</div>';
      s+='<div style="font-size:11px;font-weight:600;color:'+acc+'">'+(e.major||'Ngành')+'</div>';
      if(e.year)s+='<div style="font-size:10px;color:'+mu+'">'+e.year+(e.gpa?' · GPA: '+e.gpa:'')+'</div>';
      return s+'</div>';
    }).join('');
  }
  return html;
}

function avatarHtml(d,acc,size,radius,border){
  size=size||88; radius=radius||'50%'; border=border||'';
  if(d.avatar)return '<img src="'+d.avatar+'" style="width:'+size+'px;height:'+size+'px;border-radius:'+radius+';object-fit:cover;'+border+'">';
  return '<div style="width:'+size+'px;height:'+size+'px;border-radius:'+radius+';background:'+acc+'55;display:flex;align-items:center;justify-content:center;font-size:'+(size*0.32)+'px;font-weight:700;color:#fff;'+border+'">'+initials(d.name)+'</div>';
}

// ============ TEMPLATES ============
var TEMPLATES = [
  {
    id:"modern-gradient", name:"Modern Gradient", tag:"🌈 Trending", desc:"Gradient tím xanh hiện đại",
    preview:"linear-gradient(135deg,#667eea,#764ba2)", category:"modern",
    render:function(d,acc){
      acc=acc||'#667eea';
      return '<div style="font-family:Segoe UI,sans-serif;min-height:297mm;background:#fff"><div style="background:linear-gradient(135deg,'+acc+',#764ba2);padding:40px;display:flex;align-items:center;gap:24px">'+avatarHtml(d,acc,90,'50%','border:3px solid rgba(255,255,255,.4);')+'<div><div style="font-size:28px;font-weight:800;color:#fff;margin-bottom:4px">'+(d.name||'Họ và Tên')+'</div><div style="font-size:14px;color:rgba(255,255,255,.85);margin-bottom:10px">'+(d.title||'Chức danh')+'</div><div style="display:flex;flex-wrap:wrap;gap:12px">'+contacts(d,'rgba(255,255,255,.8)')+'</div></div></div><div style="display:grid;grid-template-columns:1fr 2fr"><div style="padding:28px 24px;background:#f8f6ff">'+leftCol(d,acc)+'</div><div style="padding:28px">'+rightCol(d,acc)+'</div></div></div>';
    }
  },
  {
    id:"neon-dark", name:"Neon Dark", tag:"🔥 Hot", desc:"Dark mode với neon cực đỉnh",
    preview:"linear-gradient(135deg,#0f0f1a,#1a1a2e)", category:"creative",
    render:function(d,acc){
      acc=acc||'#7c6ffa';
      return '<div style="font-family:Segoe UI,sans-serif;min-height:297mm;background:#0f0f1a;color:#e0e0f0"><div style="padding:40px;border-bottom:1px solid #2a2a4a;display:flex;align-items:center;gap:24px">'+avatarHtml(d,acc,88,'50%','border:2px solid '+acc+';box-shadow:0 0 20px '+acc+'55;')+'<div><div style="font-size:30px;font-weight:900;color:#fff;letter-spacing:-1px">'+(d.name||'Họ và Tên')+'</div><div style="font-size:13px;color:'+acc+';font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:6px 0">'+(d.title||'Chức danh')+'</div><div style="display:flex;flex-wrap:wrap;gap:10px">'+contacts(d,'#8888b0')+'</div></div></div><div style="display:grid;grid-template-columns:200px 1fr"><div style="background:#12121f;padding:24px;border-right:1px solid #2a2a4a">'+leftCol(d,acc,'#fff','#8888b0')+'</div><div style="padding:28px">'+rightCol(d,acc,'#fff','#8888b0')+'</div></div></div>';
    }
  },
  {
    id:"elegant-rose", name:"Elegant Rose", tag:"🌸 Feminine", desc:"Hồng pastel sang trọng",
    preview:"linear-gradient(135deg,#e91e8c,#f06292)", category:"elegant",
    render:function(d,acc){
      acc=acc||'#e91e8c';
      return '<div style="font-family:Georgia,serif;min-height:297mm;background:#fff"><div style="background:linear-gradient(135deg,'+acc+',#f06292);padding:44px;text-align:center">'+avatarHtml(d,acc,96,'50%','border:4px solid rgba(255,255,255,.5);margin-bottom:14px;display:block;margin-left:auto;margin-right:auto;')+'<div style="font-size:30px;font-weight:700;color:#fff;font-style:italic">'+(d.name||'Họ và Tên')+'</div><div style="font-size:13px;color:rgba(255,255,255,.85);margin-top:6px">'+(d.title||'Chức danh')+'</div><div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:12px">'+contacts(d,'rgba(255,255,255,.8)')+'</div></div><div style="display:grid;grid-template-columns:1fr 2fr"><div style="background:#fff0f5;padding:28px">'+leftCol(d,acc)+'</div><div style="padding:28px">'+rightCol(d,acc)+'</div></div></div>';
    }
  },
  {
    id:"corporate-blue", name:"Corporate Blue", tag:"💼 Professional", desc:"Chuyên nghiệp, phù hợp corporate",
    preview:"linear-gradient(135deg,#1565c0,#0d47a1)", category:"classic",
    render:function(d,acc){
      acc=acc||'#1565c0';
      return '<div style="font-family:Arial,sans-serif;min-height:297mm;background:#fff"><div style="background:'+acc+';padding:36px 40px;display:flex;align-items:center;gap:20px">'+avatarHtml(d,acc,82,'4px','border:2px solid rgba(255,255,255,.3);')+'<div><div style="font-size:26px;font-weight:700;color:#fff">'+(d.name||'Họ và Tên')+'</div><div style="font-size:13px;color:rgba(255,255,255,.8);margin:4px 0 10px">'+(d.title||'Chức danh')+'</div><div style="display:flex;flex-wrap:wrap;gap:10px">'+contacts(d,'rgba(255,255,255,.75)')+'</div></div></div><div style="display:grid;grid-template-columns:220px 1fr"><div style="background:#e8f0fe;padding:24px;border-right:3px solid '+acc+'">'+leftCol(d,acc)+'</div><div style="padding:28px">'+rightCol(d,acc)+'</div></div></div>';
    }
  },
  {
    id:"creative-studio", name:"Creative Studio", tag:"🎨 Creative", desc:"Dành cho designer, creative",
    preview:"linear-gradient(135deg,#ff6b35,#f7c59f)", category:"creative",
    render:function(d,acc){
      acc=acc||'#ff6b35';
      var leftW='<div style="text-align:center;margin-bottom:24px">'+avatarHtml(d,'rgba(255,255,255,.9)',100,'50%','border:3px solid rgba(255,255,255,.4);margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;')+'<div style="font-size:20px;font-weight:800;color:#fff">'+(d.name||'Họ và Tên')+'</div><div style="font-size:12px;color:rgba(255,255,255,.8);margin-top:4px">'+(d.title||'Chức danh')+'</div></div>';
      if(d.skills&&d.skills.length)leftW+='<div style="font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.6);border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:4px;margin-bottom:8px">KỸ NĂNG</div>'+d.skills.map(function(s){return '<div style="margin-bottom:7px"><div style="font-size:11px;color:rgba(255,255,255,.9);margin-bottom:2px">'+s.name+'</div><div style="height:3px;background:rgba(255,255,255,.2);border-radius:2px"><div style="height:100%;background:rgba(255,255,255,.85);border-radius:2px;width:'+s.level+'%"></div></div></div>';}).join('');
      return '<div style="font-family:Trebuchet MS,sans-serif;min-height:297mm;background:#fafafa"><div style="display:grid;grid-template-columns:260px 1fr;min-height:297mm"><div style="background:'+acc+';padding:36px 24px;color:#fff">'+leftW+'</div><div style="padding:36px 32px;background:#fff">'+rightCol(d,acc)+'</div></div></div>';
    }
  },
  {
    id:"tech-hacker", name:"Tech Hacker", tag:"⚡ Dev", desc:"Terminal style cho developer",
    preview:"linear-gradient(135deg,#0d1117,#161b22)", category:"tech",
    render:function(d,acc){
      acc=acc||'#58a6ff';
      return '<div style="font-family:Courier New,monospace;min-height:297mm;background:#0d1117;color:#c9d1d9"><div style="padding:32px 36px;border-bottom:1px solid #30363d"><div style="color:#58a6ff;font-size:12px;margin-bottom:8px">$ whoami</div><div style="font-size:28px;font-weight:700;color:#e6edf3">'+(d.name||'dev_user')+'</div><div style="color:'+acc+';font-size:13px;margin:4px 0">// '+(d.title||'Software Engineer')+'</div><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px">'+contacts(d,'#8b949e')+'</div></div><div style="display:grid;grid-template-columns:220px 1fr"><div style="padding:24px;border-right:1px solid #30363d;background:#161b22">'+leftCol(d,acc,'#c9d1d9','#8b949e')+'</div><div style="padding:24px">'+rightCol(d,acc,'#c9d1d9','#8b949e')+'</div></div></div>';
    }
  },
  {
    id:"nature-green", name:"Nature Green", tag:"🌿 Fresh", desc:"Xanh lá tươi mát, sinh động",
    preview:"linear-gradient(135deg,#2e7d32,#43a047)", category:"elegant",
    render:function(d,acc){
      acc=acc||'#2e7d32';
      return '<div style="font-family:Segoe UI,sans-serif;min-height:297mm;background:#fff"><div style="background:linear-gradient(135deg,'+acc+',#66bb6a);padding:40px;position:relative;overflow:hidden"><div style="position:absolute;top:-30px;right:-30px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.08)"></div><div style="display:flex;align-items:center;gap:22px;position:relative">'+avatarHtml(d,acc,90,'50%','border:3px solid rgba(255,255,255,.4);')+'<div><div style="font-size:28px;font-weight:800;color:#fff">'+(d.name||'Họ và Tên')+'</div><div style="color:rgba(255,255,255,.85);font-size:13px;margin:5px 0 10px">'+(d.title||'Chức danh')+'</div><div style="display:flex;flex-wrap:wrap;gap:10px">'+contacts(d,'rgba(255,255,255,.8)')+'</div></div></div></div><div style="display:grid;grid-template-columns:1fr 2fr"><div style="background:#f1f8e9;padding:26px">'+leftCol(d,acc)+'</div><div style="padding:28px">'+rightCol(d,acc)+'</div></div></div>';
    }
  },
  {
    id:"royal-purple", name:"Royal Purple", tag:"👑 Luxury", desc:"Tím hoàng gia sang trọng",
    preview:"linear-gradient(135deg,#4a148c,#7b1fa2)", category:"elegant",
    render:function(d,acc){
      acc=acc||'#4a148c';
      return '<div style="font-family:Georgia,serif;min-height:297mm;background:#faf8ff"><div style="background:linear-gradient(135deg,'+acc+',#ab47bc);padding:44px 40px"><div style="display:flex;align-items:center;gap:26px">'+avatarHtml(d,acc,92,'50%','border:3px solid rgba(255,255,255,.35);')+'<div><div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,.6);text-transform:uppercase;margin-bottom:6px">CURRICULUM VITAE</div><div style="font-size:27px;font-weight:700;color:#fff;font-style:italic">'+(d.name||'Họ và Tên')+'</div><div style="font-size:13px;color:rgba(255,255,255,.8);margin-top:5px">'+(d.title||'Chức danh')+'</div><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px">'+contacts(d,'rgba(255,255,255,.75)')+'</div></div></div></div><div style="display:grid;grid-template-columns:210px 1fr"><div style="background:#f3e5f5;padding:26px;border-right:3px solid '+acc+'">'+leftCol(d,acc)+'</div><div style="padding:28px">'+rightCol(d,acc)+'</div></div></div>';
    }
  },
  {
    id:"bold-orange", name:"Bold Orange", tag:"🚀 Energetic", desc:"Cam bùng cháy, năng động",
    preview:"linear-gradient(135deg,#e65100,#ff6d00)", category:"modern",
    render:function(d,acc){
      acc=acc||'#e65100';
      return '<div style="font-family:Arial,sans-serif;min-height:297mm;background:#fff"><div style="background:'+acc+'"><div style="background:rgba(0,0,0,.12);padding:36px 40px;display:flex;align-items:center;gap:22px">'+avatarHtml(d,acc,88,'8px','')+'<div><div style="font-size:32px;font-weight:900;color:#fff;line-height:1">'+(d.name||'Họ và Tên')+'</div><div style="font-size:13px;color:rgba(255,255,255,.8);margin-top:6px;text-transform:uppercase;letter-spacing:1.5px">'+(d.title||'Chức danh')+'</div><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px">'+contacts(d,'rgba(255,255,255,.75)')+'</div></div></div></div><div style="display:grid;grid-template-columns:1fr 2fr"><div style="background:#fff3e0;padding:26px;border-right:4px solid '+acc+'">'+leftCol(d,acc)+'</div><div style="padding:28px">'+rightCol(d,acc)+'</div></div></div>';
    }
  },
  {
    id:"retro-vintage", name:"Retro Vintage", tag:"📺 Retro", desc:"Vintage cổ điển, độc đáo",
    preview:"linear-gradient(135deg,#795548,#a1887f)", category:"creative",
    render:function(d,acc){
      acc=acc||'#795548';
      return '<div style="font-family:Georgia,serif;min-height:297mm;background:#fdf6e3;border:2px solid #c8b89a"><div style="background:'+acc+';padding:30px 40px;text-align:center;border-bottom:4px double #c8b89a"><div style="font-size:11px;letter-spacing:4px;color:rgba(255,255,255,.7);text-transform:uppercase;margin-bottom:10px">— CURRICULUM VITAE —</div>'+avatarHtml(d,acc,80,'50%','border:3px solid rgba(255,255,255,.4);margin:8px auto;display:block;')+'<div style="font-size:28px;font-weight:700;color:#fff;font-style:italic">'+(d.name||'Họ và Tên')+'</div><div style="font-size:12px;color:rgba(255,255,255,.75);margin-top:6px">'+(d.title||'Chức danh')+'</div><div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:10px">'+contacts(d,'rgba(255,255,255,.7)')+'</div></div><div style="display:grid;grid-template-columns:1fr 2fr;background:#fdf6e3"><div style="padding:26px;border-right:2px dashed #c8b89a">'+leftCol(d,acc)+'</div><div style="padding:28px">'+rightCol(d,acc)+'</div></div></div>';
    }
  },
  {
    id:"minimal-zen", name:"Minimal Zen", tag:"☯ Minimal", desc:"Tối giản tinh tế",
    preview:"linear-gradient(135deg,#f5f5f5,#eeeeee)", category:"minimal",
    render:function(d,acc){
      acc=acc||'#333';
      return '<div style="font-family:Segoe UI,sans-serif;min-height:297mm;background:#fff;padding:48px"><div style="display:flex;align-items:flex-start;gap:28px;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid #eee">'+avatarHtml(d,acc,76,'50%','')+'<div><div style="font-size:28px;font-weight:300;color:#111;letter-spacing:-0.5px">'+(d.name||'Họ và Tên')+'</div><div style="font-size:13px;color:'+acc+';margin-top:4px">'+(d.title||'Chức danh')+'</div><div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:10px">'+contacts(d,'#888')+'</div></div></div><div style="display:grid;grid-template-columns:1fr 2fr;gap:32px"><div>'+leftCol(d,acc)+'</div><div>'+rightCol(d,acc)+'</div></div></div>';
    }
  },
  {
    id:"glassmorphism", name:"Glassmorphism", tag:"💎 Ultra Modern", desc:"Glass effect siêu hiện đại",
    preview:"linear-gradient(135deg,#6ee2f5,#6454f0)", category:"modern",
    render:function(d,acc){
      acc=acc||'#6ee2f5';
      return '<div style="font-family:Segoe UI,sans-serif;min-height:297mm;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);position:relative;overflow:hidden"><div style="position:absolute;top:-80px;right:-80px;width:300px;height:300px;border-radius:50%;background:'+acc+'22"></div><div style="position:relative;padding:36px;margin:20px;background:rgba(255,255,255,.08);border-radius:16px;border:1px solid rgba(255,255,255,.15)"><div style="display:flex;align-items:center;gap:20px;margin-bottom:20px">'+avatarHtml(d,acc,88,'50%','border:2px solid '+acc+';')+'<div><div style="font-size:27px;font-weight:800;color:#fff">'+(d.name||'Họ và Tên')+'</div><div style="color:'+acc+';font-size:13px;margin-top:4px">'+(d.title||'Chức danh')+'</div><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px">'+contacts(d,'rgba(255,255,255,.65)')+'</div></div></div><div style="display:grid;grid-template-columns:1fr 2fr;gap:16px"><div style="background:rgba(255,255,255,.05);border-radius:12px;padding:18px;border:1px solid rgba(255,255,255,.1)">'+leftCol(d,acc,'#e0e0f0','#a0a0c0')+'</div><div style="background:rgba(255,255,255,.05);border-radius:12px;padding:18px;border:1px solid rgba(255,255,255,.1)">'+rightCol(d,acc,'#e0e0f0','#a0a0c0')+'</div></div></div></div>';
    }
  },
];

var ACCENTS=['#667eea','#e74c3c','#27ae60','#f39c12','#1abc9c','#2c3e50','#e91e8c','#ff6b35','#7c6ffa','#00bcd4','#795548','#607d8b'];
var DEF={name:'',title:'',email:'',phone:'',address:'',linkedin:'',website:'',summary:'',avatar:null,exps:[{id:1,company:'',pos:'',from:'',to:'',desc:''}],edus:[{id:1,school:'',major:'',year:'',gpa:''}],skills:[{name:'React / Vue.js',level:85},{name:'JavaScript',level:90}],langs:[{lang:'Tiếng Việt',level:'Bản ngữ'}]};

var iStyle={width:'100%',padding:'10px 12px',background:'rgba(255,255,255,.07)',border:'1px solid #2e2e3a',borderRadius:8,color:'#f0f0f5',fontSize:13,outline:'none',marginBottom:12,fontFamily:'inherit',boxSizing:'border-box'};
var lbStyle={display:'block',fontSize:10.5,fontWeight:700,color:'#8888a0',marginBottom:4,textTransform:'uppercase',letterSpacing:.4};
var inStyle={width:'100%',padding:'8px 10px',background:'#22222c',border:'1px solid #2e2e3a',borderRadius:8,color:'#f0f0f5',fontSize:13,outline:'none',fontFamily:'inherit',boxSizing:'border-box'};
var btnSm={padding:'7px 14px',background:'#667eea',color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer'};

// ============ MAIN ============
export default function App(){
  var [page,setPage]=useState('login');
  var [user,setUser]=useState(null);
  var [users,setUsers]=useState([]);
  var [cvList,setCvList]=useState([]);
  var [templates,setTemplates]=useState(TEMPLATES);
  var [loading,setLoading]=useState(true);

  useEffect(function(){init();},[]);

  async function init(){
    setLoading(true);
    var us=await sget('cvb_users');
    if(!us){us=[{id:'admin',name:'Admin',email:'admin@cv.pro',password:'admin123',role:'admin',createdAt:Date.now()}];await sset('cvb_users',us);}
    setUsers(us);
    var ct=await sget('cvb_templates');
    if(ct)setTemplates(TEMPLATES.concat(ct));
    var cl=await sget('cvb_cvlist');
    if(cl)setCvList(cl);
    setLoading(false);
  }

  async function login(email,pw){
    var u=users.find(function(x){return x.email===email&&x.password===pw;});
    if(!u)return 'Email hoặc mật khẩu không đúng!';
    setUser(u);setPage(u.role==='admin'?'admin':'app');return null;
  }

  async function register(name,email,pw){
    if(users.find(function(x){return x.email===email;}))return 'Email đã tồn tại!';
    var u={id:Date.now()+'',name:name,email:email,password:pw,role:'user',createdAt:Date.now()};
    var nu=users.concat([u]);setUsers(nu);await sset('cvb_users',nu);setUser(u);setPage('app');return null;
  }

  async function saveCv(data){
    var cv={id:Date.now()+'',userId:user.id,userName:user.name,templateId:data.templateId,name:data.name||'CV chưa đặt tên',createdAt:Date.now(),data:data};
    var nl=[cv].concat(cvList);setCvList(nl);await sset('cvb_cvlist',nl);return cv;
  }

  async function deleteCv(id){var nl=cvList.filter(function(c){return c.id!==id;});setCvList(nl);await sset('cvb_cvlist',nl);}
  async function deleteUser(id){var nu=users.filter(function(u){return u.id!==id;});setUsers(nu);await sset('cvb_users',nu);}

  async function addCustomTemplate(tpl){
    var nt=templates.concat([tpl]);setTemplates(nt);
    var custom=nt.filter(function(t){return !TEMPLATES.find(function(x){return x.id===t.id;});});
    await sset('cvb_templates',custom);
  }

  function logout(){setUser(null);setPage('login');}

  if(loading)return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0f0f13',color:'#667eea',fontSize:16,flexDirection:'column',gap:12}}><div style={{fontSize:40}}>📄</div><div>Đang tải CV Builder Pro Max...</div></div>;
  if(page==='login')return <LoginPage onLogin={login} onRegister={register}/>;
  if(page==='admin')return <AdminPage user={user} users={users} cvList={cvList} templates={templates} onDeleteCv={deleteCv} onDeleteUser={deleteUser} onAddTemplate={addCustomTemplate} onLogout={logout} onGoApp={function(){setPage('app');}}/>;
  return <CVApp user={user} cvList={cvList.filter(function(c){return c.userId===user.id;})} templates={templates} onSaveCv={saveCv} onDeleteCv={deleteCv} onLogout={logout} onGoAdmin={user&&user.role==='admin'?function(){setPage('admin');}:null}/>;
}

// ============ LOGIN ============
function LoginPage({onLogin,onRegister}){
  var [tab,setTab]=useState('login');
  var [email,setEmail]=useState('');
  var [pw,setPw]=useState('');
  var [name,setName]=useState('');
  var [err,setErr]=useState('');
  var [busy,setBusy]=useState(false);

  async function submit(){
    setErr('');setBusy(true);
    var e=tab==='login'?await onLogin(email,pw):await onRegister(name,email,pw);
    if(e)setErr(e);setBusy(false);
  }

  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f0f1a,#1a1a2e)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:48,marginBottom:8}}>📄</div>
          <div style={{fontSize:24,fontWeight:800,color:'#fff'}}>CV Builder Pro Max</div>
          <div style={{fontSize:13,color:'#8888a0',marginTop:4}}>Tạo CV đẹp · Chuyên nghiệp · Miễn phí</div>
        </div>
        <div style={{background:'rgba(255,255,255,.05)',border:'1px solid #2e2e3a',borderRadius:16,padding:28}}>
          <div style={{display:'flex',gap:4,marginBottom:22,background:'rgba(0,0,0,.2)',borderRadius:10,padding:4}}>
            {['login','register'].map(function(t){return(
              <button key={t} onClick={function(){setTab(t);}} style={{flex:1,padding:'8px 0',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',background:tab===t?'#667eea':'transparent',color:tab===t?'#fff':'#8888a0'}}>
                {t==='login'?'Đăng nhập':'Đăng ký'}
              </button>
            );})}
          </div>
          {tab==='register'&&<input placeholder="Họ và tên" value={name} onChange={function(e){setName(e.target.value);}} style={iStyle}/>}
          <input placeholder="Email" value={email} onChange={function(e){setEmail(e.target.value);}} style={iStyle} type="email"/>
          <input placeholder="Mật khẩu" value={pw} onChange={function(e){setPw(e.target.value);}} style={{...iStyle,marginBottom:0}} type="password" onKeyDown={function(e){if(e.key==='Enter')submit();}}/>
          {err&&<div style={{color:'#f87171',fontSize:12,marginTop:8}}>{err}</div>}
          <button onClick={submit} disabled={busy} style={{width:'100%',padding:12,background:'linear-gradient(135deg,#667eea,#764ba2)',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer',marginTop:16,opacity:busy?.6:1}}>
            {busy?'Đang xử lý...':(tab==='login'?'🚀 Đăng nhập':'✨ Tạo tài khoản')}
          </button>
          <div style={{marginTop:14,padding:12,background:'rgba(102,126,234,.1)',borderRadius:8,fontSize:12,color:'#8888a0'}}>
            <b style={{color:'#a78bfa'}}>Demo Admin:</b> admin@cv.pro / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ CV APP ============
function CVApp({user,cvList,templates,onSaveCv,onDeleteCv,onLogout,onGoAdmin}){
  var [view,setView]=useState('create');
  var [cvData,setCvData]=useState(Object.assign({},DEF));
  var [tplId,setTplId]=useState('modern-gradient');
  var [accent,setAccent]=useState('#667eea');
  var [saving,setSaving]=useState(false);
  var [saved,setSaved]=useState(false);
  var [activeTab,setActiveTab]=useState('personal');
  var [zoom,setZoom]=useState(0.72);
  var [skillInput,setSkillInput]=useState('');
  var [langInput,setLangInput]=useState('');
  var [langLevel,setLangLevel]=useState('Thành thạo');

  var tpl=templates.find(function(t){return t.id===tplId;})||templates[0];

  function upd(f,v){setCvData(function(p){var n=Object.assign({},p);n[f]=v;return n;});}
  function updExp(id,f,v){setCvData(function(p){return Object.assign({},p,{exps:p.exps.map(function(e){return e.id===id?Object.assign({},e,{[f]:v}):e;})});});}
  function updEdu(id,f,v){setCvData(function(p){return Object.assign({},p,{edus:p.edus.map(function(e){return e.id===id?Object.assign({},e,{[f]:v}):e;})});});}
  function addExp(){setCvData(function(p){return Object.assign({},p,{exps:p.exps.concat([{id:Date.now(),company:'',pos:'',from:'',to:'',desc:''}])});});}
  function delExp(id){setCvData(function(p){return Object.assign({},p,{exps:p.exps.filter(function(e){return e.id!==id;})});});}
  function addEdu(){setCvData(function(p){return Object.assign({},p,{edus:p.edus.concat([{id:Date.now(),school:'',major:'',year:'',gpa:''}])});});}
  function delEdu(id){setCvData(function(p){return Object.assign({},p,{edus:p.edus.filter(function(e){return e.id!==id;})});});}
  function addSkill(){if(!skillInput.trim())return;setCvData(function(p){return Object.assign({},p,{skills:p.skills.concat([{name:skillInput,level:80}])});});setSkillInput('');}
  function delSkill(i){setCvData(function(p){return Object.assign({},p,{skills:p.skills.filter(function(_,j){return j!==i;})});});}
  function addLang(){if(!langInput.trim())return;setCvData(function(p){return Object.assign({},p,{langs:p.langs.concat([{lang:langInput,level:langLevel}])});});setLangInput('');}
  function delLang(i){setCvData(function(p){return Object.assign({},p,{langs:p.langs.filter(function(_,j){return j!==i;})});});}

  function handleAvatar(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){upd('avatar',ev.target.result);};r.readAsDataURL(f);}

  async function save(){
    setSaving(true);
    await onSaveCv(Object.assign({},cvData,{templateId:tplId,accent:accent}));
    setSaving(false);setSaved(true);setTimeout(function(){setSaved(false);},2000);
  }

  var html=tpl.render(cvData,accent);
  var tabs=['personal','experience','education','skills','design'];
  var tabLabels={personal:'👤 Cá nhân',experience:'💼 KN',education:'🎓 HV',skills:'⚡ Kỹ năng',design:'🎨 Thiết kế'};

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#0f0f13',color:'#f0f0f5'}}>
      {/* Topbar */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 20px',background:'#18181f',borderBottom:'1px solid #2e2e3a',flexShrink:0,flexWrap:'wrap',gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:30,height:30,background:'linear-gradient(135deg,#667eea,#764ba2)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>📄</div>
          <div><div style={{fontSize:14,fontWeight:700}}>CV Builder Pro Max</div><div style={{fontSize:10,color:'#667eea'}}>Xin chào, {user.name}</div></div>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {['create','history','templates'].map(function(v){return(
            <button key={v} onClick={function(){setView(v);}} style={{padding:'6px 10px',border:'none',borderRadius:8,fontSize:11,fontWeight:600,cursor:'pointer',background:view===v?'#667eea':'rgba(255,255,255,.07)',color:view===v?'#fff':'#8888a0'}}>
              {v==='create'?'✏️ Tạo CV':v==='history'?'📁 Lịch sử ('+cvList.length+')':'🎨 Mẫu'}
            </button>
          );})}
          {onGoAdmin&&<button onClick={onGoAdmin} style={{padding:'6px 10px',border:'1px solid #667eea',borderRadius:8,fontSize:11,fontWeight:600,cursor:'pointer',background:'transparent',color:'#a78bfa'}}>⚙️ Admin</button>}
          <button onClick={onLogout} style={{padding:'6px 10px',border:'1px solid #2e2e3a',borderRadius:8,fontSize:11,cursor:'pointer',background:'transparent',color:'#8888a0'}}>Đăng xuất</button>
        </div>
      </div>

      {/* HISTORY */}
      {view==='history'&&(
        <div style={{flex:1,overflow:'auto',padding:24}}>
          <div style={{fontSize:18,fontWeight:700,marginBottom:16}}>📁 Lịch sử CV của bạn</div>
          {cvList.length===0
            ?<div style={{textAlign:'center',color:'#8888a0',marginTop:60,fontSize:14}}>Chưa có CV nào. Hãy tạo CV đầu tiên!</div>
            :<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:14}}>
              {cvList.map(function(cv){return(
                <div key={cv.id} style={{background:'#18181f',border:'1px solid #2e2e3a',borderRadius:12,padding:16}}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{cv.name}</div>
                  <div style={{fontSize:11,color:'#8888a0',marginBottom:2}}>Mẫu: {(templates.find(function(t){return t.id===cv.templateId;})||{name:cv.templateId}).name}</div>
                  <div style={{fontSize:11,color:'#8888a0',marginBottom:12}}>{new Date(cv.createdAt).toLocaleDateString('vi-VN')}</div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={function(){setCvData(cv.data);setTplId(cv.templateId);setAccent(cv.data.accent||'#667eea');setView('create');}} style={{flex:1,padding:'7px 0',background:'#667eea',color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer'}}>✏️ Chỉnh sửa</button>
                    <button onClick={function(){onDeleteCv(cv.id);}} style={{padding:'7px 12px',background:'rgba(248,113,113,.15)',color:'#f87171',border:'1px solid #f8717133',borderRadius:8,fontSize:12,cursor:'pointer'}}>🗑</button>
                  </div>
                </div>
              );})}
            </div>
          }
        </div>
      )}

      {/* TEMPLATES GALLERY */}
      {view==='templates'&&(
        <div style={{flex:1,overflow:'auto',padding:24}}>
          <div style={{fontSize:18,fontWeight:700,marginBottom:16}}>🎨 Thư viện mẫu CV ({templates.length} mẫu)</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:14}}>
            {templates.map(function(t){return(
              <div key={t.id} onClick={function(){setTplId(t.id);setView('create');}} style={{background:'#18181f',border:'2px solid '+(tplId===t.id?'#667eea':'#2e2e3a'),borderRadius:12,padding:14,cursor:'pointer',transition:'border .2s'}}>
                <div style={{height:68,borderRadius:8,background:t.preview,marginBottom:10}}></div>
                <div style={{fontSize:13,fontWeight:700}}>{t.name}</div>
                <div style={{fontSize:11,color:'#8888a0',marginTop:2}}>{t.desc}</div>
                <div style={{fontSize:10,background:'rgba(102,126,234,.15)',color:'#a78bfa',padding:'2px 8px',borderRadius:10,display:'inline-block',marginTop:6,fontWeight:700}}>{t.tag}</div>
              </div>
            );})}
          </div>
        </div>
      )}

      {/* CREATE */}
      {view==='create'&&(
        <div style={{flex:1,display:'flex',overflow:'hidden'}}>
          {/* Sidebar */}
          <div style={{width:340,minWidth:280,background:'#18181f',borderRight:'1px solid #2e2e3a',display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0}}>
            <div style={{display:'flex',padding:'8px 10px 0',gap:2,borderBottom:'1px solid #2e2e3a',overflowX:'auto'}}>
              {tabs.map(function(t){return(
                <button key={t} onClick={function(){setActiveTab(t);}} style={{padding:'7px 9px',border:'none',background:'none',fontSize:11,fontWeight:600,cursor:'pointer',borderBottom:'2px solid '+(activeTab===t?'#667eea':'transparent'),color:activeTab===t?'#a78bfa':'#8888a0',whiteSpace:'nowrap',flexShrink:0}}>
                  {tabLabels[t]}
                </button>
              );})}
            </div>

            <div style={{flex:1,overflow:'auto',padding:14}}>
              {activeTab==='personal'&&(
                <div>
                  <div style={{marginBottom:12}}>
                    <label style={lbStyle}>Ảnh đại diện</label>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div onClick={function(){document.getElementById('av-in').click();}} style={{width:54,height:54,borderRadius:'50%',background:'#22222c',border:'2px dashed #444',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',flexShrink:0}}>
                        {cvData.avatar?<img src={cvData.avatar} style={{width:'100%',height:'100%',objectFit:'cover'}} alt="av"/>:<span style={{fontSize:20,color:'#888'}}>+</span>}
                      </div>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        <button onClick={function(){document.getElementById('av-in').click();}} style={btnSm}>Tải ảnh</button>
                        {cvData.avatar&&<button onClick={function(){upd('avatar',null);}} style={{...btnSm,background:'transparent',color:'#f87171',border:'1px solid #f87171'}}>Xoá</button>}
                      </div>
                    </div>
                    <input id="av-in" type="file" accept="image/*" style={{display:'none'}} onChange={handleAvatar}/>
                  </div>
                  {[['name','Họ và tên','Nguyễn Văn An'],['title','Chức danh','Frontend Developer'],['email','Email','an@email.com'],['phone','Điện thoại','0912 345 678'],['address','Địa chỉ','TP.HCM'],['linkedin','LinkedIn','linkedin.com/in/...'],['website','Website','github.com/...']].map(function(arr){var f=arr[0],lb=arr[1],ph=arr[2];return(
                    <div key={f} style={{marginBottom:10}}>
                      <label style={lbStyle}>{lb}</label>
                      <input value={cvData[f]||''} onChange={function(e){upd(f,e.target.value);}} placeholder={ph} style={inStyle}/>
                    </div>
                  );})}
                  <div style={{marginBottom:10}}>
                    <label style={lbStyle}>Tóm tắt bản thân</label>
                    <textarea value={cvData.summary||''} onChange={function(e){upd('summary',e.target.value);}} placeholder="Giới thiệu bản thân, thế mạnh, mục tiêu..." style={{...inStyle,minHeight:70,resize:'vertical',lineHeight:1.5}}/>
                  </div>
                </div>
              )}

              {activeTab==='experience'&&(
                <div>
                  <button onClick={addExp} style={{...btnSm,width:'100%',marginBottom:12}}>+ Thêm kinh nghiệm</button>
                  {cvData.exps.map(function(e){return(
                    <div key={e.id} style={{background:'#22222c',borderRadius:10,padding:12,marginBottom:10,position:'relative',border:'1px solid #2e2e3a'}}>
                      <button onClick={function(){delExp(e.id);}} style={{position:'absolute',top:8,right:8,background:'none',border:'none',color:'#f87171',cursor:'pointer',fontSize:18}}>×</button>
                      {[['company','Công ty','Tên công ty'],['pos','Vị trí','Chức vụ'],['from','Từ','MM/YYYY'],['to','Đến','Hiện tại']].map(function(arr){var f=arr[0],lb=arr[1],ph=arr[2];return(
                        <div key={f} style={{marginBottom:8}}>
                          <label style={lbStyle}>{lb}</label>
                          <input value={e[f]||''} onChange={function(ev){updExp(e.id,f,ev.target.value);}} placeholder={ph} style={inStyle}/>
                        </div>
                      );})}
                      <div style={{marginBottom:8}}>
                        <label style={lbStyle}>Mô tả</label>
                        <textarea value={e.desc||''} onChange={function(ev){updExp(e.id,'desc',ev.target.value);}} placeholder="Mô tả công việc, thành tích..." style={{...inStyle,minHeight:55,resize:'vertical'}}/>
                      </div>
                    </div>
                  );})}
                </div>
              )}

              {activeTab==='education'&&(
                <div>
                  <button onClick={addEdu} style={{...btnSm,width:'100%',marginBottom:12}}>+ Thêm học vấn</button>
                  {cvData.edus.map(function(e){return(
                    <div key={e.id} style={{background:'#22222c',borderRadius:10,padding:12,marginBottom:10,position:'relative',border:'1px solid #2e2e3a'}}>
                      <button onClick={function(){delEdu(e.id);}} style={{position:'absolute',top:8,right:8,background:'none',border:'none',color:'#f87171',cursor:'pointer',fontSize:18}}>×</button>
                      {[['school','Trường','Tên trường'],['major','Ngành','Ngành học'],['year','Năm','2018-2022'],['gpa','GPA','3.6/4.0']].map(function(arr){var f=arr[0],lb=arr[1],ph=arr[2];return(
                        <div key={f} style={{marginBottom:8}}>
                          <label style={lbStyle}>{lb}</label>
                          <input value={e[f]||''} onChange={function(ev){updEdu(e.id,f,ev.target.value);}} placeholder={ph} style={inStyle}/>
                        </div>
                      );})}
                    </div>
                  );})}
                </div>
              )}

              {activeTab==='skills'&&(
                <div>
                  <label style={lbStyle}>Kỹ năng chuyên môn</label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
                    {cvData.skills.map(function(s,i){return(
                      <span key={i} style={{background:'rgba(102,126,234,.15)',color:'#a78bfa',fontSize:12,padding:'4px 10px',borderRadius:20,display:'flex',alignItems:'center',gap:5}}>
                        {s.name}<button onClick={function(){delSkill(i);}} style={{background:'none',border:'none',color:'#a78bfa',cursor:'pointer',fontSize:13,padding:0}}>×</button>
                      </span>
                    );})}
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <input value={skillInput} onChange={function(e){setSkillInput(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter')addSkill();}} placeholder="Thêm kỹ năng..." style={{...inStyle,flex:1}}/>
                    <button onClick={addSkill} style={btnSm}>+</button>
                  </div>
                  <div style={{marginTop:16}}>
                    <label style={lbStyle}>Ngôn ngữ</label>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
                      {cvData.langs.map(function(l,i){return(
                        <span key={i} style={{background:'rgba(124,111,250,.15)',color:'#a78bfa',fontSize:12,padding:'4px 10px',borderRadius:20,display:'flex',alignItems:'center',gap:5}}>
                          {l.lang} · {l.level}<button onClick={function(){delLang(i);}} style={{background:'none',border:'none',color:'#a78bfa',cursor:'pointer',fontSize:13,padding:0}}>×</button>
                        </span>
                      );})}
                    </div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      <input value={langInput} onChange={function(e){setLangInput(e.target.value);}} placeholder="Ngôn ngữ" style={{...inStyle,flex:1,minWidth:80}}/>
                      <select value={langLevel} onChange={function(e){setLangLevel(e.target.value);}} style={{...inStyle,width:110}}>
                        {['Cơ bản','Giao tiếp','Thành thạo','Bản ngữ'].map(function(o){return <option key={o}>{o}</option>;})}
                      </select>
                      <button onClick={addLang} style={btnSm}>+</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab==='design'&&(
                <div>
                  <label style={lbStyle}>Mẫu CV ({templates.length} mẫu)</label>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
                    {templates.map(function(t){return(
                      <div key={t.id} onClick={function(){setTplId(t.id);}} style={{border:'2px solid '+(tplId===t.id?'#667eea':'#2e2e3a'),borderRadius:10,padding:10,cursor:'pointer',background:tplId===t.id?'rgba(102,126,234,.08)':'transparent'}}>
                        <div style={{height:46,borderRadius:6,background:t.preview,marginBottom:6}}></div>
                        <div style={{fontSize:11,fontWeight:700}}>{t.name}</div>
                        <div style={{fontSize:10,color:'#8888a0'}}>{t.tag}</div>
                      </div>
                    );})}
                  </div>
                  <label style={lbStyle}>Màu sắc</label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
                    {ACCENTS.map(function(c){return(
                      <div key={c} onClick={function(){setAccent(c);}} style={{width:26,height:26,borderRadius:'50%',background:c,cursor:'pointer',border:'3px solid '+(accent===c?'#fff':'transparent'),transform:accent===c?'scale(1.2)':'scale(1)',transition:'transform .15s'}}></div>
                    );})}
                  </div>
                  <label style={lbStyle}>Zoom preview</label>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <input type="range" min="0.4" max="1" step="0.05" value={zoom} onChange={function(e){setZoom(parseFloat(e.target.value));}} style={{flex:1,accentColor:'#667eea'}}/>
                    <span style={{fontSize:12,color:'#a78bfa',minWidth:34}}>{Math.round(zoom*100)}%</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{padding:'12px 14px',borderTop:'1px solid #2e2e3a',display:'flex',gap:8}}>
              <button onClick={save} disabled={saving} style={{flex:1,padding:10,background:saved?'#16a34a':'linear-gradient(135deg,#667eea,#764ba2)',color:'#fff',border:'none',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>
                {saving?'Đang lưu...':saved?'✅ Đã lưu!':'💾 Lưu CV'}
              </button>
              <button onClick={function(){window.print();}} style={{padding:'10px 14px',background:'#22222c',color:'#a78bfa',border:'1px solid #2e2e3a',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>⬇ PDF</button>
            </div>
          </div>

          {/* Preview */}
          <div style={{flex:1,overflow:'auto',background:'#0f0f13',padding:20,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{fontSize:11,color:'#8888a0',marginBottom:10,alignSelf:'flex-start'}}>Xem trước · {tpl.name} · {Math.round(zoom*100)}%</div>
            <div style={{transformOrigin:'top center',transform:'scale('+zoom+')',marginBottom:zoom<0.8?'-'+(Math.round((1-zoom)*500))+'px':'0px'}}>
              <div style={{width:'210mm'}} dangerouslySetInnerHTML={{__html:html}}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ ADMIN ============
function AdminPage({user,users,cvList,templates,onDeleteCv,onDeleteUser,onAddTemplate,onLogout,onGoApp}){
  var [tab,setTab]=useState('dashboard');
  var [nm,setNm]=useState('');
  var [tg,setTg]=useState('');
  var [ds,setDs]=useState('');
  var [pv,setPv]=useState('#667eea');
  var [ht,setHt]=useState('');
  var [msg,setMsg]=useState('');

  var stats={users:users.length,cvs:cvList.length,templates:templates.length,today:cvList.filter(function(c){return Date.now()-c.createdAt<86400000;}).length};

  function handleAdd(){
    if(!nm||!ht){setMsg('Vui lòng nhập tên và HTML mẫu!');return;}
    onAddTemplate({id:'custom-'+Date.now(),name:nm,tag:tg||'🆕 Custom',desc:ds||'Mẫu tùy chỉnh',preview:pv,category:'custom',render:function(){return ht;}});
    setNm('');setTg('');setDs('');setHt('');
    setMsg('✅ Đã thêm mẫu thành công!');setTimeout(function(){setMsg('');},2500);
  }

  var adminTabs={dashboard:'📊 Dashboard',users:'👥 Users',cvs:'📄 CVs',templates:'🎨 Mẫu CV'};

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#0f0f13',color:'#f0f0f5'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 20px',background:'#18181f',borderBottom:'1px solid #2e2e3a',flexShrink:0,flexWrap:'wrap',gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:30,height:30,background:'linear-gradient(135deg,#f39c12,#e74c3c)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>⚙️</div>
          <div><div style={{fontSize:14,fontWeight:700}}>Admin Dashboard</div><div style={{fontSize:10,color:'#f39c12'}}>Quản lý hệ thống</div></div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onGoApp} style={{padding:'6px 12px',border:'1px solid #667eea',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',background:'transparent',color:'#a78bfa'}}>✏️ Tạo CV</button>
          <button onClick={onLogout} style={{padding:'6px 12px',border:'1px solid #2e2e3a',borderRadius:8,fontSize:12,cursor:'pointer',background:'transparent',color:'#8888a0'}}>Đăng xuất</button>
        </div>
      </div>

      <div style={{display:'flex',padding:'10px 20px 0',gap:4,background:'#18181f',borderBottom:'1px solid #2e2e3a'}}>
        {Object.entries(adminTabs).map(function(arr){var k=arr[0],v=arr[1];return(
          <button key={k} onClick={function(){setTab(k);}} style={{padding:'8px 14px',border:'none',background:'none',fontSize:12.5,fontWeight:600,cursor:'pointer',borderBottom:'2px solid '+(tab===k?'#f39c12':'transparent'),color:tab===k?'#f39c12':'#8888a0'}}>{v}</button>
        );})}
      </div>

      <div style={{flex:1,overflow:'auto',padding:22}}>
        {tab==='dashboard'&&(
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12,marginBottom:22}}>
              {[['👥','Tổng users',stats.users,'#667eea'],['📄','Tổng CV',stats.cvs,'#27ae60'],['🎨','Mẫu CV',stats.templates,'#e91e8c'],['🆕','CV hôm nay',stats.today,'#f39c12']].map(function(arr){return(
                <div key={arr[1]} style={{background:'#18181f',border:'1px solid '+arr[3]+'33',borderRadius:12,padding:18}}>
                  <div style={{fontSize:26}}>{arr[0]}</div>
                  <div style={{fontSize:26,fontWeight:800,color:arr[3],marginTop:4}}>{arr[2]}</div>
                  <div style={{fontSize:12,color:'#8888a0'}}>{arr[1]}</div>
                </div>
              );})}
            </div>
            <div style={{background:'#18181f',border:'1px solid #2e2e3a',borderRadius:12,padding:18}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>📈 CV gần đây</div>
              {cvList.slice(0,6).map(function(cv){return(
                <div key={cv.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #2e2e3a',fontSize:12}}>
                  <span><b>{cv.name}</b> <span style={{color:'#8888a0'}}>bởi {cv.userName}</span></span>
                  <span style={{color:'#8888a0'}}>{new Date(cv.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              );})}
              {cvList.length===0&&<div style={{color:'#8888a0',fontSize:13}}>Chưa có CV nào.</div>}
            </div>
          </div>
        )}

        {tab==='users'&&(
          <div>
            <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>👥 Quản lý Users ({users.length})</div>
            <div style={{background:'#18181f',border:'1px solid #2e2e3a',borderRadius:12,overflow:'hidden'}}>
              {users.map(function(u,i){return(
                <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 18px',borderBottom:i<users.length-1?'1px solid #2e2e3a':'none',flexWrap:'wrap',gap:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:u.role==='admin'?'linear-gradient(135deg,#f39c12,#e74c3c)':'linear-gradient(135deg,#667eea,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff',flexShrink:0}}>{(u.name||'U')[0]}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>{u.name} {u.role==='admin'&&<span style={{fontSize:10,background:'rgba(243,156,18,.2)',color:'#f39c12',padding:'2px 7px',borderRadius:10,fontWeight:700}}>ADMIN</span>}</div>
                      <div style={{fontSize:11,color:'#8888a0'}}>{u.email} · CV: {cvList.filter(function(c){return c.userId===u.id;}).length}</div>
                    </div>
                  </div>
                  {u.role!=='admin'&&<button onClick={function(){onDeleteUser(u.id);}} style={{padding:'5px 12px',background:'rgba(248,113,113,.12)',color:'#f87171',border:'1px solid #f8717133',borderRadius:8,fontSize:12,cursor:'pointer'}}>🗑 Xoá</button>}
                </div>
              );})}
            </div>
          </div>
        )}

        {tab==='cvs'&&(
          <div>
            <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>📄 Quản lý CVs ({cvList.length})</div>
            {cvList.length===0?<div style={{color:'#8888a0',fontSize:13}}>Chưa có CV nào.</div>:(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
                {cvList.map(function(cv){return(
                  <div key={cv.id} style={{background:'#18181f',border:'1px solid #2e2e3a',borderRadius:12,padding:16}}>
                    <div style={{fontSize:13,fontWeight:700}}>{cv.name}</div>
                    <div style={{fontSize:11,color:'#8888a0',marginTop:3}}>User: {cv.userName}</div>
                    <div style={{fontSize:11,color:'#8888a0'}}>Mẫu: {(templates.find(function(t){return t.id===cv.templateId;})||{name:cv.templateId}).name}</div>
                    <div style={{fontSize:11,color:'#8888a0',marginBottom:10}}>{new Date(cv.createdAt).toLocaleDateString('vi-VN')}</div>
                    <button onClick={function(){onDeleteCv(cv.id);}} style={{padding:'5px 12px',background:'rgba(248,113,113,.12)',color:'#f87171',border:'1px solid #f8717133',borderRadius:8,fontSize:12,cursor:'pointer'}}>🗑 Xoá CV</button>
                  </div>
                );})}
              </div>
            )}
          </div>
        )}

        {tab==='templates'&&(
          <div>
            <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🎨 Quản lý mẫu ({templates.length} mẫu)</div>
            <div style={{background:'#18181f',border:'1px solid #2e2e3a',borderRadius:12,padding:20,marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:14,color:'#a78bfa'}}>➕ Thêm mẫu CV mới</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                <div><label style={lbStyle}>Tên mẫu *</label><input value={nm} onChange={function(e){setNm(e.target.value);}} placeholder="VD: Executive Dark" style={inStyle}/></div>
                <div><label style={lbStyle}>Tag hiển thị</label><input value={tg} onChange={function(e){setTg(e.target.value);}} placeholder="VD: 🖤 Executive" style={inStyle}/></div>
              </div>
              <div style={{marginBottom:10}}><label style={lbStyle}>Mô tả ngắn</label><input value={ds} onChange={function(e){setDs(e.target.value);}} placeholder="Mô tả mẫu CV..." style={inStyle}/></div>
              <div style={{marginBottom:10}}><label style={lbStyle}>Màu preview</label><input value={pv} onChange={function(e){setPv(e.target.value);}} placeholder="linear-gradient(135deg,#333,#555)" style={inStyle}/></div>
              <div style={{marginBottom:14}}><label style={lbStyle}>HTML Template *</label><textarea value={ht} onChange={function(e){setHt(e.target.value);}} placeholder={'<div style="padding:40px;background:#fff">\n  <h1>Tên CV</h1>\n  <!-- Nội dung CV -->\n</div>'} style={{...inStyle,minHeight:140,resize:'vertical',fontFamily:'monospace',fontSize:12}}/></div>
              {msg&&<div style={{fontSize:12,color:msg.startsWith('✅')?'#34d399':'#f87171',marginBottom:10}}>{msg}</div>}
              <button onClick={handleAdd} style={{padding:'10px 22px',background:'linear-gradient(135deg,#667eea,#764ba2)',color:'#fff',border:'none',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>✅ Thêm mẫu vào hệ thống</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:12}}>
              {templates.map(function(t){return(
                <div key={t.id} style={{background:'#18181f',border:'1px solid #2e2e3a',borderRadius:10,padding:12}}>
                  <div style={{height:52,borderRadius:8,background:t.preview,marginBottom:8}}></div>
                  <div style={{fontSize:12,fontWeight:700}}>{t.name}</div>
                  <div style={{fontSize:10,color:'#8888a0',marginTop:2}}>{t.tag}</div>
                  {t.category==='custom'&&<div style={{fontSize:10,color:'#34d399',marginTop:4}}>🆕 Custom</div>}
                </div>
              );})}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
