import { getUser, setUser, deleteUser } from "./handlers/store.js";
import { getEnv } from "../env.js";
const baseUrl = getEnv();

/* 
    This file contains functions to create the user page.
    - get the user from local storage
    - add event listeners to the buttons
    - validate the form using built-in methods
*/

const initForm = () => {
	// Add event listeners
	document.querySelector("button").addEventListener("click", deleteAccount);
	document.querySelector("form").addEventListener("submit", validateForm);

	// Get user
	const user = getUser();

	// Show welcome message
	const visitor = document.querySelector("#visitor");
	if (!user) {
		visitor.innerHTML = "Welcome visitor!";
		return;
	}
	visitor.innerHTML = "Welcome " + user[0] + "!";

	// Pre-fill form, if user exists
	const inputs = document.querySelectorAll("input");
	inputs.forEach((input, index) => {
		input.classList.add("has-user");
		input.value = user[index];
	});

	// Show info box below form
	const message = document.querySelector("#welcome");
	message.style.display = "block";

	// Change the appearance of submit button
	const submit = document.querySelector("input[type='submit']");
	submit.value = "Continue";
};

// Handler for submit button
const validateForm = (e) => {
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
};

// Handler for delete button
const deleteAccount = (e) => {
	e.preventDefault();
	if (deleteUser()) {
		window.location.href = baseUrl;
	}
};

document.addEventListener("DOMContentLoaded", initForm);
