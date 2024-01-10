const config = {
	dev: "http://localhost:5500",
	prod: "https://codcodea.github.io/hkr-2",
};

const getEnv = () => {
	const host = window.location.hostname;
    return host !== "codcodea.github.io" ? window.origin : config["prod"];
};

export { getEnv };
