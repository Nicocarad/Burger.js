const es = new EventSource("http://localhost:3000/updates/tocustomer");
const div1 = document.querySelector(".take");
const div2 = document.querySelector(".current");
const div3 = document.querySelector(".completed");

es.addEventListener("update-order", (event) => {
  let data = JSON.parse(event.data);
  if (data.orderID === document.getElementById("orderId").textContent) {
    //Il primo si resetta
    div1.style.color = "#0e2e5640";
    div1.style.borderColor = "#0e2e5640";
    //Il secondo si attiva
    div2.style.color = "#e72240";
    div2.style.borderColor = "#e72240";
    //Il terzo si resetta
    div3.style.color = "#0e2e5640";
    div3.style.borderColor = "#0e2e5640";
  }
});

es.addEventListener("finish-order", (event) => {
  let data = JSON.parse(event.data);
  if (data.orderID === document.getElementById("orderId").textContent) {
    //Il primo si resetta
    div1.style.color = "#0e2e5640";
    div1.style.borderColor = "#0e2e5640";
    //Il secondo si resetta
    div2.style.color = "#0e2e5640";
    div2.style.borderColor = "#0e2e5640";
    //Il terzo si attiva
    div3.style.color = "#e72240";
    div3.style.borderColor = "#e72240";
  }
});

es.addEventListener("pending-order", (event) => {
  //Il primo si attiva
  div1.style.color = "#e72240";
  div1.style.borderColor = "#e72240";
  //Il secondo si resetta
  div2.style.color = "#0e2e5640";
  div2.style.borderColor = "#0e2e5640";
  //Il terzo si resetta
  div3.style.color = "#0e2e5640";
  div3.style.borderColor = "#0e2e5640";
});