import { type LibSQLDatabase, drizzle } from "drizzle-orm/libsql";  
import { createClient } from "@libsql/client/http";
import * as schema from "$lib/db/schema";
//import { env } from "face-api.js";
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$env/static/private';

export function tursoClient(): LibSQLDatabase<typeof schema> {
    /*
    const url = import.meta.env.VITE_TURSO_DATABASE_URL?.trim();

    if(url === undefined) {
        throw new Error("DATABASE_URL not set");
    }

    const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN?.trim();
    if(authToken === undefined) {
        throw new Error("DATABASE_AUTH_TOKEN not set");
    }
*/  
    return drizzle(
        createClient({
            url: DATABASE_URL,
            authToken: DATABASE_AUTH_TOKEN
        }), 
        { schema }
    )
}