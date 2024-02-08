<script lang="ts">

    import { page } from "$app/stores";
    import { mode } from "../../store";

    mode.subscribe((value) => {
        console.log('STUDENTS: mode changed to: ', value);
    });

    console.log('I Have students: ', $page.data);

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
            {#each $page.data.students as student}
                <tr>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.status}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
