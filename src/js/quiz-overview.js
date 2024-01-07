import { getUser } from "./user.js";
import { LocalStore } from "./class/local-storage.js";

const toQuiz = (e) => {
	console.log("toQuiz");
	window.location.href = `./quiz.html?id=${e.currentTarget.id}`;
};

const initQuiz = async () => {
	console.log("initQuiz");

	const user = getUser();
	const welcome = document.querySelector("#user");
	// welcome.innerHTML = user[0];

    await fetchCustomQuiz();

	const quizzes = document.querySelector(".quiz").children;
	[...quizzes].forEach((quiz) => quiz.addEventListener("click", toQuiz));
};

const fetchCustomQuiz = async () => {
    const template = document.querySelector("template");
    const list = LocalStore.getAllNames();  
    
    list.forEach((name) => {
        const clone = template.cloneNode(true).content;
        clone.querySelector("article").id = name;
        clone.querySelector("h4").innerHTML = name;
        clone.querySelector("p").innerText = "Category: Test";

        document.querySelector(".quiz").append(clone);
    });
}


document.addEventListener("DOMContentLoaded", initQuiz);
