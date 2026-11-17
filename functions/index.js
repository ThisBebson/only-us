const {onCall,HttpsError}=require('firebase-functions/v2/https');
const admin=require('firebase-admin');
const crypto=require('node:crypto');
admin.initializeApp();const db=admin.firestore();
const opts={region:'europe-west1',enforceAppCheck:false,maxInstances:10};
const requireUser=r=>{if(!r.auth)throw new HttpsError('unauthenticated','Zaloguj się.');return r.auth.uid;};
exports.createInvite=onCall(opts,async r=>{
 const uid=requireUser(r),user=db.doc('users/'+uid),snap=await user.get();
 if(snap.exists && snap.data().coupleId)throw new HttpsError('failed-precondition','Konto jest już połączone.');
 const code=crypto.randomBytes(8).toString('hex').slice(0,10).toUpperCase();
 await db.doc('invites/'+code).create({owner:uid,expires:admin.firestore.Timestamp.fromMillis(Date.now()+86400000),used:false,createdAt:admin.firestore.FieldValue.serverTimestamp()});
 return {code};
});
exports.joinInvite=onCall(opts,async r=>{
 const uid=requireUser(r),code=String(r.data?.code||'').trim().toUpperCase();
 if(!/^[0-9A-F]{10}$/.test(code))throw new HttpsError('invalid-argument','Nieprawidłowy kod.');
 const invite=db.doc('invites/'+code),mine=db.doc('users/'+uid);
 await db.runTransaction(async t=>{
  const inv=await t.get(invite);
  if(!inv.exists||inv.data().used||inv.data().expires.toMillis()<Date.now())throw new HttpsError('not-found','Kod wygasł lub został użyty.');
  const owner=inv.data().owner;
  if(owner===uid)throw new HttpsError('failed-precondition','Nie można połączyć konta z samym sobą.');
  const theirs=db.doc('users/'+owner),[me,them]=await Promise.all([t.get(mine),t.get(theirs)]);
  if(me.data()?.coupleId||them.data()?.coupleId)throw new HttpsError('failed-precondition','Jedno z kont jest już połączone.');
  const couple=db.collection('couples').doc();
  t.create(couple,{members:[owner,uid],createdAt:admin.firestore.FieldValue.serverTimestamp(),startDate:''});
  t.set(mine,{coupleId:couple.id},{merge:true});t.set(theirs,{coupleId:couple.id},{merge:true});
  t.update(invite,{used:true,usedBy:uid});
 });
 return {ok:true};
});
