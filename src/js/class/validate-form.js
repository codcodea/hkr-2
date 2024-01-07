class Validator {
	constructor(form) {
		this.form = form;
		this.init();
	}

	init() {
		// Grab references to static DOM elements for later use
		this.name = this.get("input[name=name]");
		this.question = this.get("input[name=question]");
		this.select = this.get("select");
		this.text = this.get("#option-text");
		this.multi = this.get("#option-multi");
		this.radios = this.getAll("input[type=radio]");
		this.multiTemplate = this.get("#m-template");
		this.multiItems = this.get("#m-items");
		this.plusButton = this.get("#plus-button");
		this.delete = this.get("#delete");
		this.back = this.get("#back");
		this.submit = this.get("input[type=submit]");
		this.del = this.get("#delete");
		this.inputs = this.getAll("input");
		this.firstCheckbox = this.get(".c2 input[type=checkbox]");
	}

	inputValidation() {
		// Bind form input to a FormData object
		const formData = new FormData(this.form);
		let data = Object.fromEntries(formData.entries());

		// Set name 
		const name = this["name"];
		if (!data.name && name.disabled) data.name = name.value;

		// Clean data
		data = this.inputClean(data);

		// Validate each record
		const errors = Object.entries(data)
			.map(([key, value]) => this.validate(key, value))
			.filter(Boolean);

		// Return an error or data
		if (this.checkErrors(errors)) return false;
		else return data;
	}

    validate(key, value) {
		// Validation rules
		const validation = {
			name: { required: true, minLength: 2, maxLength: 12 },
			question: { required: true, minLength: 3, maxLength: 40 },
			correct_answer: { required: true, minArrayLength: 1 },
			incorrect_answers: { required: true, minArrayLength: ((value) => (value.type == "text" ? 0 : 1))(value) },
			isRequired: { required: false },
		};

		const rules = validation[key];
		if (!rules) return false;

		const { minLength, maxLength, minArrayLength } = rules;
		const length = value.length;

		if (minLength && length < minLength) return [key, `must be at least ${minLength} characters`];
		if (maxLength && length > maxLength) return [key, `must be at most ${maxLength} characters`];
		if (length < minArrayLength) {
			const errorType = key === "incorrect_answers" ? "at least one incorrect answer" : "at least one correct answer";
			return [key, `${errorType} is required`];
		}
	}

	checkErrors(errors) {
		if (errors.length == 0) return false;

		const [key, message] = errors[0]; 
		let errorElement;

		switch (key) {
			case "correct_answer":
				errorElement = this.get("input[type=checkbox]");
				break;
			case "incorrect_answers":
				const elems = this.form.querySelectorAll(`input[placeholder="Enter your option here..."]`);
				if (elems) {
					for (const el of elems) {
						if (el.value == "") {
							errorElement = el;
							el.focus();
							break;
						}
					}
				}
				errorElement ? errorElement : errorElement = this.get("#plus-button");
				break;
			default:
				errorElement = this.form.querySelector(`input[name=${key}]`);
				break;
		}
		this.showCustomError(errorElement, message);
		return true; 
	}

	showCustomError(element, message) {
		element.setCustomValidity(message);
		element.reportValidity();
	}

	get(selector) {
		if (selector) return this.form.querySelector(selector);
		return this.form;
	}

	getAll(selector) {
		return this.form.querySelectorAll(selector);
	}

	clear() {
		const inputs = this["inputs"];
		inputs.forEach((i) => {
			if (i.type == "checkbox") {
				i.checked = false;
			} else if (i.type == "text" && i.name != "name") {
				i.value = "";
			}
		});
	}

	clearAnswers() {
		const textField = this.get("#answers");
		textField.value = "";
	}

	clearMultiple() {
		const textFields = this.getAll("input[type=text].c1");
		const checkboxes = this.getAll("input[type=checkbox]");
		textFields.forEach((t) => (t.value = ""));
		checkboxes.forEach((c) => (c.checked = false));
	}

	inputClean(input) {
		// Trim of any whitespace from the input values
		const a = Object.fromEntries(Object.entries(input).map(([k, v]) => [k, v.trim()]));

		let output = {
			name: a.name,
			question: a.question,
			type: a.type == "text" ? "text" : "multiple",
			isRequired: "isRequired" in a ? true : false,
		};

		// Clean the text input
		if (output.type == "text") {
			output.correct_answer = a.answers
				.split(",")
				.map((s) => s.trim().toLowerCase())
				.filter((s) => s !== "");
			output.incorrect_answers = [];
			return output;
		}

		// Clean the multiple-choice inputs
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
}

export { Validator };
