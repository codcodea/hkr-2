// Populate the question-wrapper template
const getQuestionWrapper = (question, index, hasControls, handler) => {
	const node = document.getElementById("question").cloneNode(true).content;

	const ctrl = node.querySelector(".q-controls");
	ctrl.style.display = hasControls ? "flex" : "none";

	[...ctrl.children].forEach((c) => {
		c.dataset.question = index;
		c.addEventListener("click", handler);
	});

	const required = node.querySelector(".required");

	if (hasControls || !question.isRequired) required.style.display = "none";
	else if (question.isRequired) required.innerText = "(required)";

	node.querySelector("span").innerHTML = index + 1;
	node.querySelector("article").dataset.question = index;
	node.querySelector(".answer-symbol").dataset.question = index;
	node.querySelector("h1").innerHTML = question.question;
	return node;
};

// Populate the multiple-choice template
const getMultiple = (question, index, node, handler) => {
	const nodes = [];
	const answers = [...question.correct_answer, ...question.incorrect_answers];

	answers.forEach((a, i) => {
		const isCorrect = question.correct_answer.includes(a);

		const domId = "id-" + i;

		const clone = node.cloneNode(true);
		const input = clone.querySelector("input");
		input.type = question.isRadio ? "radio" : "checkbox";
		input.value = a;
		input.id = domId;
		input.name = "group-" + index;
		input.dataset.question = index;
		input.onchange = handler;

		const option = clone.querySelector("#option");
		option.htmlFor = domId;
		option.innerHTML = a;

		const answer = clone.querySelector("#answer");
		answer.htmlFor = domId;
		answer.classList.add(isCorrect ? "correct" : "incorrect");
		answer.innerHTML = isCorrect ? "(correct)" : "";

		nodes.push(clone);
	});
	return nodes;
};

// Populate the text-input template
const getText = (question, index, node, handler) => {
	const clone = node.cloneNode(true);
	const input = clone.querySelector("input");
	input.type = "text";
	input.id = "id-text-" + index;
	input.name = "group-text-" + index;
	input.dataset.question = index;
	input.placeholder = "Type your answer here";
	input.onchange = handler;

	const answer = clone.querySelector("#answer");
	answer.htmlFor = "id-text-" + index;
	answer.innerHTML = question.correct_answer;

	return clone;
};

const getOptions = (list) => {
	const fragment = document.createDocumentFragment();

	const option = document.createElement("option");
	option.value = "new";
	option.innerText = "New Quiz";
	fragment.appendChild(option);

	list.forEach((name) => {
		const option = document.createElement("option");
		option.value = name;
		option.innerText = name;
		fragment.appendChild(option);
	});
	return fragment;
};

// Populate the result template
const onSubmit = (node, handler) => {
	const result = node.cloneNode(true);
	result.querySelector("#submit").addEventListener("click", handler);
	return result;
};

export { getQuestionWrapper, getMultiple, getText, onSubmit, getOptions };
