const examplePoem = {
  paragraph:
    "Op het groene veld vol passie, waar de voetbalhelden strijden. Schijnbeweging, tact en actie, het publiek kan zich verblijden. Schijnbeweging, tact en actie, het publiek kan zich verblijden. Schijnbeweging, tact en actie, het publiek kan zich verblijden.",
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

(function () {
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

  const handleClick = (e) => {
    const alternatives = e.target.dataset.alternatives.split(",");

    console.log(alternatives);
  };

  const startPoem = (sentences) => {
    const poem = document.querySelector(".poem");
    const childNodes = poem.childNodes;
    let scrollY = 0;
    let timeout = 0;

    childNodes.forEach((child, i) => {
      if (i > 0) {
        timeout += sentences[i - 1].length * 75;
      }

      setTimeout(() => {
        child.classList.remove("blur");

        if (i <= 0) return;

        scrollY += childNodes[i - 1].offsetHeight;
        window.scrollTo(0, scrollY);
      }, timeout);
    });
  };

  init();
})();
