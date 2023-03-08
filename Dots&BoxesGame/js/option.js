const body = document.querySelector("body");
const option = document.querySelector(".option");
const play = option.querySelector(".play");
const s3x3 = option.querySelector(".s3x3");
const s5x5 = option.querySelector(".s5x5");
const s7x7 = option.querySelector(".s7x7");

const game = document.querySelector(".game");
const player1 = game.querySelector(".player1");
const player2 = game.querySelector(".player2");
const app = game.querySelector(".app");

let size;

s3x3.addEventListener("click", function () {
  size = "3x3";
  switchActive(s3x3, s5x5, s7x7);
});

s5x5.addEventListener("click", function () {
  size = "5x5";
  switchActive(s5x5, s7x7, s3x3);
});

s7x7.addEventListener("click", function () {
  size = "7x7";
  switchActive(s7x7, s3x3, s5x5);
});

play.addEventListener("click", function () {
  if (!size) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please select board size!",
    });
    return;
  } else {
    option.classList.add("hind");
    game.classList.remove("hind");
    body.style.backgroundColor = "rgb(255, 240, 156)";
  }
  init(size);
});

function switchActive(on, off1, off2) {
  off1.classList.remove("active");
  off2.classList.remove("active");
  on.classList.add("active");
}
