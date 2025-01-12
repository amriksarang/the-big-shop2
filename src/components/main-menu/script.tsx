const handleNav = () => {
    let screenWidth = window.innerWidth;

	let primaryMenuElement = document.getElementsByClassName("nav-links")[0] as HTMLDivElement;
	let primaryMenuElementHeight: number = primaryMenuElement.offsetHeight;
	let primaryMenuElementLeft: number = primaryMenuElement.offsetLeft;

	let secondaryMenuElement = document.getElementsByClassName("categories")[0] as HTMLDivElement;
    secondaryMenuElement.style.top = 2 * primaryMenuElementHeight + 30 + "px";
    if(screenWidth < 600 ) {
        secondaryMenuElement.style.left = '0px';
    }else{
	    secondaryMenuElement.style.left = primaryMenuElementLeft + "px";
    }
	

	let allNavLink = document.querySelector(".nav-links li:first-child") as HTMLElement;

	allNavLink.addEventListener("mouseenter", function (e) {
		secondaryMenuElement.classList.add("nav-link-mouseover");
	});

	allNavLink.addEventListener("mouseleave", function (e) {
		secondaryMenuElement.classList.remove("nav-link-mouseover");
	});

	(document
		.querySelector(".hamburger-icon") as SVGElement)
		.addEventListener("click", function () {
			secondaryMenuElement.style.display = "inline-flex";
		});

	(document
		.querySelector(".categories") as SVGElement)
		.addEventListener("click", function () {
			secondaryMenuElement.style.display = "none";
		});
};

export default handleNav;
