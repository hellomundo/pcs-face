<script lang="ts">
    import Recognizer from "$lib/components/recognizer.svelte";
    import Students from "$lib/components/students.svelte";
    import Addform from "$lib/components/addform.svelte";

    type Mode = 'recognize' | 'enroll';

    export let data;

    import { mode } from "../store";
    mode.subscribe((value) => {
        console.log('PAGE- mode changed to: ', value);
    });

    function toggleMode() {
        mode.update((value) => {
            if (value === 'recognize') {
                return 'enroll';
            } else {
                return 'recognize';
            }
        });
    }

    let localStudents = data.students.map((student) => {
        return {
            id: student.id,
            name: student.name,
            face: student.face,
            status: 'absent'
        }
    });

    function resetAttendance() {
        console.log('reset attendance')
        localStudents.forEach((student) => {
            student.status = 'absent';
        });
    }

    function startCapture() {
        console.log('start capture');
    }

    resetAttendance();

</script>

<h1>PCS Attendance Bot</h1>

<div id="outside">
    <div id="video-container">
        <Recognizer />
    </div>
    <div id="context-container">
        {#if $mode === 'recognize'}
        <div id="student-container">
            <h2>Students</h2>
            <Students />
            <div>
                <button on:click={() => resetAttendance()}>Reset</button>
                <button on:click={() => toggleMode()}>Add Student</button>
            </div>
        </div>
        {:else}
        <div id="add-container">
            <h2>Add Student</h2>
            <input type="text" id="name" name="name" placeholder="Name" />
            <button on:click={() => console.log('submit')}>Submit</button>
        </div>
        {/if}
    </div>
</div>  

<style>
    #outside {
        display: flex;
        flex-direction: row;
    }
    #video-container {
        position: relative;
    }
    #context-container {
        position: relative;
    }
    #student-container {
        position: relative;
    }
    #add-container {
        position: relative;
    }
</style>