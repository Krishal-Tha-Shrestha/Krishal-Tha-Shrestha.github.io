document.documentElement.classList.add("js");

const nav=document.querySelector("nav"),menu=document.querySelector(".menu");
menu?.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menu.setAttribute("aria-expanded",String(open));
});
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>{
  nav.classList.remove("open");
  menu?.setAttribute("aria-expanded","false");
}));
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded","false");
  }
});

const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{
  if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";}
},{passive:true});

// Scroll reveal
const revealItems=document.querySelectorAll(".section-main,.section-meta,.project-card,.contact-box");
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(reduceMotion){
  revealItems.forEach(el=>el.classList.add("visible"));
}else{
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },{threshold:.08});
  revealItems.forEach((el,i)=>{el.style.transitionDelay=Math.min(i*.035,.2)+"s";observer.observe(el);});
}

// Short system boot. It never blocks the page for long.
const boot=document.querySelector(".boot-screen");
if(boot){
  const progress=boot.querySelector(".boot-progress i");
  const enter=boot.querySelector(".boot-enter");
  const logs=[...boot.querySelectorAll(".boot-log p")];
  logs.forEach((el,i)=>{el.style.opacity="0";el.style.transform="translateX(-6px)";el.style.transition="opacity .25s ease,transform .25s ease";setTimeout(()=>{el.style.opacity="1";el.style.transform="translateX(0)"},180+i*180)});
  requestAnimationFrame(()=>{if(progress)progress.style.width="100%";});
  setTimeout(()=>enter?.classList.add("show"),900);
  setTimeout(()=>boot.classList.add("done"),1450);
}


// Interactive hero system map
const systemMap = document.querySelector(".system-map");
const mapVector = document.querySelector("#mapVector");
if (systemMap && !reduceMotion) {
  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));

  systemMap.addEventListener("pointerenter", () => {
    systemMap.classList.add("is-hovered");
  });

  systemMap.addEventListener("pointerleave", () => {
    systemMap.classList.remove("is-hovered");
    systemMap.style.setProperty("--px","0px");
    systemMap.style.setProperty("--py","0px");
    systemMap.style.setProperty("--rx","0deg");
    systemMap.style.setProperty("--ry","0deg");
    if (mapVector) mapVector.textContent = "00 / 00";
  });

  systemMap.addEventListener("pointermove", e => {
    const r = systemMap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;

    const px = clamp(x * 18,-10,10);
    const py = clamp(y * 12,-8,8);
    const rx = clamp(-y * 4,-3,3);
    const ry = clamp(x * 5,-4,4);

    systemMap.style.setProperty("--px",`${px}px`);
    systemMap.style.setProperty("--py",`${py}px`);
    systemMap.style.setProperty("--rx",`${rx}deg`);
    systemMap.style.setProperty("--ry",`${ry}deg`);

    if (mapVector) {
      const vx = Math.round(x * 99).toString().padStart(2,"0");
      const vy = Math.round(-y * 99).toString().padStart(2,"0");
      mapVector.textContent = `${vx} / ${vy}`;
    }
  }, {passive:true});
}
