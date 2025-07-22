import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { path } = req.query;

  if (!path || !Array.isArray(path)) {
    return res.status(400).json({ error: "Invalid path" });
  }

  const fullPath = path.join("/");
  const url = `https://api.mangadex.org/${fullPath}${req.url?.split(fullPath)[1] || ""}`;

  try {
    const response = await axios({
      url,
      method: req.method,
      headers: {
        "x-requested-with": "cubari",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      detail: error.response?.data || null,
    });
  }
}
