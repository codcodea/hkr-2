
class Game {
    user = null;
    quiz = null;
    score = null;

    tracker = new Map();

    constructor() {
        this.state = {
            current: null,
            previous: null,
            next: null
        }
    }
}