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