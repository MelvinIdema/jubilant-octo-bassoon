const selectContainer=document.querySelector(".select__container"),selectedItemInput=document.getElementById("selectedItemInput");function showSpinner(e){const t=document.querySelector(".select__list");t.innerHTML="",e.forEach(e=>{const s=document.createElement("div");s.classList.add("select__item"),s.textContent=e,t.appendChild(s)}),blurItemBasedOnDistanceFromMiddle(),posItems(),document.getElementById("select__spinner").style.display="block"}const selectList=document.querySelector(".select__list"),selectItems=document.querySelectorAll(".select__item");let isDragging=!1,startMousePosY=0;function getItemDistanceFromMiddle(e,t){const s=e.getBoundingClientRect(),n=t.getBoundingClientRect(),c=s.top+s.height/2,o=n.top+n.height/2;return Math.abs(c-o)}function posItems(){isDragging=!1;const e=[];selectItems.forEach(t=>{const s=getItemDistanceFromMiddle(t,selectContainer);e.push({distance:s,item:t})}),e.sort((e,t)=>e.distance-t.distance);const t=e[0].item;selectedItemInput.value=t.textContent,selectItems.forEach(e=>{e.classList.remove("select__item--selected")}),t.classList.add("select__item--selected");const s=t.getBoundingClientRect(),n=selectContainer.getBoundingClientRect(),c=s.top+s.height/2,o=n.top+n.height/2-c,i=parseInt(selectList.style.top)||0;selectList.style.top=`${i+o}px`,blurItemBasedOnDistanceFromMiddle()}function blurItemBasedOnDistanceFromMiddle(){selectItems.forEach(e=>{const t=getItemDistanceFromMiddle(e,selectContainer)/50;e.style.filter=`blur(${t}px)`,e.style.transform=`scale(${1-t/100})`})}function submit(){console.log(selectedItemInput.value)}selectContainer.addEventListener("mousedown",e=>{startMousePosY=e.clientY,isDragging=!0}),document.addEventListener("mousemove",e=>{if(!isDragging)return;const t=selectList.style.top?parseInt(selectList.style.top):0;selectList.style.top=`${t-(startMousePosY-e.clientY)/25}px`}),document.addEventListener("mouseup",posItems),document.querySelector(".select__submit").addEventListener("click",submit);