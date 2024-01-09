import { fetchStaticQuiz, fetchDynamicQuiz } from "./handlers/fetch.js";
import { getMultiple, getText, onSubmit, getQuestionWrapper } from "./handlers/dom.js";
import { ScoreTracker } from "./score.js";
import { LocalStore } from "./local-storage.js";
import { getEnv } from "../../env.js";

const baseUrl = getEnv();

class Quiz {
	constructor(param, controls = false) {
		this.param = param;
		this.controls = controls;
	}

	// Initialize the quiz and route to the correct fetch function
	async init() {
		this.score = new ScoreTracker();
		this.store = new LocalStore();
        this.getDomRefs();

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
        console.log(this.param)
	}

	async initDynamicQuiz() {
		this.quiz = await fetchDynamicQuiz(this.param);
	}

	initCustomQuiz() {
		this.quiz = this.store.getQuiz(this.param);
	}

	render() {
		const nodes = [];
		this.clear();

		this.quiz.forEach((q, i) => {
			q = this.clean(q, i);

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

		// Append to DOM
		this.root.append(...nodes);

		if (!this.controls) {
			const button = onSubmit(this["result"], this.handleSubmit);
			this.root.appendChild(button);
		}

		// Init score calculation
		this.score.init(this.quiz, this.root);
	}

	handleSubmit = (e) => {
		if (e.target.textContent == "Done") return (window.location = baseUrl + "/src/overview/index.html");

        // Show score if no error
		if (this.score.getResult()) {
			this.root.querySelectorAll(".show").forEach((show) => show.classList.toggle("now"));
			e.target.textContent = "Done";
		}
	}

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
	}

    clear() {
		this.root.innerHTML = "";
	}

	clean(q, i) {
        // Aligns data from different input sources
		if (typeof q.correct_answer == "string") q.correct_answer = [q.correct_answer];
		if ("id" in q === false) (q.id = `q${i + 1}`), (q.sort = i + 1);
		q.isRadio = q.correct_answer.length == 1 ? true : false;
		return q;
	}

	shuffle(arr) {
		return arr.sort(() => Math.random() - 0.5);
	}
}

export { Quiz };
