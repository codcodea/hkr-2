import { getUser, setUser } from "./handlers/store.js";
import { getEnv } from "../env.js";

const baseUrl = getEnv();

console.log(baseUrl);

const folder = new URL(import.meta.url);
console.log(folder);

const initForm = () => {
	// Add event listeners for delete and submit buttons
	document.querySelector("button").addEventListener("click", deleteAccount);
	document.querySelector("form").addEventListener("submit", validateForm);

	// Check if user is in local storage
	const user = getUser();
	// Show welcome message

	const visitor = document.querySelector("#visitor");
	if (!user) {
		visitor.innerHTML = "visitor";
		return;
	}
	console.log(user);
	visitor.innerHTML = user[0];

	// Fill from from local storage
	const inputs = document.querySelectorAll("input");
	inputs.forEach((input, index) => {
		input.classList.add("has-user");
		input.value = user[index];
	});

	// Show message box
	const message = document.querySelector("#welcome");
	message.style.display = "block";

	// Change the appearance of submit button
	const submit = document.querySelector("input[type='submit']");
	submit.value = "Continue";
};

// Handler for submit button
function validateForm(e) {
	e.preventDefault();
	try {
		const inputs = document.querySelectorAll("input");
		const outputs = [...inputs].map((input) => input.value.trim());
		outputs.pop(); // Remove submit button
		setUser(outputs);

		window.location.href = baseUrl + "/src/overview/index.html";
	} catch (error) {
		console.log(error);
	}
	return true;
}

// Handler for delete button
function deleteAccount() {
	localStorage.removeItem("user");
	localStorage.removeItem("token");
	window.location.reload();
}

document.addEventListener("DOMContentLoaded", initForm);
