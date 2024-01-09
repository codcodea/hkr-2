class Validator {
	constructor(form) {
		this.form = form;
		this.init();
	}

	init() {
		this.getDomRefs();
	}

	start() {
		// Bind form data to a FormData object
		const formData = new FormData(this.form);
		let data = Object.fromEntries(formData.entries());

		// Clean up and structure data
		data = this.clean(data);
		const isText = data.type == "text" ? true : false;

		// Validate each record
		const errors = Object.entries(data)
			.map(([key, value]) => this.validate(key, value, isText))
			.filter(Boolean);

		// Return an error or data
		if (this.handleError(errors, isText)) return false;
		else return data;
	}

	clean(input) {

		/*
            This method clean the data from various pars of the form:
            - Trim off whitespaces
            - Structures to an output object that is easier to work with

            Output object:
            {
                name: string,
                question: string,
                type: "text" | "multiple",
                isRequired: boolean,
                correct_answer: string[],
                incorrect_answers: string[],
            }
        */

		// Trim whitespaces
		const a = Object.fromEntries(Object.entries(input).map(([k, v]) => [k, v.trim()]));

		// Init output
		let output = {
			name: a.name,
			question: a.question,
			type: a.type == "text" ? "text" : "multiple",
			isRequired: "isRequired" in a ? true : false,
		};

		// Structure text input into arrays
		if (output.type == "text") {
			output.correct_answer = a.answers
				.split(",")
				.map((s) => s.trim().toLowerCase())
				.filter((s) => s !== "");
			output.incorrect_answers = [];
			return output;
		}

		// Structure the multiple-choice inputs 
		const options = new Map();
		const correct_answer = [];
		const incorrect_answers = [];

		// Populate with correct and incorrect answers
		for (const [key, value] of Object.entries(a)) {
			if (key.includes("option")) {
				const [_, id, on] = key.split("-");
				if (value == "") continue;
				if (!options.has(id)) options.set(id, [value, false]);
				if (on) options.get(id)[1] = true;
			}
		}

		// Structure and returns the output
		options.forEach((value, _) => {
			const [answer, isCorrect] = value;
			if (isCorrect) correct_answer.push(answer);
			else incorrect_answers.push(answer);
		});

		output.correct_answer = correct_answer.filter((s) => s !== "");
		output.incorrect_answers = incorrect_answers;

		return output;
	}

	validate(key, value, isText) {
		// Validation rules
		const validation = {
			name: { required: true, minLength: 4, maxLength: 12 },
			question: { required: true, minLength: 3, maxLength: 40 },
			correct_answer: { required: true, minArrayLength: 1 },
			incorrect_answers: { required: true, minArrayLength: isText ? 0 : 1 },
			isRequired: { required: false },
		};

		// Validate each key against rules
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

    // Evaluate errors and show them in the form if any
	handleError(errors, isText) {
		if (errors.length == 0) return false;

        // Show only the first error
		const [key, message] = errors[0];

        // Find the error element
		let errorElement;

        console.log(key, message)

		switch (key) {
			case "correct_answer":
				if (isText) errorElement = this.get("#answers");
				else errorElement = document.querySelector(".cbox input[type='checkbox']");
                console.log(errorElement);
				break;
			case "incorrect_answers":
				const elems = this.getAll(`input[placeholder="Enter your option here..."]`);
				if (elems) {
					for (const el of elems) {
						if (el.value == "") {
							errorElement = el;
							el.focus();
							break;
						}
					}
				}
				errorElement ? errorElement : (errorElement = this.get("#plus-button")); // if no open fields grab the plus button
				break;
			default:
				errorElement = this.get(`input[name=${key}]`);
				break;
		}

		// Pass the error element and message
		this.showError(errorElement, message);
		return true;
	}

    // Show custom error message in the form
	showError(element, message) {
		element.setCustomValidity(message);
		element.reportValidity();
	}

	// Utility methods

	clear() {
		this.clearAnswers();
		this.clearMultiple();
		this["question"].value = "";
	}

	clearAnswers() {
		const textField = this.get("#answers");
		textField.value = "";
	}

	clearMultiple() {
		const textFields = this.getAll("input[type=text].col-1");
		const checkboxes = this.getAll("input[type=checkbox]");
		textFields.forEach((t) => (t.value = ""));
		checkboxes.forEach((c) => (c.checked = false));
	}

	getDomRefs() {
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
		this.firstCheckbox = this.get(".cbox input[type=checkbox]");
	}

    get(selector) {
		return this.form.querySelector(selector);
	}

	getAll(selector) {
		return this.form.querySelectorAll(selector);
	}

}

export { Validator };
