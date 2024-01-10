import { fetchStaticQuiz, fetchDynamicQuiz } from "./handlers/fetch.js";
import { getMultiple, getText, onSubmit, getQuestionWrapper } from "./handlers/dom.js";
import { ScoreTracker } from "./score.js";
import { LocalStore } from "./local-storage.js";
import { getEnv } from "../../env.js";

const baseUrl = getEnv();

/* 
    This class is responsible for a quiz (a set of questions).
*/

class Quiz {
	constructor(param, controls = false) {
		this.param = param; // quiz id from the url
		this.controls = controls;
	}

	async init() {

		// Add an instance of the score and store classes
		this.score = new ScoreTracker();
		this.store = new LocalStore();

		// Get the DOM elements for later use
		this.getDomRefs();

		// Route to the correct init method
		switch (this.param) {
			case "random-quiz":
				await this.initDynamicQuiz();
				break;
			case "scandinavia":
			case "puzzle":
				await this.initStaticQuiz();
				break;
			default:
				this.initCustomQuiz();
		}
		this.clear();
		if (this.quiz) this.render();
	}

	getDomRefs() {
		this.root = document.getElementById("questions");
		this["text"] = document.getElementById("text").cloneNode(true).content;
		this["multiple"] = document.getElementById("multiple").cloneNode(true).content;
		this["result"] = document.getElementById("result").cloneNode(true).content;
	}

	async initStaticQuiz() {
		this.quiz = await fetchStaticQuiz(this.param);
	}

	async initDynamicQuiz() {
		const [ok, message] = await fetchDynamicQuiz(this.param);
        if (ok) this.quiz = message;
        else alert(message);
        
	}

	initCustomQuiz() {
		this.quiz = this.store.getQuiz(this.param);
	}

	render() {
		const nodes = [];
		this.clear();

		this.quiz.forEach((q, i) => {
			q = this.clean(q, i);

			// Get templates and populate with data
			const question = getQuestionWrapper(q, i, this.controls, this.handleControl);
			const answers = question.querySelector(".answer-wrapper");

			switch (q.type) {
				case "multiple":
				case "boolean":
					const nodes = getMultiple(q, i, this["multiple"], this.score.handleSubmit);
					answers.append(...this.shuffle(nodes));
					break;
				case "text":
					const node = getText(q, i, this["text"], this.score.handleSubmit);
					answers.append(node);
					break;
				default:
					throw new Error("Invalid question type");
			}
			nodes.push(question);
		});

		this.root.append(...nodes);

		if (!this.controls) {
			// if sortable
			const button = onSubmit(this["result"], this.handleSubmit);
			this.root.appendChild(button);
		}

		// Initialize the score tracker
		this.score.init(this.quiz, this.root);
	}

	// Event handler for the submit button
	handleSubmit = (e) => {
		if (e.target.textContent == "Done") return (window.location = baseUrl + "/src/overview/index.html");

		if (this.score.getResult()) {
			this.root.querySelectorAll(".show").forEach((show) => show.classList.toggle("now"));
			e.target.textContent = "Done";
		}
	};

	// Event handler for the control buttons, if present
	handleControl = (e) => {
		const index = e.target.dataset.question;
		switch (e.target.textContent) {
			case "X":
				this.quiz = this.store.deleteQuestion(this.param, index);
				break;
			case "↑":
				this.quiz = this.store.sortQuestion(this.param, index, "up");
				break;
			case "↓":
				this.quiz = this.store.sortQuestion(this.param, index, "down");
				break;
		}
		this.render();
	};

	// Clear the DOM
	clear() {
		this.root.innerHTML = "";
	}

	// Shuffle the order of the answers
	shuffle(arr) {
		return arr.sort(() => Math.random() - 0.5);
	}

	// Aligns data from different input sources (local storage, json, api)
	clean(q, i) {
		if (typeof q.correct_answer == "string") q.correct_answer = [q.correct_answer];
		if ("id" in q === false) (q.id = `q${i + 1}`), (q.sort = i + 1);
		q.isRadio = q.correct_answer.length == 1 ? true : false;
		return q;
	}
}

export { Quiz };
