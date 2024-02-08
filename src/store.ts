import { writable, type Writable } from "svelte/store";

export const mode = writable('recognize')

export type Attendant = {
    id: string,
    name: string,
    face: string,
    status: string
}
export const newStudent = writable({name: '', face: ''})
export const attendance: Writable<Attendant[]> = writable([])

