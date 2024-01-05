import { fetchStaticQuiz, fetchDynamicQuiz, fetchCustomQuiz } from "./handlers/fetch.js";
import { getMultiple, getText, onSubmit, getQuestionWrapper } from "./handlers/dom.js";
import { ScoreBoard } from "./score.js";
import { CreateDashboard } from "./create.js";

/*
    Quiz class
    - initQuiz: gets the HTML document templates and calls the appropriate init function
    - render: renders the quiz to the DOM
    - getMultiple, getText, getResult, getQuestionWrapper: helper functions that populate the templates
    - inputValidation: validates the data of the quiz
    - shuffle: shuffles the answers array
*/

class Quiz {
	constructor(param) {
		this.name = param;
		this.toggleResult = this.toggleResult.bind(this);
	}

	async initQuiz() {
		["text", "multiple", "result"].forEach((template) => {
			const t = document.getElementById(template);
			this[template] = t.cloneNode(true).content;
		});

        switch (this.name) {
            case "random-quiz":
                await this.initDynamicQuiz();
                break;
            case "create-quiz":
                await this.initCustomQuiz();
                break;
            default:
                await this.initStaticQuiz();
        }
		
		this.score = new ScoreBoard();
        if(this.quiz) this.render();
	}

	async initStaticQuiz() {
		this.quiz = await fetchStaticQuiz(this.name);
	}

	async initDynamicQuiz() {
		this.quiz = await fetchDynamicQuiz();
	}

	async initCustomQuiz() {
        this.quiz = await fetchCustomQuiz(this.name);
        new CreateDashboard(this.name);
    }

	render() {
		const root = document.getElementById("questions");
		const nodes = [];

		this.quiz.forEach((question, index) => {
			// validate input
			question = this.inputValidation(question, index);

			// get a question-wrapper template
			const wrapper = getQuestionWrapper(question, index);
			const answers = wrapper.querySelector(".answer-wrapper");

          	// populate template
			switch (question.type) {
				case "multiple":
				case "boolean":
					const n = getMultiple(question, this["multiple"], this.score.onChange);
					answers.append(...this.shuffle(n));
					break;
				case "text":
					const m = getText(question, this["text"], this.score.onChange);
					answers.append(m);
					break;
				default:
					throw new Error("Invalid question type");
			}
			nodes.push(wrapper);
		});

		root.append(...nodes);
		this.score.initState(this.quiz);

		const r = onSubmit(this["result"], this.toggleResult);
		root.appendChild(r);
	}

	// Adds event listener to toggle the result visibility
	toggleResult(e) {
		document.querySelectorAll(".show").forEach((show) => show.classList.toggle("now"));

		const symbols = document.querySelectorAll(".answer-symbol");
		const result = this.score.getResult();
		let score = 0;

		for (const [question, value] of Object.entries(result)) {
			const symbol = Array.from(symbols).find((symbol) => symbol.dataset.question == question);
			symbol.innerHTML = value.isCorrect ? "✔" : "✗";
			score = value.isCorrect ? (score += 1) : score;
		}

		const display = document.getElementById("score");
		display.innerHTML = `${score}/${this.quiz.length}`;
	}

	inputValidation(q, i) {
		if (typeof q.correct_answer == "string") q.correct_answer = [q.correct_answer];
		if ("id" in q === false) (q.id = `q${i + 1}`), (q.sort = i + 1);
        q.isRadio = q.correct_answer.length == 1 ? true : false;
        return q
	}

	shuffle(arr) {
		return arr.sort(() => Math.random() - 0.5);
	}
}

export default Quiz;
