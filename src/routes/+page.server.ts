import type { Actions, PageServerLoad } from "./$types";
import { students } from "$lib/db/schema";
import { tursoClient } from "../lib/server/turso";

export const load: PageServerLoad = async () => {
    const db = tursoClient();
    const students = await db.query.students.findMany();

    if(students != undefined) {
        return { students };
    }

    return { students: [] };
}


export const actions: Actions = {
    create: async ({request}) => {
        const {name, face } = await Object.fromEntries(await request.formData()) as {name: string, face: string};
        const db = tursoClient();

        const id: string = crypto.randomUUID();

        try {
            const newStudent = await db.insert(students).values({ 
                id, 
                name, 
                face 
            }).returning();

            console.log("Success! New student: ", newStudent);

            return {
                body: JSON.stringify(newStudent)
            }
        } catch {
            return {
                status: 500,
                body: JSON.stringify({error: "Error creating student"})
            };
        }

    },

};
