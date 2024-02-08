<script>
  import { enhance } from "$app/forms";
</script>

<form action="?/create" use:enhance method="POST">
  <label for="name">Name</label>
    <input type="text" id="name" name="name" />
  <label for="face">Face</label>
    <input type="text" id="face" name="face" />
    <button type="submit">Submit</button>
</form>