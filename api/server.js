import { Readable } from "node:stream";
import serverEntry from "../dist/server/server.js";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
	const proto = req.headers["x-forwarded-proto"] ?? "https";
	const host =
		req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost";

	const request = new Request(new URL(req.url, `${proto}://${host}`), {
		method: req.method,
		headers: new Headers(
			Object.entries(req.headers)
				.filter(([, v]) => v != null)
				.map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v]),
		),
		body: ["GET", "HEAD"].includes(req.method ?? "") ? undefined : req,
		// @ts-ignore
		duplex: "half",
	});

	const response = await serverEntry.fetch(request);

	res.writeHead(
		response.status,
		Object.fromEntries(response.headers.entries()),
	);

	if (response.body) {
		Readable.fromWeb(response.body).pipe(res);
	} else {
		res.end();
	}
}
