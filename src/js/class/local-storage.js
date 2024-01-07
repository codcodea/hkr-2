class LocalStore {
	current = {};
	constructor() {}

	static getAllNames() {
		const list = [];
		const reserved = ["token", "date", "user"];
		for (let i = 0; i < localStorage.length; i++) {
			if (reserved.includes(localStorage.key(i))) continue;
			list.push(localStorage.key(i));
		}
		return list;
	}

	getQuiz(key) {
		const data = localStorage.getItem(key);
		return JSON.parse(data);
	}

	setQuiz(data) {
		// clone data
		data = { ...data };
		const key = data.name.trim();
		delete data.name;
		const current = this.getQuiz(key);
		if (!current) {
			data.id = 0;
			localStorage.setItem(key, JSON.stringify([data]));
		} else {
			this.addToQuiz(key, current, data);
		}
	}

	addToQuiz(key, current, data) {
		const len = current.length;
		const next = len;
		data.id = next;
		const update = [data, ...current];
		localStorage.setItem(key, JSON.stringify(update));
	}

	deleteQuestion(key, id) {
		console.log(key, id);
		const data = localStorage.getItem(key);
		const current = JSON.parse(data);
		const update = current.filter((q) => q.id != id);
		localStorage.setItem(key, JSON.stringify(update));
		return update;
	}

	sortQuestion(key, id, direction) {
		const data = this.getQuiz(key);
		const index = data.findIndex((q) => q.id == id);  // 1 == "1"
		const lastIndex = data.length - 1;

		// No sort
		const notValid = index === -1;
		const onEdge = (index === 0 && direction === "up") || (index === lastIndex && direction === "down");
		if (notValid || onEdge) return data;

		// Sort
		if (direction === "up") {
			[data[index - 1], data[index]] = [data[index], data[index - 1]];
		} else {
			[data[index], data[index + 1]] = [data[index + 1], data[index]];
		}

        localStorage.setItem(key, JSON.stringify(data));

		return data;
	}

	deleteQuiz(id) {
		localStorage.removeItem(id);
	}
}

export { LocalStore };
