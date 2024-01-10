const config = {
	dev: "http://localhost:5500",
	prod: "https://codcodea.github.io/hkr-2",
};

const getEnv = () => {
	const host = window.location.hostname;
	const baseUrl =  host === ("localhost" || "127.0.0.1") ? config["dev"] : config["prod"];
    console.log(baseUrl);
    return baseUrl;
};

export { getEnv };
