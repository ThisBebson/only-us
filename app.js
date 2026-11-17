import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,onSnapshot,collection,query,orderBy,limit,addDoc,serverTimestamp,updateDoc} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {getFunctions,httpsCallable} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js';
const $=id=>document.getElementById(id),show=(id,yes)=>$(id).classList.toggle('hidden',!yes),notice=t=>$('notice').textContent=t;
const config=window.ONLY_US_FIREBASE_CONFIG;
if(!config?.projectId || config.projectId.startsWith('WPISZ')) {notice('Uzupełnij firebase-config.js przed uruchomieniem.');} else {
show('setup',false);const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app),fn=getFunctions(app,window.ONLY_US_FUNCTIONS_REGION||'europe-west1');let user=null,pairId=null,unsubs=[],unsubUser=null;
const clear=()=>{unsubs.forEach(f=>f());unsubs=[];pairId=null;show('paired',false);};
async function execute(f){try{await f();notice('');}catch(e){console.error(e);notice('Błąd: '+(e.message||e.code||'spróbuj ponownie'));}}
$('register').onclick=()=>execute(()=>createUserWithEmailAndPassword(auth,$('email').value.trim(),$('password').value));
$('login').onclick=()=>execute(()=>signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value));
$('logout').onclick=()=>execute(()=>signOut(auth));
$('invite').onclick=()=>execute(async()=>{const r=await httpsCallable(fn,'createInvite')({});$('code').textContent='Twój kod: '+r.data.code+' (ważny 24 godziny)';});
$('join').onclick=()=>execute(async()=>{await httpsCallable(fn,'joinInvite')({code:$('joinCode').value.trim().toUpperCase()});$('joinCode').value='';notice('Konta połączone!');});
function startPair(id){if(pairId===id)return;clear();pairId=id;show('paired',true);show('pairBox',false);$('pairStatus').textContent='Jesteście połączeni ❤️';
 unsubs.push(onSnapshot(doc(db,'couples',id),snap=>{const d=snap.data()||{};$('startDate').value=d.startDate||'';const date=d.startDate?new Date(d.startDate+'T12:00:00'):null;$('days').textContent=date?'Dni razem: '+Math.max(0,Math.floor((Date.now()-date.getTime())/86400000)):'Ustaw datę początku związku.';}));
 unsubs.push(onSnapshot(query(collection(db,'couples',id,'messages'),orderBy('createdAt','desc'),limit(60)),snap=>{const el=$('messages');el.replaceChildren();snap.docs.reverse().forEach(s=>{const m=s.data(),div=document.createElement('div'),sm=document.createElement('small');div.className='bubble'+(m.sender===user.uid?' mine':'');div.textContent=m.text||'';sm.textContent=m.sender===user.uid?'Ty':'Druga osoba';div.append(sm);el.append(div);});el.scrollTop=el.scrollHeight;}));
 unsubs.push(onSnapshot(query(collection(db,'couples',id,'events'),orderBy('date','asc'),limit(100)),snap=>{const el=$('events');el.replaceChildren();snap.docs.forEach(s=>{const li=document.createElement('li');li.textContent=s.data().date+' — '+s.data().title;el.append(li);});}));}
 onAuthStateChanged(auth,u=>{if(unsubUser){unsubUser();unsubUser=null;}clear();user=u;show('auth',!u);show('main',!!u);$('status').textContent=u?'Zalogowano':'Zaloguj się';if(!u)return;$('who').textContent=u.email||'';show('pairBox',true);$('pairStatus').textContent='Połączcie konta, aby rozpocząć.';unsubUser=onSnapshot(doc(db,'users',u.uid),snap=>{const id=snap.data()?.coupleId;if(id)startPair(id);else{clear();show('pairBox',true);$('pairStatus').textContent='Połączcie konta, aby rozpocząć.';}},e=>notice(e.message));});
async function send(text){if(!pairId||!text.trim())return;await addDoc(collection(db,'couples',pairId,'messages'),{text:text.trim(),sender:user.uid,createdAt:serverTimestamp()});}
document.querySelectorAll('[data-love]').forEach(b=>b.onclick=()=>execute(()=>send(b.dataset.love)));
$('chatForm').onsubmit=e=>{e.preventDefault();const val=$('message').value;execute(async()=>{await send(val);$('message').value='';});};
$('eventForm').onsubmit=e=>{e.preventDefault();execute(async()=>{if(!pairId)return;await addDoc(collection(db,'couples',pairId,'events'),{title:$('eventTitle').value.trim(),date:$('eventDate').value,createdBy:user.uid,createdAt:serverTimestamp()});$('eventTitle').value='';});};
$('saveDate').onclick=()=>execute(async()=>{if(!pairId)return;await updateDoc(doc(db,'couples',pairId),{startDate:$('startDate').value});});
}
