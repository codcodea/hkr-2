function intersectionObserver() {
	const elements = document.querySelectorAll("article");

	const thresholds = Array.from({ length: 20 }, (_, i) => i / 20); // 0,05 steps

	const options = {
		root: null,
		rootMargin: "0px",
		threshold: thresholds,
	};

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				let ratio = entry.intersectionRatio;
				let opacity = Math.pow(ratio, 0.4);
				let blur = 0.5 * (1.002 - ratio);

				entry.target.style.opacity = opacity;
				entry.target.style.filter = `blur(${blur}px)`;
				//observer.unobserve(entry.target);
			}
		});
	}, options);

	elements.forEach((element) => observer.observe(element));
}

export { intersectionObserver };