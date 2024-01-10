const isSupported = () => typeof Storage !== "undefined";
const isUserInLocalStorage = () => localStorage.getItem("user") !== null;

const getUser = () => {
	if (isSupported() && isUserInLocalStorage()) {
		return JSON.parse(localStorage.getItem("user"));
	}
	return false;
};

const setUser = (user) => {
	if (isSupported()) {
		const json = JSON.stringify(user);
		localStorage.setItem("user", json);
		return true;
	}

	return false;
};

const deleteUser = () => {
    if (isSupported()) {
        localStorage.clear();
        return true;
    }
    return false;
};  

export { getUser, setUser, deleteUser };
