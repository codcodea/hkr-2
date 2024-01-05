class Validator {
	constructor(form) {
		this.form = form;
		this.init();
	}

	init() {
		this.name = this.form.querySelector("input[name=name]");
		this.question = this.form.querySelector("input[name=question]");
	}

	inputClean(input) {
		// Trim input values
		const a = Object.fromEntries(Object.entries(input).map(([k, v]) => [k, v.trim()]));

		let output = {
			name: a.name,
			question: a.question,
			type: a.type == "text" ? "text" : "multiple",
			isRequired: "isRequired" in a ? true : false,
			useStrict: "useStrict" in a ? true : false,
		};

		if (output.type == "text") {
			output.correct_answer = a.answers
				.split(",")
				.map((s) => s.trim().toLowerCase())
				.filter((s) => s !== "");
			output.incorrect_answers = [];
			return output;
		}

		const options = new Map();
		const correct_answer = [];
		const incorrect_answers = [];

		for (const [key, value] of Object.entries(a)) {
			if (key.includes("option")) {
				const [_, id, on] = key.split("-");
				if (value == "") continue;
				if (!options.has(id)) options.set(id, [value, false]);
				if (on) options.get(id)[1] = true;
			}
		}

		options.forEach((value, key) => {
			const [answer, isCorrect] = value;
			if (isCorrect) correct_answer.push(answer);
			else incorrect_answers.push(answer);
		});

		output.correct_answer = correct_answer.filter((s) => s !== "");
		output.incorrect_answers = incorrect_answers;

		return output;
	}

	inputValidation() {
		const formData = new FormData(this.form);
		let data = Object.fromEntries(formData.entries());
		data = this.inputClean(data);

		const validation = {
			name: {
				required: true,
				minLength: 2,
				maxLength: 12,
			},
			question: {
				required: true,
				minLength: 3,
				maxLength: 40,
			},
			type: {
				required: true,
				allowedValues: ["text", "multiple"],
			},
			correct_answer: {
				required: true,
				minArrayLength: 1,
			},
			incorrect_answers: {
				required: true,
				minArrayLength: ((data) => (data.type == "text" ? 0 : 1))(data),
			},
			isRequired: {
				required: false,
			},
			useStrict: {
				required: false,
			},
		};

		const errors = [];

		for (const [key, value] of Object.entries(data)) {
			const rules = validation[key];
			if (!rules) continue;

			const { required, minLength, maxLength, allowedValues, minArrayLength } = rules;

			if (minLength && value.length < minLength) errors.push([key, `must be at least ${minLength} characters`]);
			if (maxLength && value.length > maxLength) errors.push([key, `must be at most ${maxLength} characters`]);
			if (allowedValues && !allowedValues.includes(value))
				errors.push([key, `must be one of ${allowedValues.join(", ")}`]);
			if (value.length < minArrayLength) {
				if (key == "incorrect_answers") errors.push([key, `at least one incorrect answer is required`]);
				else errors.push([key, `at least one correct answer is required`]);
			}
		}
		if (errors.length > 0) {
			const [key, message] = errors[0];

			switch (key) {
				case "correct_answer":
                    const checkbox = this.form.querySelector(`input[type=checkbox]`);
                    checkbox.setCustomValidity(message);
                    checkbox.reportValidity();
                    break;
				case "incorrect_answers":
                    const text = this.form.querySelectorAll(`input[placeholder="Enter your option here..."]`);

                    for (const t of text) {
                        if(t.value == "") {
                            t.setCustomValidity(message);
                            t.reportValidity();
                            break;
                        }
                    }
                    break;
				default:
					const input = this.form.querySelector(`input[name=${key}]`);
					input.setCustomValidity(message);
					input.reportValidity();
					break;
			}
		}
		this.inputSave(data);
	}

	inputSave(data) {
		const { name, question, ...rest } = data;
		console.log(data);
	}

	getFormData() {
		const formData = new FormData(this.form);
		const data = Object.fromEntries(formData.entries());
		return data;
	}
}

export { Validator };
