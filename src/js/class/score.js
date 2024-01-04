class ScoreBoard {
    state = {};
    questions = null;

    constructor() {
        this.onChange = this.onChange.bind(this); // bind this to be used in the onChange method
        this.getResult = this.getResult.bind(this); // bind this to be used in the getResult method 
    }

    // Initialize the state object if empty key
    initState(q) {
        for (const [key, value] of Object.entries(q)) {
            if (!this.state[key]) {
                this.state[value.id] = {
                    selected: new Set(),
                    answers: new Set([...value.correct_answer]),
                    isText: value.type == "text",
                    isCorrect: false,
                    isAnswered: false,
                };
            }
        }   
    }

    onChange(e) {
        const type = e.target.type;
        const id = e.target.id;
        const value = e.target.value.toLowerCase().trim(); 
        console.log(type, id, value)

        switch (type) {
            case "radio":
                console.log(this.state)
                this.state[id].selected = new Set([value]);
                break;
            case "checkbox":
                e.target.checked ? this.state[id].selected.add(value) : this.state[id].selected.delete(value);
                break;
            case "text":
                this.state[id].selected = new Set([value]);
                break;
            default:
                throw new Error("Invalid input type");
        }

        for (const [key, { selected, answers, isText }] of Object.entries(this.state)) {

            if(key != id) continue;

            if (isText) console.log([...answers], [...selected][0])

            const isAnswered = selected.size > 0;
            const correctNumberOfAnswers = isText || selected.size == answers.size;
            const correctAnswers = isText 
                ? [...answers].some(answer => [...selected][0].includes(answer))
                : [...answers].every(answer => selected.has(answer.toLowerCase()));

            const isCorrect = 
                    isAnswered &&
                    correctAnswers && 
                    correctNumberOfAnswers

            this.state[key] = {
                selected,
                answers,
                isText,
                isCorrect,
                isAnswered,
            };
        }

        console.log(this.state);
    }

    getResult() {
        return this.state;
    }
}

export { ScoreBoard };