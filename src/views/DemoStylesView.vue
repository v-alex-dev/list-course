<template>
  <div class="min-h-screen p-8 space-y-8">
    <div class="max-w-4xl mx-auto">
      <!-- Titre principal -->
      <h1 class="text-4xl font-bold text-center mb-12 glow-cyan animate-pulse-glow">
        Démo Thème Glass Moderne
      </h1>

      <!-- Section Boutons -->
      <div class="card-glass-highlight mb-8">
        <h2 class="text-2xl font-semibold mb-6 text-cyan-300">Boutons Glass</h2>
        <div class="flex flex-wrap gap-4">
          <button class="btn-glass">Bouton Glass</button>
          <button class="btn-glass-primary">Bouton Primary</button>
          <button class="btn-glass-secondary">Bouton Secondary</button>
        </div>
      </div>

      <!-- Section Liens Néon -->
      <div class="card-glass mb-8">
        <h2 class="text-2xl font-semibold mb-6 text-purple-300">Liens Néon</h2>
        <div class="flex flex-wrap gap-6">
          <a href="#" class="link-neon">Lien Cyan</a>
          <a href="#" class="link-neon-pink">Lien Rose</a>
          <a href="#" class="link-neon-green">Lien Vert</a>
        </div>
      </div>

      <!-- Section Onglets -->
      <div class="card-glass mb-8">
        <h2 class="text-2xl font-semibold mb-6 text-green-300">Onglets</h2>
        <div class="tabs-container">
          <div class="tab active">Accueil</div>
          <div class="tab">Profil</div>
          <div class="tab">Paramètres</div>
          <div class="tab">À propos</div>
        </div>
      </div>

      <!-- Section Formulaire -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-6 text-pink-300 text-center">Formulaire Glass</h2>
        <form class="form">
          <div class="form-group">
            <label for="nom">Nom complet</label>
            <input type="text" id="nom" placeholder="Entrez votre nom" />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="votre@email.com" />
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" placeholder="Votre message..."></textarea>
          </div>

          <div class="form-group">
            <label for="categorie">Catégorie</label>
            <select id="categorie">
              <option value="">Choisir une catégorie</option>
              <option value="general">Général</option>
              <option value="support">Support</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <button type="submit" class="btn-glass-primary w-full mt-4">Envoyer le message</button>
        </form>
      </div>

      <!-- Section Cards avec effets -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="card-glass">
          <h3 class="text-xl font-semibold mb-3 text-cyan-300">Card Standard</h3>
          <p class="text-gray-300">
            Cette card utilise l'effet glass standard avec un arrière-plan semi-transparent et un
            effet de flou.
          </p>
          <button class="btn-glass mt-4">En savoir plus</button>
        </div>

        <div class="card-glass-highlight">
          <h3 class="text-xl font-semibold mb-3 text-purple-300">Card Highlight</h3>
          <p class="text-gray-300">
            Cette card a un effet de surbrillance avec des dégradés colorés et des bordures qui
            changent au survol.
          </p>
          <button class="btn-glass-secondary mt-4">Action</button>
        </div>
      </div>

      <!-- Section Effets spéciaux -->
      <div class="card-glass text-center">
        <h2 class="text-2xl font-semibold mb-6 text-yellow-300">Effets Spéciaux</h2>
        <div class="flex justify-center space-x-8">
          <div class="glow-cyan p-4 bg-gray-800/50 rounded-lg">
            <span class="text-cyan-300">Glow Cyan</span>
          </div>
          <div class="glow-purple p-4 bg-gray-800/50 rounded-lg">
            <span class="text-purple-300">Glow Purple</span>
          </div>
          <div class="glow-pink p-4 bg-gray-800/50 rounded-lg">
            <span class="text-pink-300">Glow Pink</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Aucune logique JS nécessaire pour cette démo
</script>
