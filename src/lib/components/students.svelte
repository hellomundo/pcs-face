<script lang="ts">

    import { page } from "$app/stores";
    import { mode, attendance } from "../../store";
    import type { Attendant } from "../../store";

    let students: Attendant[] = [];

    mode.subscribe((value) => {
        console.log('STUDENTS: mode changed to: ', value);
    });

    attendance.subscribe((value) => {
        students = value;
    });


    console.log('I Have students: ', attendance);
    console.log('I have local students: ',)

</script>

<div>
    <table>
        <thead>
            <tr>
                <th>Student ID</th>
                <th>First Name</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {#each students as student}
                <tr>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.status}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    td {
        padding: 0.5em;
    }
    table {
        border: 1px solid #eee;
    }

</style>