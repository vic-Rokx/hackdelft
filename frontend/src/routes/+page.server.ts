// src/routes/+page.server.ts
import OpenAI from "openai";
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';


const fields = [
    "brand",
    "type",
    "pore_size_mu",
    "max_temperature_c",
    "max_temperature_f",
    "adapter_1",
    "adapter_2",
    "o_ring_gasket",
    "length_in_inch",
    "length_in_cm",
    "outer_diameter_inch",
    "quantity_per_case",
    "volume_l",
    "package",
    "shipping_weight_kg",
    "dosage_ppm",
    "caco3",
    "caso4",
    "baso4",
    "srso4",
    "caf2",
    "capo4",
    "fe",
    "mn",
    "al",
    "silica",
    "wt_p",
    "wt_n",
    "turbidity_ntu",
    "inlet_pressure_bar",
    "inlet_pressure_psi",
    "number_of_stacks",
    "type_of_stack",
    "recovery",
    "stages",
    "ph_range",
    "flow_m3h",
    "flow_rate_gpm_ft2",
    "shipping_weight_lbs",
    "flow_l_min",
    "inlet",
    "outlet",
    "material",
    "port_type",
    "port_size_in_inch",
    "port_size_out_inch",
    "number_of_cartridges",
    "weight_kg",
    "weight_lb",
    "flow_gpm",
    "shipping_size_of_case_in_cm",
    "carton_shipping_weight_in_lbs",
    "carton_shipping_weight_in_kg",
    "replaced_by",
    "area_m2",
    "area_ft2",
    "flow_l_h",
    "material_housing",
    "diameter_bores_mm",
    "diameter_fiber_od_mm",
    "width_mm",
    "width_inch",
    "length_mm",
    "application",
    "configuration",
    "feed_connector_inch",
    "permeate_connection_inch",
    "max_pressure_psi",
    "max_pressure_bar",
    "diameter_bores_inch",
    "diameter_fiber_od_inch",
    "flow_gfd",
    "average_nacl_rejection_percentage",
    "minimum_nacl_rejection_percentage",
    "max_pressure_kpa",
    "membrane_active_area_ft2",
    "membrane_active_area_m2",
    "flow_gpd",
    "flow_m3_day",
    "replaced_part_number",
    "remarks",
    "average_mgso4l_rejection_percentage",
    "membrane_thickness_mum",
    "ion_exchange_capacity_meq_g",
    "water_transfer_ml_f",
    "sucrose_transfer_g_f",
    "water_content",
    "resin_type"
]

import { json, type Actions, type RequestHandler } from '@sveltejs/kit';
import { SECRET_API_KEY, SECRET_ORGID, SECRET_PROJECTID } from '$env/static/private';
const openai = new OpenAI({
    organization: SECRET_ORGID,
    project: SECRET_PROJECTID,
    apiKey: SECRET_API_KEY,
});

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    // const user = await db.getUserFromSession(cookies.get('sessionid'));
    return { data: [] };
}

async function constructJSON(taskText: string): Promise<string | null> {
    // const prompt = `Only return the json object from this prompt '${taskText}'`;
    const conditionsString = JSON.stringify(fields);
    const prompt = `Return ONLY a json array where each element is of the structure {column: ..., value: ...}, from the prompt: '${taskText}' which matches the columns from the following string array ${conditionsString}`;
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
    console.log(chatCompletion);
    if (chatCompletion.choices[0].logprobs === null) {
        const resp = chatCompletion.choices[0].message.content
        return resp;
    }
    return null;
}

async function openDB(): Promise<Database> {
    return open({
        filename: './products.db', // Ensure this path is correct relative to your project structure
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

        if (resp.length < 1) {
            return { data: [], success: false }
        }

        let conditions;
        try {
            conditions = await JSON.parse(resp);
        } catch (error) {
            const resp = await constructJSON(prompt)
            if (resp === null) {
                console.log("Error parsing")
                throw new Error("Could not parse")
            }
            conditions = await JSON.parse(resp);
        }


        if (conditions.length < 1) {
            return { data: [], success: false }
        }

        // const conditions = [
        //     { column: 'pore_size_mu', value: 5 },
        //     { column: 'brand', value: "SUEZ Muni.Z" },
        // ]

        for (const con of conditions) {
            con.value = con.value.toString();
        }

        // console.log(conditions);

        const data = await queryDatabase("products", conditions);
        // console.log("Length of the db results", data.length);

        const urlsAndBrands = []
        for (const product of data) {
            if (product.url) {
                urlsAndBrands.push({ url: product.url, brand: product.brand, name: product.name })
            }
        }

        return { data: urlsAndBrands, success: true };
    }
}