import cartReducer, { setItem } from "../Cart";
import { screen } from "@testing-library/react";

describe("Cart Testing", () => {
	test("if setItem is adding product to reducer", () => {
		const initialState = {
			products: null,
			userId: null,
			address: null,
			"credit-card": "",
			"primary-phone": "",
			"secondary-phone": "",
			"expiry-date": "",
			"name-on-card": "",
			success: true,
		};

		const finalState = {
			address: null,
			"credit-card": "",
			"expiry-date": "",
			"name-on-card": "",
			"primary-phone": "",
			"secondary-phone": "",
			userId: null,
			products: {
				products: [
					{
						product: {
							category: "Mobiles",
							"sub-category": "",
							"product-id": "123",
							"product-title": "Samsung",
							mrp: "12000",
							discount: "10",
							details: "Some Details",
							features: "",
							varients: "",
							images: "",
							owner_id: "678",
						},
						productPrice: 13000,
						quantity: 1,
						varient: [
							{
								type: "RAM",
								id: "123",
								value: "128GB",
								price: "1000",
							},
						],
					},
				],
				total: 13000,
			},
			success: true,
		};

		const actionData = {
			product: {
				category: "Mobiles",
				"sub-category": "",
				"product-id": "123",
				"product-title": "Samsung",
				mrp: "12000",
				discount: "10",
				details: "Some Details",
				features: "",
				varients: "",
				images: "",
				owner_id: "678",
			},
			quantity: 1,
			varient: [
				{
					type: "RAM",
					id: "123",
					value: "128GB",
					price: "1000",
				},
			],
		};

		const action = setItem(actionData);
		const newState = cartReducer(initialState, action);

		expect(newState).toEqual(finalState);
	});
});
