import nock from "nock";

const baseConfig = () => {
	nock("https://realm.mongodb.com")
		.persist()
		.get("/api/client/v2.0/app/the-big-shop-poikl/location")
		.reply(() => {
			return [
				200,
				{
					deployment_model: "LOCAL",
					location: "US-VA",
					hostname: "https://us-east-1.aws.realm.mongodb.com",
					ws_hostname: "wss://ws.us-east-1.aws.realm.mongodb.com",
				},
			];
		});

	nock("https://us-east-1.aws.realm.mongodb.com")
		.persist()
		.post(
			"/api/client/v2.0/app/the-big-shop-poikl/auth/providers/anon-user/login"
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
		.persist()
		.get("/api/client/v2.0/auth/profile")
		.reply(200, {
			user_id: "636a9db30cc445e50b8dc213",
			domain_id: "606702e36fe9f75b74bf4dc7",
			identities: [
				{
					id: "636a9db30cc445e50b8dc210-vjacfpgmgcfdfqogbdwplpyx",
					provider_type: "anon-user",
					provider_id: "60670cce6fe9f75b74c0289b",
				},
			],
			data: {},
			type: "normal",
		});
};

export const cleanUp = () => {
	nock.cleanAll();
	if (!nock.isDone()) {
		console.error("Pending mocks: ", nock.pendingMocks());
	}
};
export default baseConfig;
