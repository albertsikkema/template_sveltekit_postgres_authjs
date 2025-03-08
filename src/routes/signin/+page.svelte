<script lang="ts">
 import '../../app.css';
</script>

<div>
 <main>
    <div>
     <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      Login
     </h3>
     <form method="POST" action="/auth/signin/github">
      <input type="hidden" name="csrfToken" >      
      <button type="submit" class="w-full buttonPrimary">Login</button> 
     </form>
    </div>
 </main>
</div>