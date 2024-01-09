import { Quiz } from "./class/quiz.js";
import { CreateQuiz } from "./class/create.js";

/*
    start the quiz
    - get the url parameter to determine which quiz to load
    - create an istance of the quiz class
    - attach intersection observer for visual scroll effects
*/

async function start() {
	const params = new URLSearchParams(window.location.search);
	const param = params.get("id");

	if (param == "create-quiz") {
		console.log("create quiz");
		await new CreateQuiz().init();
	} else {
		console.log("start quiz");
		await new Quiz(param, false).init();
	}

	// intersectionObserver();
}

document.addEventListener("DOMContentLoaded", start);
