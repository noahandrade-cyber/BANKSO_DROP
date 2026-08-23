document.addEventListener('DOMContentLoaded',()=>{
 const header=document.querySelector('.site-header'),toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-header nav');
 const update=()=>header&&header.classList.toggle('scrolled',scrollY>20); addEventListener('scroll',update,{passive:true}); update();
 if(toggle&&nav) toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);toggle.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'});
 const reservations=JSON.parse(localStorage.getItem('banksoReservations')||'[]');
 document.querySelectorAll('.reservation-count').forEach(c=>c.textContent=reservations.length);
 const reveal=()=>document.querySelectorAll('[data-reveal]').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight*.9)el.classList.add('revealed')}); addEventListener('scroll',reveal,{passive:true}); reveal();
});
