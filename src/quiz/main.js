import { Quiz } from "./class/quiz.js";
import { CreateQuiz } from "./class/create.js";

/*
    start the quiz
    - get the url parameter to determine which quiz to load
    - create an istance of the quiz class
*/

async function start() {
	const params = new URLSearchParams(window.location.search);
	const param = params.get("id");

	if (param == "create-quiz") {
        document.title = "Create Quiz";
		new CreateQuiz().init();
	} else {
        document.title = param[0].toUpperCase() + param.slice(1); 
		await new Quiz(param, false).init();
	}
}

document.addEventListener("DOMContentLoaded", start);
