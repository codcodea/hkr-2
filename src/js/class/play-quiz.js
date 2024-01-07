import { fetchStaticQuiz, fetchDynamicQuiz, fetchCustomQuiz } from "./handlers/fetch.js";
import { getMultiple, getText, onSubmit, getQuestionWrapper } from "./handlers/dom.js";
import { ScoreTracker } from "./score-tracker.js";
import { LocalStore } from "./local-storage.js";

class Quiz {
	constructor(param, controls = false) {
		this.param = param;
        this.controls = controls; 
        this.toggleResult = this.toggleResult.bind(this); 
        this.handleQuiz = this.handleQuiz.bind(this);
	}

	async init() {
        this.score = new ScoreTracker();
        this.store = new LocalStore();

		["text", "multiple", "result"].forEach((template) => {
			const t = document.getElementById(template);
			this[template] = t.cloneNode(true).content;
		});

        this.remove();

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
		if (this.quiz) this.render();
	}

	remove() {
		document.getElementById("questions").innerHTML = "";
	}

	async initStaticQuiz() {
		this.quiz = await fetchStaticQuiz(this.param);
	}

	async initDynamicQuiz() {
		this.quiz = await fetchDynamicQuiz(this.param);
	}

	initCustomQuiz() {
		console.log("initCustomQuiz");
		this.quiz = this.store.getQuiz(this.param);
	}

	render() {
        this.remove();

		const root = document.getElementById("questions");
		const nodes = [];

		this.quiz.forEach((question, index) => {
			question = this.inputValidation(question, index);

			const wrapper = getQuestionWrapper(question, index, this.controls, this.handleQuiz);
			const answers = wrapper.querySelector(".answer-wrapper");

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

	toggleResult(e) {
        
        if(e.target.textContent == "Done") return window.location = "overview.html";
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

        e.target.textContent = "Done";
	}

    handleQuiz(e) {
        const q = e.target.dataset.question;
        switch(e.target.textContent) {
            case "X":
                this.quiz = this.store.deleteQuestion(this.param, q);
                break;
            case "↑":
                this.quiz = this.store.sortQuestion(this.param, q, "up"); 
                break;
            case "↓":
                this.quiz = this.store.sortQuestion(this.param, q, "down");
                break;
        }
        this.render();
    }

	inputValidation(q, i) {
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
