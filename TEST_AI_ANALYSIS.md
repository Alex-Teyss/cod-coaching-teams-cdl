# Test de l'Analyse IA - Checklist

## Pré-requis ✅

- [ ] Clé API Gemini configurée dans `.env`
- [ ] Serveur de développement lancé (`pnpm dev`)
- [ ] Compte coach créé et connecté
- [ ] Screenshot de scoreboard COD disponible

## Tests à effectuer

### 1. Navigation

- [ ] Se connecter en tant que Coach
- [ ] Vérifier que l'onglet "IA - Analyse" ✨ apparaît dans la sidebar
- [ ] Cliquer sur "IA - Analyse"
- [ ] Vérifier que la page se charge sans erreur

### 2. Upload d'image

- [ ] Cliquer sur "Choisir un fichier"
- [ ] Sélectionner un screenshot de scoreboard COD
- [ ] Vérifier que le nom du fichier s'affiche
- [ ] Vérifier que la prévisualisation s'affiche
- [ ] Vérifier que les boutons "Analyser" et "Réinitialiser" apparaissent

### 3. Analyse

- [ ] Cliquer sur "Analyser le screenshot"
- [ ] Vérifier que le loader s'affiche ("Analyse en cours...")
- [ ] Attendre 3-10 secondes
- [ ] Vérifier qu'aucune erreur ne s'affiche dans la console

### 4. Résultats

#### Informations du match
- [ ] Le jeu est correctement détecté (MW2/MW3/BO6)
- [ ] Le mode est correct (Hardpoint/Search & Destroy/Control)
- [ ] La carte est identifiée
- [ ] La qualité du screenshot est indiquée

#### Équipes et scores
- [ ] Les noms des équipes sont affichés
- [ ] Les scores finaux sont corrects

#### Statistiques des joueurs
- [ ] Les noms des joueurs sont lisibles
- [ ] Les kills sont corrects
- [ ] Les deaths sont corrects
- [ ] Les assists sont corrects
- [ ] Le K/D ratio est calculé
- [ ] Les colonnes spécifiques au mode s'affichent (Damage pour HP, Plants/Defuses pour SnD, etc.)
- [ ] Les badges de confiance sont affichés (vert/jaune/rouge)

### 5. Fonctionnalités supplémentaires

- [ ] Cliquer sur "Réinitialiser" efface tout
- [ ] Tester avec un screenshot de mauvaise qualité
- [ ] Vérifier que l'erreur est gérée gracieusement
- [ ] Tester avec un fichier qui n'est pas une image
- [ ] Vérifier le message d'erreur

### 6. Responsive

- [ ] Tester sur mobile (DevTools)
- [ ] Vérifier que les tableaux sont scrollables horizontalement
- [ ] Vérifier que l'upload fonctionne sur mobile

## Cas de test spécifiques

### Test 1 : Hardpoint
- [ ] Upload screenshot de Hardpoint
- [ ] Vérifier colonne "Damage"
- [ ] Vérifier colonne "Hill Time"

### Test 2 : Search & Destroy
- [ ] Upload screenshot de SnD
- [ ] Vérifier colonne "Plants"
- [ ] Vérifier colonne "Defuses"

### Test 3 : Control
- [ ] Upload screenshot de Control
- [ ] Vérifier colonne "Captures"
- [ ] Vérifier colonne "Damage"

## Erreurs communes et solutions

### Erreur : "Non authentifié"
**Solution** : Se reconnecter en tant que Coach

### Erreur : "Accès réservé aux coaches"
**Solution** : Vérifier que le rôle de l'utilisateur est bien "COACH"

### Erreur : "API key not valid"
**Solution** :
1. Vérifier `.env` contient `GEMINI_API_KEY`
2. Vérifier qu'il n'y a pas d'espaces
3. Redémarrer le serveur

### Erreur : "Quota exceeded"
**Solution** : Attendre 1 minute (limite de 15 req/min)

### L'analyse retourne des résultats incorrects
**Solutions** :
1. Utiliser un screenshot de meilleure qualité
2. S'assurer que le scoreboard est entièrement visible
3. Éviter les screenshots flous ou compressés

## Logs à vérifier

### Console navigateur (F12)
- Pas d'erreurs JavaScript
- Requête POST à `/api/screenshots/analyze` réussie (status 200)
- Response JSON bien formaté

### Console serveur (terminal)
- Pas d'erreurs lors de l'appel à Gemini
- JSON correctement parsé
- Pas de warnings

## Performance

- [ ] L'analyse prend moins de 10 secondes
- [ ] Le serveur ne freeze pas pendant l'analyse
- [ ] L'interface reste responsive
- [ ] Pas de memory leaks (vérifier avec DevTools)

## Résultat final

- [ ] ✅ Tous les tests passent
- [ ] 🚀 L'application est prête pour la production

## Notes

Notez ici vos observations et bugs trouvés :

---

**Date du test** : _____________

**Testeur** : _____________

**Résultat** : ✅ PASS / ❌ FAIL

**Commentaires** :
