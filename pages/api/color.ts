// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
//@ts-ignore
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

// Setting values for the prompt and message to be used in the GPT-3 and GPT-3.5-Turbo
const GPT35TurboMessage = (question: string) => [
  {
    role: "system",
    content: `You're a designer give the closest base color name from hex code. Answer with short and simple name.`,
  },
  {
    role: "user",
    content: "Color name of #af6e4d ?",
  },
  {
    role: "assistant",
    content: "brown",
  },
  { role: "user", content: `Color name of ${question} ?` },
];

type Data = {
  hex: string;
  color: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Creating an instance of OpenAIApi with API key from the environment variables
  const openai = new OpenAIApi(
    new Configuration({ apiKey: req.query.apiKey + "" })
  );
  let GPT35Turbo = async (message: string) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      //@ts-ignore
      messages: message,
    });

    return response.data.choices[0].message?.content;
  };
  try {
    const answer = (await GPT35Turbo(
      GPT35TurboMessage(`#${req.query.hex}`) as any
    )) as any;
    // get the first color
    let result = answer;
    if (result.includes(',')) result = answer.split(',')[0];
    result = result.trim().toLowerCase();
    res.status(200).json({ hex: `#${req.query.hex}`, color: result });
  } catch (e) {
    res
      .status(400)
      .json({
        hex: `#${req.query.hex}`,
        color: "",
        error: "API Key is invalid",
      });
  }
}
