class ScoreTracker {
	state = {};
	questions = null;

	constructor() {}

	init(questions, root) {
		for (const [key, value] of Object.entries(questions)) {
			this.state[Number(key)] = this.getTracker(value);
		}
        this.root = root;
		this.getDomRefs();
	}

	getTracker(value) {
		// Tracker is a state object for each question
		return {
			question: value.question,
			selected: new Set(),
			answers: new Set([...value.correct_answer]),
			isText: value.type == "text",
			isCorrect: false,
			isAnswered: false,
			isRequired: value.isRequired ? true : false,
		};
	}

	handleSubmit = (e) => {
		let { type, value, dataset } = e.target;
		let index = Number(dataset.question);
		value = value.toLowerCase().trim();

		type == "checkbox"
			? e.target.checked
				? this.state[index].selected.add(value)
				: this.state[index].selected.delete(value)
			: (this.state[index].selected = new Set([value])); // radio, text

		this.updateState(index);
	}

	updateState(index) {
		let { question, selected, answers, isText, isAnswered, isCorrect, ...rest } = this.state[index];

		isAnswered = selected.size > 0;
		const hasCorrectAnswers = isText ? this.hasSome(answers, selected) : this.hasEvery(answers, selected);
		isCorrect = isAnswered && hasCorrectAnswers;

		this.state[index] = { question, selected, answers, isText, isAnswered, isCorrect, ...rest };
	}

	hasSome(a, b) {
		return [...a].some((value) => [...b][0].includes(value));
	}

	hasEvery(a, b) {
		return a.size === b.size && [...a].every((value) => b.has(value.toLowerCase()));
	}

	getResult() {
		const scores = Object.entries(this.state);
		let score = 0;
		let error = "";

		scores.forEach(([key, value]) => {
			value.isRequired && !value.isAnswered ? (error += `${Number(key) + 1}, `) : null;
			score = value.isCorrect ? (score += 1) : score;
		});

		if (error !== "") {
			this.showError(error);
			return false;
		}

		this.showResult(scores, score);
		return true;
	}

	showError(error) {
		this["error"].innerHTML = `Please answer the following questions: ${error.slice(0, -2)}`;
		this["error"].classList.add("now");
		this["result"].classList.remove("now");
	}

	showResult(scores, score) {
		scores.forEach(([key, value]) => {
			const symbol = this["symbols"].find((s) => s.dataset.question == key);
			symbol.innerHTML = value.isCorrect ? "✔" : "✗";
		});
		this["score"].innerHTML = `${score}/${scores.length}`;
		this["result"].classList.add("now");
		this["error"].classList.remove("now");
	}

	get(selector) {
		return this.root.querySelector(selector);
	}

	getAll(selector) {
		return this.root.querySelectorAll(selector);
	}

    getDomRefs() {
		this.result = this.get(".res");
		this.error = this.get(".err");
		this.score = this.get("#score");
		this.symbols = [...this.getAll(".answer-symbol")];
	}
}

export { ScoreTracker };
