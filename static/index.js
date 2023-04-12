
const svg = document.getElementById("blob-bg-blob");
const s = Snap(svg);
const simpleCup = Snap.select('#blob-one');
const fancyCup = Snap.select('#blob-two');
const simpleCupPoints = simpleCup.node.getAttribute('d');
const fancyCupPoints = fancyCup.node.getAttribute('d');
const toFancy = function(){
  simpleCup.animate({ d: fancyCupPoints }, 5000, mina.backout, toSimple);
}
const toSimple = function(){
  simpleCup.animate({ d: simpleCupPoints }, 5000, mina.backout, toFancy);
}
toSimple();