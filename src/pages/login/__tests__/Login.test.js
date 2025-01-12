import { screen, waitFor, act } from "@testing-library/react";
import nock from "nock";
import { render } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "../../login/Login";
import LandingPage from "../../landing-page/LandingPage";
import App from "../../../App";
import baseConfig, { cleanUp } from "../../../nockConfiguration";

describe("Login", () => {
	beforeAll(() => {
		baseConfig();
	});

	afterEach(() => {
		cleanUp();
	});

	test("Login", async () => {
		nock("https://us-east-1.aws.realm.mongodb.com")
			.persist()
			.post(
				"/api/client/v2.0/app/the-big-shop-poikl/auth/providers/local-userpass/login",
				{
					username: "test9@gmail.com",
					password: "amk_xyz1",
					options: {
						device: {
							sdkVersion: "2.0.0",
							platform: "node",
							platformVersion: "20.13.1",
							deviceId: {
								$oid: "636a9db3bdeec4a0374030d8",
							},
						},
					},
				}
			)
			.reply(200, {
				access_token:
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjYzNmE5ZGIzYmRlZWM0YTAzNzQwMzBkOCIsImJhYXNfZG9tYWluX2lkIjoiNjA2NzAyZTM2ZmU5Zjc1Yjc0YmY0ZGM3IiwiZXhwIjoxNjY3OTMzMzcyLCJpYXQiOjE2Njc5MzE1NzIsImlzcyI6IjYzNmE5ZGI0YmRlZWM0YTAzNzQwMzEyNCIsInN0aXRjaF9kZXZJZCI6IjYzNmE5ZGIzYmRlZWM0YTAzNzQwMzBkOCIsInN0aXRjaF9kb21haW5JZCI6IjYwNjcwMmUzNmZlOWY3NWI3NGJmNGRjNyIsInN1YiI6IjYzNmE5ZGIzYmRlZWM0YTAzNzQwMzBkNCIsInR5cCI6ImFjY2VzcyJ9.KCq0rPr06Z-YYsJVO2UyuzKy3EXmthFBckffiLMlf_0",
				refresh_token:
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RhdGEiOm51bGwsImJhYXNfZGV2aWNlX2lkIjoiNjM2YTlkYjNiZGVlYzRhMDM3NDAzMGQ4IiwiYmFhc19kb21haW5faWQiOiI2MDY3MDJlMzZmZTlmNzViNzRiZjRkYzciLCJiYWFzX2lkIjoiNjM2YTlkYjRiZGVlYzRhMDM3NDAzMTI0IiwiYmFhc19pZGVudGl0eSI6eyJpZCI6IjYzNmE5ZGIzYmRlZWM0YTAzNzQwMzBjZi11cGpoY25saXVqbmxwdW10emVpZ2x5bHEiLCJwcm92aWRlcl90eXBlIjoiYW5vbi11c2VyIiwicHJvdmlkZXJfaWQiOiI2MDY3MGNjZTZmZTlmNzViNzRjMDI4OWIifSwiZXhwIjozMjQ0NzMxNTcyLCJpYXQiOjE2Njc5MzE1NzIsInN0aXRjaF9kYXRhIjpudWxsLCJzdGl0Y2hfZGV2SWQiOiI2MzZhOWRiM2JkZWVjNGEwMzc0MDMwZDgiLCJzdGl0Y2hfZG9tYWluSWQiOiI2MDY3MDJlMzZmZTlmNzViNzRiZjRkYzciLCJzdGl0Y2hfaWQiOiI2MzZhOWRiNGJkZWVjNGEwMzc0MDMxMjQiLCJzdGl0Y2hfaWRlbnQiOnsiaWQiOiI2MzZhOWRiM2JkZWVjNGEwMzc0MDMwY2YtdXBqaGNubGl1am5scHVtdHplaWdseWxxIiwicHJvdmlkZXJfdHlwZSI6ImFub24tdXNlciIsInByb3ZpZGVyX2lkIjoiNjA2NzBjY2U2ZmU5Zjc1Yjc0YzAyODliIn0sInN1YiI6IjYzNmE5ZGIzYmRlZWM0YTAzNzQwMzBkNCIsInR5cCI6InJlZnJlc2gifQ.rYEs6vKKBwXTybOqToNanCFT9ijQfXh3nSEjFfLp43E",
				user_id: "636a9db3bdeec4a0374030d4",
				device_id: "636a9db3bdeec4a0374030d8",
			});

		nock("https://us-east-1.aws.realm.mongodb.com")
			.get("/api/client/v2.0/auth/profile")
			.matchHeader("accept", "application/json")
			.matchHeader(
				"user-agent",
				"node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"
			)
			.matchHeader("accept-encoding", "gzip,deflate")
			.matchHeader(
				"authorization",
				"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjYzNmE5ZGIzYmRlZWM0YTAzNzQwMzBkOCIsImJhYXNfZG9tYWluX2lkIjoiNjA2NzAyZTM2ZmU5Zjc1Yjc0YmY0ZGM3IiwiZXhwIjoxNjY3OTMzMzcyLCJpYXQiOjE2Njc5MzE1NzIsImlzcyI6IjYzNmE5ZGI0YmRlZWM0YTAzNzQwMzEyNCIsInN0aXRjaF9kZXZJZCI6IjYzNmE5ZGIzYmRlZWM0YTAzNzQwMzBkOCIsInN0aXRjaF9kb21haW5JZCI6IjYwNjcwMmUzNmZlOWY3NWI3NGJmNGRjNyIsInN1YiI6IjYzNmE5ZGIzYmRlZWM0YTAzNzQwMzBkNCIsInR5cCI6ImFjY2VzcyJ9.KCq0rPr06Z-YYsJVO2UyuzKy3EXmthFBckffiLMlf_0"
			)
			.reply(200, {
				user_id: "6341b2cdd86a348c2fbb7dd6",
				domain_id: "606702e36fe9f75b74bf4dc7",
				identities: [
					{
						id: "6341b2bf5cf52865afd67136",
						provider_type: "local-userpass",
						provider_id: "60670b80bffbe967426cd0af",
						provider_data: {
							email: "test9@gmail.com",
						},
					},
				],
				custom_data: {
					_id: "6341b9c9dc2c33d6c81b4a7d",
					userId: "6341b2cdd86a348c2fbb7dd6",
					addresses: [
						{
							houseno: "a",
							street1: "b",
							street2: "c",
							city: "d",
							state: "e",
							_id: "dc2c777d-8405-4cd8-8302-dee4d94f5d2d",
						},
					],
					email: "test9@gmail.com",
					firstname: "test9",
					lastname: "xyz",
					"primary-phone": "7894561230",
					"secondary-phone": "4561237890",
				},
				data: {
					email: "test9@gmail.com",
				},
				type: "normal",
			});

		render(
			<MemoryRouter initialEntries={["/login"]}>
				<App />
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</MemoryRouter>
		);
		let userName, password;
		await waitFor(() => {
			userName = screen.getByTestId("username");
			screen.debug(userName);
			expect(userName).toBeInTheDocument();

			password = screen.getByTestId("password");
			screen.debug(password);
			expect(password).toBeInTheDocument();
		});

		await userEvent.type(userName, "test9@gmail.com");

		await userEvent.type(password, "amk_xyz1");

		await waitFor(() => {
			expect(userName.value).toBe("test9@gmail.com");
			expect(password.value).toBe("amk_xyz1");
		});

		const logInButton = screen.getByTestId("log-in");
		expect(logInButton).toBeInTheDocument();

		await userEvent.click(logInButton);

		await waitFor(() => {
			const logOutText = screen.getByText(/Log Out/);
			expect(logOutText).toBeInTheDocument();
		});
		screen.debug(undefined, Infinity);
	});
});
