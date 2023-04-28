(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))a(l);new MutationObserver(l=>{for(const s of l)if(s.type==="childList")for(const w of s.addedNodes)w.tagName==="LINK"&&w.rel==="modulepreload"&&a(w)}).observe(document,{childList:!0,subtree:!0});function m(l){const s={};return l.integrity&&(s.integrity=l.integrity),l.referrerPolicy&&(s.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?s.credentials="include":l.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(l){if(l.ep)return;l.ep=!0;const s=m(l);fetch(l.href,s)}})();const $=(()=>{let M=60,u=6,m="0",a=670,l=170,s,w,x,h,y,c=new Image,g,v,b,i=(()=>{let t=50;return{size:t,width:88,height:0,x:20,y:l-t,sx:0,sy:0,position:0,offset:1338,move:void 0,defaultY:l-t,minY:50}})(),r={count:3,speed:7,sx:160,width:100,height:35,y:{top:20,bottom:40},interval:300,skies:[]},n={width:a,height:l,x:0,y:l-20,sx:0,sy:100},d={cactuses:[],count:3,height:75,y:{small:120,large:100},interval:[250,300,350,400,450],small:[{sx:440,width:42},{sx:480,width:70},{sx:580,width:74}],large:[{sx:648,width:56},{sx:648,width:106},{sx:754,width:50},{sx:852,width:52},{sx:852,width:100}]},z=t=>`/dinosaur-game/${t}`,L=()=>{h.clearRect(0,0,a,l)},Y=()=>{let t=+m+(g?1:0);m=t.toString().padStart(t.toString().length+3,"0"),h.font="20px Poppins",h.fillText(m,a-100,25)},I=()=>{L(),P(),T(),R(),q(),Y(),D()},O=()=>{y=setInterval(I,1e3/M)},k=()=>{y&&(clearInterval(y),y=null)},P=()=>{n.sx=n.sx>=s?0:n.sx+u,h.drawImage(c,n.sx,n.sy,n.width,n.height,n.x,n.y,n.width,80);let t=s-n.sx;if(t>a)return;let e=a-t;h.drawImage(c,0,n.sy,e,n.height,t,n.y,e,80)},C=()=>d.interval[Math.floor(Math.random()*d.interval.length)],R=()=>{for(let t=0;t<d.count;t++){let e=d.cactuses[t];if(e)e.x===-e.width?e=null:e.x=Math.max(e.x-u,-e.width);else{let o=d.cactuses[t===0?d.cactuses.length-1:t-1],f=t===0&&!g?0:C(),p=Math.floor(Math.random()*2+1)===1?"small":"large",S=d[p],U=S[Math.floor(Math.random()*S.length)],W=d.y[p];e={size:p,y:W,x:(o?o.x:a)+f,...U}}d.cactuses[t]=e,e&&h.drawImage(c,e.sx,0,e.width,100,e.x,e.y,e.width,d.height)}};const E=(t,e)=>t.left<e.right&&t.right>e.left&&t.top<e.bottom&&t.bottom>e.top;let D=()=>{d.cactuses.some(e=>{let o=20;if(!e)return;let f={top:e.y+o,left:e.x,bottom:e.y+75,right:e.x+e.width},p={top:i.y,left:i.x+o,bottom:i.y+i.size,right:i.x+i.size-o};return E(p,f)})&&(K(),N(),k())},H=()=>{m="0",r.skies=[],d.cactuses=[],i={...i,y:i.defaultY,position:0,move:void 0,time:void 0},I(),O()},K=()=>{let t=392,e=30,o=(a-t+100)/2,f=(l-e+10)/2;h.drawImage(c,950,24,t,e,o,f,t-100,e-10),x.addEventListener("click",H,{once:!0})},N=()=>{let t=70,e=64,o=(a-t)/2,f=(l-e)/2+50;h.drawImage(c,0,0,t,e,o,f,40,40)},T=()=>{for(let t=0;t<r.count;t++){let e=r.skies[t];if(e)e.x===-r.width?e=null:e.x=Math.max(e.x-u,-r.width);else{let o=r.skies[t===0?r.skies.length-1:t-1],f=(o==null?void 0:o.position)==="top"?"bottom":"top";e={x:(o?o.x:a)+r.interval,y:r.y[f],position:f}}r.skies[t]=e,e&&h.drawImage(c,r.sx,0,r.width,r.height,e.x,e.y,r.width,r.height)}},q=()=>{let t=Date.now(),e=i.position;g&&!i.position&&(i.position=2),i.time||(i.time=t),i.y!==i.defaultY?e=0:t-i.time>=100&&(i.time=t,e=i.position===2?3:2),i.sx=i.offset+i.width*e,i.position=e,v&&(i.move!=="down"&&(i.y<=0||b&&i.y<=i.minY)?i.move="down":i.move!=="up"&&i.y===i.defaultY&&(i.move="up"),i.y=i.move==="up"?Math.max(i.y-u,0):Math.min(i.y+u,i.defaultY),i.y===i.defaultY&&(v=!1,i.move=void 0)),h.drawImage(c,i.sx,i.sy,i.width,i.height,i.x,i.y,i.size,i.size)};const A=t=>{if(t.code==="Space"||t.code==="ArrowUp"){if(b=!1,v=!0,window.addEventListener("keyup",()=>b=!0,{once:!0}),g)return;g=!0,O()}};return{init:()=>{x=document.querySelector("canvas"),x.width=a,x.height=l;let t=x.getContext("2d");t&&(h=t),c.src=z("sprite.png"),c.onload=()=>{s=c.width,w=c.height,i.height=w-30,I()},window.addEventListener("keydown",A)}}})();$.init();