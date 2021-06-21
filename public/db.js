
let db;
let budgetStore;

const request = indexedDB.open ("BudgetDB, 1")

request.onupgradeneeded = function (e) {
db = e.target.result;

if (db.objectStoreNames.length === 0) {
    budgetStore = 
db.createObjectStore ('budget', {autoIncrement: true});

}

 budgetStore.createIndex("dateIndex", "date");
 budgetStore.createIndex("nameIndex", "name");
 budgetStore.createIndex("valueIndex", "value");
 



}
request.onerror = function (e) {
    console.log(`Woops! ${e.target.errorCode}`);
  };
  
request.onsuccess = function (e) {

    const transaction = db.transaction(['budgetStore'], 'readwrite')

    .add({name: "job deposit", value: '1000', date: '2/02/2021'})

}