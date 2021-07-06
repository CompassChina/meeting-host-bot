import { VercelRequest, VercelResponse } from "@vercel/node";
export default async function (req: VercelRequest, res: VercelResponse) {
    const { name = "world" } = req.query;
    res.status(200).send(`Hello ${name}`!);
}
