import Quiz from "./class/quiz.js";

/*
    start the quiz
    - get the url parameter to determine which quiz to load
    - create an istance of the quiz class
    - attach intersection observer for visual scroll effects
*/

async function start() {
	const params = new URLSearchParams(window.location.search);
	const param = params.get("id");

	await new Quiz(param).initQuiz();

	// intersectionObserver();
}

document.addEventListener("DOMContentLoaded", start);
