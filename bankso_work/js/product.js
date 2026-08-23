document.addEventListener('DOMContentLoaded',()=>{
  const id=new URLSearchParams(location.search).get('id')||'maroc';
  const p=window.BANKSO_PRODUCTS.findById(id);
  const root=document.querySelector('#product-root');

  if(!p){
    root.innerHTML='<section class="empty-product"><h1>ARTICLE INTROUVABLE</h1><a class="btn btn-primary" href="collection.html">RETOUR À LA COLLECTION</a></section>';
    return;
  }

  root.innerHTML=`
  <section class="product-page">
    <div class="product-image-wrap" data-reveal>
      <span class="product-number">${p.number} / DROP 001</span>
      <img src="${p.image}" alt="BANKSO ${p.name}">
    </div>
    <div class="product-info" data-reveal>
      <p class="eyebrow"><span></span>${p.country}</p>
      <h1>${p.name}</h1>
      <p class="tag">DROP 001 · ÉDITION LIMITÉE</p>
      <p class="description">${p.description}</p>
      <p class="detail">${p.detail}</p>

      <div class="price-line">
        <span>PRIX</span><strong>24,99 €</strong>
      </div>

      <div class="sizes">
        <span>CHOISIS TA TAILLE</span>
        <div>${p.sizes.map(s=>`<button type="button" data-size="${s}">${s}</button>`).join('')}</div>
      </div>

      <div class="quantity-block">
        <span>QUANTITÉ</span>
        <div class="quantity-control">
          <button type="button" id="qty-minus" aria-label="Diminuer la quantité">−</button>
          <strong id="qty">1</strong>
          <button type="button" id="qty-plus" aria-label="Augmenter la quantité">+</button>
        </div>
      </div>

      <div class="product-total">
        <span>TOTAL</span><strong id="product-total">24,99 €</strong>
      </div>

      <div class="product-actions">
        <button class="btn btn-primary" id="reserve" type="button">RÉSERVER CET ARTICLE <i class="fa-solid fa-arrow-right"></i></button>
        <button class="btn btn-outline" id="bag" type="button">AJOUTER À MA SÉLECTION <i class="fa-solid fa-plus"></i></button>
      </div>
      <p class="stock-note"><i class="fa-solid fa-circle"></i> Demande de réservation · aucune commande ni paiement immédiat</p>
    </div>
  </section>`;

  let size='';
  let quantity=1;

  const qtyEl=document.querySelector('#qty');
  const totalEl=document.querySelector('#product-total');

  function money(n){return n.toFixed(2).replace('.',',')+' €';}
  function updateQuantity(){
    qtyEl.textContent=quantity;
    totalEl.textContent=money(quantity*24.99);
  }

  document.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{
    size=b.dataset.size;
    document.querySelectorAll('[data-size]').forEach(x=>x.classList.remove('chosen'));
    b.classList.add('chosen');
  });

  document.querySelector('#qty-minus').onclick=()=>{
    quantity=Math.max(1,quantity-1);
    updateQuantity();
  };
  document.querySelector('#qty-plus').onclick=()=>{
    quantity=Math.min(20,quantity+1);
    updateQuantity();
  };

  function getBag(){
    try{
      const b=JSON.parse(localStorage.getItem('banksoBag')||'[]');
      return Array.isArray(b)?b:[];
    }catch(e){return [];}
  }

  function addUnits(){
    if(!size){
      alert('Choisis une taille avant de continuer.');
      return null;
    }
    const bag=getBag();
    const key=p.id+'-'+size;
    for(let i=0;i<quantity;i++){
      bag.push({key:p.id+'-'+size+'-'+Date.now()+'-'+i,product:p.id,name:p.name,size,image:p.image});
    }
    localStorage.setItem('banksoBag',JSON.stringify(bag));
    document.querySelectorAll('.reservation-count').forEach(c=>c.textContent=bag.length);
    return bag;
  }

  document.querySelector('#reserve').onclick=()=>{
    const bag=addUnits();
    if(bag) location.href='reservation.html';
  };

  document.querySelector('#bag').onclick=()=>{
    const bag=addUnits();
    if(bag) location.href='cart.html';
  };
});