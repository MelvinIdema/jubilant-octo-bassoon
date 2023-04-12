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
  const url = `https://dichter.responsible-it.nl/api/poetry?type=${type}&theme=${encodeURIComponent(theme)}`;
  const headers = {
    "Authorization": `Bearer dichter-a6a8ae46-4c90`  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    output.textContent = data.data.paragraph;
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