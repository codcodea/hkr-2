import { getUser } from "./user.js";

const toQuiz = (e) => {
    console.log("toQuiz")
    window.location.href = `./quiz.html?id=${e.currentTarget.id}`;
}

const initQuiz = () => {
    console.log("initQuiz");

	const user = getUser();
	const welcome = document.querySelector("#user");
	// welcome.innerHTML = user[0];

    const quizzes = document.querySelector(".quiz").children;
    [...quizzes].forEach(quiz => quiz.addEventListener("click", toQuiz));
   
};

document.addEventListener("DOMContentLoaded", initQuiz);
