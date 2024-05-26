// src/routes/+page.server.ts
import OpenAI from "openai";
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

import type { Actions, RequestHandler } from '@sveltejs/kit';
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

async function openDB(): Promise<Database>  {
    return open({
        filename: './database.db', // Ensure this path is correct relative to your project structure
        driver: sqlite3.Database
    });
}

interface Condition {
    column: string;
    value: any;
  }

async function queryDatabase(table: string, conditions: Condition[]) {
    const db = await openDB();
    try {
        const { whereClause, params } = buildWhereClause(conditions);
        const sql = `SELECT * FROM ${table} ${whereClause}`;
        return await db.all(sql, params);
    } finally {
        await db.close();
    }
}

function buildWhereClause(conditions: Condition[]) {
    if (conditions.length === 0) return { whereClause: '', params: [] };
  
    const whereClause = 'WHERE ' + conditions.map(cond => `${cond.column} = ?`).join(' AND ');
    const params = conditions.map(cond => cond.value);
  
    return { whereClause, params };
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

        const conditions = [
            { column: 'Turbidity NTU', value: url.searchParams.get('turbidity') },
            { column: 'Inlet Pressure bar', value: url.searchParams.get('inletPressureBar') },
            { column: 'Inlet Pressure psi', value: url.searchParams.get('inletPressurePsi') },
            { column: 'Number of Stacks', value: url.searchParams.get('numberOfStacks') },
            { column: 'Type of Stack', value: url.searchParams.get('typeOfStack') },
            { column: 'Recovery %', value: url.searchParams.get('recovery') },
            { column: 'Stages', value: url.searchParams.get('stages') },
            { column: 'pH range', value: url.searchParams.get('phRange') },
          ].filter(cond => cond.value !== null); // Filter out conditions with null values

        const data = await queryDatabase("products", conditions);
    }
}