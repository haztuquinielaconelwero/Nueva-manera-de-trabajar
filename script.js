// Configuracion inicial //
function sanitizeHTML(str){
if(!str) return '';
const div = document.createElement('div');
div.textContent = str;
return div.innerHTML;
}
function sanitizeData(obj){
if(typeof obj === 'string') return sanitizeHTML(obj);
if(Array.isArray(obj)) return obj.map(sanitizeData);
if(typeof obj === 'object' && obj !== null){
const sanitized = {};
for(let key in obj){
sanitized[key] = sanitizeData(obj[key]);
}
return sanitized;
}
return obj;
}
// Configuracion sobre el menu secreto //
let logoClickCount = 0;
let logoClickTimer = null;
let adminMenuActivated = false;
let datosListaCargados = false;
document.addEventListener('DOMContentLoaded', function(){
const logo = document.querySelector('.app-header__logo');
const adminTab = document.getElementById('admin-tab');
if(logo && adminTab){
logo.addEventListener('click', function(){
if(adminMenuActivated) return;
logoClickCount++;
if(logoClickTimer){
clearTimeout(logoClickTimer);
}
if(logoClickCount >= 10){
adminMenuActivated = true;
adminTab.style.display = 'flex';
logoClickCount = 0;
console.log('Menú de Administrador activado ✓');
}
logoClickTimer = setTimeout(()=>{
logoClickCount = 0;
},2000);
});
}
});
//Trabaja en la Quiniela semanal //
const QuinielaJ1 = {
matchesData: [
{ id: 1, local: 'Puebla', visit: 'Cruz Azul', imgL: 'logos/puebla.png', imgV: 'logos/cruz azul.png' },
{ id: 2, local: 'Necaxa', visit: 'León', imgL: 'logos/necaxa.png', imgV: 'logos/leon.png' },
{ id: 3, local: 'Chivas', visit: 'Juárez', imgL: 'logos/chivas.png', imgV: 'logos/juarez.png' },
{ id: 4, local: 'Toluca', visit: 'Pumas', imgL: 'logos/toluca.png', imgV: 'logos/pumas.png' },
{ id: 5, local: 'Pachuca', visit: 'Tijuana', imgL: 'logos/pachuca.png', imgV: 'logos/tijuana.png' },
{ id: 6, local: 'Tigres', visit: 'América', imgL: 'logos/tigres.png', imgV: 'logos/america.png' },
{ id: 7, local: 'Cruz Azul', visit: 'Santos', imgL: 'logos/cruz azul.png', imgV: 'logos/santos.png' },
{ id: 8, local: 'Querétaro', visit: 'Atlas', imgL: 'logos/queretaro.png', imgV: 'logos/atlas.png' },
{ id: 9, local: 'Monterrey', visit: 'Mazatlán', imgL: 'logos/monterrey.png', imgV: 'logos/mazatlan.png' }
],
userSelections: {},
vendedor: 'Alexander',
buttonsAttached: false,
init() {
this.loadFromLocalStorage();
this.renderMatches();
this.attachSelectionEvents();
if (!this.buttonsAttached) {
this.attachButtonEvents();
this.buttonsAttached = true;
}
this.updateCounter();
this.updateCombinationsAndPrice();
console.log('Quiniela J1 inicializada ✅');
},
renderMatches() {
const matchListContainer = document.getElementById('matchList');
if (!matchListContainer) return;
matchListContainer.innerHTML = '';
this.matchesData.forEach(match => {
const card = document.createElement('div');
card.className = 'match-card-new';
card.innerHTML = `
<div class="match-grid-new">
<button class="option-btn-new" data-id="${match.id}" data-type="L">L</button>
<div class="team-logo-new"><img src="${match.imgL}" alt="${match.local}"></div>
<span class="team-name-new local">${match.local}</span>
<button class="option-btn-new" data-id="${match.id}" data-type="E">E</button>
<span class="team-name-new visit">${match.visit}</span>
<div class="team-logo-new"><img src="${match.imgV}" alt="${match.visit}"></div>
<button class="option-btn-new" data-id="${match.id}" data-type="V">V</button>
</div>
`;
matchListContainer.appendChild(card);
});
},
attachSelectionEvents() {
const buttons = document.querySelectorAll('.option-btn-new');
buttons.forEach(btn => {
btn.addEventListener('click', () => {
const matchId = parseInt(btn.dataset.id);
const type = btn.dataset.type;
this.toggleSelection(matchId, type);
});
});
},
toggleSelection(matchId, type) {
if (!this.userSelections[matchId]) {
this.userSelections[matchId] = [];
}
const index = this.userSelections[matchId].indexOf(type);
if (index > -1) {
this.userSelections[matchId].splice(index, 1);
if (this.userSelections[matchId].length === 0) {
delete this.userSelections[matchId];
}
} else {
this.userSelections[matchId].push(type);
const currentLength = this.userSelections[matchId].length;
if (currentLength === 2) {
const doublesCount = Object.values(this.userSelections).filter(sel => sel.length === 2).length;
if (doublesCount > 3) {
this.userSelections[matchId].splice(this.userSelections[matchId].indexOf(type), 1);
this.showErrorAlert('No se permiten más de 3 dobles ❌');
return;
}
} else if (currentLength === 3) {
const triplesCount = Object.values(this.userSelections).filter(sel => sel.length === 3).length;
if (triplesCount > 3) {
this.userSelections[matchId].splice(this.userSelections[matchId].indexOf(type), 1);
this.showErrorAlert('No se permiten más de 3 triples ❌');
return;
}
}
}
this.updateUI();
this.updateCombinationsAndPrice();
},
updateUI() {
const buttons = document.querySelectorAll('.option-btn-new');
buttons.forEach(btn => {
const mId = parseInt(btn.dataset.id);
const type = btn.dataset.type;
if (this.userSelections[mId] && this.userSelections[mId].includes(type)) {
btn.classList.add('active');
} else {
btn.classList.remove('active');
}
});
},
calculateCombinations() {
const keys = Object.keys(this.userSelections);
if (keys.length === 0) return 0;
let total = 1;
keys.forEach(matchId => {
const selections = this.userSelections[matchId];
total *= selections.length;
});
return total;
},
updateCombinationsAndPrice() {
const combos = this.calculateCombinations();
const pricePerCombo = combos >= 10 ? 25 : 30;
const totalPrice = combos * pricePerCombo;
const btnCombos = document.getElementById('btnCombos');
const btnTotal = document.getElementById('btnTotal');
if (btnCombos) {
btnCombos.querySelector('.btn-content').textContent = combos;
}
if (btnTotal) {
btnTotal.querySelector('.btn-content').textContent = `$${totalPrice}`;
}
},
attachButtonEvents() {
const btnDelete = document.getElementById('btnDelete');
const btnRandom = document.getElementById('btnRandom');
const btnInfo = document.getElementById('btnInfo');
const headerPrice = document.getElementById('headerPrice');
const btnSaveHeader = document.getElementById('btnSaveHeader');
const btnLoadSaved = document.getElementById('btnLoadSaved');
const btnSend = document.getElementById('btnSend');
if (btnDelete) btnDelete.addEventListener('click', () => this.clearSelections());
if (btnRandom) btnRandom.addEventListener('click', () => this.generateRandom());
if (btnInfo) btnInfo.addEventListener('click', () => this.showReglamento());
if (headerPrice) headerPrice.addEventListener('click', () => this.showPrecios());
if (btnSaveHeader) btnSaveHeader.addEventListener('click', () => this.saveQuiniela());
if (btnLoadSaved) btnLoadSaved.addEventListener('click', () => this.showSavedQuinielas());
if (btnSend) btnSend.addEventListener('click', () => this.sendQuiniela());
},
clearSelections() {
this.userSelections = {};
this.updateUI();
this.updateCombinationsAndPrice();
console.log(' Selecciones borradas🗑️');
},
generateRandom() {
this.userSelections = {};
let doublesCount = 0;
let triplesCount = 0;
this.matchesData.forEach(match => {
const rand = Math.random();
if (rand < 0.75) {
const options = ['L', 'E', 'V'];
this.userSelections[match.id] = [options[Math.floor(Math.random() * 3)]];
} else if (rand < 0.95 && doublesCount < 3) {
const options = ['L', 'E', 'V'];
const idx1 = Math.floor(Math.random() * 3);
let idx2 = Math.floor(Math.random() * 3);
while (idx2 === idx1) idx2 = Math.floor(Math.random() * 3);
this.userSelections[match.id] = [options[idx1], options[idx2]];
doublesCount++;
} else if (triplesCount < 3) {
this.userSelections[match.id] = ['L', 'E', 'V'];
triplesCount++;
} else {
const options = ['L', 'E', 'V'];
this.userSelections[match.id] = [options[Math.floor(Math.random() * 3)]];
}
});
this.updateUI();
this.updateCombinationsAndPrice();
console.log(' Quiniela aleatoria generada🎲');
},
showErrorAlert(message) {
const modal = document.createElement('div');
modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;`;
modal.innerHTML = `
<div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 20px; padding: 25px; max-width: 350px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 3px solid #ce1126; text-align: center;">
<img src="logos/tarjetaroja.png" alt="Error" style="width: 120px; height: 120px; object-fit: contain; margin: 0 auto 15px auto; display: block;">
<h2 style="color: #ce1126; margin: 0 0 15px 0; font-size: 22px; font-weight: 800;">Acción Incorrecta</h2>
<p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">${message}</p>
<button onclick="this.closest('div').parentElement.remove()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #ce1126 0%, #9d0d1f 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer;">Entendido</button>
</div>
`;
document.body.appendChild(modal);
},
showReglamento() {
const modal = document.createElement('div');
modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;`;
modal.innerHTML = `
<div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 20px; padding: 25px; max-width: 400px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 3px solid #006847;">
<div style="text-align: center; margin-bottom: 20px;">
<div style="font-size: 60px; margin-bottom: 10px;">⚽</div>
<h2 style="color: #006847; margin: 0; font-size: 24px; font-weight: 800;">Reglamento</h2>
</div>
<div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ce1126; max-height: 400px; overflow-y: auto;">
<p style="color: #333; line-height: 1.8; margin: 0; font-size: 14px;">
1-Primer Lugar: El ganador del primer lugar será el participante que obtenga el mayor número de aciertos.<br>
En caso de que exista un empate entre dos o más participantes, el monto total del premio se repartirá en partes iguales entre todos los ganadores.<br>
2-Segundo lugar: Será entregado a las personas que logren obtener un acierto menos que el primer lugar.<br>
Solamente será repartido y entregado el monto asignado al segundo lugar, siempre y cuando se cumpla el requisito. <br>
3-El monto total publicado es lo que se le entregará al ganador(es).<br>
4-Solo se podrá apostar por: Equipo Local, empate o equipo visitante.<br>
El resultado válido para cada partido será únicamente el obtenido durante el tiempo reglamentario, es decir,
los 90 minutos más el tiempo de compensación o agregado. <br>
7-Es responsabilidad del participante verificar que su quiniela esté correctamente registrada en la pre-lista de participantes y que coincida exactamente con la información enviada.
En caso de existir algún error y no ser reportado antes de la publicación de la lista final, no se podrán realizar correcciones posteriormente.
8-Quiniela no capturada:
Si tu quiniela no fue registrada por algún error, ya sea por parte del vendedor o por un fallo nuestro, se te reembolsará el costo total de la quiniela.
9-Participación de la quiniela:<br>
Tu quiniela participará conforme a cómo fue capturada y publicada en la lista final.<br>
Si no estás de acuerdo con los resultados registrados, podrás solicitar el reembolso antes de que inicie el 2 partido.
10-Publicación de la lista final:
Cada semana, antes de iniciar el primer partido, se publicará la lista final de participantes, la cual no podrá ser modificada una vez publicada. <br>
11-Partidos suspendidos o pospuestos:
Si un partido es suspendido durante su transcurso, se tomará en cuenta siempre y cuando se reanude y finalice dentro de la misma jornada.<br>
De lo contrario, se considerará como resultado oficial el marcador al momento de la suspensión.
Por otra parte, si un partido es pospuesto antes de iniciar y no se juega dentro de la misma jornada, dicho partido no será tomado en cuenta.</p>
</div>
<button onclick="this.closest('div').parentElement.remove()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #006847 0%, #009c3b 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer;">Entendido ✓</button>
</div>
`;
document.body.appendChild(modal);
},
showPrecios() {
const modal = document.createElement('div');
modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;`;
modal.innerHTML = `
<div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 20px; padding: 25px; max-width: 400px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 3px solid #ffd700;">
<div style="text-align: center; margin-bottom: 20px;">
<div style="font-size: 60px; margin-bottom: 10px;">💰</div>
<h2 style="color: #006847; margin: 0; font-size: 24px; font-weight: 800;">Precios</h2>
</div>
<div style="background: linear-gradient(135deg, #006847 0%, #009c3b 100%); padding: 20px; border-radius: 12px; margin-bottom: 15px; text-align: center;">
<div style="color: #ffd700; font-size: 14px; font-weight: 600; margin-bottom: 5px;">Precio</div>
<div style="color: white; font-size: 36px; font-weight: 900; margin-bottom: 5px;">$30</div>
<div style="color: rgba(255,255,255,0.9); font-size: 12px;">Por quiniela</div>
</div>
<div style="background: linear-gradient(135deg, #ce1126 0%, #9d0d1f 100%); padding: 20px; border-radius: 12px; text-align: center; position: relative;">
<div style="position: absolute; top: 10px; right: 10px; background: #ffd700; color: #ce1126; padding: 5px 5px; border-radius: 20px; font-size: 8px; font-weight: 500;">Promo 🔥</div>
<div style="color: #ffd700; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Para que invites a tus amigos</div>
<div style="color: white; font-size: 16px; font-weight: 700; margin-bottom: 5px;">10 o más quinielas</div>
<div style="color: white; font-size: 32px; font-weight: 900;">$25 cada una</div>
</div>
<button onclick="this.closest('div').parentElement.remove()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #006847 0%, #009c3b 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 20px;">Cerrar</button>
</div>
`;
document.body.appendChild(modal);
},
expandCombinations(selections) {
const matchIds = Object.keys(selections);
if (matchIds.length === 0) return [];
const generateCombinations = (obj, keys, index = 0, current = {}) => {
if (index === keys.length) return [{ ...current }];
const key = keys[index];
const values = obj[key];
let results = [];
values.forEach(value => {
const newCurrent = { ...current, [key]: value };
results = results.concat(generateCombinations(obj, keys, index + 1, newCurrent));
});
return results;
};
return generateCombinations(selections, matchIds);
},
loadFromLocalStorage() {
const saved = localStorage.getItem('currentQuiniela');
if (saved) {
try {
this.userSelections = JSON.parse(saved);
} catch (e) {
console.error('Error al cargar quiniela: ❌ ', e);
}
}
},
updateCounter() {
const saved = JSON.parse(localStorage.getItem('quinielasGuardadas') || '[]');
const btnLoadSaved = document.getElementById('btnLoadSaved');
if (btnLoadSaved) {
const counter = btnLoadSaved.querySelector('.btn-content');
if (saved.length > 0) {
counter.innerHTML = `💾 <span style="position: absolute; top: 8px; right: -10px; background: #ffd700; color: #ce1126; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; border: 2px solid white;">${saved.length}</span>`;
counter.style.position = 'relative';
} else {
counter.textContent = '💾';
}
}
},
saveQuiniela() {
const userName = document.getElementById('userName').value.trim();
if (!userName) {
this.showErrorAlert('Ingresa tu nombre antes de guardar la quiniela ❌');
return;
}
const selectedMatches = Object.keys(this.userSelections).length;
if (selectedMatches < 9) {
this.showErrorAlert(`Faltan ${9 - selectedMatches} partido(s) por seleccionar ❌`);
return;
}
const allCombinations = this.expandCombinations(this.userSelections);
let saved = JSON.parse(localStorage.getItem('quinielasGuardadas') || '[]');
allCombinations.forEach((combo, index) => {
const quiniela = {
id: Date.now() + index,
userName: userName,
vendedor: this.vendedor,
selections: JSON.stringify(combo),
combinations: 1,
price: allCombinations.length >= 10 ? 25 : 30,
date: new Date().toLocaleString('es-MX')
};
saved.push(quiniela);
});
localStorage.setItem('quinielasGuardadas', JSON.stringify(saved));
document.getElementById('userName').value = '';
this.userSelections = {};
this.updateUI();
this.updateCombinationsAndPrice();
this.updateCounter();
const modal = document.createElement('div');
modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;`;
modal.innerHTML = `
<div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 20px; padding: 25px; max-width: 350px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 3px solid #006847; text-align: center;">
<div style="font-size: 80px; margin-bottom: 15px;">✅</div>
<h2 style="color: #006847; margin: 0 0 10px 0; font-size: 24px; font-weight: 800;">${allCombinations.length} Quinielas guardadas</h2>
<p style="color: #666; font-size: 14px; margin: 0 0 20px 0;">Tus quinielas se guardaron correctamente</p>
<button onclick="this.closest('div').parentElement.remove()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #006847 0%, #009c3b 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer;">Aceptar</button>
</div>
`;
document.body.appendChild(modal);
console.log(`${allCombinations.length} Quinielas guardadas 💾`);
},
showSavedQuinielas() {
const saved = JSON.parse(localStorage.getItem('quinielasGuardadas') || '[]');
if (saved.length === 0) {
this.showErrorAlert('No tienes quinielas guardadas ❌');
return;
}
const modal = document.createElement('div');
modal.className = 'modal-guardadas';
modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto;`;
let quinielasHTML = '';
let totalPrice = 0;
saved.forEach((q, index) => {
const selections = JSON.parse(q.selections);
let miniQuinielaHTML = '';
totalPrice += q.price;
this.matchesData.forEach(match => {
const sel = selections[match.id];
if (sel) {
miniQuinielaHTML += `
<div style="display: grid; grid-template-columns: 22px 60px auto 60px 22px; align-items: center; gap: 4px; padding: 4px; background: #f8f9fa; border-radius: 6px; margin-bottom: 3px;">
<img src="${match.imgL}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: contain;">
<div style="font-size: 9px; font-weight: 700; color: #333; text-align: left;">${match.local}</div>
<div style="background: white; color: #333; padding: 3px 6px; border-radius: 5px; font-size: 10px; font-weight: 900; text-align: center; border: 2px solid #e5e7eb;">${sel}</div>
<div style="font-size: 9px; font-weight: 700; color: #333; text-align: right;">${match.visit}</div>
<img src="${match.imgV}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: contain;">
</div>
`;
}
});
quinielasHTML += `
<div style="background: white; border-radius: 10px; padding: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; border-left: 4px solid #006847; width: 100%; max-width: 500px;">
<button class="btn-delete-quiniela" data-quiniela-id="${q.id}" style="position: absolute; top: 8px; right: 8px; background: #ce1126; color: white; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; font-size: 15px; font-weight: 700; z-index: 10;">×</button>
<div style="margin-bottom: 10px;">
<div style="color: #006847; font-size: 14px; font-weight: 800;">${q.userName}</div>
<div style="color: #666; font-size: 11px;">Vendedor: ${q.vendedor}</div>
<div style="color: #999; font-size: 10px;">${q.date}</div>
</div>
<div style="margin-bottom: 10px; max-height: 300px; overflow-y: auto;">${miniQuinielaHTML}</div>
</div>
`;
});
modal.innerHTML = `
<div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 20px; padding: 20px; max-width: 550px; width: 100%; max-height: 85vh; overflow-y: auto;">
<div style="text-align: center; margin-bottom: 18px; position: sticky; top: 0; background: white; padding-bottom: 12px; z-index: 1;">
<h2 style="color: #006847; margin: 0; font-size: 22px; font-weight: 800;">Quinielas guardadas</h2>
</div>
${quinielasHTML}
<div style="background: linear-gradient(135deg, #006847 0%, #009c3b 100%); border-radius: 12px; padding: 20px; margin: 20px 0 15px 0; text-align: center;">
<div style="display: flex; justify-content: space-around; align-items: center;">
<div>
<div style="color: rgba(255,255,255,0.9); font-size: 12px; margin-bottom: 5px;">Quinielas guardadas</div>
<div style="color: #ffd700; font-size: 32px; font-weight: 900;">${saved.length}</div>
</div>
<div style="width: 2px; height: 50px; background: rgba(255,255,255,0.4);"></div>
<div>
<div style="color: rgba(255,255,255,0.9); font-size: 12px; margin-bottom: 5px;">Precio total</div>
<div style="color: #ffd700; font-size: 32px; font-weight: 900;">$${totalPrice}</div>
</div>
</div>
</div>
<button class="btn-close-modal" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #006847 0%, #009c3b 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; position: sticky; bottom: 0;">Cerrar</button>
</div>
`;
document.body.appendChild(modal);
const deleteButtons = modal.querySelectorAll('.btn-delete-quiniela');
deleteButtons.forEach(btn => {
btn.addEventListener('click', (e) => {
e.stopPropagation();
const quinielaId = parseInt(btn.getAttribute('data-quiniela-id'));
this.deleteQuiniela(quinielaId);
});
});
const closeBtn = modal.querySelector('.btn-close-modal');
closeBtn.addEventListener('click', () => modal.remove());
},
deleteQuiniela(id) {
if (!confirm('¿Eliminar esta quiniela?')) return;
let saved = JSON.parse(localStorage.getItem('quinielasGuardadas') || '[]');
saved = saved.filter(q => q.id !== id);
localStorage.setItem('quinielasGuardadas', JSON.stringify(saved));
this.updateCounter();
const modal = document.querySelector('.modal-guardadas');
if (modal) modal.remove();
if (saved.length > 0) this.showSavedQuinielas();
console.log('Quiniela eliminada 🗑️:', id);
},
sendQuiniela() {
const saved = JSON.parse(localStorage.getItem('quinielasGuardadas') || '[]');
if (saved.length === 0) {
this.showErrorAlert('No tienes quinielas guardadas para enviar ❌ ');
return;
}
const modal = document.createElement('div');
modal.style.cssText = `
position: fixed; top: 0; left: 0; right: 0; bottom: 0;
background: rgba(0,0,0,0.85); z-index: 10000;
display: flex; align-items: center; justify-content: center; padding: 20px;
`;
const totalPrice = saved.reduce((sum, q) => sum + q.price, 0);
modal.innerHTML = `
<div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
border-radius: 20px; padding: 25px; max-width: 350px; width: 100%;
box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 3px solid #006847;
text-align: center;">
<div style="font-size: 80px; margin-bottom: 15px;">📲</div>
<h2 style="color: #006847; margin: 0 0 10px 0; font-size: 22px; font-weight: 800;">
Enviar por WhatsApp
</h2>
<div style="background: #f8f9fa; padding: 15px; border-radius: 12px; margin: 15px 0;">
<div style="color: #666; font-size: 13px; margin-bottom: 8px;">
<strong>${saved.length}</strong> quiniela${saved.length !== 1 ? 's' : ''} guardada${saved.length !== 1 ? 's 📋' : ''}
</div>
<div style="color: #006847; font-size: 24px; font-weight: 900;">
$${totalPrice}
</div>
</div>
<p style="color: #666; font-size: 13px; margin: 15px 0;">
Para finalizar, envía todas tus quinielas por WhatsApp ⚠️
</p>
<button class="btn-enviar-confirmar"
style="width: 100%; padding: 14px; margin-bottom: 10px;
background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
color: white; border: none; border-radius: 10px;
font-size: 16px; font-weight: 700; cursor: pointer;
box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);">
Enviar ahora ✓
</button>
<button class="btn-cancelar"
style="width: 100%; padding: 12px;
background: transparent; color: #999; border: 2px solid #ddd;
border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">
Cancelar
</button>
</div>
`;
document.body.appendChild(modal);
modal.querySelector('.btn-enviar-confirmar').addEventListener('click', () => {
modal.remove();
this.procesarEnvioWhatsApp(saved, totalPrice);
});
modal.querySelector('.btn-cancelar').addEventListener('click', () => {
modal.remove();
});
},
//Todo lo de abajo trabaja en el envio de Whats App //
procesarEnvioWhatsApp(saved, totalPrice) {
const numeroWhatsApp = '5218281142074';
let mensaje = '📋 *QUINIELAS EL WERO* 📋\\n\\n';
const quinielasParaSheets = [];
saved.forEach((quiniela, index) => {
const selections = JSON.parse(quiniela.selections);
mensaje += `👤 *${quiniela.userName}*\\n`;
this.matchesData.forEach((match, partidoIdx) => {
const sel = selections[match.id];
if (sel) {
mensaje += `P${partidoIdx + 1}: ${sel}\\n`;
}
});
if (index < saved.length - 1) {
mensaje += `\\n`;
}
quinielasParaSheets.push({
nombre: quiniela.userName,
partido1: selections[1] || '',
partido2: selections[2] || '',
partido3: selections[3] || '',
partido4: selections[4] || '',
partido5: selections[5] || '',
partido6: selections[6] || '',
partido7: selections[7] || '',
partido8: selections[8] || '',
partido9: selections[9] || ''
});
});
mensaje += `\\nMis quinielas: ${saved.length}\\n`;
mensaje += `Total a pagar: $${totalPrice}\\n`;
mensaje += `En unos momentos te envío el comprobante.`;
this.enviarQuinielasASheets(quinielasParaSheets);
const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}`;
window.open(url, '_blank');
const quinielasEnviadas = JSON.parse(localStorage.getItem('quinielasEnviadas') || '[]');
saved.forEach(q => {
q.fechaEnvio = new Date().toLocaleString('es-MX');
quinielasEnviadas.push(q);
});
localStorage.setItem('quinielasEnviadas', JSON.stringify(quinielasEnviadas));
localStorage.setItem('quinielasGuardadas', '[]');
this.updateCounter();
this.mostrarConfirmacionEnvio(saved.length, totalPrice);
},
async enviarQuinielasASheets(quinielas) {
try {
console.log('📤 Enviando a Google Sheets (No confirmadas)...', quinielas);
await fetch(GOOGLE_SHEETS_ADMIN_URL, {
method: 'POST',
mode: 'no-cors',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
action: 'guardar',
quinielas: quinielas
})
});
console.log('Petición enviada ✅ (no-cors). El navegador no muestra la respuesta, revisa la hoja.');
} catch (error) {
console.error('Error al conectar con Sheets❌:', error);
}
},
mostrarConfirmacionEnvio(cantidad, total) {
const modal = document.createElement('div');
modal.style.cssText = `
position: fixed; top: 0; left: 0; right: 0; bottom: 0;
background: rgba(0,0,0,0.85); z-index: 10000;
display: flex; align-items: center; justify-content: center; padding: 20px;
`;
modal.innerHTML = `
<div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
border-radius: 20px; padding: 25px; max-width: 350px; width: 100%;
box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 3px solid #25D366;
text-align: center;">
<div style="font-size: 80px; margin-bottom: 15px;">✅</div>
<h2 style="color: #25D366; margin: 0 0 10px 0; font-size: 24px; font-weight: 800;">
¡WhatsApp Abierto!
</h2>
<p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
${cantidad} quiniela${cantidad !== 1 ? 's' : ''} lista${cantidad !== 1 ? 's' : ''} por <strong>$${total}</strong><br><br>
<strong style="color: #ce1126;">⚠️ IMPORTANTE:</strong><br>
Presiona ENVIAR en WhatsApp para completar tu registro
</p>
<button onclick="this.closest('div').parentElement.remove()"
style="width: 100%; padding: 12px;
background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
color: white; border: none; border-radius: 10px;
font-size: 16px; font-weight: 700; cursor: pointer;">
Entendido
</button>
</div>
`;
document.body.appendChild(modal);
setTimeout(() => {
if (document.body.contains(modal)) {
modal.remove();
}
}, 10000);
}
}; 
//===Navegacion principal entre las 6 pestañas===//
document.addEventListener('DOMContentLoaded', function(){
const navButtons         = document.querySelectorAll('.bottom-nav__item');
const views              = document.querySelectorAll('.view');
const subNavInicio       = document.getElementById('sub-nav-inicio');
const subNavAnalisis     = document.getElementById('sub-nav-analisis');
const subNavResultados   = document.getElementById('sub-nav-resultados');
const subNavAdministrador= document.getElementById('sub-nav-administrador');
function mostrarSoloSubNav(targetView){
if(subNavInicio)        subNavInicio.style.display        = (targetView === 'view-inicio')        ? 'flex' : 'none';
if(subNavAnalisis)      subNavAnalisis.style.display      = (targetView === 'view-analisis')      ? 'flex' : 'none';
if(subNavResultados)    subNavResultados.style.display    = (targetView === 'view-resultados')    ? 'flex' : 'none';
if(subNavAdministrador) subNavAdministrador.style.display = (targetView === 'view-administrador') ? 'flex' : 'none';
}
navButtons.forEach(button=>{
button.addEventListener('click', function(){
const targetView = this.getAttribute('data-view');
if(!targetView) return;
navButtons.forEach(btn=>btn.classList.remove('bottom-nav__item--active'));
views.forEach(view=>view.classList.remove('view--active'));
this.classList.add('bottom-nav__item--active');
const viewEl = document.getElementById(targetView);
if(viewEl) viewEl.classList.add('view--active');
mostrarSoloSubNav(targetView);
if(targetView === 'view-analisis'){
const horariosBtn     = document.querySelector('#sub-nav-analisis [data-section="analisis"]');
const horariosSection = document.getElementById('analisis');
if(horariosBtn && horariosSection){
const subNavAnalisisButtons = document.querySelectorAll('#sub-nav-analisis .sub-nav__item');
const analisisSections      = document.querySelectorAll('#view-analisis .app-main');
subNavAnalisisButtons.forEach(btn=>btn.classList.remove('sub-nav__item--active'));
analisisSections.forEach(sec=>sec.classList.remove('active'));
horariosBtn.classList.add('sub-nav__item--active');
horariosSection.classList.add('active');
if(typeof showMatchCard === 'function'){
currentMatchIndex = 0;
showMatchCard(0);
}
}
}else if(targetView === 'view-resultados'){
setTimeout(()=>{
const quinielasBtn     = document.querySelector('#sub-nav-resultados [data-section="quinielas"]');
const quinielasSection = document.getElementById('quinielas');
if(quinielasBtn && quinielasSection){
const subNavResultadosButtons = document.querySelectorAll('#sub-nav-resultados .sub-nav__item');
const resultadosSections      = document.querySelectorAll('#view-resultados .app-main');
subNavResultadosButtons.forEach(btn=>btn.classList.remove('sub-nav__item--active'));
resultadosSections.forEach(sec=>sec.classList.remove('active'));
quinielasBtn.classList.add('sub-nav__item--active');
quinielasSection.classList.add('active');
}
},50);
if(typeof cargarSeccionQuinielas === 'function'){
cargarSeccionQuinielas();
}
}else if (targetView === 'view-quiniela') {
if (window.QuinielaJ1 && typeof QuinielaJ1.init === 'function') {
console.log('Iniciando QuinielaJ1 desde view-quiniela');
QuinielaJ1.init();
} else {
console.warn('QuinielaJ1 no está disponible');
}
}
});
});
});
// Navegación en subpestañas de Administrador //
const subNavAdmin    = document.querySelectorAll('#sub-nav-administrador .sub-nav__item');
const adminSections  = document.querySelectorAll('#view-administrador .app-main');
subNavAdmin.forEach(button => {
button.addEventListener('click', function () {
const targetSection = this.getAttribute('data-section');
subNavAdmin.forEach(btn => btn.classList.remove('sub-nav__item--active'));
adminSections.forEach(section => section.classList.remove('active'));
this.classList.add('sub-nav__item--active');
const activeSection = document.getElementById(targetSection);
if (activeSection) activeSection.classList.add('active');
});
});
//===Navegacion en subpestañas de analisis===//
const subNavAnalisisButtons = document.querySelectorAll('#sub-nav-analisis .sub-nav__item');
const analisisSections = document.querySelectorAll('#view-analisis > div');
subNavAnalisisButtons.forEach(button => {
button.addEventListener('click', function() 
{
const targetSection = this.getAttribute('data-section');
subNavAnalisisButtons.forEach(btn => btn.classList.remove('sub-nav__item--active'));
analisisSections.forEach(section => section.classList.remove('active'));
this.classList.add('sub-nav__item--active');
document.getElementById(targetSection).classList.add('active');
if (targetSection === 'porcentajes') {
cargarPorcentajesEnTiempoReal();
}
});
});
//===Navegacion en subpestañas de resultados===//
const subNavResultadosButtons = document.querySelectorAll('#sub-nav-resultados .sub-nav__item');
const resultadosSections = document.querySelectorAll('#view-resultados div');
subNavResultadosButtons.forEach(button => {
button.addEventListener('click', function() 
{
const targetSection = this.getAttribute('data-section');
subNavResultadosButtons.forEach(btn => btn.classList.remove('sub-nav__item--active'));
resultadosSections.forEach(section => section.classList.remove('active'));
this.classList.add('sub-nav__item--active');
const activeSection = document.getElementById(targetSection);
if (activeSection) {
activeSection.classList.add('active');
}
if (targetSection === 'quinielas') {
cargarSeccionQuinielas();
} else if (targetSection === 'lista') {
cargarTablaResultados(); 
} else if (targetSection === 'primero') {
cargarSeccionPrimero();
} else if (targetSection === 'segundo') {
cargarSeccionSegundo();
} else if (targetSection === 'verificar') {
cargarSeccionVerificar();
} else if (targetSection === 'premios') {
cargarSeccionPremios();
}
console.log('Sección Resultados seleccionada:', targetSection);
});
});
document.addEventListener('DOMContentLoaded', function() {
console.log('DOM Cargado - Iniciando precarga de datos ✅');
cargarTablaResultados();
console.log('Datos cargándose en segundo plano 📊 ...');
});
//===Horarios de los partidos y el movimiento===//
const matchesData = [
{ local: { name: 'Chivas', logo: 'logos/chivas.png' }, visitor: { name: 'Cruz Azul', logo: 'logos/cruz azul.png' }, day: 'Sábado', hour: '7:30 PM', broadcaster: 'logos/tudn.png' },
{ local: { name: 'Toluca', logo: 'logos/toluca.png' }, visitor: { name: 'Necaxa', logo: 'logos/necaxa.png' }, day: 'Sábado', hour: '7:00 PM', broadcaster: 'logos/tv azteca.png' },
{ local: { name: 'Mazatlán', logo: 'logos/mazatlan.png' }, visitor: { name: 'Querétaro', logo: 'logos/queretaro.png' }, day: 'Sábado', hour: '5:00 PM', broadcaster: 'logos/fox sports.png' },
{ local: { name: 'Pumas', logo: 'logos/pumas.png' }, visitor: { name: 'Tijuana', logo: 'logos/tijuana.png' }, day: 'Sábado', hour: '7:00 PM', broadcaster: 'logos/tudn.png' },
{ local: { name: 'América', logo: 'logos/america.png' }, visitor: { name: 'León', logo: 'logos/leon.png' }, day: 'Sábado', hour: '5:00 PM', broadcaster: 'logos/las estrellas.png' },
{ local: { name: 'Atlas', logo: 'logos/atlas.png' }, visitor: { name: 'Monterrey', logo: 'logos/monterrey.png' }, day: 'Sábado', hour: '5:00 PM', broadcaster: 'logos/tv azteca.png' },
{ local: { name: 'Puebla', logo: 'logos/puebla.png' }, visitor: { name: 'San Luis', logo: 'logos/san luis.png' }, day: 'Sábado', hour: '7:00 PM', broadcaster: 'logos/fox sports.png' },
{ local: { name: 'Tigres', logo: 'logos/tigres.png' }, visitor: { name: 'Pachuca', logo: 'logos/pachuca.png' }, day: 'Sábado', hour: '9:00 PM', broadcaster: 'logos/tudn.png' },
{ local: { name: 'Guadalajara', logo: 'logos/chivas.png' }, visitor: { name: 'Santos', logo: 'logos/santos.png' }, day: 'Sábado', hour: '6:00 PM', broadcaster: 'logos/fox sports.png' }
];
let currentMatchIndex = 0;
window.addEventListener('load', function() {
currentMatchIndex = 0;
if (typeof showMatchCard === 'function') {
showMatchCard(0);
}
});
document.addEventListener('visibilitychange', function() {
if (!document.hidden) {
currentMatchIndex = 0;
if (typeof showMatchCard === 'function') {
showMatchCard(0);
}
}
});
function createMatchCard(match, index) {
return `
<div class="match-card ${index === 0 ? 'active' : ''}" data-index="${index}">
<div class="match-header">
<img src="logos/liga mx.png" alt="Liga MX" class="liga-mx-logo">
<div class="header-info-horarios">
<div class="header-row-horarios">
<span class="liga-mx-text">Liga MX</span>
<span class="match-number">Partido ${index + 1}</span>
</div>
<div class="match-title-horarios">${match.local.name} vs ${match.visitor.name}</div>
</div>
</div>
<div class="match-datetime">
<span class="match-day">${match.day}</span>
<span class="match-hour">${match.hour}</span>
</div>
<div class="match-teams">
<div class="team-section">
<img src="${match.local.logo}" alt="${match.local.name}" class="team-logo">
</div>
<div class="match-center">
<div class="vs-text">Vs</div>
<div class="score-label">Marcador</div>
<div class="score-display">0-0</div>
</div>
<div class="team-section">
<img src="${match.visitor.logo}" alt="${match.visitor.name}" class="team-logo">
</div>
</div>
<div class="match-footer">
<div class="broadcast-label">Canal</div>
<img src="${match.broadcaster}" alt="Broadcaster" class="broadcaster-logo">
</div>
</div>
`;
}
let carouselRendered = false;
function renderCarousel() {
const carousel = document.getElementById('matchesCarousel');
if (!carousel) return;
carousel.innerHTML = '';
matchesData.forEach((match, index) => {
carousel.innerHTML += createMatchCard(match, index);
});
}
function showMatch(index) {
const cards = document.querySelectorAll('.match-card');
const dots = document.querySelectorAll('.indicator-dot');
cards.forEach((card, i) => {
card.classList.toggle('active', i === index);
});
dots.forEach((dot, i) => {
dot.classList.toggle('active', i === index);
});
currentMatchIndex = index;
}
window.goToMatch = function(index) {
showMatch(index);
}
let touchStartX = 0;
let touchEndX = 0;
document.addEventListener('touchstart', (e) => {
const target = e.target.closest('.horarios-wrapper');
if (target) {
touchStartX = e.changedTouches[0].screenX;
}
});
document.addEventListener('touchend', (e) => {
const target = e.target.closest('.horarios-wrapper');
if (target) {
touchEndX = e.changedTouches[0].screenX;
handleSwipe();
}
});
function handleSwipe() {
if (touchEndX < touchStartX - 50) {
const newIndex = (currentMatchIndex + 1) % matchesData.length;
showMatch(newIndex);
}
if (touchEndX > touchStartX + 50) {
const newIndex = (currentMatchIndex - 1 + matchesData.length) % matchesData.length;
showMatch(newIndex);
}
}
renderCarousel();
document.addEventListener('DOMContentLoaded', function() {
const listaSection = document.getElementById('lista');
if (listaSection && listaSection.classList.contains('active')) {
cargarTablaResultados();
}
});
//===Todo lo de abajo trabaja en la lista oficial===//
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyfNCNSaNfeJOzCxB5kOpkqqSkTosLcD0334QvqvAViX0WCirVrSSRkVUxqYn5f_DWP6w/exec';
const GOOGLE_SHEETS_ADMIN_URL  = 'https://script.google.com/macros/s/AKfycbxxEbKjkNDKpMHQRSYKPA_OACbN6TfPkZGZlMpK3mQ99iXrbyF2dsM8YPIxCjtyo6x2/exec';
const LOGOS_EQUIPOS = {
'Puebla': 'logos/puebla.png',
'Atlas': 'logos/atlas.png',
'Tijuana': 'logos/tijuana.png',
'Queretaro': 'logos/queretaro.png',
'Juarez': 'logos/juarez.png',
'America': 'logos/america.png',
'Santos': 'logos/santos.png',
'Pumas': 'logos/pumas.png',
'Toluca': 'logos/toluca.png',
'Necaxa': 'logos/necaxa.png',
'Cruz Azul': 'logos/cruz azul.png',
'Mazatlan': 'logos/mazatlan.png',
'Pachuca': 'logos/pachuca.png',
'Monterrey': 'logos/monterrey.png',
'Leon': 'logos/leon.png',
'San Luis': 'logos/san luis.png',
'Chivas': 'logos/chivas.png',
'Tigres': 'logos/tigres.png'
};
const PARTIDOS = [
{ local: 'Puebla', visitante: 'Cruz Azul' },
{ local: 'Necaxa', visitante: 'Leon' },
{ local: 'Chivas', visitante: 'Juarez' },
{ local: 'Toluca', visitante: 'Pumas' },
{ local: 'Pachuca', visitante: 'Tijuana' },
{ local: 'Tigres', visitante: 'America' },
{ local: 'Cruz Azul', visitante: 'Santos' },
{ local: 'Queretaro', visitante: 'Atlas' },
{ local: 'Monterrey', visitante: 'Mazatlan' }
];
let participantesOriginales = [];
let claveOficialGuardada = [];
async function cargarTablaResultados() {
if (datosListaCargados) {
console.log('✅ Datos ya cargados previamente✅');
return;
}
const loading = document.getElementById('resultadosLoading');
const error = document.getElementById('resultadosError');
const container = document.getElementById('tablaResultadosContainer');  
loading.style.display = 'block';
error.style.display = 'none';
container.style.display = 'none';
try {
const response = await fetch(GOOGLE_SHEETS_URL);   
if (!response.ok) {
throw new Error(`Error HTTP: ${response.status}`);
}
const data = await response.json();
if (!data.participantes || data.participantes.length === 0) {
throw new Error('No hay datos');
}
participantesOriginales = data.participantes;
claveOficialGuardada = data.claveOficial;
renderizarTabla(data.participantes, data.claveOficial);    
loading.style.display = 'none';
container.style.display = 'block';
datosListaCargados = true;
console.log('Tabla de resultados cargada ✅');
console.log('Total participantes 📊:', participantesOriginales.length);
} catch (err) {
console.error('❌ Error detallado:', err.message);
loading.style.display = 'none';
error.style.display = 'block';
}
}
function renderizarTabla(participantes, claveOficial) {
const headerContainer = document.getElementById('tablaHeader');
const bodyContainer = document.getElementById('tablaBody');
let headerHTML = `
<div class="tabla-header-text">#</div>
<div class="tabla-header-text">Nombre</div>
<div class="tabla-header-text">Vendedor</div>
`;
PARTIDOS.forEach(partido => {
headerHTML += `
<div class="partido-header">
<img src="${LOGOS_EQUIPOS[partido.local]}" alt="${partido.local}" class="logo-equipo-header" title="${partido.local}">
<div class="vs-header">vs</div>
<img src="${LOGOS_EQUIPOS[partido.visitante]}" alt="${partido.visitante}" class="logo-equipo-header" title="${partido.visitante}">
</div>
`;
});
headerHTML += `<div class="tabla-header-text">Puntos</div>`;
headerContainer.innerHTML = headerHTML;
const puntajePrimero = participantes[0].puntos;
const puntajesUnicos = [...new Set(participantes.map(p => p.puntos))].sort((a, b) => b - a);
const puntajeSegundo = puntajesUnicos[1];
let bodyHTML = '';
participantes.forEach((participante, index) => {
const posicion = participante.folio || (index + 1);
let posicionClass = '';
let filaClass = '';
if (participante.puntos === puntajePrimero) {
posicionClass = 'top1';
filaClass = 'top1';
} else if (participante.puntos === puntajeSegundo) {
posicionClass = 'top2';
filaClass = 'top2';
}
bodyHTML += `
<div class="fila-participante ${filaClass}" style="animation-delay: ${index * 0.05}s">
<div class="posicion ${posicionClass}">${posicion}</div>
<div class="nombre">${participante.nombre}</div>
<div class="vendedor">${participante.vendedor}</div>
`;
participante.picks.forEach((pick, idx) => {
const resultadoOficial = claveOficial[idx];
let claseResultado = 'pendiente';
if (resultadoOficial && resultadoOficial.trim() !== '' && resultadoOficial !== '–' && pick !== '–') {
if (pick === resultadoOficial) {
claseResultado = 'acierto';
} else {
claseResultado = 'error';
}
}
bodyHTML += `<div class="resultado ${claseResultado}">${pick || '–'}</div>`;
});
const puntosClass = participante.puntos < 5 ? 'puntos-bajos' : '';
let puntosColor = '';
if (participante.puntos === puntajePrimero) puntosColor = 'top1';
else if (participante.puntos === puntajeSegundo) puntosColor = 'top2';
bodyHTML += `<div class="puntos ${puntosClass} ${puntosColor}">${participante.puntos}</div>`;
bodyHTML += `</div>`;
});
bodyContainer.innerHTML = bodyHTML;
}
//===Funciones para secciones de Resultados===// 
function cargarSeccionPrimero() {
const primeroSection = document.getElementById('primero');
if (participantesOriginales.length === 0) {
primeroSection.innerHTML = `<div style="padding: 40px 20px; text-align: center; color: #fff;"><p>Carga primero la lista de resultados</p></div>`;
return;
}
const primerParticipante = participantesOriginales[0];
const puntajePrimero = primerParticipante.puntos;
const primerosLugares = participantesOriginales.filter(p => p.puntos === puntajePrimero);
const totalPrimeros = primerosLugares.length;
primeroSection.innerHTML = `<div style="background: #000000;min-height: calc(100vh - 200px);padding: 0;display: flex;align-items: stretch;justify-content: center;font-family: 'Poppins', sans-serif;"><div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);border-radius: 0;padding: 60px 20px 100px 20px;max-width: 100%;width: 100%;height: 100%;box-shadow: 0 10px 40px rgba(255,215,0,0.5);text-align: center;box-sizing: border-box;"><div style="font-size: 120px;margin-bottom: 55px;filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));">🥇</div><h2 style="color: #000000;margin: 0 0 8px 0;font-size: 26px;font-weight: 900;text-shadow: 2px 2px 4px rgba(255,255,255,0.5);">Primer Lugar</h2><div style="background: rgba(0,0,0,0.2);padding: 20px;border-radius: 14px;margin: 25px 0;border: 2px solid rgba(255,255,255,0.3);"><div style="font-size: 18px;color: #000000;font-weight: 700;margin-bottom: 10px;opacity: 0.9;">Total en primer lugar</div><div style="font-size: 64px;font-weight: 900;color: #FFFFFF;text-shadow: 3px 3px 6px rgba(0,0,0,0.5);line-height: 1;">${totalPrimeros.toLocaleString()}</div><div style="font-size: 16px;color: #000000;font-weight: 600;margin-top: 10px;opacity: 0.8;">${totalPrimeros === 1 ? 'Participante' : 'Participantes'}</div></div><div style="font-size: 18px;color: rgba(0,0,0,0.8);margin-top: 10px;font-weight: 700;">Con ${puntajePrimero} ${puntajePrimero === 1 ? 'punto' : 'puntos'}</div></div></div>`;
}
function cargarSeccionSegundo() {
const segundoSection = document.getElementById('segundo');
if (participantesOriginales.length === 0) {
segundoSection.innerHTML = `<div style="padding: 40px 20px; text-align: center; color: #fff;"><p>Carga primero la lista de resultados</p></div>`;
return;
}
const puntajesUnicos = [...new Set(participantesOriginales.map(p => p.puntos))].sort((a, b) => b - a);
const segundoPuntaje = puntajesUnicos[1] !== undefined ? puntajesUnicos[1] : 0;
const segundosLugares = participantesOriginales.filter(p => p.puntos === segundoPuntaje);
const totalSegundos = segundosLugares.length;
segundoSection.innerHTML = `<div style="background: #000000;min-height: calc(100vh - 200px);padding: 0;display: flex;align-items: stretch;justify-content: center;font-family: 'Poppins', sans-serif;"><div style="background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%);border-radius: 0;padding: 60px 20px 100px 20px;max-width: 100%;width: 100%;height: 100%;box-shadow: 0 10px 40px rgba(192,192,192,0.5);text-align: center;box-sizing: border-box;"><div style="font-size: 120px;margin-bottom: 55px;filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));">🥈</div><h2 style="color: #000000;margin: 0 0 8px 0;font-size: 26px;font-weight: 900;text-shadow: 2px 2px 4px rgba(255,255,255,0.5);">Segundo Lugar</h2><div style="background: rgba(0,0,0,0.2);padding: 20px;border-radius: 14px;margin: 25px 0;border: 2px solid rgba(255,255,255,0.3);"><div style="font-size: 18px;color: #000000;font-weight: 700;margin-bottom: 10px;opacity: 0.9;">Total en segundo lugar</div><div style="font-size: 64px;font-weight: 900;color: #FFFFFF;text-shadow: 3px 3px 6px rgba(0,0,0,0.5);line-height: 1;">${totalSegundos.toLocaleString()}</div><div style="font-size: 16px;color: #000000;font-weight: 600;margin-top: 10px;opacity: 0.8;">${totalSegundos === 1 ? 'Participante' : 'Participantes'}</div></div><div style="font-size: 18px;color: rgba(0,0,0,0.8);margin-top: 10px;font-weight: 700;">Con ${segundoPuntaje} ${segundoPuntaje === 1 ? 'punto' : 'puntos'}</div></div></div>`;
}
function cargarSeccionVerificar() {
const verificarSection = document.getElementById('verificar');
verificarSection.innerHTML = `<div style="background: linear-gradient(135deg, #006847 0%, #009c3b 100%);min-height: calc(100vh - 200px);padding: 15px;font-family: 'Poppins', sans-serif;"><div style="background: linear-gradient(135deg, #006847 0%, #009c3b 100%);padding: 15px 18px;border-radius: 14px;margin-bottom: 15px;box-shadow: 0 4px 16px rgba(0,104,71,0.3);"><div style="font-size: 32px; text-align: center; margin-bottom: 8px;">🔍</div><h3 style="color: #FFFFFF;text-align: center;margin: 0 0 10px 0;font-size: 18px;font-weight: 800;">Verificar Quiniela</h3><div style="background: rgba(255,255,255,0.95);border-radius: 10px;padding: 6px 12px;display: flex;align-items: center;gap: 8px;"><i class="fa-solid fa-magnifying-glass" style="color: #666; font-size: 14px;"></i><input type="text" id="busquedaVerificar" placeholder="Buscar por nombre o vendedor..." style="flex: 1;border: none;background: transparent;font-size: 13px;outline: none;padding: 6px 0;color: #333;font-weight: 600;font-family: 'Poppins', sans-serif;"/></div><div id="contadorBusqueda" style="color: rgba(255,255,255,0.9);text-align: center;font-size: 11px;margin-top: 8px;font-weight: 600;">Ingresa un nombre para buscar</div></div><div id="resultadosBusqueda" style="background: #111111;border-radius: 12px;padding: 12px;min-height: 200px;max-height: calc(100vh - 350px);overflow-y: auto;"><div style="text-align: center;color: rgba(255,255,255,0.5);padding: 30px 15px;font-size: 13px;"><div style="font-size: 40px; margin-bottom: 12px;">📋</div>Escribe en el buscador para ver resultados</div></div></div>`;
const inputBusqueda = document.getElementById('busquedaVerificar');
const resultadosDiv = document.getElementById('resultadosBusqueda');
const contadorDiv = document.getElementById('contadorBusqueda');
inputBusqueda.addEventListener('input', (e) => {
const query = e.target.value.trim().toLowerCase();
if (query.length === 0) {
resultadosDiv.innerHTML = `<div style="text-align: center; color: rgba(255,255,255,0.5); padding: 30px 15px; font-size: 13px;"><div style="font-size: 40px; margin-bottom: 12px;">📋</div>Escribe en el buscador para ver resultados</div>`;
contadorDiv.textContent = 'Ingresa un nombre para buscar';
return;
}
const resultados = participantesOriginales.filter(p => {
const nombre = p.nombre.toLowerCase();
const vendedor = p.vendedor.toLowerCase();
return nombre.includes(query) || vendedor.includes(query);
});
contadorDiv.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${resultados.length} ${resultados.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`;
if (resultados.length === 0) {
resultadosDiv.innerHTML = `<div style="text-align: center; color: rgba(255,255,255,0.7); padding: 30px 15px;"><div style="font-size: 40px; margin-bottom: 12px;">❌</div><div style="font-size: 15px; font-weight: 600;">No se encontraron resultados</div><div style="font-size: 11px; margin-top: 6px; opacity: 0.7;">Intenta con otro nombre</div></div>`;
return;
}
const puntajePrimero = participantesOriginales[0].puntos;
const puntajesUnicos = [...new Set(participantesOriginales.map(p => p.puntos))].sort((a, b) => b - a);
const puntajeSegundo = puntajesUnicos[1];
let htmlResultados = '';
resultados.forEach((participante) => {
const posicion = participante.folio || (participantesOriginales.indexOf(participante) + 1);
let medallaEmoji = '';
let colorBorde = '#333';
if (participante.puntos === puntajePrimero) {
medallaEmoji = '🥇';
colorBorde = '#FFD700';
} else if (participante.puntos === puntajeSegundo) {
medallaEmoji = '🥈';
colorBorde = '#C0C0C0';
}
htmlResultados += `<div style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);border-left: 4px solid ${colorBorde};border-radius: 10px;padding: 12px;margin-bottom: 10px;box-shadow: 0 3px 10px rgba(0,0,0,0.5);">`;
htmlResultados += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">`;
htmlResultados += `<div><div style="color: #FFFFFF; font-size: 15px; font-weight: 700; margin-bottom: 3px;">${medallaEmoji} ${participante.nombre}</div>`;
htmlResultados += `<div style="color: rgba(255,255,255,0.6); font-size: 11px; font-weight: 500;">Vendedor: ${participante.vendedor}</div></div>`;
htmlResultados += `<div style="background: linear-gradient(135deg, #006847 0%, #009c3b 100%);color: #FFFFFF;padding: 6px 14px;border-radius: 18px;font-size: 18px;font-weight: 900;box-shadow: 0 3px 10px rgba(0,104,71,0.4);">${participante.puntos}</div>`;
htmlResultados += `</div>`;
htmlResultados += `<div style="display: grid; grid-template-columns: repeat(9, 1fr); gap: 5px; margin-top: 10px;">`;
participante.picks.forEach((pick, idx) => {
const resultadoOficial = claveOficialGuardada[idx];
let claseResultado = 'pendiente';
if (resultadoOficial && resultadoOficial.trim() !== '' && resultadoOficial !== '–' && pick !== '–') {
if (pick === resultadoOficial) {
claseResultado = 'acierto';
} else {
claseResultado = 'error';
}
}
htmlResultados += `<div class="resultado ${claseResultado}" style="padding: 6px 3px;text-align: center;border-radius: 5px;font-size: 12px;font-weight: 900;box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${pick || '–'}</div>`;
});
htmlResultados += `</div>`;
htmlResultados += `<div style="margin-top: 10px;padding-top: 10px;border-top: 1px solid rgba(255,255,255,0.1);color: rgba(255,255,255,0.7);font-size: 12px;font-weight: 600;text-align: center;">Posición: #${posicion}</div>`;
htmlResultados += `</div>`;
});
resultadosDiv.innerHTML = htmlResultados;
});
}
function cargarSeccionPremios() {
const premiosSection = document.getElementById('premios');
if (!premiosSection) return;
premiosSection.innerHTML = `
<main class="app-container">
<div class="papel-picado-banner">
<svg preserveAspectRatio="none" viewBox="0 0 400 20" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern id="picadoPattern" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
<path d="M0 0H13.33V10L6.66 20L0 10V0Z" fill="#006847"/>
<path d="M13.33 0H26.66V10L20 20L13.33 10V0Z" fill="#FFFFFF"/>
<path d="M26.66 0H40V10L33.33 20L26.66 10V0Z" fill="#CE1126"/>
</pattern>
</defs>
<rect width="100%" height="20" fill="url(#picadoPattern)"/>
</svg>
</div>
<header class="header">
<h1 class="main-title">Quinielas 'El Wero'</h1>
<h2 class="subtitle">Premios de esta Jornada 1</h2>
</header>
<section class="prizes-section" style="margin-top: 35px;">
<article class="prize-card primary-card">
<div class="card-content">
<span class="place-text">1er Lugar</span>
<span class="prize-amount prize-gold">$60,000</span>
</div>
<div class="card-icon">
<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 4V2H17V4H20C21.1 4 22 4.9 22 6V8C22 10.21 20.21 12 18 12H17C17 13.1 16.1 14 15 14H9C7.9 14 7 13.1 7 12H6C3.79 12 2 10.21 2 8V6C2 4.9 2.9 4 4 4H7ZM4 6V8C4 9.1 4.9 10 6 10H7V6H4ZM17 10H18C19.1 10 20 9.1 20 8V6H17V10ZM9 16H15V18H17V22H7V18H9V16Z" fill="#D4AF37"/>
</svg>
</div>
</article>
<article class="prize-card secondary-card" style="margin-top: 35px;">
<div class="card-content">
<span class="place-text secondary-place-text">2do Lugar</span>
<span class="prize-amount prize-green">$20,000</span>
</div>
<div class="card-icon">
<svg width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 4L32 2L44 4L38 20L32 18L26 20L20 4Z" fill="#CE1126"/>
<circle cx="32" cy="38" r="18" fill="#C0C0C0"/>
<circle cx="32" cy="38" r="15" fill="#E8E8E8"/>
<circle cx="32" cy="38" r="12" fill="#C0C0C0"/>
<path d="M32 30L34 36L40 36L35 40L37 46L32 42L27 46L29 40L24 36L30 36L32 30Z" fill="#FFFFFF"/>
</svg>
</div>
</article>
</section>
<footer class="footer">
<p class="footer-text">Muchas gracias por participar ❤️</p>
<p class="footer-luck">¡Mucha suerte! 🍀</p>
</footer>
<div class="bottom-decoration-line"></div>
</main>
`;
}
window.eliminarQuinielaEnviada = function(quinielaId) {
let quinielasEnviadas = JSON.parse(localStorage.getItem('quinielasEnviadas') || '[]');
quinielasEnviadas = quinielasEnviadas.filter(q => q.id !== quinielaId);
localStorage.setItem('quinielasEnviadas', JSON.stringify(quinielasEnviadas));
cargarSeccionQuinielas();
}
function cargarSeccionQuinielas() {
const quinielasSection = document.getElementById('quinielas');
const quinielasEnviadas = JSON.parse(localStorage.getItem('quinielasEnviadas') || '[]');
if (quinielasEnviadas.length === 0) {
quinielasSection.innerHTML = `<div style="background: linear-gradient(135deg, #ce1126 0%, #9d0d1f 100%); width: 100%; height: calc(100vh - 96px);
display: flex; flex-direction: column; transform: translateY(-60px); align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; box-sizing: border-box; padding: 20px;"><div style="color: #FFFFFF; margin: 0 0 50px 0; font-size: 36px; font-weight: 900; text-shadow: 3px 3px 8px rgba(0,0,0,0.6); text-align: center; line-height: 1.3; display: block;">No te quedes sin participar</div><div style="font-size: 140px; margin: 0 0 40px 0; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.4));">❌</div><div style="background: rgba(0,0,0,0.3); padding: 25px 30px; border-radius: 16px; border: 3px solid rgba(255,255,255,0.3); box-shadow: 0 8px 24px rgba(0,0,0,0.3);"><p style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.4); text-align: center; line-height: 1.5;">Recuerda enviar tus quinielas</p></div></div>`;
return;
}
const matchesData = [
{ id: 1, local: 'Puebla', visit: 'Cruz Azul', imgL: 'logos/puebla.png', imgV: 'logos/cruz azul.png' },
{ id: 2, local: 'Necaxa', visit: 'León', imgL: 'logos/necaxa.png', imgV: 'logos/leon.png' },
{ id: 3, local: 'Chivas', visit: 'Juárez', imgL: 'logos/chivas.png', imgV: 'logos/juarez.png' },
{ id: 4, local: 'Toluca', visit: 'Pumas', imgL: 'logos/toluca.png', imgV: 'logos/pumas.png' },
{ id: 5, local: 'Pachuca', visit: 'Tijuana', imgL: 'logos/pachuca.png', imgV: 'logos/tijuana.png' },
{ id: 6, local: 'Tigres', visit: 'América', imgL: 'logos/tigres.png', imgV: 'logos/america.png' },
{ id: 7, local: 'Cruz Azul', visit: 'Santos', imgL: 'logos/cruz azul.png', imgV: 'logos/santos.png' },
{ id: 8, local: 'Querétaro', visit: 'Atlas', imgL: 'logos/queretaro.png', imgV: 'logos/atlas.png' },
{ id: 9, local: 'Monterrey', visit: 'Mazatlán', imgL: 'logos/monterrey.png', imgV: 'logos/mazatlan.png' }
];
quinielasEnviadas.forEach(quiniela => {
quiniela.encontrada = false;
quiniela.folio = null;
quiniela.numeroTelefono = null;
quiniela.puntos = 0;
const selections = JSON.parse(quiniela.selections);
if (claveOficialGuardada && claveOficialGuardada.length > 0) {
matchesData.forEach((match, idx) => {
const selQuiniela = selections[match.id];
const resultadoOficial = claveOficialGuardada[idx];
if (resultadoOficial && resultadoOficial.trim() !== '' && selQuiniela === resultadoOficial) {
quiniela.puntos += 1;
}
});
}
if (participantesOriginales && participantesOriginales.length > 0) {
participantesOriginales.forEach(participante => {
const nombreCoincide = participante.nombre.toLowerCase().trim() === quiniela.userName.toLowerCase().trim();
const vendedorCoincide = participante.vendedor.toLowerCase().trim() === quiniela.vendedor.toLowerCase().trim();
if (nombreCoincide && vendedorCoincide) {
let todosCoinciden = true;
matchesData.forEach((match, idx) => {
const selQuiniela = selections[match.id];
const selParticipante = participante.picks[idx];
if (selQuiniela !== selParticipante) {
todosCoinciden = false;
}
});
if (todosCoinciden) {
quiniela.encontrada = true;
quiniela.folio = participante.folio || (participantesOriginales.indexOf(participante) + 1);
quiniela.numeroTelefono = participante.numero || participante.telefono || participante.celular || null;
}
}
});
}
});
quinielasEnviadas.sort((a, b) => b.puntos - a.puntos);
let quinielasHTML = `<div style="background: #ffffff; min-height: calc(100vh - 200px); padding: 0px 0px 0px 0px; font-family: 'Poppins', sans-serif; max-height: calc(100vh - 200px); overflow-y: auto;"><div style="text-align: center; margin-bottom: 18px; position: sticky; top: 0; background: #ffffff; padding: 0px 0; z-index: 10;"><h2 style="color: #006847; margin: 0; font-size: 22px; font-weight: 800;">Mis Quinielas Enviadas</h2></div>`;
quinielasEnviadas.forEach((q, index) => {
const selections = JSON.parse(q.selections);
const colorFondo = q.encontrada ? '#006847' : '#ce1126';
const colorBorde = q.encontrada ? '#009c3b' : '#9d0d1f';
const estadoTexto = q.encontrada ? '✓ Jugando' : '✗ No Jugando';
const estadoColor = q.encontrada ? '#4ade80' : '#f87171';
let miniQuinielaHTML = '';
matchesData.forEach((match, idx) => {
const sel = selections[match.id];
if (sel) {
let resultadoStyle = 'background: white;';
if (claveOficialGuardada && claveOficialGuardada[idx]) {
if (sel === claveOficialGuardada[idx]) {
resultadoStyle = 'background: #4ade80;';
} else if (claveOficialGuardada[idx] !== '' && claveOficialGuardada[idx] !== '-') {
resultadoStyle = 'background: #f87171;';
}
}
miniQuinielaHTML += `<div style="display: grid; grid-template-columns: 22px 60px auto 60px 22px; align-items: center; gap: 4px; padding: 4px; background: #f8f9fa; border-radius: 6px; margin-bottom: 3px;"><img src="${match.imgL}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: contain;"><div style="font-size: 9px; font-weight: 700; color: #333; text-align: left;">${match.local}</div><div style="${resultadoStyle} color: #333; padding: 3px 6px; border-radius: 5px; font-size: 10px; font-weight: 900; text-align: center; border: 2px solid #e5e7eb;">${sel}</div><div style="font-size: 9px; font-weight: 700; color: #333; text-align: right;">${match.visit}</div><img src="${match.imgV}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: contain;"></div>`;
}
});
let medallaEmoji = '';
if (index === 0 && q.puntos > 0) medallaEmoji = '🥇 ';
else if (index === 1 && q.puntos > 0) medallaEmoji = '🥈 ';
quinielasHTML += `<div style="background: linear-gradient(135deg, ${colorFondo} 0%, ${colorBorde} 100%); border-radius: 10px; padding: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); position: relative; border: 2px solid ${colorBorde}; width: 100%; max-width: 500px; margin-left: auto; margin-right: auto;"><button onclick="eliminarQuinielaEnviada(${q.id})" style="position: absolute; top: 8px; right: 8px; background: #ce1126; color: white; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; font-size: 16px; font-weight: 700; z-index: 20; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">×</button><div style="position: absolute; top: 38px; right: 8px; background: ${estadoColor}; color: #333; padding: 4px 10px; border-radius: 20px; font-size: 9px; font-weight: 800;">${estadoTexto}</div><div style="margin-bottom: 10px; padding-right: 120px;"><div style="color: #ffd700; font-size: 14px; font-weight: 800;">${medallaEmoji}${q.userName}</div><div style="color: rgba(255,255,255,0.9); font-size: 11px;">Vendedor: ${q.vendedor}</div><div style="color: rgba(255,255,255,0.7); font-size: 10px;">${q.fechaEnvio || q.date}</div>`;
if (q.encontrada && q.folio) {
quinielasHTML += `<div style="color: #ffd700; font-size: 12px; font-weight: 900; margin-top: 4px;">📋 Folio: ${q.folio}</div>`;
}
quinielasHTML += `</div><div style="margin-bottom: 10px; max-height: 300px; overflow-y: auto;">${miniQuinielaHTML}</div><div style="text-align: center; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 8px; color: #fff; font-weight: 700;">⚽ Puntos: ${q.puntos}</div></div>`;
});
quinielasHTML += `</div>`;
quinielasSection.innerHTML = quinielasHTML;
console.log('Quinielas cargadas ✅ :', quinielasEnviadas.length);
console.log('Puntos calculados 📊 :', quinielasEnviadas.map(q => `${q.userName}: ${q.puntos}`));
}
//===Porcentajes en tiempo real===//
async function cargarPorcentajesEnTiempoReal() {
const porcentajesContainer = document.getElementById('porcentajesCarousel');
if (!porcentajesContainer) return;
if (!participantesOriginales || participantesOriginales.length === 0) {
console.log('Cargando datos para porcentajes⏳...');
try {
const response = await fetch(GOOGLE_SHEETS_URL);
const data = await response.json();
if (data.participantes && data.participantes.length > 0) {
participantesOriginales = data.participantes;
claveOficialGuardada = data.claveOficial;
console.log('Datos cargados para porcentajes ✅');
}
} catch (err) {
console.error('Error al cargar datos ❌:', err);
porcentajesContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: #ce1126;">Error al cargar datos</div>';
return;
}
}
const partidos = [
{ id: 1, local: 'Puebla', visitante: 'Cruz Azul', logoLocal: 'logos/puebla.png', logoVisitante: 'logos/cruz azul.png', claseLocal: 'puebla-local', claseVisitante: 'cruz-azul-visitante' },
{ id: 2, local: 'Necaxa', visitante: 'León', logoLocal: 'logos/necaxa.png', logoVisitante: 'logos/leon.png', claseLocal: 'necaxa-local', claseVisitante: 'leon-visitante' },
{ id: 3, local: 'Chivas', visitante: 'Juárez', logoLocal: 'logos/chivas.png', logoVisitante: 'logos/juarez.png', claseLocal: 'chivas-local', claseVisitante: 'juarez-visitante' },
{ id: 4, local: 'Toluca', visitante: 'Pumas', logoLocal: 'logos/toluca.png', logoVisitante: 'logos/pumas.png', claseLocal: 'toluca-local', claseVisitante: 'pumas-visitante' },
{ id: 5, local: 'Pachuca', visitante: 'Tijuana', logoLocal: 'logos/pachuca.png', logoVisitante: 'logos/tijuana.png', claseLocal: 'pachuca-local', claseVisitante: 'tijuana-visitante' },
{ id: 6, local: 'Tigres', visitante: 'América', logoLocal: 'logos/tigres.png', logoVisitante: 'logos/america.png', claseLocal: 'tigres-local', claseVisitante: 'america-visitante' },
{ id: 7, local: 'Cruz Azul', visitante: 'Santos', logoLocal: 'logos/cruz azul.png', logoVisitante: 'logos/santos.png', claseLocal: 'cruz-azul-local', claseVisitante: 'santos-visitante' },
{ id: 8, local: 'Querétaro', visitante: 'Atlas', logoLocal: 'logos/queretaro.png', logoVisitante: 'logos/atlas.png', claseLocal: 'queretaro-local', claseVisitante: 'atlas-visitante' },
{ id: 9, local: 'Monterrey', visitante: 'Mazatlán', logoLocal: 'logos/monterrey.png', logoVisitante: 'logos/mazatlan.png', claseLocal: 'monterrey-local', claseVisitante: 'mazatlan-visitante' }
];
const porcentajes = partidos.map((partido, idx) => {
let countL = 0, countE = 0, countV = 0;
if (participantesOriginales && participantesOriginales.length > 0) {
participantesOriginales.forEach(p => {
const pick = p.picks[idx];
if (pick === 'L') countL++;
else if (pick === 'E') countE++;
else if (pick === 'V') countV++;
});
}
const total = countL + countE + countV || 1;
return {
local: Math.round((countL / total) * 100),
empate: Math.round((countE / total) * 100),
visitante: Math.round((countV / total) * 100)
};
});
let html = '';
partidos.forEach((partido, idx) => {
const porc = porcentajes[idx];
html += `
<div class="match-percentage-card ${idx === 0 ? 'active' : ''}" data-index="${idx}">
<div class="match-card-header">
<img src="logos/liga mx.png" alt="Liga MX" class="liga-mx-logo-perc">
<div class="header-info">
<div class="header-row">
<span class="liga-text">Liga Mx</span>
<span class="partido-num">Partido ${idx + 1}</span>
</div>
<div class="match-title">${partido.local} vs ${partido.visitante}</div>
</div>
</div>
<div class="prediction-row">
<div class="label-text">Local (L)</div>
<div class="capsule ${partido.claseLocal}">
<div class="capsule-bg">
<span class="team-name-right">${partido.local}</span>
</div>
<div class="progress-fill" style="width: ${porc.local}%;">
<div class="gloss-overlay"></div>
<div class="content-left">
<div class="logo-circle">
<img src="${partido.logoLocal}" alt="${partido.local}">
</div>
<span class="porcentaje">${porc.local}%</span>
</div>
</div>
</div>
</div>
<div class="prediction-row">
<div class="label-text">Empate (E)</div>
<div class="capsule empate">
<div class="capsule-bg">
<span class="team-name-right">Empate</span>
</div>
<div class="progress-fill" style="width: ${porc.empate}%;">
<div class="gloss-overlay"></div>
<div class="content-left">
<div class="logo-circle draw-icon">
<div class="inner-ring"></div>
</div>
<span class="porcentaje">${porc.empate}%</span>
</div>
</div>
</div>
</div>
<div class="prediction-row">
<div class="label-text">Visitante (V)</div>
<div class="capsule ${partido.claseVisitante}">
<div class="capsule-bg">
<span class="team-name-right">${partido.visitante}</span>
</div>
<div class="progress-fill" style="width: ${porc.visitante}%;">
<div class="gloss-overlay"></div>
<div class="content-left">
<div class="logo-circle">
<img src="${partido.logoVisitante}" alt="${partido.visitante}">
</div>
<span class="porcentaje">${porc.visitante}%</span>
</div>
</div>
</div>
</div>
</div>
`;
});
porcentajesContainer.innerHTML = html;
console.log(' Porcentajes cargados📊 :', participantesOriginales.length, 'participantes');
}
let currentPercentageIndex = 0;
function showPercentageMatch(index) {
const cards = document.querySelectorAll('.match-percentage-card');
const dots = document.querySelectorAll('.indicator-dot-perc');
cards.forEach((card, i) => {
card.classList.toggle('active', i === index);
});
dots.forEach((dot, i) => {
dot.classList.toggle('active', i === index);
});
currentPercentageIndex = index;
}
window.nextPercentageMatch = function() {
const totalMatches = document.querySelectorAll('.match-percentage-card').length;
const newIndex = (currentPercentageIndex + 1) % totalMatches;
showPercentageMatch(newIndex);
}
window.prevPercentageMatch = function() {
const totalMatches = document.querySelectorAll('.match-percentage-card').length;
const newIndex = (currentPercentageIndex - 1 + totalMatches) % totalMatches;
showPercentageMatch(newIndex);
}
window.goToPercentageMatch = function(index) {
showPercentageMatch(index);
}
let touchStartXPerc = 0;
let touchEndXPerc = 0;
document.addEventListener('touchstart', e => {
const target = e.target.closest('.porcentajes-wrapper');
if (target) {
touchStartXPerc = e.changedTouches[0].screenX;
}
});
document.addEventListener('touchend', e => {
const target = e.target.closest('.porcentajes-wrapper');
if (target) {
touchEndXPerc = e.changedTouches[0].screenX;
handleSwipePercentage();
}
});
function handleSwipePercentage() {
if (touchEndXPerc < touchStartXPerc - 50) nextPercentageMatch();
if (touchEndXPerc > touchStartXPerc + 50) prevPercentageMatch();
}
//===Contenido de Ayuda===// //===Contenido de Ayuda===// //===Contenido de Ayuda===//
function mostrarAlertaAyuda(tipo) {
let titulo = '';
let contenido = '';
switch(tipo) {
case 'bienvenido':
titulo = 'Bienvenido 👋';
contenido = `
<div class="alert-ayuda">
<h3>${titulo}</h3>
<p>¡Bienvenido a Quinielas "El Wero"!</p>
<p>Si te gusta el fútbol, divertirte y, sobre todo, poner a prueba tu suerte, estás en el lugar correcto.</p>
<p>En "El Wero" organizamos quinielas semanales para que puedas vivir toda la emoción de cada partido, hacer tus pronósticos y, con un poco de suerte, ganar premios.</p>
<p>Aquí no necesitas ser un experto: basta con animarte a participar, elegir tus resultados y disfrutar el juego.</p>
</div>
`;
break;
case 'como-jugar':
titulo = '¿Cómo jugar? 🎮';
contenido = `
<div class="alert-ayuda">
<h3>${titulo}</h3>
<ol>
<li>Selecciona el resultado de cada partido.</li>
<li>Completa todos los partidos.</li>
<li>Introduce tu nombre y guarda tu quiniela.</li>
<li>Completa el último paso.<br>Envíala por WhatsApp antes del cierre de la quiniela.</li>
</ol>
</div>
`;
break;
case 'preguntas-frecuentes':
titulo = 'Preguntas frecuentes ❓';
contenido = `
<div class="alert-ayuda">
<h3>${titulo}</h3>
<ol>
<li><strong>¿Cómo te llamas?</strong><br>R: Irving Emilio Gonzalez Romero.</li>
<li><strong>¿Dónde se ubican?</strong><br>R: Cadereyta Jiménez.</li>
<li><strong>¿Cuánto es el premio?</strong><br>R: El premio se publica poco antes del primer partido.</li>
<li><strong>¿Qué pasa si hay varios ganadores?</strong><br>R: El premio se reparte entre las personas con mayor puntaje.</li>
<li><strong>¿A qué hora cierra la quiniela?</strong><br>R: El horario cambia cada semana.</li>
<li><strong>¿Cómo es el método de pago si gano?</strong><br>R: Se te pide una tarjeta para realizar el depósito.</li>
<li><strong>¿Cuándo se publica la lista de participantes?</strong><br>R: Poco antes del primer partido.</li>
<li><strong>¿Cuánto vale la quiniela?</strong><br>R: $30 pesos.</li>
</ol>
</div>
`;
break;
case 'cosas-que-debes-saber':
titulo = 'Cosas que debes de saber ⚠️';
contenido = `
<div class="alert-ayuda">
<h3>${titulo}</h3>
<ol>
<li>La lista de participantes se publica poco antes del primer partido.</li>
<li>La lista de ganadores se publica poco después del último partido.</li>
<li>Quinielas "El Wero" solo responde a la lista general.</li>
<li>La lista general no se modifica una vez publicada.</li>
<li>Quiniela no subida no se juega.</li>
<li>Quiniela con error debe revisarse con su vendedor.</li>
<li>Cualquier protesta debe realizarse antes de que finalice el segundo partido.</li>
<li>Quinielas incompletas o con doble resultado se capturan como empate.</li>
<li>Quinielas enviadas después de las 3 se pasan a la siguiente jornada.</li>
<li>Formatos distintos al oficial no son responsabilidad de Quinielas "El Wero".</li>
<li>Pagos incorrectos deberán verificarse.</li>
</ol>
</div>
`;
break;
}
const overlay = document.createElement('div');
overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999;';
overlay.onclick = () => {
document.body.removeChild(overlay);
document.body.removeChild(alertDiv);
};
const alertDiv = document.createElement('div');
alertDiv.innerHTML = contenido;
alertDiv.style.position = 'fixed';
alertDiv.style.top = '50%';
alertDiv.style.left = '50%';
alertDiv.style.transform = 'translate(-50%, -50%)';
alertDiv.style.zIndex = '10000';
alertDiv.style.width = '95%';
alertDiv.style.maxWidth = '600px';
alertDiv.style.maxHeight = '80vh';
alertDiv.style.overflow = 'auto';
const innerAlert = alertDiv.querySelector('.alert-ayuda');
if (innerAlert) {
innerAlert.style.position = 'relative';
const closeBtn = document.createElement('button');
closeBtn.innerHTML = '✕';
closeBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; background: #006847; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;';
closeBtn.onclick = () => {
document.body.removeChild(alertDiv);
document.body.removeChild(overlay);
};
innerAlert.appendChild(closeBtn);
}
document.body.appendChild(overlay);
document.body.appendChild(alertDiv);
}
let cuentaActualIndex = 0;
function navegarCuenta(direccion) {
const cuentas = document.querySelectorAll('.cuenta-item');
if (cuentas.length === 0) return;
cuentas[cuentaActualIndex].classList.remove('visible');
cuentaActualIndex = (cuentaActualIndex + direccion + cuentas.length) % cuentas.length;
cuentas[cuentaActualIndex].classList.add('visible');
}
function copiarCuenta(numero, banco) {
const textarea = document.createElement('textarea');
textarea.value = numero;
textarea.style.position = 'fixed';
textarea.style.top = '0';
textarea.style.left = '0';
textarea.style.opacity = '0';
document.body.appendChild(textarea);
textarea.focus();
textarea.select();
try {
const successful = document.execCommand('copy');
if (successful) {
mostrarNotificacionCopiado(banco, numero);
}
} catch (err) {
console.error('Error al copiar:', err);
}
document.body.removeChild(textarea);
}
function mostrarNotificacionCopiado(banco, numero) {
const modal = document.createElement('div');
modal.style.cssText = `
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background: linear-gradient(135deg, #006847 0%, #009c3b 100%);
color: white;
padding: 20px 30px;
border-radius: 12px;
box-shadow: 0 8px 24px rgba(0, 104, 71, 0.4);
z-index: 10000;
text-align: center;
animation: fadeInOut 2s ease;
`;
modal.innerHTML = `
<div style="font-size: 40px; margin-bottom: 10px;">✅</div>
<div style="font-size: 16px; font-weight: 700; margin-bottom: 5px;">${banco}</div>
<div style="font-size: 14px; opacity: 0.9;">${numero} copiado</div>
`;
document.body.appendChild(modal);
setTimeout(() => modal.remove(), 2000);
}
//=== Crea el contenido en Administrador para las tarjetas ===//
function crearTarjetaQuinielaAdmin(quiniela, index, mostrarAcciones) {
  const partidos = quiniela.picks || [];
  const nombre = quiniela.nombre || 'Sin nombre';
  const vendedor = quiniela.vendedor || 'Alexander';
  const fecha = quiniela.fecha || '';

  const estaEnLista = !!quiniela.estaEnLista; 
  const folio = quiniela.folio || 'Sin folio';
  const estadoTexto = estaEnLista ? `Jugando (${folio})` : 'No Jugando';
  const estadoColor = estaEnLista ? '#28a745' : '#ce1126';

  const PARTIDOS_ADMIN = [
    'Puebla vs Cruz Azul',
    'Necaxa vs León',
    'Chivas vs Juárez',
    'Toluca vs Pumas',
    'Pachuca vs Tijuana',
    'Tigres vs América',
    'Cruz Azul vs Santos',
    'Querétaro vs Atlas',
    'Monterrey vs Mazatlán'
  ];

  let miniQuinielaHTML = '';

  for (let i = 0; i < 9; i++) {
    const pick = partidos[i] || '';
    let letra = '';

    if (pick === '1' || pick === 'L') letra = 'L';
    else if (pick === '2' || pick === 'E') letra = 'E';
    else if (pick === '3' || pick === 'V') letra = 'V';
    else letra = pick;

    miniQuinielaHTML += `
      <div style="display: grid; grid-template-columns: 1fr 60px 1fr; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 8px; background: #f8f9fa; margin-bottom: 5px; border: 1px solid #e5e5e5;">
        <div style="font-size: 11px; color: #444;">${PARTIDOS_ADMIN[i].split(' vs ')[0]}</div>
        <div style="text-align: center;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 20px; border-radius: 12px; background: white; border: 1px solid #ddd; font-size: 12px; font-weight: 800; color: #333;">
            ${letra || '-'}
          </div>
        </div>
        <div style="font-size: 11px; color: #444; text-align: right;">${PARTIDOS_ADMIN[i].split(' vs ')[1]}</div>
      </div>
    `;
  }

  return `
    <div class="admin-quiniela-card" data-fila="${quiniela.fila}"
      style="background: white; border-radius: 10px; padding: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; border-left: 4px solid #006847; width: 100%; max-width: 500px;">

      <div
        style="
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 3px 12px;
          border-radius: 16px;
          font-size: 11px;
          font-weight: 700;
          background: #ffe5e9;
          color: ${estadoColor};
          border: 1px solid ${estadoColor};
        ">
        ${estaEnLista ? '✔ ' : '✗ '}${estadoTexto}
      </div>

      <div style="margin-bottom: 10px;">
        <div style="color: #006847; font-size: 14px; font-weight: 800;">${nombre}</div>
        <div style="color: #666; font-size: 11px;">Vendedor: ${vendedor}</div>
        <div style="color: #999; font-size: 10px;">${fecha}</div>
      </div>

      <div style="margin-bottom: 10px; max-height: 300px; overflow-y: auto;">
        ${miniQuinielaHTML}
      </div>

      ${mostrarAcciones ? `
      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <button class="btn-admin-rechazar"
          style="flex: 1; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;">
          Rechazar
        </button>
        <button class="btn-admin-aprobar"
          style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;">
          Aprobar
        </button>
      </div>
      ` : ''}

    </div>
  `;
}

//=== Cargar "No confirmadas" ===//
async function cargarAdminNoConfirmadas() {
  const contenedor = document.getElementById('admin-por-aprobar');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="admin-loading">
      <div class="spinner-resultados"></div>
      <p>Cargando quinielas no confirmadas...</p>
    </div>
  `;

  try {
    const resp = await fetch(`${GOOGLE_SHEETS_ADMIN_URL}?tipo=no_confirmadas`);
    const data = await resp.json();
    const participantes = data.participantes || [];

    if (!participantes.length) {
      contenedor.innerHTML = `
        <div class="admin-empty">
          <div style="font-size: 60px; margin-bottom: 10px;">📭</div>
          <h2>No hay quinielas por aprobar</h2>
          <p>Cuando te envíen quinielas, aparecerán aquí.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div class="admin-list-wrapper">
        <h2 class="admin-title">Quinielas por aprobar</h2>
    `;

    participantes.forEach((q, idx) => {
      html += crearTarjetaQuinielaAdmin(q, idx, true);
    });

    html += `</div>`;
    contenedor.innerHTML = html;

    const cards = contenedor.querySelectorAll('.admin-quiniela-card');

    cards.forEach(card => {
      const fila = parseInt(card.getAttribute('data-fila'), 10);
      const btnRechazar = card.querySelector('.btn-admin-rechazar');
      const btnAprobar = card.querySelector('.btn-admin-aprobar');

      if (btnRechazar) {
        btnRechazar.addEventListener('click', async () => {
          await adminRechazarQuinielas([fila]);
        });
      }

      if (btnAprobar) {
        btnAprobar.addEventListener('click', async () => {
          await adminAprobarQuinielas([fila]);
        });
      }
    });

  } catch (err) {
    console.error('Error cargando no confirmadas', err);
    contenedor.innerHTML = `
      <div class="admin-error">
        <p>⚠️ Error al cargar quinielas no confirmadas</p>
        <button class="btn-reload" onclick="cargarAdminNoConfirmadas()">Reintentar</button>
      </div>
    `;
  }
}

//=== Cargar "Confirmadas" ===//
async function cargarAdminConfirmadas() {
  const contenedor = document.getElementById('admin-aprobadas');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="admin-loading">
      <div class="spinner-resultados"></div>
      <p>Cargando quinielas confirmadas...</p>
    </div>
  `;

  try {
    const resp = await fetch(`${GOOGLE_SHEETS_ADMIN_URL}?tipo=confirmadas`);
    const data = await resp.json();
    const participantes = data.participantes || [];

    if (!participantes.length) {
      contenedor.innerHTML = `
        <div class="admin-empty">
          <div style="font-size: 60px; margin-bottom: 10px;">📁</div>
          <h2>No hay quinielas confirmadas</h2>
          <p>Cuando apruebes quinielas, aparecerán aquí.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div class="admin-list-wrapper">
        <h2 class="admin-title">Quinielas confirmadas</h2>
    `;

    participantes.forEach((q, idx) => {
      html += crearTarjetaQuinielaAdmin(q, idx, false);
    });

    html += `</div>`;
    contenedor.innerHTML = html;
  } catch (err) {
    console.error('Error cargando confirmadas', err);
    contenedor.innerHTML = `
      <div class="admin-error">
        <p>⚠️ Error al cargar quinielas confirmadas</p>
        <button class="btn-reload" onclick="cargarAdminConfirmadas()">Reintentar</button>
      </div>
    `;
  }
}

//=== Rechazar quinielas (sin confirm, directo) ===//
async function adminRechazarQuinielas(filas) {
  try {
    console.log('📤 Rechazar filas:', filas);
    await fetch(GOOGLE_SHEETS_ADMIN_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'rechazar',
        filas: filas
      })
    });

    await cargarAdminNoConfirmadas();
  } catch (err) {
    console.error('Error al rechazar', err);
    alert('Error al rechazar quiniela');
  }
}

//=== Aprobar quinielas (sin confirm, directo) ===//
async function adminAprobarQuinielas(filas) {
  try {
    console.log('📤 Aprobar filas:', filas);
    await fetch(GOOGLE_SHEETS_ADMIN_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'aprobar',
        filas: filas
      })
    });

    await cargarAdminNoConfirmadas();
    await cargarAdminConfirmadas();
  } catch (err) {
    console.error('Error al aprobar', err);
    alert('Error al aprobar quiniela');
  }
}

//=== Inicialización de la vista Administrador ===//
document.addEventListener('DOMContentLoaded', function () {
  const adminView = document.getElementById('view-administrador');
  if (!adminView) return;

  const navButtons = document.querySelectorAll('.bottom-nav__item[data-view="view-administrador"]');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      cargarAdminNoConfirmadas();
      cargarAdminConfirmadas();
    });
  });
});
