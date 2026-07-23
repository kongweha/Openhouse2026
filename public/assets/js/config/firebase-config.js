(() => {
  "use strict";

  const firebaseConfig = Object.freeze({
    apiKey: "AIzaSyAJlt9qKkkUqPrQL7RLoRAPO-ToYwY7Q2o",
    authDomain: "eventstampcard.firebaseapp.com",
    databaseURL: "https://eventstampcard-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "eventstampcard",
    storageBucket: "eventstampcard.firebasestorage.app",
    messagingSenderId: "1072393228911",
    appId: "1:1072393228911:web:66f14d85a50749e7b9b39a",
  });

  if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
  }

  window.openHouseDb = window.firebase.database();
})();
