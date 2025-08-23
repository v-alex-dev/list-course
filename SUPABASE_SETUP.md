# 🚀 Configuration Supabase

## Étapes de configuration

### 1. 📋 Récupérer vos clés Supabase

1. Allez sur [votre dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **Settings** (icône d'engrenage)
4. Cliquez sur **API**
5. Vous trouverez :
   - **Project URL** : `https://xxxxxxxxx.supabase.co`
   - **Project API Keys** → **anon public** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. 🔧 Configurer les variables d'environnement

Modifiez le fichier `.env` à la racine de votre projet :

```env
# Remplacez par vos vraies valeurs
VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. 🧪 Tester la configuration

1. Démarrez votre application : `npm run dev`
2. Allez sur : `http://localhost:5173/test-supabase`
3. Testez la création de profils et l'ajout d'éléments

### 4. ✅ Vérifications

Si tout fonctionne, vous devriez voir :

- ✅ Connexion OK (vert)
- Possibilité de créer des profils
- Possibilité d'ajouter des éléments de test

### 5. 🔄 Adaptation de votre application existante

Une fois la configuration testée, vos vues existantes doivent être adaptées pour :

1. **Charger les profils depuis Supabase** au lieu des fichiers JSON
2. **Initialiser le store** au démarrage de l'app
3. **Gérer les états de chargement** et les erreurs

## 📁 Structure des fichiers ajoutés

```
src/
├── lib/
│   └── supabase.js          # Configuration client Supabase
├── services/
│   └── dataService.js       # Service pour interagir avec l'API
├── stores/
│   └── profiles.js          # Store Pinia mis à jour
├── components/
│   └── SupabaseTest.vue     # Composant de test
└── views/
    └── SupabaseTestView.vue # Vue de test
```

## 🏗️ Structure de la base de données

Vos tables Supabase :

```sql
-- Table des profils
CREATE TABLE profile (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  name character varying NOT NULL
);

-- Table des listes de courses
CREATE TABLE "list-shopping" (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  items json,
  tags_id smallint,
  profile_id bigint REFERENCES profile(id)
);
```

## 🚨 Résolution de problèmes

### Erreur "Missing Supabase environment variables"

- Vérifiez que le fichier `.env` est à la racine du projet
- Redémarrez votre serveur de développement après modification

### Erreur de connexion à Supabase

- Vérifiez vos clés dans le dashboard Supabase
- Assurez-vous que votre projet Supabase est actif

### Tables non trouvées

- Vérifiez que vos tables sont bien créées dans Supabase
- Vérifiez les noms des tables dans le code (attention aux tirets)

## 📞 Support

Si vous rencontrez des problèmes, vérifiez :

1. Les logs de la console du navigateur
2. L'onglet Network pour voir les requêtes API
3. Les logs Supabase dans votre dashboard
