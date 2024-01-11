/* 
    These functions are reponsible for fetching quizzes from various sources
*/

import { getEnv } from "../../../env.js";
const baseUrl = getEnv();

const LOCAL = baseUrl + "/db/static.json";
const QUIZZ = "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy";

// Fetch local quiz stored as JSON
const fetchStaticQuiz = async (name) => {
	const resp = await fetch(LOCAL);
	const data = await resp.json();
	const quiz = data[name];
	return quiz;
};

// Fetch dynamic quiz from Open Trivia API
const fetchDynamicQuiz = async () => {
	const resp = await fetch(QUIZZ);
	const data = await resp.json();
	if (resp.status !== 200) {
		if (resp.status == 429) return [false, "\nToo many requests. Please try again later."];
		else return [false, resp.statusText];
	}
	const quiz = data.results;
	return [true, quiz];
};

// Fetch user defined quiz from local storage
const fetchCustomQuiz = async (name) => {
	const quiz = JSON.parse(localStorage.getItem(name));
	return quiz;
};

export { fetchStaticQuiz, fetchDynamicQuiz, fetchCustomQuiz };
