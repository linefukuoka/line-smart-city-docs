var acc = document.getElementsByClassName("accordion");

function bindEventListener() {
    let i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }

    //setup before functions
    let typingTimer;                //timer identifier
    let doneTypingInterval = 300;  //time in ms, 5 second for example
    let searchQuery = document.getElementById("searchQuery");

    //on keyup, start the countdown
    searchQuery.addEventListener('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    //on keydown, clear the countdown 
    searchQuery.addEventListener('keydown', function () {
        clearTimeout(typingTimer);
    });

    //user is "finished typing," do something
    function doneTyping() {
        let keyword = document.getElementById("searchQuery").value;
        searchQuestion(keyword);
    }
}

function searchQuestion(keyword){
    let foundFlag = false;
    if(keyword !== null && keyword !== ""){
        // Hide all the faq item
        document.querySelectorAll(".faq-item").forEach(item => { item.style.display = 'none'; });
        document.querySelectorAll(".category").forEach(item => { item.style.display = 'none'; });
        faqData.forEach(function(item, i){
            if(item.question.includes(keyword) || item.answer.includes(keyword)){
                foundFlag = true;
                element = document.getElementById("faq_item" + i);
                if(element !== null){
                    element.style.display = 'block';
                    element.parentElement.style.display = 'block';;
                }
            }
        });
    } else {
        document.querySelectorAll(".faq-item").forEach(item => { item.style.display = 'block'; });
        document.querySelectorAll(".category").forEach(item => { item.style.display = 'block'; });
        document.getElementById("not_found").style.display = "none";
        return;
    }

    if(foundFlag === false){
        document.getElementById("not_found").style.display = "block";
    } else {
        document.getElementById("not_found").style.display = "none";
    }
}

function generateFaq(content) {
    content.forEach(function(item, i){
        let faqDiv = document.getElementById("faq");
        let category = document.querySelector(".category[data-category='" + item.category + "']");
        if (category === null) {
            category = document.createElement("div");
            category.setAttribute("class", "category");
            let title = document.createElement("h4");
            title.setAttribute("class", "tit2");
            title.innerHTML = item.category;
            category.setAttribute("data-category", item.category);
            category.append(title);
            faqDiv.append(category);
        }

        let question = document.createElement("button");
        question.setAttribute("class", "accordion question");
        question.innerHTML = item.question;
        let ansPanel = document.createElement("div");
        ansPanel.setAttribute("class", "panel answer");
        let answer = document.createElement("p");
        answer.innerHTML = item.answer;

        let faqItem = document.createElement("div");
        faqItem.setAttribute("id", "faq_item" + i);
        faqItem.setAttribute("class", "faq-item");
        ansPanel.append(answer);
        faqItem.append(question);
        faqItem.append(ansPanel);
        category.append(faqItem);
    });
}

generateFaq(faqData);
bindEventListener();