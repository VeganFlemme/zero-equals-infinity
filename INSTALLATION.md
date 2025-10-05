# 🚀 Guide d'Installation

## Pour GitHub

### Option 1: Nouveau Repository

```bash
# 1. Créez un nouveau repo sur GitHub (sans README initial)

# 2. Extrayez le ZIP

# 3. Dans le dossier extrait:
git init
git add .
git commit -m "Initial commit: v3.0 FIXED - Optimized & Bug-Free"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
git push -u origin main
```

### Option 2: Fork Existant

```bash
# 1. Forkez le repo original sur GitHub

# 2. Clonez votre fork:
git clone https://github.com/VOTRE-USERNAME/zero-equals-infinity.git
cd zero-equals-infinity

# 3. Extrayez le ZIP dans ce dossier (remplace les fichiers)

# 4. Commit et push:
git add .
git commit -m "Update to v3.0 FIXED - All bugs corrected"
git push origin main
```

## Déploiement

### Vercel (Recommandé)

1. Allez sur [vercel.com](https://vercel.com)
2. "New Project"
3. Importez votre repo GitHub
4. Deploy automatique ! ✨

### Netlify

1. Allez sur [netlify.com](https://netlify.com)
2. "Add new site" > "Import from Git"
3. Sélectionnez votre repo
4. Build settings: aucun (site statique)
5. Deploy !

### GitHub Pages

```bash
# Dans votre repo:
git checkout -b gh-pages
git push origin gh-pages

# Puis sur GitHub:
# Settings > Pages > Source: gh-pages branch
```

## Test Local

### Python
```bash
python -m http.server 8000
# Ouvrez http://localhost:8000
```

### Node.js
```bash
npx serve
# Ouvrez l'URL affichée
```

### PHP
```bash
php -S localhost:8000
# Ouvrez http://localhost:8000
```

### VS Code
- Installez l'extension "Live Server"
- Clic droit sur index.html > "Open with Live Server"

## Vérification

Une fois déployé, vérifiez:

✅ **Performance:**
- Ouvrez DevTools (F12)
- Onglet "Performance"
- Enregistrez 10 secondes de navigation
- Vérifiez: pas de memory leaks, FPS stable

✅ **Console:**
- Devrait afficher les messages de succès en vert
- Aucune erreur rouge

✅ **Features:**
- Cliquez sur expériences → animations fluides
- Changez d'onglet → animations pausées
- Scrollez hors vue → animations stoppées
- Mode sombre fonctionne
- Graphe 3D charge correctement

## Problèmes Courants

**Three.js ne charge pas:**
- Vérifiez la connexion internet
- Le CDN cloudflare est-il accessible ?

**Animations saccadées sur mobile:**
- Normal si appareil ancien
- Config.js permet d'ajuster PARTICLE_COUNT_MOBILE

**LocalStorage quota exceeded:**
- Le code gère ça automatiquement
- Efface les anciennes données si nécessaire

**ES6 Modules non supportés:**
- Navigateur trop ancien
- Message automatique affiché

## Support

Questions ? → GitHub Issues
Bugs trouvés ? → Pull Request bienvenue !

---

**Bon déploiement ! 🎉**
