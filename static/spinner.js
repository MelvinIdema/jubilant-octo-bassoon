const alternatives = ["stervoetballers", "voetbalkampioenen", "topspelers", "voetbaltalenten"];
const selectContainer = document.querySelector(".select__container");
const selectedItemInput = document.getElementById("selectedItemInput");

function injectAlternatives(alternatives) {
  const selectList = document.querySelector(".select__list");
  selectList.innerHTML = "";

  alternatives.forEach((alternative) => {
    const selectItem = document.createElement("div");
    selectItem.classList.add("select__item");
    selectItem.textContent = alternative;
    selectList.appendChild(selectItem);
  });
}

injectAlternatives(alternatives);

const selectList = document.querySelector(".select__list");
const selectItems = document.querySelectorAll(".select__item");

let isDragging = false;

let startMousePosY = 0;

selectContainer.addEventListener("mousedown", (e) => {
  startMousePosY = e.clientY;
  isDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const top = selectList.style.top ? parseInt(selectList.style.top) : 0;
  selectList.style.top = `${top - ((startMousePosY - e.clientY) / 25)}px`;
});

document.addEventListener("mouseup", posItems);

function getItemDistanceFromMiddle(item, container) {
  const itemRect = item.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const itemMiddle = itemRect.top + (itemRect.height / 2);
  const containerMiddle = containerRect.top + (containerRect.height / 2);

  return Math.abs(itemMiddle - containerMiddle);
}

function posItems() {
  isDragging = false;
  const items = [];

  selectItems.forEach(item => {
    const distance = getItemDistanceFromMiddle(item, selectContainer);
    items.push({
      distance,
      item,
    });
  });

  items.sort((a, b) => a.distance - b.distance);

  const closestItem = items[0].item;
  selectedItemInput.value = closestItem.textContent;

  selectItems.forEach(item => {
    item.classList.remove("select__item--selected");
  });

  closestItem.classList.add("select__item--selected");

  const closestItemRect = closestItem.getBoundingClientRect();
  const selectContainerRect = selectContainer.getBoundingClientRect();

  const closestItemMiddle = closestItemRect.top + (closestItemRect.height / 2);
  const selectContainerMiddle = selectContainerRect.top + (selectContainerRect.height / 2);

  const offset = selectContainerMiddle - closestItemMiddle;

  const selectListTop = parseInt(selectList.style.top) || 0;
  selectList.style.top = `${selectListTop + offset}px`;

  blurItemBasedOnDistanceFromMiddle();
}

posItems();

function blurItemBasedOnDistanceFromMiddle() {
  selectItems.forEach(item => {
    const distance = getItemDistanceFromMiddle(item, selectContainer);
    const blur = distance / 50;
    item.style.filter = `blur(${blur}px)`;
    item.style.transform = `scale(${1 - (blur / 100)})`;
  });
}

blurItemBasedOnDistanceFromMiddle();

function submit() {
  console.log(selectedItemInput.value);
}

document.querySelector(".select__submit").addEventListener("click", submit);