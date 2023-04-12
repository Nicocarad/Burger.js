const psw = document.querySelector("#psw");
const div = document.querySelector(".hidden");

// visualizzazione delle info password nella view registrazione
psw.addEventListener("mouseover", () => {
  div.style.display = "inline";
});

psw.addEventListener("mouseout", () => {
  div.style.display = "none";
});