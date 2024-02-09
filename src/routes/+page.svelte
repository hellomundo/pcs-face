<script lang="ts">
    import Recognizer from "$lib/components/recognizer.svelte";
    import Students from "$lib/components/students.svelte";
    import Addform from "$lib/components/addform.svelte";
    import { mode, attendance, newStudent } from "../store";
    import type { Attendant } from "../store";

    export let data;
    
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

    // map server data new array with attendance data
    const localStudents: Attendant[] = data.students.map((student) => {
        return {
            id: student.id,
            name: student.name as string,
            face: student.face as string,
            status: 'absent'
        }
    });
    // then update the store
    attendance.update((value) => {
        return [...value, ...localStudents]
    });

    function resetAttendance() {
        console.log('reset attendance')
        $attendance.forEach((student) => {
            student.status = 'absent';
        });
    }

    function deleteAllStudents() {
        console.log('delete all students');
        fetch('/api/students', {
            method: 'DELETE'
        });
        $attendance = [];
    }

    function startRecognize() {
        console.log('start recognize');
        mode.set('recognize');
    }

    function startEnroll() {
        console.log('start enroll');
        $newStudent.name = '';
        mode.set('enroll');
    }
    function startCapture() {
        console.log('start capture for: ', $newStudent.name);
        mode.set('capture');
    }

    function cancelCapture() {
        console.log('cancel capture');
        mode.set('recognize');
    }

    async function handleCapture() {
        console.log('handle capture');
        console.log('captured: ', $newStudent.face);
        console.log('trying to save student: ', $newStudent.name);
        // clear form field


        // store to server
        const response = await fetch('/api/students', {
			method: 'POST',
			body: JSON.stringify($newStudent),
			headers: {
				'content-type': 'application/json',
			},
		});

        const captured = await response.json()
        const stu = captured[0];
        stu.status = 'present';
        console.log('response: ', stu);
        $attendance = [...$attendance, stu];

        mode.set('recognize');
    }

    resetAttendance();

</script>

<h1>PCS Attendance Bot</h1>

<div id="outside">
    <div id="video-container">
        <Recognizer on:capture={handleCapture}/>
    </div>
    <div id="context-container">
        {#if $mode === 'recognize'}
        <div id="student-container">
            <h2>Students</h2>
            <Students />
            <div>
                <button on:click={() => resetAttendance()}>Reset Attendance</button>
                <button on:click={() => deleteAllStudents()}>Delete All Students</button>
                <button on:click={() => startEnroll()}>Add Student</button>
            </div>
        </div>
        {:else if $mode === 'enroll'}
        <div id="enroll-container">
            <h2>Add Student</h2>
            <input bind:value={$newStudent.name} type="text" id="name" name="name" placeholder="Name" />
            <button on:click={() => startCapture()}>Submit</button>
            <button on:click={() => cancelCapture()}>Cancel</button>
        </div>
        {:else if $mode === 'capture'}
        <div id="capture-container">
            <h2>Capturing...</h2>
        </div>
        {/if}
    </div>
</div>  

<style>
    #outside {
        display: flex;
        flex-direction: row;
        gap: 3em;
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
</style>