import type { RequestHandler} from "../$types";
import { students } from "$lib/db/schema";
import { tursoClient } from "$lib/server/turso";

import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
    const options: RequestInit = {

    }

    return new Response("Hello, world!", {
    });
}

export const POST: RequestHandler = async ({request}) => {
    const db = tursoClient();

    const id: string = crypto.randomUUID();

    const {name, face} = await request.json() as {name: string, face: string};
    
    try {
        const newStudent = await db.insert(students).values({ 
            id, 
            name, 
            face 
        }).returning();

        console.log("Success! New student: ", newStudent);

        return new Response(
            JSON.stringify(newStudent),
            {
                status: 201,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    } catch {
        return new Response(
            JSON.stringify({error: "Error creating student"}),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }


}

export const DELETE: RequestHandler = async ({request}) => {
    const db = tursoClient();

    await db.delete(students);

    return new Response("Cleared", {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
}