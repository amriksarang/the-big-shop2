// when app loads the hangover is to the right
const carousalSmallScript = () => {
	let imgWidth, visibleWindowWidth, hangoverWidth, leftStep, totalWidth;
	let carousal = document.querySelector(".carousal-small");

	let leftButton = document.getElementsByClassName("left")[0];
	let rightButton = document.getElementsByClassName("right")[0];

	function isDiffLessThanEqualToOne(value1, value2 = 0) {
		let difference = Math.abs(value1 - value2);

		if (
			difference === 0 ||
			Math.ceil(difference) <= 2 ||
			Math.floor(difference) <= 2
		) {
			return true;
		}
		return false;
	}

	function controlButtonVisibility(elem, type, time) {
		setTimeout(function () {
			let left = 0;
			if (carousal.style.left) {
				left = Math.abs(
					parseInt(carousal.style.left.replace("px", ""))
				);
			}

			if (type === "left") {
				// left button moves carousal to right
				if (isDiffLessThanEqualToOne(left, 0)) {
					// carousal has fully moved to right
					elem.style.visibility = "hidden";
				} else {
					// carousal has not fully moved to right
					elem.style.visibility = "visible";
				}
			} else if (type === "right") {
				// right button moves carousal to left
				let carousalWidth = Math.abs(parseInt(carousal.offsetWidth));

				// note here left is absolute value
				if (
					isDiffLessThanEqualToOne(
						left + visibleWindowWidth,
						carousalWidth
					)
				) {
					// carousal has fully moved to left
					elem.style.visibility = "hidden";
				} else {
					// carousal has not fully moved to left
					elem.style.visibility = "visible";
				}
			}
		}, time);
	}

	function imageLoaded(image) {
		return new Promise(function (resolve) {
			let src = image.getAttribute("data-src");
			image.setAttribute("src", src);

			image.addEventListener("load", resolve);
		});
	}

	async function initCarousal() {
		let imagesUrlList = document.querySelectorAll(".carousal-small img");
		let containerElement = document.querySelector(".container-small");

		for (let i = 0; i < imagesUrlList.length; i++) {
			await imageLoaded(imagesUrlList[i]);
		}

		if (!imgWidth) {
			let img = document.querySelector(".carousal-small img[src]");
			let imageMargin = window
				.getComputedStyle(img, null)
				.getPropertyValue("margin-left");
			imageMargin = parseInt(imageMargin.replace("px", ""));

			carousal = document.querySelector(".carousal-small");
			imgWidth = img.width;

			visibleWindowWidth = containerElement.offsetWidth;

			// carousal spills outside the container
			totalWidth = carousal.offsetWidth;

			hangoverWidth = totalWidth - visibleWindowWidth;
			leftStep = imgWidth + 2 * imageMargin;

			let carousalHeight = carousal.offsetHeight;
			containerElement.style.height = carousalHeight + "px";

			//elem, type, time
			controlButtonVisibility(leftButton, "left", 0);
		}
	}

	initCarousal();

	// this button moves carousal to the left
	// because we want to see the hidden items present on the right side
	rightButton.addEventListener("click", function () {
		let left = carousal.style.left.replace("px", "");

		if (!left) {
			left = 0;
		}
		left = parseInt(left);

		// note left is negative here
		// has carousal fully moved to the left
		if (left <= -hangoverWidth) {
			return;
		}
		// hangover is the maximum left that the element can move
		// hangover is +ve, left is -ve
		// remaining width is absolute value
		let remainingWidth = hangoverWidth + left;

		if (remainingWidth < leftStep) {
			let leftTotal = left - remainingWidth; // move only remaining width
			carousal.style.left = leftTotal + "px";
			// elem, type, time
			controlButtonVisibility(rightButton, "right", 0);

			return;
		} else {
			let leftTotal = left - leftStep; // move one step to left
			carousal.style.left = leftTotal + "px";
		}
		// wait for 1 sec as this is the time taken by carousal to slide
		// elem, type, time
		controlButtonVisibility(leftButton, "left", 1000);
		controlButtonVisibility(rightButton, "right", 1000);
	});

	// this button moves carousal to the right
	// because we want to see the hidden items present on the left side
	leftButton.addEventListener("click", function () {
		let left = carousal.style.left.replace("px", "");

		if (!left) {
			left = 0;
		}
		left = parseInt(left);

		// has carousal already moved fully to the right
		if (left >= 0) {
			return;
		}
		//is absolute left is < leftStep ?
		// note here left is negative
		if (left > -leftStep) {
			// remaining space < one step
			carousal.style.left = 0;
			//elem, type, time
			controlButtonVisibility(leftButton, "left", 0);
		} else {
			// move right by leftStep, note left is -ve
			carousal.style.left = left + leftStep + "px";
		}
		//elem, type, time
		controlButtonVisibility(leftButton, "left", 1000);
		controlButtonVisibility(rightButton, "right", 1000);
	});
};

export default carousalSmallScript;
