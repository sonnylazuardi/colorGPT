// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
//@ts-ignore
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { PASSKEY } from '../camera';

dotenv.config();

// Creating an instance of OpenAIApi with API key from the environment variables
const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_KEY })
);

// Setting values for the prompt and message to be used in the GPT-3 and GPT-3.5-Turbo
const GPT35TurboMessage = (question: string) => ([
  { role: "system", content: `You're a designer give semantic color name from hex code. Answer with short string or multiple string separated with comma.` },
  {
    role: "user",
    content: "Color name of #af6e4d ?",
  },
  {
    role: "assistant",
    content: "brown sugar, brown",
  },
  { role: "user", content: `Color name of ${question} ?` },
]);

let GPT35Turbo = async (message: string) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    //@ts-ignore
    messages: message,
  });

  return response.data.choices[0].message?.content;
};

type Data = {
    hex: string,
  color: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.query.passkey !== PASSKEY) return res.status(200).json({ hex: `#${req.query.hex}`, color: 'Error' });
    const answer = await GPT35Turbo(GPT35TurboMessage(`#${req.query.hex}`) as any) as any;
  res.status(200).json({ hex: `#${req.query.hex}`, color: answer})
}
