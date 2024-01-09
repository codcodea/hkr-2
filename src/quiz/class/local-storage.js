class LocalStore {
	current = {}
	constructor() {}

    // Returns a list of all quiz names in local storage
	static getAllNames() {
		const list = [];
		const reserved = ["token", "date", "user"];
		for (let i = 0; i < localStorage.length; i++) {
			if (reserved.includes(localStorage.key(i))) continue;
			list.push(localStorage.key(i));
		}
		return list;
	}

    // Return a quiz from local storage
	getQuiz(key) {
		const data = localStorage.getItem(key);
		return JSON.parse(data);
	}

	setQuiz(data) {
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
		const update = [...current, data];
		localStorage.setItem(key, JSON.stringify(update));
	}

	deleteQuestion(key, index) {
		console.log(key, index);
		const data = localStorage.getItem(key);
		const current = JSON.parse(data);
		const update = current.filter((q, ix) => ix != index);
		localStorage.setItem(key, JSON.stringify(update));
		return update;
	}

    deleteQuiz(index) {
		const key = localStorage.key(index);
        localStorage.removeItem(key);
	}

    sortQuestion(key, index, direction) {
        const data = this.getQuiz(key);
        const lastIndex = data.length - 1;
    
        index = Number(index);
    
        // No sort needed
        const onEdge = (index === 0 && direction === "up") || (index === lastIndex && direction === "down");
        console.log(onEdge) 
        if (onEdge) return data; 
    
        // Sort using array destructuring
        const update = [...data]; 
        if (direction === "up") [update[index - 1], update[index]] = [update[index], update[index - 1]];
        else [update[index], update[index + 1]] = [update[index + 1], update[index]];
        
        localStorage.setItem(key, JSON.stringify(update));
        return update;
    }
}

export { LocalStore };
