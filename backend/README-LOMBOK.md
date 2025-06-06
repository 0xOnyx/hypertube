# Configuration Lombok pour Hypertube

## Qu'est-ce que Lombok ?

Lombok est une bibliothèque Java qui élimine automatiquement le code boilerplate (getters, setters, constructeurs, etc.) grâce aux annotations.

## Installation et Configuration

### 1. IntelliJ IDEA
1. Allez dans `File > Settings > Plugins`
2. Recherchez "Lombok" et installez le plugin
3. Redémarrez IntelliJ IDEA
4. Allez dans `File > Settings > Build, Execution, Deployment > Compiler > Annotation Processors`
5. Cochez "Enable annotation processing"

### 2. VS Code
1. Installez l'extension "Language Support for Java"
2. Lombok est automatiquement supporté

### 3. Eclipse
1. Téléchargez `lombok.jar` depuis https://projectlombok.org/download
2. Exécutez `java -jar lombok.jar`
3. Suivez l'assistant d'installation

## Annotations Lombok utilisées dans le projet

### @Data
- Génère automatiquement : `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, `@RequiredArgsConstructor`
- Utilisé sur : toutes les entités et DTOs

### @NoArgsConstructor
- Génère un constructeur sans arguments
- Requis pour JPA

### @AllArgsConstructor
- Génère un constructeur avec tous les champs
- Utile pour les tests et l'initialisation

### @Builder
- Génère le pattern Builder
- Utilisé sur les entités pour une création fluide

### @ToString(exclude = {...})
- Évite les boucles infinies avec les relations JPA
- Exclut les champs sensibles comme les mots de passe

### @EqualsAndHashCode(exclude = {...})
- Évite les problèmes avec les relations bidirectionnelles

### @Builder.Default
- Définit des valeurs par défaut pour le pattern Builder

## Avantages

✅ **Code plus propre** : Élimination de centaines de lignes de code boilerplate
✅ **Moins d'erreurs** : Pas de risque d'oublier de mettre à jour equals/hashCode
✅ **Maintenance facile** : Modifications automatiques lors de l'ajout de champs
✅ **Performance** : Lombok génère le code à la compilation, pas de réflexion

## Exemple avant/après

### Avant (avec getters/setters manuels)
```java
public class User {
    private String username;
    private String email;
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    // ... 20+ lignes de plus
}
```

### Après (avec Lombok)
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String username;
    private String email;
}
```

## Troubleshooting

Si vous avez des erreurs de compilation :
1. Vérifiez que le plugin Lombok est installé dans votre IDE
2. Assurez-vous que "annotation processing" est activé
3. Redémarrez votre IDE
4. Nettoyez et recompilez le projet : `mvn clean compile`

## Commandes utiles

```bash
# Compiler avec Lombok
mvn clean compile

# Voir le code généré par Lombok
mvn compile -Dlombok.verbose=true

# Tester sans cache
mvn clean test
``` 