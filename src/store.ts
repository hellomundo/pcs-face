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

export const markAttendance = (name: string, status: string) => {
    attendance.update((attendants: Attendant[]) => {
        return attendants.map((attendant: Attendant) => {
            if (attendant.name === name) {
                console.log("Marking attendance for ", name, " as ", status)
                return {
                    ...attendant,
                    status
                }
            }
            return attendant
        })
    })
}