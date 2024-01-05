
import { Validator } from "./validation.js"; 

class CreateDashboard {

	constructor(quizName) {
		this.quizName = quizName;
		this.init();
	}

	init() {
		const root = document.querySelector("#dashboard-root");
		let node = document.querySelector("#dashboard-template").cloneNode(true).content;

		node = this.addTypeControls(node);
		node = this.addOptionsControls(node);
		node = this.addActionsControls(node);

        this.form = node.querySelector("form");
        this.validator= new Validator(this.form);

		root.appendChild(node);
	}

	addTypeControls(node) {
		const [text, multi] = ["#option-text", "#option-multi"].map((s) => node.querySelector(s));
 
        const resetText = () => {
            const textField = this.form.querySelector("#answers");
            textField.value = "";
        }

        const resetMulti = () => {  
            const textFields = this.form.querySelectorAll("input[type=text].c1");
            const checkboxes = this.form.querySelectorAll("input[type=checkbox]");
            textFields.forEach((t) => t.value = "")
            checkboxes.forEach((c) => c.checked = false)
        }

		const toggleType = (e) => {
            console.log(e.target)
			if (e.target.id == "radio-text") text.classList.add("show"), multi.classList.remove("show"), resetMulti();
			else text.classList.remove("show"), multi.classList.add("show"), resetText();
		};

		const radios = node.querySelectorAll("input[type=radio]");
		radios.forEach((radio) => radio.addEventListener("change", toggleType));

		return node;
	}

	addOptionsControls(node) {
		const [template, container, plusButton] = ["#options-template", "#multiple-options-items", "#plus-button"].map(
			(s) => node.querySelector(s)
		);

		const addOption = () => {
			const clone = template.cloneNode(true).content;
			const id = this.randomId();

			const names = clone.querySelectorAll("input[name]");
			names.forEach((n, i) => {
                if(i == 0) n.name = `option-${id}`
                else n.name = `option-${id}-on`
            });

			const trash = clone.querySelectorAll("button");
			trash.forEach((b) => b.addEventListener("click", (e) => e.target.parentNode.remove()));
			container.appendChild(clone);
		};

		const onClick = (e) => {
			e.preventDefault();
			addOption();
		};

		[1, 2, 3].forEach(addOption);
		plusButton.addEventListener("click", onClick);

		return node;
	}

	addActionsControls(node) {        
        const [submit, reset, done] = ["input[type=submit]", "input[type=reset]", "input[type=button]"]
            .map((s) => node.querySelector(s));

		const submitClick = (e) => {
			e.preventDefault();
            this.validator.inputValidation();
		};

		const resetClick = (e) => {
			e.preventDefault();
            this.form.reset();
		};

		const doneClick = (e) => {
			e.preventDefault();
			const elem = this.form.querySelector("input[name='type']");
            elem.setCustomValidity("Question is required")
            elem.reportValidity()
		};

		submit.addEventListener("click", submitClick);
		reset.addEventListener("click", resetClick);
		done.addEventListener("click", doneClick);

		return node;
	}

	randomId() {
		return Math.random().toString(36).substring(2, 5);
	}
}

export { CreateDashboard };
