var role = "owner", curCat = "All", active = null, slideIndex = 0, saved = [];
var uploadPhotos = [];
var profile = { name: "Dustin Stacks", city: "Tempe, AZ", contact: "dustinstack8181@gmail.com", avatar: "" };

var items = [
  {
    id: 1,
    title: "1921 Morgan Silver Dollar",
    cat: "Coins & Currency",
    price: 48,
    images: ["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80"],
    seller: "Dustin Stacks",
    desc: "Sharp strike, original mint luster in capsule.",
    condition: "Like New",
    nego: true,
    comments: ["Is this still available for meetup in Tempe? - Mark"]
  },
  {
    id: 2,
    title: "Kicker Solo-Baric L7 Subwoofer",
    cat: "Electronics & Audio",
    price: 250,
    images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80"],
    seller: "Dustin Stacks",
    desc: "Custom tuned port box, tested clean.",
    condition: "Good",
    nego: false,
    comments: []
  }
];

function openM(id){document.getElementById(id).classList.add('active');}
function closeM(id){document.getElementById(id).classList.remove('active');}

function clickPost(){
  if(role==='guest'){
    alert("Posting is locked to approved members.");
    openM('profileModal');
  } else {
    openM('chooseModal');
  }
}

function setRole(r){
  role = r;
  document.getElementById('roleBadge').innerText = r.toUpperCase();
  closeM('menuModal');
  render();
}

function addLike(){
  var el = document.getElementById('siteLikes');
  el.innerText = parseInt(el.innerText) + 1;
}

function setCat(b, c){
  curCat = c;
  document.querySelectorAll('.filters .pill').forEach(function(x){x.classList.remove('active');});
  b.classList.add('active');
  render();
}

function filterMine(){
  curCat = "Mine";
  document.querySelectorAll('.filters .pill').forEach(function(x){x.classList.remove('active');});
  render();
}

function handleIncomingFiles(files){
  if(!files) return;
  for(var i=0; i<files.length; i++){
    if(uploadPhotos.length >= 12){
      alert("Maximum 12 photos reached per listing.");
      break;
    }
    var reader = new FileReader();
    reader.onload = function(e){
      uploadPhotos.push(e.target.result);
      renderUploadThumbs();
    };
    reader.readAsDataURL(files[i]);
  }
}

function renderUploadThumbs(){
  var grid = document.getElementById('newListingThumbs');
  grid.innerHTML = "";
  document.getElementById('postPhotoCount').innerText = uploadPhotos.length;
  uploadPhotos.forEach(function(src, idx){
    var wrap = document.createElement('div');
    wrap.className = "thumb-wrap";
    wrap.innerHTML = '<img src="'+src+'"><button type="button" class="thumb-del" onclick="removeUploadPhoto('+idx+')">&times;</button>';
    grid.appendChild(wrap);
  });
}

function removeUploadPhoto(idx){
  uploadPhotos.splice(idx, 1);
  renderUploadThumbs();
}

function handleProfileAvatar(inp){
  if(inp.files && inp.files[0]){
    var r = new FileReader();
    r.onload = function(e){
      profile.avatar = e.target.result;
      var prev = document.getElementById('profPreview');
      prev.src = profile.avatar;
      prev.style.display = 'block';
      document.getElementById('profInitial').style.display = 'none';
    };
    r.readAsDataURL(inp.files[0]);
  }
}

function saveProf(e){
  e.preventDefault();
  profile.name = document.getElementById('pName').value;
  profile.city = document.getElementById('pCity').value;
  profile.contact = document.getElementById('pContact').value;
  document.getElementById('heroName').innerText = profile.name;
  document.getElementById('heroCity').innerText = profile.city;
  document.getElementById('navCity').innerText = profile.city;
  if(profile.avatar){
    document.getElementById('heroAvatar').innerHTML = '<img src="'+profile.avatar+'">';
    document.getElementById('navAvatar').innerHTML = '<img src="'+profile.avatar+'">';
  }
  alert("Profile updated successfully!");
  closeM('profileModal');
}

function render(){
  var g = document.getElementById('itemsGrid');
  g.innerHTML = "";
  var list = items;
  if(curCat === "Mine") {
    list = items.filter(function(x){return x.seller === profile.name;});
  } else if(curCat !== "All") {
    list = items.filter(function(x){return x.cat === curCat;});
  }
  document.getElementById('invCount').innerText = items.length;

  list.forEach(function(item){
    var c = document.createElement('div');
    c.className = "card";
    c.onclick = function(){show(item);};
    var firstImg = (item.images && item.images.length) ? item.images[0] : "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=400&q=80";
    var countTag = (item.images && item.images.length > 1) ? '<span style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.65);color:#fff;font-size:10px;padding:2px 5px;border-radius:4px;"><i class="fa-solid fa-images"></i> '+item.images.length+'</span>' : '';
    
    c.innerHTML = '<div style="position:relative;"><img src="'+firstImg+'">'+countTag+'</div><div class="card-body"><div style="display:flex;justify-content:space-between;align-items:center;"><div class="price">$'+item.price+'</div>'+(item.nego?'<span style="font-size:10px;background:#e0f2fe;color:#0284c7;padding:2px 6px;border-radius:4px;font-weight:700;">Negotiable</span>':'')+'</div><div style="font-size:13px;font-weight:600;margin:4px 0;line-height:1.2;">'+item.title+'</div><div style="font-size:11px;color:#64748b;">Tempe, AZ &bull; '+item.seller+'</div></div>';
    g.appendChild(c);
  });
}

function show(item){
  active = item;
  slideIndex = 0;
  updateSlideDisplay();

  document.getElementById('itemPrice').innerText = '$'+item.price;
  document.getElementById('itemTitle').innerText = item.title;
  document.getElementById('itemMeta').innerText = 'Listed by '+item.seller+' • Tempe, AZ • Condition: '+(item.condition||'Good');
  document.getElementById('itemDesc').innerText = item.desc || "Verified marketplace listing.";
  document.getElementById('itemNego').innerText = item.nego ? "Negotiable" : "Firm Price";
  document.getElementById('saveIcon').className = saved.includes(item.id) ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark";
  document.getElementById('itemContact').innerHTML = '<strong style="color:#16a34a;"><i class="fa-solid fa-circle-check"></i> Verified Member Contact:</strong><br>'+(item.contact||profile.contact);
  
  var isOwnerOrAdmin = (role === 'owner' || item.seller === profile.name);
  document.getElementById('sellerControlBox').style.display = isOwnerOrAdmin ? 'block' : 'none';

  renderComments();
  openM('itemModal');
}

function updateSlideDisplay(){
  if(!active || !active.images || !active.images.length) return;
  document.getElementById('detailCaroImg').src = active.images[slideIndex];
  document.getElementById('detailCaroCount').innerText = (slideIndex + 1) + '/' + active.images.length;
}

function moveSlide(dir){
  if(!active || !active.images || active.images.length <= 1) return;
  slideIndex += dir;
  if(slideIndex < 0) slideIndex = active.images.length - 1;
  if(slideIndex >= active.images.length) slideIndex = 0;
  updateSlideDisplay();
}

function renderComments(){
  var box = document.getElementById('itemCommentsList');
  box.innerHTML = "";
  if(!active.comments || !active.comments.length){
    box.innerHTML = '<p style="font-size:11px;color:#94a3b8;font-style:italic;">No questions posted yet. Be the first to ask!</p>';
    return;
  }
  active.comments.forEach(function(c){
    var b = document.createElement('div');
    b.className = "comment-bubble";
    b.innerText = c;
    box.appendChild(b);
  });
}

function submitComment(){
  var inp = document.getElementById('newCommentInput');
  if(!inp.value.trim() || !active) return;
  if(!active.comments) active.comments = [];
  active.comments.push(profile.name + ": " + inp.value.trim());
  inp.value = "";
  renderComments();
}

function openEditActive(){
  if(!active) return;
  document.getElementById('editTitle').value = active.title;
  document.getElementById('editPrice').value = active.price;
  document.getElementById('editCondition').value = active.condition || "Like New";
  document.getElementById('editDesc').value = active.desc || "";
  openM('editModal');
}

function saveEditedItem(e){
  e.preventDefault();
  if(!active) return;
  active.title = document.getElementById('editTitle').value;
  active.price = parseInt(document.getElementById('editPrice').value);
  active.condition = document.getElementById('editCondition').value;
  active.desc = document.getElementById('editDesc').value;
  closeM('editModal');
  show(active);
  render();
}

function openOffer(){
  var b = document.getElementById('offerBox');
  b.style.display = b.style.display === 'block' ? 'none' : 'block';
}

function sendOffer(){
  var a = document.getElementById('offerAmt').value;
  if(!a) return;
  alert("Offer of $" + a + " sent to " + active.seller + "!");
  document.getElementById('offerBox').style.display = 'none';
}

function toggleSave(){
  if(!active) return;
  var i = saved.indexOf(active.id);
  if(i > -1){
    saved.splice(i, 1);
    document.getElementById('saveIcon').className = "fa-regular fa-bookmark";
    alert("Removed from saved.");
  } else {
    saved.push(active.id);
    document.getElementById('saveIcon').className = "fa-solid fa-bookmark";
    alert("Saved to Watchlist!");
  }
  renderSaved();
}

function renderSaved(){
  var b = document.getElementById('savedList');
  var s = items.filter(function(x){return saved.includes(x.id);});
  if(!s.length){
    b.innerHTML = "No items saved yet.";
    return;
  }
  b.innerHTML = "";
  s.forEach(function(x){
    var img = (x.images && x.images.length) ? x.images[0] : '';
    b.innerHTML += '<div style="display:flex;gap:8px;padding:6px;border-bottom:1px solid #e2e8f0;align-items:center;"><img src="'+img+'" style="width:40px;height:40px;border-radius:4px;object-fit:cover;"><div><div style="font-weight:700;">'+x.title+'</div><div style="color:#0284c7;">$'+x.price+'</div></div></div>';
  });
}

function delItem(){
  if(!active || !confirm("Delete listing?")) return;
  items = items.filter(function(x){return x.id !== active.id;});
  closeM('itemModal');
  render();
}

function subPost(e){
  e.preventDefault();
  var imgs = uploadPhotos.length ? uploadPhotos.slice(0, 12) : ["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=400&q=80"];
  items.unshift({
    id: Date.now(),
    title: document.getElementById('postTitle').value,
    cat: document.getElementById('postCat').value,
    price: parseInt(document.getElementById('postPrice').value),
    images: imgs,
    seller: profile.name,
    contact: profile.contact,
    desc: document.getElementById('postDesc').value,
    condition: document.getElementById('postCondition').value,
    nego: document.getElementById('postNego').checked,
    comments: []
  });
  closeM('createPostModal');
  e.target.reset();
  uploadPhotos = [];
  renderUploadThumbs();
  render();
}

render();
