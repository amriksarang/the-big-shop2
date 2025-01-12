import { screen, waitFor, act } from "@testing-library/react";
import nock from "nock";
import { render } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetail from "../ProductDetail";
import Cart from "../../../components/cart/Cart";
import baseConfig, { cleanUp } from "../../../nockConfiguration";

jest.setTimeout(120 * 1000);

describe("Product Page Tests", () => {
	beforeAll(() => {
		baseConfig();
	});

	afterEach(() => {
		cleanUp();
	});

	beforeEach(() => {
		nock("https://us-east-1.aws.realm.mongodb.com")
			.persist()
			.post("/api/client/v2.0/app/the-big-shop-poikl/functions/call", {
				name: "aggregate",
				arguments: [
					{
						database: "the-big-shop",
						collection: "products",
						pipeline: [
							{ $skip: { $numberInt: "0" } },
							{ $limit: { $numberInt: "12" } },
						],
					},
				],
				service: "mongodb-atlas",
			})
			.reply(200, [
				{
					_id: {
						$oid: "606983f211076e1a5ea15e3d",
					},
					category: "Mobiles",
					"sub-category": "Smart Phones",
					"product-id": {
						$numberInt: "1",
					},
					"product-title": "Samsung Note 10 Lite | 10% Price Drop",
					mrp: "43,000",
					discount: "10%",
					details:
						"12MP Ultra wide (123°) FF + F2.2  Wide (77°) 12MP AF F1.7 Dual Pixel + Tele (45°) 12MP AF F2.4 OIS, 2x Zoom camera | 32MP front facing camera \n 17.04 centimeters (6.7-inch) super Amoled infinity-O display and FHD+ capacitive multi-touch touchscreen with 2400 x 1080 pixels resolution | 16M color support \n Memory, Storage & SIM: 6GB RAM | 128GB internal memory expandable up to 1TB | Dual SIM dual-standby (4G+4G) \n Android v10.0 operating system with 2.7GHz+1.8GHz Exynos 9810 octa core processor \n 4500mAH lithium-ion battery \n 1 year manufacturer warranty for device and 6 months manufacturer warranty for in-box accessories including batteries from the date of purchase \n Box also Includes: S-pen, non-removable battery included, earphones, travel adapter, USB cable and user manual",
					features: {
						RAM: [
							{
								$numberInt: "4",
							},
							{
								$numberInt: "8",
							},
						],
						Camera: {
							$numberInt: "32",
						},
						Battery: {
							$numberInt: "4500",
						},
						Processor: "Exynos",
						"Screen Size": {
							$numberDouble: "6.7",
						},
						Storage: [
							{
								$numberInt: "128",
							},
						],
						Rating: {
							$numberInt: "4",
						},
						Brand: "Samsung",
						Reviews: {
							$numberInt: "4142",
						},
					},
					varients: [
						{
							type: "Color",
							value: [
								{
									id: "1_1",
									value: "Red",
									price: {
										$numberInt: "0",
									},
								},
								{
									id: "1_2",
									value: "Grey",
									price: {
										$numberInt: "0",
									},
								},
							],
						},
						{
							type: "RAM",
							value: [
								{
									id: "1_3",
									value: "4GB, 128GB",
									price: {
										$numberInt: "0",
									},
								},
								{
									id: "1_4",
									value: "8GB, 128GB",
									price: {
										$numberInt: "3000",
									},
								},
							],
						},
					],
					images: {
						small: "img/products/1_medium_2.jpg",
						large: [
							"img/products/1_large_1.jpg",
							"img/products/1_large_2.jpg",
							"img/products/1_large_3.jpg",
							"img/products/1_large_4.jpg",
							"img/products/1_large_5.jpg",
							"img/products/1_large_6.jpg",
						],
						thumbs: [
							"img/products/1_thumb_1.jpg",
							"img/products/1_thumb_2.jpg",
							"img/products/1_thumb_3.jpg",
							"img/products/1_thumb_4.jpg",
							"img/products/1_thumb_5.jpg",
							"img/products/1_thumb_6.jpg",
						],
					},
					owner_id: "60671fc7579a811c0297ae2b",
				},
				{
					_id: {
						$oid: "606983f211076e1a5ea15e4a",
					},
					category: "Mobiles",
					"sub-category": "Smart Phones",
					"product-id": {
						$numberInt: "14",
					},
					"product-title":
						"Samsung Galaxy S21 Plus 5G (Phantom Black, 8GB RAM, 128GB Storage)",
					mrp: "81,999",
					discount: "9%",
					details:
						"Triple rear camera setup- Main Camera 12MP Dual Pixel + Ultra Wide 12MP Camera + Tele1 3X 64MP Camera | 10MP front Dual Pixel Camera \n (6.7-inch) Dynamic AMOLED 2X Display, FHD+ resolution with 2400 X 1080 pixels resolution, 394 PPI with 16M colours \n 8GB RAM | 128GB internal Storage | Dual SIM (nano+nano) dual-standby (5G+5G) \n Android Pie v10.0 operating system with 2.9GHz Exynos 2100 octa core processor \n 4800mAH lithium-ion battery, 1 year manufacturer warranty for device and 6 months manufacturer warranty for in-box accessories including batteries from the date of purchase",
					features: {
						RAM: [
							{
								$numberInt: "8",
							},
						],
						Camera: {
							$numberInt: "64",
						},
						Battery: {
							$numberInt: "4800",
						},
						Processor: "Exynos",
						"Screen Size": {
							$numberDouble: "6.7",
						},
						Storage: [
							{
								$numberInt: "128",
							},
							{
								$numberInt: "256",
							},
						],
						Rating: {
							$numberDouble: "4.5",
						},
						Brand: "Samsung",
						Reviews: {
							$numberInt: "10452",
						},
					},
					varients: [
						{
							type: "Color",
							value: [
								{
									id: "14_1",
									value: "Phantom Black",
								},
								{
									id: "14_2",
									value: "Phantom Silver",
								},
								{
									id: "14_3",
									value: "Phantom Violet",
								},
							],
						},
						{
							type: "RAM",
							value: [
								{
									id: "14_4",
									value: "8GB, 128GB",
									price: "81,999",
								},
								{
									id: "14_5",
									value: "8GB, 256GB",
									price: "84,000",
								},
							],
						},
					],
					images: {
						small: "img/products/14_medium_2.jpg",
						large: [
							"img/products/14_large_1.jpg",
							"img/products/14_large_2.jpg",
							"img/products/14_large_3.jpg",
							"img/products/14_large_4.jpg",
							"img/products/14_large_5.jpg",
							"img/products/14_large_6.jpg",
						],
						thumbs: [
							"img/products/14_thumb_1.jpg",
							"img/products/14_thumb_2.jpg",
							"img/products/14_thumb_3.jpg",
							"img/products/14_thumb_4.jpg",
							"img/products/14_thumb_5.jpg",
							"img/products/14_thumb_6.jpg",
						],
					},
					owner_id: "60671fc7579a811c0297ae2b",
				},
			]);

		nock("https://us-east-1.aws.realm.mongodb.com")
			.persist()
			.post("/api/client/v2.0/app/the-big-shop-poikl/functions/call", {
				name: "findOne",
				arguments: [
					{
						database: "the-big-shop",
						collection: "products",
						query: { "product-id": { $numberInt: "14" } },
					},
				],
				service: "mongodb-atlas",
			})
			.reply(200, {
				_id: { $oid: "606983f211076e1a5ea15e4a" },
				category: "Mobiles",
				"sub-category": "Smart Phones",
				"product-id": { $numberInt: "14" },
				"product-title":
					"Samsung Galaxy S21 Plus 5G (Phantom Black, 8GB RAM, 128GB Storage)",
				mrp: "81,999",
				discount: "9%",
				details:
					"Triple rear camera setup- Main Camera 12MP Dual Pixel + Ultra Wide 12MP Camera + Tele1 3X 64MP Camera | 10MP front Dual Pixel Camera \n (6.7-inch) Dynamic AMOLED 2X Display, FHD+ resolution with 2400 X 1080 pixels resolution, 394 PPI with 16M colours \n 8GB RAM | 128GB internal Storage | Dual SIM (nano+nano) dual-standby (5G+5G) \n Android Pie v10.0 operating system with 2.9GHz Exynos 2100 octa core processor \n 4800mAH lithium-ion battery, 1 year manufacturer warranty for device and 6 months manufacturer warranty for in-box accessories including batteries from the date of purchase",
				features: {
					RAM: [{ $numberInt: "8" }],
					Camera: { $numberInt: "64" },
					Battery: { $numberInt: "4800" },
					Processor: "Exynos",
					"Screen Size": { $numberDouble: "6.7" },
					Storage: [{ $numberInt: "128" }, { $numberInt: "256" }],
					Rating: { $numberDouble: "4.5" },
					Brand: "Samsung",
					Reviews: { $numberInt: "10452" },
				},
				varients: [
					{
						type: "Color",
						value: [
							{ id: "14_1", value: "Phantom Black" },
							{ id: "14_2", value: "Phantom Silver" },
							{ id: "14_3", value: "Phantom Violet" },
						],
					},
					{
						type: "RAM",
						value: [
							{
								id: "14_4",
								value: "8GB, 128GB",
								price: "81,999",
							},
							{
								id: "14_5",
								value: "8GB, 256GB",
								price: "84,000",
							},
						],
					},
				],
				images: {
					small: "img/products/14_medium_2.jpg",
					large: [
						"img/products/14_large_1.jpg",
						"img/products/14_large_2.jpg",
						"img/products/14_large_3.jpg",
						"img/products/14_large_4.jpg",
						"img/products/14_large_5.jpg",
						"img/products/14_large_6.jpg",
					],
					thumbs: [
						"img/products/14_thumb_1.jpg",
						"img/products/14_thumb_2.jpg",
						"img/products/14_thumb_3.jpg",
						"img/products/14_thumb_4.jpg",
						"img/products/14_thumb_5.jpg",
						"img/products/14_thumb_6.jpg",
					],
				},
				owner_id: "60671fc7579a811c0297ae2b",
			});
	});

	test("button has correct initial color", async () => {
		/*
    await waitFor(async () => {
        brandCheckbox = (await screen.findByText("Samsung Galaxy S21 Plus 5G (Phantom Black, 8GB RAM, 128GB Storage)")).closest('a');
        screen.debug(brandCheckbox);
    });*/

		//const brandCheckbox = container.querySelector('[href="/product?productId=14"]');

		/*****
    await waitFor(async () => {
        
        brandCheckbox = (await screen.findByText("Samsung Galaxy S21 Plus 5G (Phantom Black, 8GB RAM, 128GB Storage)")).parentElement.parentElement;
*****/
		/*brandCheckbox.firstChild.removeChild(brandCheckbox.firstChild.firstChild);
        brandCheckbox.firstChild.removeChild(brandCheckbox.firstChild.firstChild);
        brandCheckbox.firstChild.removeChild(brandCheckbox.firstChild.firstChild);
        brandCheckbox.firstChild.removeChild(brandCheckbox.firstChild.firstChild);
        brandCheckbox.firstChild.removeChild(brandCheckbox.firstChild.firstChild);
        brandCheckbox.firstChild.removeChild(brandCheckbox.firstChild.firstChild);*/
		//screen.debug(brandCheckbox);

		/****
    await act( async () => {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 10000);
        });
    });
    

    await waitFor(async () => {         
         
        const elem = await screen.findByText("Triple rear camera setup- Main Camera 12MP Dual Pixel + Ultra Wide 12MP Camera + Tele1 3X 64MP Camera");
        //screen.debug();
        expect(elem).toBeInTheDocument; 
        
        screen.debug(elem);
        
    },{timeout:2000});
*****/

		/*   

        //screen.debug(undefined, Infinity);

*/

		render(
			<MemoryRouter initialEntries={["/product?productId=14"]}>
				<Routes>
					<Route path="/product" element={<ProductDetail />} />
					<Route path="/cart" element={<Cart />} />
				</Routes>
			</MemoryRouter>
		);

		await waitFor(() => {
			const product = screen.getByText(/Samsung Galaxy S21 Plus 5G/);
			expect(product).toBeInTheDocument();
		});

		const addButton = screen.getByTestId("add-product");
		expect(addButton).toBeInTheDocument();

		userEvent.click(addButton);

		let cartButton;
		await waitFor(() => {
			cartButton = screen.getByTestId("go-to-cart");
			expect(cartButton).toBeInTheDocument();
		});
		userEvent.click(cartButton);

		await waitFor(() => {
			const totalPrice = screen.getByText(/163998/);
			expect(totalPrice).toBeInTheDocument();
		});
	});

	test("Add 2 products", async () => {
		render(
			<MemoryRouter initialEntries={["/product?productId=14"]}>
				<Routes>
					<Route path="/product" element={<ProductDetail />} />
					<Route path="/cart" element={<Cart />} />
				</Routes>
			</MemoryRouter>
		);

		await waitFor(() => {
			const product = screen.getByText(/Samsung Galaxy S21 Plus 5G/);
			expect(product).toBeInTheDocument();
		});

		const incrementButton = screen.getByTestId("increment");
		expect(incrementButton).toBeInTheDocument();

		userEvent.click(incrementButton);

		await waitFor(() => {
			const quantityElement = screen.getByTestId("quantity-elem");
			expect(quantityElement).toBeInTheDocument();

			const quantity = quantityElement.textContent;
			expect(quantity).toMatch(/2/);
		});

		const addButton = screen.getByTestId("add-product");
		expect(addButton).toBeInTheDocument();

		userEvent.click(addButton);

		let cartButton;
		await waitFor(() => {
			cartButton = screen.getByTestId("go-to-cart");
			expect(cartButton).toBeInTheDocument();
		});
		userEvent.click(cartButton);

		await waitFor(() => {
			const totalPrice = screen.getByText(/327996/);
			expect(totalPrice).toBeInTheDocument();
		});
	});
});
