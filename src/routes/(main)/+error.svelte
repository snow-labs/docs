<script>
    import { page } from '$app/state';
  </script>

  <div>
    <h1 class='h1'>{page.status}</h1>
    <p>{page.error?.message}</p>
  </div>