document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('#bag-items');
  const count=document.querySelector('#bag-count');

  function getBag(){
    try{
      const b=JSON.parse(localStorage.getItem('banksoBag')||'[]');
      return Array.isArray(b)?b:[];
    }catch(e){return [];}
  }
  function saveBag(b){localStorage.setItem('banksoBag',JSON.stringify(b));}

  function groupItems(items){
    const grouped=[];
    const map=new Map();
    items.forEach(x=>{
      const key=String(x.product||x.name)+'||'+String(x.size||'');
      if(map.has(key)){
        grouped[map.get(key)].items.push(x);
        grouped[map.get(key)].quantity++;
      }else{
        map.set(key,grouped.length);
        grouped.push({first:x,items:[x],quantity:1,key});
      }
    });
    return grouped;
  }

  function money(n){return n.toFixed(2).replace('.',',')+' €';}

  function render(){
    const items=getBag();
    const grouped=groupItems(items);
    count.textContent=`${items.length} ${items.length>1?'ARTICLES':'ARTICLE'}`;
    document.querySelectorAll('.reservation-count').forEach(c=>c.textContent=items.length);

    root.innerHTML=items.length ? grouped.map((g,i)=>`
      <article class="bag-item" data-group="${i}">
        <img src="${g.first.image}" alt="${g.first.name}">
        <div class="bag-main">
          <small>DROP 001 · TAILLE ${g.first.size}</small>
          <h2>${g.first.name}</h2>
          <div class="bag-price">24,99 € / T-SHIRT · <strong>${money(g.quantity*24.99)}</strong></div>
          <div class="bag-quantity">
            <span>QUANTITÉ</span>
            <div class="bag-quantity-control">
              <button type="button" class="minus" aria-label="Diminuer">−</button>
              <strong>${g.quantity}</strong>
              <button type="button" class="plus" aria-label="Augmenter">+</button>
            </div>
          </div>
          <button class="remove" type="button">RETIRER</button>
        </div>
      </article>
    `).join('') : `
      <div class="empty-bag">
        <i class="fa-solid fa-bag-shopping"></i>
        <h2>TA SÉLECTION EST VIDE</h2>
        <a class="btn btn-outline" href="collection.html">VOIR LA COLLECTION</a>
      </div>`;

    root.querySelectorAll('.bag-item').forEach((card)=>{
      const g=grouped[Number(card.dataset.group)];
      card.querySelector('.plus').onclick=()=>{
        const b=getBag();
        const sample=g.first;
        b.push({key:sample.product+'-'+sample.size+'-'+Date.now(),product:sample.product,name:sample.name,size:sample.size,image:sample.image});
        saveBag(b); render();
      };
      card.querySelector('.minus').onclick=()=>{
        const b=getBag();
        const idx=b.findIndex(x=>String(x.product||x.name)+'||'+String(x.size||'')===g.key);
        if(idx>=0)b.splice(idx,1);
        saveBag(b); render();
      };
      card.querySelector('.remove').onclick=()=>{
        const b=getBag().filter(x=>String(x.product||x.name)+'||'+String(x.size||'')!==g.key);
        saveBag(b); render();
      };
    });
  }

  render();
  document.querySelector('#clear').onclick=()=>{
    localStorage.removeItem('banksoBag');
    render();
  };
});