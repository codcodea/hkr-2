import { getUser } from "../user/handlers/store.js";
import { LocalStore } from "../quiz/class/local-storage.js";

const toQuiz = (e) => {
	window.location.href = `../quiz/index.html?id=${e.currentTarget.id}`;
};

const initQuiz = async () => {
	const user = getUser();
	const welcome = document.querySelector("#user");
	welcome.innerHTML = user[0];

    await fetchCustomQuiz();

	const quizzes = document.querySelector(".quiz").children;
	[...quizzes].forEach((quiz) => quiz.addEventListener("click", toQuiz));
};

const fetchCustomQuiz = async () => {
    const template = document.querySelector("template");
    const insertAfter = document.querySelector("section.quiz article");
    const list = LocalStore.getAllNames();  
    const fragment = document.createDocumentFragment();

    let lastIndex = 0;
    
    list.forEach((name, i) => {
        lastIndex = i;
        const clone = template.cloneNode(true).content;
        clone.querySelector("article").id = name;
        clone.querySelector("h4").innerHTML = `Quiz: ${i + 2}: ${name}`;
        fragment.appendChild(clone);
    });

    const clone = template.cloneNode(true).content;
    clone.querySelector("article").id = "random-quiz";
    clone.querySelector("h4").innerHTML = `Quiz: ${lastIndex + 3}: Random`;
    fragment.appendChild(clone);


    insertAfter.after(fragment);
}


document.addEventListener("DOMContentLoaded", initQuiz);
