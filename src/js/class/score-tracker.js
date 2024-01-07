class ScoreTracker {
	state = {};
	questions = null;

	constructor() {
		this.onChange = this.onChange.bind(this); 
		this.getResult = this.getResult.bind(this); 
	}

	initState(q) {
		for (const [_, value] of Object.entries(q)) {
			this.state[value.id] = this.getScoreTracker(value);
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

	updateState(id) {
		const { selected, answers, isText } = this.state[id];

		const isAnswered = selected.size > 0
		const hasCorrectAnswers = isText
			? this.setSome(answers, selected)
			: this.setEvery(answers, selected);
		
        const isCorrect = isAnswered && hasCorrectAnswers 

		this.state[id] = {
			selected,
			answers,
			isText,
			isCorrect,
			isAnswered,
		};
	}

    setSome(a, b) {
        return [...a].some(value=> [...b][0].includes(value))
    }

    setEvery(a, b) {
        return a.size === b.size && [...a].every(value => b.has(value.toLowerCase()));
    }

    getScoreTracker(value) {
        return {
            selected: new Set(),
            answers: new Set([...value.correct_answer]),
            isText: value.type == "text",
            isCorrect: false,
            isAnswered: false,
        };
    }

    getResult() {
		return this.state;
	}
}

export { ScoreTracker };
