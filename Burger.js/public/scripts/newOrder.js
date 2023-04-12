const es = new EventSource("http://localhost:3000/updates/tocook");

es.addEventListener("new-order", (event) => {
  if(confirm("Nuovo ordine arrivato")){
    location.reload();
  }
});

es.addEventListener("default", (event) => {
  console.log(event);
});