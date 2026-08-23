document.addEventListener("DOMContentLoaded",()=>{
const products=[
["maroc","MAROC","images/back-morocco.jpg","Une pièce inspirée des motifs et de l'identité visuelle du Maroc."],
["japon","JAPON","images/back-japan.jpg","Une pièce inspirée de l'esthétique japonaise et de ses contrastes."],
["italie","ITALIE","images/back-italy.jpg","Une pièce inspirée du style et de la culture italienne."],
["albanie","ALBANIE","images/back-albania.jpg","Une pièce inspirée de l'héritage et des symboles albanais."],
["algerie","ALGÉRIE","images/back-algeria-zellige.jpg","Une pièce inspirée des formes et couleurs de l'Algérie."],
["jordanie","JORDANIE","images/back-jordan.jpg","Une pièce inspirée des paysages et de la culture jordanienne."],
["madagascar","MADAGASCAR","images/back-madagascar.jpg","Une pièce inspirée de l'identité unique de Madagascar."],
["turquie","TURQUIE","images/back-turkey.jpg","Une pièce inspirée des motifs et de l'héritage turc."],
["rdc","R.D. CONGO","images/back-rdcongo.jpg","Une pièce inspirée de la culture et de l'énergie de la RDC."],
["reunion","LA RÉUNION","images/back-reunion.jpg","Une pièce inspirée de l'île et de ses influences culturelles."]
];
const container=document.querySelector("#reservation-products"),preview=document.querySelector("#selected-preview"),name=document.querySelector("#selected-name"),desc=document.querySelector("#selected-description"),hidden=document.querySelector("#selected-product"),form=document.querySelector("#reservation-form"),success=document.querySelector("#reservation-success"),error=document.querySelector("#reservation-error");
let selected=null;
const params=new URLSearchParams(location.search);
products.forEach((p,i)=>{const card=document.createElement("article");card.className="reservation-product";card.dataset.id=p[0];card.innerHTML=`<img src="${p[2]}" alt="BANKSO ${p[1]}"><span class="reserve-label">RÉSERVER</span><div class="product-data"><small>${String(i+1).padStart(2,"0")} · DROP 001</small><h3>${p[1]}</h3><p>ÉDITION LIMITÉE</p></div>`;card.onclick=()=>select(p,card);container.appendChild(card); if(params.get('product')===p[0]) setTimeout(()=>select(p,card),0)});
function select(p,card){selected=p;document.querySelectorAll(".reservation-product").forEach(x=>x.classList.remove("selected"));card.classList.add("selected");preview.innerHTML=`<img src="${p[2]}" alt="Aperçu ${p[1]}">`;name.textContent=p[1];desc.textContent=p[3];hidden.value=p[1];document.querySelector(".reservation-card").scrollIntoView({behavior:"smooth",block:"nearest"})}
form.addEventListener("submit",async e=>{e.preventDefault();success.classList.remove("show");error.classList.remove("show");if(!selected){error.textContent="Choisis d'abord une pièce.";error.classList.add("show");return}
const data=Object.fromEntries(new FormData(form).entries());if(data.website){return}
const reservations=JSON.parse(localStorage.getItem("banksoReservations")||"[]");reservations.push({...data,date:new Date().toISOString()});localStorage.setItem("banksoReservations",JSON.stringify(reservations));
const url=window.BANKSO_CONFIG?.GOOGLE_SCRIPT_URL;
if(!url){success.textContent="Demande enregistrée sur cet appareil. Pour recevoir les demandes, ajoute l'URL Google Apps Script dans js/config.js.";success.classList.add("show");return}
try{await fetch(url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:new URLSearchParams({type:"reservation",product:data.product,size:data.size,name:data.name,email:data.email,phone:data.phone||"",message:data.message||"",source:location.href})});success.innerHTML='<span class="reservation-success-icon">✓</span><span><strong>RÉSERVATION ENVOYÉE</strong><small>Merci ! Ta demande de réservation a bien été reçue. Nous allons vérifier la disponibilité de l’article et te contacter par e-mail pour confirmer ta réservation.</small></span>';success.classList.add("show");success.scrollIntoView({behavior:"smooth",block:"center"});form.reset();hidden.value=selected[1]}catch(err){error.textContent="Impossible d'envoyer la demande. Vérifie ta connexion et réessaie.";error.classList.add("show")}})});
