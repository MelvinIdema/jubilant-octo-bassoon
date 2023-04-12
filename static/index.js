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

async function fetchPoem() {
  const type = typeSelect.value;
  const theme = themeInput.value;

  try {
    const response = await fetch('/prompt/fetch-poem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, theme })
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    output.textContent = data.poem;
  } catch (error) {
    console.error("Er is een fout opgetreden:", error);
  }
}
const poemForm = document.querySelector("#poemForm");
const typeSelect = document.querySelector("#poemForm select");
const themeInput = document.querySelector("#poemForm input");
const output = document.querySelector(".output");

poemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  fetchPoem();
});

async function fetchPoem() {
  const type = typeSelect.value;
  const theme = themeInput.value;

  try {
    const response = await fetch('/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, theme })
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    output.textContent = data.poem;
  } catch (error) {
    console.error("Er is een fout opgetreden:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const ulElement = document.querySelector('header ul');
    const inputField = document.getElementById('theme');
    inputField.addEventListener('input', (event) => {
      const theme = event.target.value;
      const themes = theme.split(',').map((theme) => theme.trim());
      ulElement.innerHTML = '';
      themes.forEach((theme) => {
        const liElement = document.createElement('li');
        liElement.innerText = theme;
        ulElement.appendChild(liElement);
      });
    });
  });