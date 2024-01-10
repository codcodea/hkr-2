import { getUser, setUser, deleteUser } from "./handlers/store.js";
import { getEnv } from "../env.js";

const baseUrl = getEnv();

const initForm = () => {

    // Add event listeners
    document.querySelector("button").addEventListener("click", deleteAccount);
	document.querySelector("form").addEventListener("submit", validateForm);

	// Get user
	const user = getUser();
	
    // Show welcome message
	const visitor = document.querySelector("#visitor");
	if (!user) {
		visitor.innerHTML = "visitor";
		return;
	}
	visitor.innerHTML = user[0];

	// Pre-fill form
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
}

// Handler for delete button
const deleteAccount = (e) => {
    e.preventDefault();
    console.log("Delete account")
	if(deleteUser()){
        window.location.href = baseUrl;
    }
}

document.addEventListener("DOMContentLoaded", initForm);
