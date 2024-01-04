import { getUser, setUser } from "./user.js";

const initForm = () => {
	// Add event listeners for delete and submit buttons
	document.querySelector("button").addEventListener("click", deleteAccount);
	document.querySelector("form").addEventListener("submit", validateForm);

	// Check if user is in local storage
	const user = getUser();
	if (!user) return;

	// Show welcome message
	document.querySelector("#visitor").innerHTML = user[0];

	// Fill from 
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
	submit.style.backgroundColor = "var(--theme-accent-2)";
	submit.style.color = "white";
	submit.style.border = "none";
};

// Handler for submit button
function validateForm(e) {
    e.preventDefault();
	try {
		const inputs = document.querySelectorAll("input");
		const outputs = [...inputs].map((input) => input.value.trim());
		outputs.pop(); // Remove submit button
		setUser(outputs);

		window.location.href = "./src/html/overview.html";
	} catch (error) {
		console.log(error);
	}
    return true
}

// Handler for delete button
function deleteAccount() {
	localStorage.removeItem("user");
    localStorage.removeItem("token");
	window.location.reload();
}

document.addEventListener("DOMContentLoaded", initForm);
