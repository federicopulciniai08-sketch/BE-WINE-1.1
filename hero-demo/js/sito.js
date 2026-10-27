// Un clic veloce dura meno di 100 ms: tengo lo stato "premuto" almeno 160 ms
// perché colore e ingrandimento si vedano davvero.
document.querySelectorAll(".nav__link").forEach(function (link) {
  var down = 0;
  link.addEventListener("pointerdown", function () {
    down = Date.now();
    link.classList.add("is-pressed");
  });
  function release() {
    var wait = Math.max(0, 160 - (Date.now() - down));
    setTimeout(function () { link.classList.remove("is-pressed"); }, wait);
  }
  link.addEventListener("pointerup", release);
  link.addEventListener("pointercancel", release);
  link.addEventListener("pointerleave", release);
});
