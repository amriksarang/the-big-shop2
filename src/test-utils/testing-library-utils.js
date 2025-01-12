import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { AppProvider } from "../context/AppProvider";
import { UserProvider } from "../context/UserProvider";
import { CartProvider } from "../context/CartProvider";
import store from "../redux/store";

// import { BrowserRouter, Route, Routes } from "react-router-dom";

const APP_ID = "the-big-shop-poikl";

const AllTheProviders = ({ children }) => {
	return (
		<Provider store={store}>
			<AppProvider appId={APP_ID}>
				<UserProvider>
					<CartProvider>{children}</CartProvider>
				</UserProvider>
			</AppProvider>
		</Provider>
	);
};

const renderWithContext = (ui, options) =>
	render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { renderWithContext as render };
