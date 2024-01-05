class ScoreBoard {
	state = {};
	questions = null;

	constructor() {
		this.onChange = this.onChange.bind(this); // bind this to be used in the onChange method
		this.getResult = this.getResult.bind(this); // bind this to be used in the getResult method
	}

	// Initialize the state object if empty key
	initState(q) {
		for (const [_, value] of Object.entries(q)) {
			this.state[value.id] = {
				selected: new Set(),
				answers: new Set([...value.correct_answer]),
				isText: value.type == "text",
				isCorrect: false,
				isAnswered: false,
			};
		}
	}

	onChange(e) {
		let { type, id, value } = e.target;
		value = value.toLowerCase().trim();

		switch (type) {
			case "text":
			case "radio":
				this.state[id].selected = new Set([value]);
				break;
			case "checkbox":
				e.target.checked ? this.state[id].selected.add(value) : this.state[id].selected.delete(value);
				break;
			default:
				throw new Error("Invalid input type");
		}

		this.updateState(id);
	}

	updateState(questionID) {
		const { selected, answers, isText } = this.state[questionID];

		const isAnswered = selected.size > 0;
		const hasCorrectNumberOfAnswers = isText || selected.size == answers.size;
		const hasCorrectAnswers = isText
			? [...answers].some((answer) => [...selected][0].includes(answer))
			: [...answers].every((answer) => selected.has(answer.toLowerCase()));
		const isCorrect = isAnswered && hasCorrectAnswers && hasCorrectNumberOfAnswers;

		this.state[id] = {
			selected,
			answers,
			isText,
			isCorrect,
			isAnswered,
		};
	}

	getResult() {
		return this.state;
	}
}

export { ScoreBoard };
