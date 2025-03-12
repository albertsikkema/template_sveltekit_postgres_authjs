<script lang="ts">
 import '../../app.css';
</script>

<div>
 <main>
    <div>
     <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      Login
     </h3>
     <form onSubmit={handleSubmit} class="flex flex-col space-y-4">
      <div class="flex flex-col space-y-1">
       <label for="email" class="text-sm font-medium text-gray-900 dark:text-white">
        Email
       </label>
       <input type="email" id="email" name="email" class="p-2 border border-gray-300 dark:border-gray-700 rounded-md" />
      </div>
      <div class="flex flex-col space-y-1">
       <label for="password" class="text-sm font-medium text-gray-900 dark:text-white">
        Password
       </label>
       <input type="password" id="password" name="password" class="p-2 border border-gray-300 dark:border-gray-700 rounded-md" />
      </div>
      <button type="submit" class="p-2 bg-blue-500 text-white rounded-md">
       Login
      </button>
    </div>
 </main>
</div>