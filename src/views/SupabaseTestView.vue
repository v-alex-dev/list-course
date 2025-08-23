<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">🧪 Test Supabase Integration</h1>

      <!-- Instructions -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 class="text-lg font-semibold text-yellow-800 mb-2">⚠️ Configuration requise</h2>
        <ol class="list-decimal list-inside space-y-1 text-yellow-700">
          <li>
            Allez sur
            <a href="https://supabase.com/dashboard" target="_blank" class="underline font-medium"
              >votre dashboard Supabase</a
            >
          </li>
          <li>Sélectionnez votre projet</li>
          <li>Allez dans <strong>Settings</strong> → <strong>API</strong></li>
          <li>Copiez l'<strong>URL</strong> et la clé <strong>anon/public</strong></li>
          <li>
            Modifiez le fichier <code class="bg-yellow-100 px-1 rounded">.env</code> à la racine du
            projet
          </li>
        </ol>
      </div>

      <!-- Composant de test -->
      <SupabaseTest />

      <!-- Lien de retour -->
      <div class="mt-8 text-center">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← Retour à l'app
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import SupabaseTest from '../components/SupabaseTest.vue'
</script>
