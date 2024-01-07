// Populate the question-wrapper template
const getQuestionWrapper = (question, index, hasControls, handler) => {
	const node = document.getElementById("question").cloneNode(true).content;
    
    const ctrl = node.querySelector(".q-controls");
    ctrl.style.display = hasControls ? "flex" : "none";

    [...ctrl.children].forEach((c) => {
        c.addEventListener("click", handler);
        c.dataset.question = question.id ;
    });
    
    node.querySelector("span").innerHTML = index + 1;
	node.querySelector(".answer-symbol").dataset.question = question.id;
	node.querySelector("h1").innerHTML = question.question;
	return node;
};

// Populate the multiple-choice template
const getMultiple = (question, node, onChange) => {
	const nodes = [];
	const answers = [...question.correct_answer, ...question.incorrect_answers];

	answers.forEach((a) => {
		const isCorrect = question.correct_answer.includes(a);

		const clone = node.cloneNode(true);
		const input = clone.querySelector("input");
		input.type = question.isRadio ? "radio" : "checkbox";
		input.id = question.id;
		input.name = question.id;
		input.value = a;
		input.onchange = onChange;

		const option = clone.querySelector("#option");
		option.htmlFor = question.id;
		option.innerHTML = a;

		const answer = clone.querySelector("#answer");
		answer.for = question.id;
		answer.classList.add(isCorrect ? "correct" : "incorrect");
		answer.innerHTML = isCorrect ? "(correct)" : "";

		nodes.push(clone);
	});
	return nodes;
};

// Populate the text-input template
const getText = (question, node, onChange) => {
	const clone = node.cloneNode(true);
	const input = clone.querySelector("input");
	input.type = "text";
	input.id = question.id;
	input.name = question.id;
	input.placeholder = "Type your answer here";
	input.onchange = onChange;

	const answer = clone.querySelector("#answer");
	answer.for = question.id;
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
}

// Populate the result template
const onSubmit = (node, handler) => {
	const result = node.cloneNode(true);
	result.querySelector("#submit").addEventListener("click", handler);
	return result;
};

export { getQuestionWrapper, getMultiple, getText, onSubmit, getOptions };
