function saveOrca(orca) {
  setCookie('orca', JSON.stringify(orca));
}
function loadOrca() {
  try {
    return JSON.parse(getCookie('orca')) || null;
  } catch(e) {
    return null;
  }
}
function setCookie(name, value, days=365) {
  const expires = new Date(Date.now() + days*24*60*60*1000).toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + expires + ";path=/";
}
function getCookie(name) {
  const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return v ? decodeURIComponent(v.pop()) : null;
}

const defaultOrca = {
  name: "シャッチー",
  age: 0,
  hunger: 50,
  health: 100,
  weight: 500,
  stage: 1,
  lastAction: "",
  message: "",
};

function getOrcaImage(stage) {
  if(stage == 1) return "🐳";
  if(stage == 2) return "🐋";
  if(stage == 3) return "🦈";
  return "🐳";
}

function renderOrcaList() {
  const orca = loadOrca();
  const el = document.getElementById('orcalist');
  if (orca) {
    el.innerHTML = `
      <div class="card" style="text-align:center;">
        <div style="font-size:4rem;transition:all .3s;" id="orcaimage">${getOrcaImage(orca.stage)}</div>
        <h2>${orca.name}（年齢:${orca.age}）</h2>
        <p>体重: ${orca.weight} kg</p>
        <p>お腹空き: ${orca.hunger}</p>
        <p>健康: ${orca.health}</p>
        <p>成長段階: ${["赤ちゃん","子ども","大人"][orca.stage-1]}</p>
        <button onclick="showOrcaDetail()">詳細・育成</button>
      </div>
    `;
  } else {
    el.innerHTML = `
      <div class="card">
        <h2>シャチを育てよう！</h2>
        <input id="orcaname" placeholder="シャチの名前" />
        <button onclick="createOrca()">はじめる</button>
      </div>
    `;
  }
}

window.createOrca = function () {
  const name = document.getElementById('orcaname').value || defaultOrca.name;
  const newOrca = {...defaultOrca, name};
  saveOrca(newOrca);
  renderOrcaList();
};

window.showOrcaDetail = function () {
  document.getElementById('orcalist').style.display = 'none';
  const orca = loadOrca();
  document.getElementById('orcadetail').style.display = 'block';
  document.getElementById('orcadetail').innerHTML = `
    <div class="card" style="text-align:center;">
      <div style="font-size:5rem;transition:all .3s;" id="orcaimage">${getOrcaImage(orca.stage)}</div>
      <h2>${orca.name} の育成</h2>
      <p>年齢: ${orca.age}</p>
      <p>体重: ${orca.weight} kg</p>
      <p>お腹空き: ${orca.hunger}</p>
      <p>健康: ${orca.health}</p>
      <p>成長段階: ${["赤ちゃん","子ども","大人"][orca.stage-1]}</p>
      <div style="margin:12px 0;min-height:1.8em;"><span id="orcamessage">${orca.message||""}</span></div>
      <button onclick="feedOrca()">餌をやる</button>
      <button onclick="trainOrca()">トレーニング</button>
      <button onclick="cleanTank()">水槽掃除</button>
      <button onclick="backToList()">戻る</button>
    </div>
  `;
  if(orca.lastAction == "feed") feedAnimation();
  if(orca.lastAction == "train") trainAnimation();
  if(orca.lastAction == "clean") cleanAnimation();
};

window.backToList = function () {
  document.getElementById('orcadetail').style.display = 'none';
  document.getElementById('orcalist').style.display = 'block';
  renderOrcaList();
};

window.feedOrca = function () {
  let orca = loadOrca();
  orca.hunger = Math.max(orca.hunger - 20, 0);
  orca.weight += 5;
  orca.health = Math.min(orca.health + 5, 100);
  orca.lastAction = "feed";
  orca.message = "美味しそうに食べている！";
  checkStageUp(orca);
  saveOrca(orca);
  window.showOrcaDetail();
};

window.trainOrca = function () {
  let orca = loadOrca();
  orca.age += 1;
  orca.weight += 2;
  orca.hunger = Math.min(orca.hunger + 15, 100);
  orca.health = Math.max(orca.health - 5, 0);
  orca.lastAction = "train";
  orca.message = "シャチが元気にジャンプした！";
  checkStageUp(orca);
  saveOrca(orca);
  window.showOrcaDetail();
};

window.cleanTank = function () {
  let orca = loadOrca();
  orca.health = Math.min(orca.health + 10, 100);
  orca.lastAction = "clean";
  orca.message = "水槽がピカピカになった！";
  saveOrca(orca);
  window.showOrcaDetail();
};

function checkStageUp(orca) {
  if(orca.age >= 10 && orca.stage == 1) {
    orca.stage = 2;
    orca.message = "子どもシャチに成長した！";
  }
  if(orca.age >= 20 && orca.stage == 2) {
    orca.stage = 3;
    orca.message = "立派な大人のシャチになった！";
  }
}

function feedAnimation() {
  const el = document.getElementById('orcaimage');
  if(!el) return;
  el.animate([{transform:"scale(1)"},{transform:"scale(1.2)"},{transform:"scale(1)"}], {
    duration: 700
  });
  document.getElementById('orcamessage').textContent = "もぐもぐ...";
}
function trainAnimation() {
  const el = document.getElementById('orcaimage');
  if(!el) return;
  el.animate([{transform:"translateY(0)"},{transform:"translateY(-30px)"},{transform:"translateY(0)"}], {
    duration: 700
  });
  document.getElementById('orcamessage').textContent = "ジャンプした！";
}
function cleanAnimation() {
  const el = document.getElementById('orcaimage');
  if(!el) return;
  el.animate([{filter:"brightness(1)"},{filter:"brightness(1.8)"},{filter:"brightness(1)"}], {
    duration: 600
  });
  document.getElementById('orcamessage').textContent = "キラキラ！";
}

renderOrcaList();
