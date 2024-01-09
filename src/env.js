const config = {
	dev: {
		baseUrl: "http://localhost:5500",
	},
	prod: {
		baseUrl: "https://codcodea.github.io/hkr-2",
	},

    mobile: {
        baseUrl: ".",
    }
};

const getEnv = () => {

    const host = window.location.hostname;
    console.log(host)
    return host === "localhost" 
        ? config["dev"].baseUrl 
        :  host === "codcodea.github.io" 
            ? config["prod"].baseUrl
            : config["mobile"].baseUrl;
}

export { getEnv };
