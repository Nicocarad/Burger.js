//Preleva tutti gli elementi "li" di classe "prod"
const items = document.querySelectorAll(".prod");
//Inizializza variabili
let products = [];
let obj;
let sum = 0;
//Per ogni elemento registra un event listener associato al click dell'immagine
for (let x = 0; x < items.length; x++) {
  items[x].childNodes[5].addEventListener("click", () => {
    //Realizza l'oggetto dell'elemento cliccato da inserire nell'ordine
    obj = {
      nome: items[x].childNodes[1].textContent,
      prezzo: items[x].childNodes[3].textContent,
    };
    //Aggiorna la somma per il prezzo totale dell'ordine
    sum += parseFloat(items[x].childNodes[3].textContent);
    //Inserimento dell'oggetto creato all'interno dell'array di prodotti
    products.push(obj);
    //Crea l'elemento di lista dell'ordine
    const newItem = document.createElement("li");
    newItem.setAttribute("class", "order");
    newItem.textContent = obj.nome;
    console.log(newItem.textContent);
    document.getElementById("ordine").appendChild(newItem);
    //Aggiorna il valore del totale
    document.getElementById("total").textContent = sum.toFixed(2);
  });
};

//Funzione invocata al submit del form relativo all'ordine
function invia() {
  //Impostazione dei valori da inviare
  document
    .getElementById("products")
    .setAttribute("value", JSON.stringify(products));
  document.getElementById("sum").setAttribute("value", sum.toFixed(2));
  //Submit del form
  document.getElementById("send-form").submit();
};