import { getUser } from "../user/handlers/store.js";
import { LocalStore } from "../quiz/class/local-storage.js";

import { getEnv } from "../env.js";
const baseUrl = getEnv();

// Initialize the overview page
const initQuiz = () => {
    // Welcome user
	const user = getUser();
	const welcome = document.querySelector("#user");

    user ? welcome.innerHTML = "Welcome " + user[0] + "!" : "Welcome!";
    welcome.style.whiteSpace = "wrap";
    createPage();

    // Add event listeners  
	const quizzes = document.querySelector(".quiz").children;
	[...quizzes].forEach((quiz) => quiz.addEventListener("click", toQuiz));
};

// Handler for the click events
const toQuiz = (e) => {
    const page = e.currentTarget.id;
    console.log(page);  
    if (page == "user-page") window.location.href = baseUrl;
    else window.location.href = baseUrl + `/src/quiz/index.html?id=${page}`;
};

// Create the page from a template
const createPage = async () => {
    const template = document.querySelector("template");
    const root = document.querySelector("section.quiz");

    // Get all quiz-names from local storage
    const list = LocalStore.getAllNames();  

    // Append two mandatory cards
    list.unshift("scandinavia");
    list.push("random-quiz")

    let lastIndex = 0;
    const fragment = document.createDocumentFragment();
    
    list.forEach((name, i) => {
        lastIndex = i;
        const n = getCard(template, name, i);
        fragment.appendChild(n);
    });

    const next = getCard(template, "create-quiz", lastIndex + 1);
    fragment.appendChild(next);

    root.appendChild(fragment);
}

// Construct a card for each quiz
const getCard = (template, name, i) => {
    const clone = template.cloneNode(true).content;
    const article = clone.querySelector("article");
    article.id = name;
    const file = baseUrl + '/public/' + 'image_s_' + Number(i + 1) + '.jpg'; 

    article.style.backgroundImage = `url(${file})`;
    name != "create-quiz" ? clone.querySelector("h4").innerHTML = `Quiz: ${i + 1}` : null;
    clone.querySelector("p").innerHTML = name[0].toUpperCase() + name.slice(1);
    return clone;
};

document.addEventListener("DOMContentLoaded", initQuiz);
