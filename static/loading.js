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
let activeIndex = 0;
let timeout;

function setActiveItem(index) {
  for (const item of items) {
    item.classList.remove('active');
  }
  items[index].classList.add('active');
}

function showNextItem() {
  activeIndex = (activeIndex + 1) % items.length;
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

startAutoSwitch();
