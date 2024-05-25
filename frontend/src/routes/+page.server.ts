// src/routes/+page.server.ts
import OpenAI from "openai";
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from '@sveltejs/kit';
import { SECRET_API_KEY, SECRET_ORGID, SECRET_PROJECTID } from '$env/static/private';
const openai = new OpenAI({
    organization: SECRET_ORGID,
    project: SECRET_PROJECTID,
    apiKey: SECRET_API_KEY,
});

async function constructJSON(taskText: string): Promise<string | null> {
    // const prompt = `Only return the json object from this prompt '${taskText}'`;
    const prompt = `Only return the json object from this prompt '${taskText}'`;
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
    if (chatCompletion.choices[0].logprobs === null) {
        const resp = chatCompletion.choices[0].message.content
        return resp;
    }
    return null;
}

// 18,181.81 events input

export const actions: Actions = {
    postGpt: async ({ request, url }) => {
        const formData = await request.formData();
        const prompt = formData.get('prompt') as string;
        console.log(prompt)

        const resp = await constructJSON(prompt)
        if (resp === null) {
            console.log("Error parsing")
            throw new Error("Could not parse")
        }
        console.log(resp)
    }
}