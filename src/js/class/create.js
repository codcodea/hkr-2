class CreateDashboard {

	constructor(quizName) {
        this.quizName = quizName;
		this.initDashboard();
	}

	initDashboard() {
		const root = document.querySelector("#dashboard-root");
		let node = document.querySelector("#dashboard-template").cloneNode(true).content;

		node = this.addTypeControls(node);
		node = this.addOptionsControls(node);
        node = this.addActionsControls(node);
		root.appendChild(node);
	}

	addTypeControls(node) {
		const radioBtnText = node.querySelector("#radio-text");
		const radioBtnMulti = node.querySelector("#radio-multi");
		const ct = node.querySelector("#container-text");
		const mc = node.querySelector("#container-multi");

		const toggleType = (e) => {
			if (e.target.id == "radio-text") {
				ct.classList.add("show");
				mc.classList.remove("show");
				return;
			}
			ct.classList.remove("show");
			mc.classList.add("show");
		};

		radioBtnText.addEventListener("change", toggleType);
		radioBtnMulti.addEventListener("change", toggleType);

		return node;
	}

	addOptionsControls(node) {
		const template = node.querySelector("#option-template");
		const container = node.querySelector("#options-items");
		const addBtn = node.querySelector("#add-option");

		const addOption = () => {
			const clone = template.cloneNode(true).content;
			const id = this.randomId();

			const names = clone.querySelectorAll("input[name]");
			names.forEach((n) => (n.name = `option-${id}`));

			const trashCan = clone.querySelectorAll("button");
			trashCan.forEach((button) => button.addEventListener("click", (e) => e.target.parentNode.remove()));
			container.appendChild(clone);
		};

		const addClick = (e) => {
			e.preventDefault();
			addOption();
		};

		// Add 3 options by default
		[1, 2, 3].forEach(addOption);

		// Add another option on + click
		addBtn.addEventListener("click", addClick);

		return node;
	}

    addActionsControls(node) {
        const submitBtn = node.querySelector("input[type=submit]");
        const cancelBtn = node.querySelector("input[type=reset]");
        const doneBtn = node.querySelector("input[type=button]");

        console.log(submitBtn, cancelBtn, doneBtn)

        const submitClick = (e) => {
            e.preventDefault();
            console.log(e)
        }

        const cancelClick = (e) => {
            e.preventDefault();
            this.cancel();
        }
        
        const doneClick = (e) => {
            e.preventDefault();
            this.done();
        }

        submitBtn.addEventListener("click", submitClick);
        cancelBtn.addEventListener("click", cancelClick);
        doneBtn.addEventListener("click", doneClick);

        return node;
    }

	randomId() {
		return Math.random().toString(36).substring(2, 5);
	}
}

export { CreateDashboard };
