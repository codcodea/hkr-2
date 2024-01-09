
const FOLDR = new URL(import.meta.url).href.split("/").slice(0, -2).join("/");
const LOCAL = "/db/static.json";
const TOKEN = "https://opentdb.com/api_token.php?command=request";
const QUIZZ = "https://opentdb.com/api.php?amount=5&difficulty=easy&token=";

const { LocalStore } = "../local-storage.js";

// Fetch local quiz stored as JSON
const fetchStaticQuiz = async (name) => {
	const resp = await fetch(LOCAL);
	const data = await resp.json();
	const quiz = data[name];
	return quiz;
};

// Fetch dynamic quiz from Open Trivia API
const fetchDynamicQuiz = async () => {
    let date = localStorage.getItem("date");
    let token = localStorage.getItem("token");
    let dateInt = parseInt(date, 10); 

    if(date) {
        const now = Date.now();
        const diff = now - dateInt;
        const day = 1000 * 60 * 60 * 24; // 24 hours in ms
        if (diff > day) {
            localStorage.removeItem("token");
            localStorage.removeItem("date");
        }
    }

	if (!token) {
		const resp = await fetch(TOKEN);
		const data = await resp.json();
        token = data.token;
		localStorage.setItem("token", token);
        localStorage.setItem("date", Date.now());
	}

	const resp = await fetch(QUIZZ + token);
	const data = await resp.json();
	if (data.response_code != 0) {
        localStorage.removeItem("token");
        localStorage.removeItem("date");
        return fetchDynamicQuiz();
    };
	const quiz = data.results;
	return quiz;
};

const fetchCustomQuiz = async (name) => {
    const quiz = JSON.parse(localStorage.getItem(name));
    return quiz;
}

// Fetch user defined quiz from local storage

export { fetchStaticQuiz, fetchDynamicQuiz, fetchCustomQuiz };
