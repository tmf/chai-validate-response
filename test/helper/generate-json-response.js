import { Response } from "whatwg-fetch";

export default (body = {}, status=200) => new Response(
	JSON.stringify(body), { status: status, headers: { "Content-Type": "application/json" } }
);