import fs from "fs";
import path from "path";
import { parse } from 'node-html-parser';


export function fromDir(startPath: string, filter: string, callback: (path: string) => void) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, callback);
        } else if (filename.endsWith(filter)) {
            callback(filename);
        };
    };
};

type attributes = { field: string, value: string }[];
export type product = {
    name: string,
    url: string,
    attributes: attributes
}
export const parseProduct = (path: string) => {
    const data = fs.readFileSync(path, 'utf8');
    const root = parse(data);

    const title = root.querySelector("title").innerText;

    const product: product = {
        name: title,
        url: path,    // Leave empty for now
        attributes: []
    }

    const tbody = root.querySelectorAll("table")[0]?.querySelector("tbody");
    if (!tbody) return product;
    const rows = tbody.querySelectorAll("tr")

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const field = row.querySelectorAll("td")[0]?.innerText;
        const value = row.querySelectorAll("td")[1]?.innerText;
        if (!value) continue;
        product.attributes.push({ field, value })
    }
    return product;
}