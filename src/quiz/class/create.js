import { getOptions } from "./handlers/dom.js";
import { Validator } from "./validate.js";
import { LocalStore } from "./local-storage.js";
import { Quiz } from "./quiz.js";
import { getEnv } from "../../env.js";

const baseUrl = getEnv();

class CreateQuiz {
	constructor() {
		this.quizName = null;
		this.quiz = null;
	}

	init() {
        // Get the root element for the create quiz form
		const root = document.querySelector("#root");
		this.node = document.querySelector("#create-quiz").cloneNode(true).content;

        // Create a new form validator instance
		const form = this.node.querySelector("form");
		this.validator = new Validator(form);

        // Create a new local storage instance
		this.store = new LocalStore(); 

        // Add controls to the DOM
		this.addControls();
		root.appendChild(this.node);
	}

	addControls() {
		this.addDropdown();
		this.addName();
		this.addType();
		this.addOptions();
		this.addActions();
	}

	addDropdown() {
        // Populates the drop down menu 
		this.validator["select"].addEventListener("change", this.handleSelect);
		this.updateDropdown();
	}

	updateDropdown() {
		const select = this.validator["select"];
		select.innerHTML = "";

		this.quizList = LocalStore.getAllNames();
		const options = getOptions(this.quizList);
		select.appendChild(options);
	}

	handleSelect = (e) => {
        // Event handler for the drop down menu
		const name = this.validator["name"];
		const selected = e.target.value;

        const createNew = () => {
            this.quizName = selected;
			this.quiz = new Quiz(this.quizName, true);
			this.quiz.init();
        };
        const showExisting = () => {
            this.quiz.clear();
			this.quizName = null;
			this.quiz = null;
        };

		if (selected !== "new") createNew() 
        else showExisting()

        // toggle show delete button
		selected == "new"
			? ((name.readOnly = false), (name.value = ""))
			: ((name.readOnly = true), (name.value = selected));

		this.toggleShowDelete();
	}

	triggerSelect(value) {
        // Programmatically triggers the drop down menu
		const select = this.validator["select"];
		select.value = value;
		const changeEvent = new Event("change", { bubbles: true });
		select.dispatchEvent(changeEvent);
	}

	addName() {
		if (this.quizName) this.validator["name"].value = this.quizName;
	}

	addType() {
		const radios = this.validator["radios"];
		radios.forEach((radio) => radio.addEventListener("change", this.handleType));
	}

    // Event handler for the radio buttons
	handleType = (e) => {
        this.validator["text"].classList.toggle("hide");
        this.validator["multi"].classList.toggle("hide");
  
        const clearInput = e.target.id == "radio-text";
        clearInput ? this.validator.clearMultiple() : this.validator.clearAnswers();
	}

	addOptions() {
		const t = this.validator["multiTemplate"];
		const container = this.validator["multiItems"];
		const button = this.validator["plusButton"];

		const addOption = () => {
			const clone = t.cloneNode(true).content;
			const id = this.randomId();

			// add dynamic id:s for tracking
			const names = clone.querySelectorAll("input[name]");
			names.forEach((n, i) => {
				if (i == 0) n.name = `option-${id}`;
				else n.name = `option-${id}-on`;
			});

			// trash symbol
			const trash = clone.querySelectorAll("button");
			trash.forEach((b) => b.addEventListener("click", (e) => e.target.parentNode.remove()));
			container.appendChild(clone);
		};

		const onClick = (e) => (e.preventDefault(), addOption());

		[1, 2, 3].forEach(addOption); // add 3 options by default
		button.addEventListener("click", onClick); // add another option on click
	}

	addActions() {
		const del = this.validator["delete"];
		const back = this.validator["back"];
		const submit = this.validator["submit"];

		del.addEventListener("click", this.handleDelete);
		back.addEventListener("click", this.handleBack);
		submit.addEventListener("click", this.handleSubmit);

		this.toggleShowDelete();
	}

	handleDelete = (e) => {
		e.preventDefault();
		if (!this.quizName) return;
		this.store.deleteQuiz(this.quizName);
        this.validator.clear();
		this.updateDropdown();
		this.triggerSelect("new");
	}

	handleBack() {
        console.log(baseUrl)
		window.location.assign(baseUrl + "/src/overview/index.html");
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const data = this.validator.start();
		if (!data) return;

		this.store.setQuiz(data);
		this.validator.clear();

		if (this.quizName != data.name) {
			this.updateDropdown();
			this.triggerSelect(data.name);
			return;
		}

		if (this.quiz) {
			this.quiz.init();
		}
	}

	toggleShowDelete() {
		const del = this.validator["del"];
		if (!this.quizName) del.disabled = true;
		else del.disabled = false;
	}

	randomId() {
		return Math.random().toString(36).substring(2, 5);
	}
}

export { CreateQuiz };
