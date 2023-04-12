const selectContainer = document.querySelector(".select__container");
const selectedItemInput = document.getElementById("selectedItemInput");
let selectList = null;
let selectItems = null;
let isDragging = false;
let startMousePosY = 0;
let isDoneWithScrolling = false;

function showSpinner(alternatives) {
  const _selectList = document.querySelector(".select__list");
  _selectList.innerHTML = "";

  alternatives.forEach((alternative) => {
    const selectItem = document.createElement("div");
    selectItem.classList.add("select__item");
    selectItem.textContent = alternative;
    _selectList.appendChild(selectItem);
  });

  document.getElementById("select__spinner").style.display = "block";

  selectList = document.querySelector(".select__list");
  selectItems = document.querySelectorAll(".select__item");

  isDragging = false;

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

  blurItemBasedOnDistanceFromMiddle();
  posItems();
}

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

function blurItemBasedOnDistanceFromMiddle() {
  selectItems.forEach(item => {
    const distance = getItemDistanceFromMiddle(item, selectContainer);
    const blur = distance / 50;
    item.style.filter = `blur(${blur}px)`;
    item.style.transform = `scale(${1 - (blur / 100)})`;
  });
}

function submit() {
  console.log(selectedItemInput.value);
}

document.querySelector(".select__submit").addEventListener("click", submit);

const examplePoem = {
  paragraph:
    "Op het groene veld vol passie, waar de voetbalhelden strijden. Schijnbeweging, tact en actie, het publiek kan zich verblijden. Op het groene veld vol passie, waar de voetbalhelden strijden. Schijnbeweging, tact en actie, het publiek kan zich verblijden.",
  keywords: [
    {
      keyword: "voetbalhelden",
      alternatives: ["stervoetballers", "voetbalkampioenen", "topspelers", "voetbaltalenten"],
    },
    {
      keyword: "tact",
      alternatives: ["strategie", "slimheid", "inzicht", "techniek"],
    },
    {
      keyword: "actie",
      alternatives: ["beweging", "dynamiek", "snelheid", "energie"],
    },
  ],
};
// TODO: add support for capitalized keywords.

const init = () => {
  const poem = document.querySelector(".poem");

  if (!poem) return;

  // Split the single paragraph in separate sentences
  const sentences = examplePoem.paragraph.split(". ").map((sentence) => {
    if (sentence.charAt(sentence.length - 1) !== ".") {
      // Add a period to the end of the sentence if it was removed by the initial split
      const newSentence = sentence + ".";

      return newSentence;
    }

    return sentence;
  });

  // Create an array of keywords and sentence elements
  const keywords = examplePoem.keywords.map((keywordObj) => keywordObj.keyword);
  const sentenceElements = sentences.map((sentence) => createParagraphWithKeywords(sentence, keywords, examplePoem.keywords));

  sentenceElements.forEach((sentenceElement) => {
    poem.appendChild(sentenceElement);
  });

  poem.style.paddingTop = `calc(50vh - ${sentenceElements[0].offsetHeight / 2}px)`;
  poem.style.paddingBottom = `calc(50vh - ${sentenceElements[sentenceElements.length - 1].offsetHeight / 2}px)`;

  startPoem(sentences);
};

const createParagraphWithKeywords = (text, keywords, keywordObjs) => {
  const paragraph = document.createElement("p");
  let currentIndex = 0;

  paragraph.classList.add("blur");

  keywords.forEach((keyword) => {
    const keywordIndex = text.indexOf(keyword, currentIndex);

    if (keywordIndex !== -1) {
      const beforeKeyword = text.substring(currentIndex, keywordIndex);

      if (beforeKeyword.length > 0) {
        paragraph.appendChild(document.createTextNode(beforeKeyword));
      }

      const keywordSpan = document.createElement("span");

      keywordSpan.appendChild(document.createTextNode(keyword));
      // Add a custom data attribute to the keyword span containing it's possible alternatives
      keywordSpan.dataset.alternatives = keywordObjs
        .find((keywordObj) => keywordObj.keyword === keyword)
        .alternatives.join(",");
      paragraph.appendChild(keywordSpan);

      keywordSpan.addEventListener("click", handleClick);

      currentIndex = keywordIndex + keyword.length;
    }
  });

  const afterLastKeyword = text.substring(currentIndex);

  if (afterLastKeyword.length > 0) {
    paragraph.appendChild(document.createTextNode(afterLastKeyword));
  }

  return paragraph;
};

const startPoem = (sentences) => {
  const poemWrapper = document.querySelector(".poem-wrapper");
  const poem = document.querySelector(".poem");
  const share = document.querySelector(".share");
  const childNodes = poem.childNodes;
  const millisecondsPerChar = 75;
  let scroll = 0;
  let timeout = 0;

  childNodes.forEach((child, i) => {
    if (i > 0) {
      timeout += sentences[i - 1].length * millisecondsPerChar;
    }

    setTimeout(() => {
      child.classList.remove("blur");

      if (i <= 0) return;

      // Increase the scroll distance by the height of the previous sentence
      scroll += childNodes[i - 1].offsetHeight + 32;
      poemWrapper.scrollTop = scroll;

      if (i !== childNodes.length - 1) return;

      setTimeout(() => {
        share.classList.add("show");
        isDoneWithScrolling = true;
      }, 1000);
    }, timeout);
  });
};

const handleClick = (e) => {
  if (!isDoneWithScrolling) return;
  const alternatives = e.target.dataset.alternatives.split(",");
  showSpinner(alternatives);
};

init();

