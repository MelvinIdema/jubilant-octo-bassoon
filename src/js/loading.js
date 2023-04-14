const loader = document.getElementById("loader");
const loaderContainer = document.querySelector('.loaderContainer')
function showLoader() {
  loaderContainer.classList.add('show')
  loader.classList.add('show')
}
function hideLoader() {
  loaderContainer.classList.remove('show')
  loader.classList.remove('show');
}

const myLoader = document.getElementById('poetryLoader');
const items = myLoader.getElementsByTagName('li');
let activeIndex = getRandomIndex();
let timeout;

function getRandomIndex() {
  return Math.floor(Math.random() * items.length);
}

function setActiveItem(index) {
  for (const item of items) {
    item.classList.remove('active');
  }
  items[index].classList.add('active');
}

function showNextItem() {
  let newIndex = getRandomIndex();
  while (newIndex === activeIndex) {
    newIndex = getRandomIndex();
  }
  activeIndex = newIndex;
  setActiveItem(activeIndex);
}

function showPreviousItem() {
  activeIndex = (activeIndex - 1 + items.length) % items.length;
  setActiveItem(activeIndex);
}

function startAutoSwitch() {
  timeout = setInterval(showNextItem, 6000);
}

function stopAutoSwitch() {
  clearInterval(timeout);
}

document.getElementById('next').addEventListener('click', () => {
  stopAutoSwitch();
  showNextItem();
  startAutoSwitch();
});

document.getElementById('previous').addEventListener('click', () => {
  stopAutoSwitch();
  showPreviousItem();
  startAutoSwitch();
});

setActiveItem(activeIndex);
startAutoSwitch();
