# Plan d'Amélioration : Volume par Asset et Temps Réel

## 1. Volume par Asset

### 1.1 Extension du Modèle Prisma
```prisma
model asset_volumes {
  id              String   @id @default(dbgenerated("gen_random_uuid()"))
  asset_id        String   // nft_token_id
  chain_id        String
  nft_token       String   // nft_token
  nft_type        String   // ERC721 ou ERC1155
  volume_24h      Float    @default(0)
  volume_7d       Float    @default(0)
  volume_30d      Float    @default(0)
  last_price      Float?
  last_trade_time DateTime?
  date_created    DateTime @default(now())
  date_updated    DateTime @updatedAt

  @@unique([asset_id, chain_id, nft_token])
  @@index([chain_id])
  @@index([nft_token])
}
```

### 1.2 Intégration avec le Système d'Événements Existant
- Étendre la fonction `updateOrderStatus` existante pour mettre à jour les volumes
- Ajouter une nouvelle fonction `updateAssetVolume` dans `events-listener.ts`
- Modifier les listeners existants pour inclure la mise à jour des volumes :

```typescript
// Dans events-listener.ts
async function updateAssetVolume(
  chainId: string,
  nftToken: string,
  assetId: string,
  nftType: string,
  price: string,
  amount: string
) {
  // Mise à jour des volumes dans la base de données
  // Utilisation de Redis pour le cache
}

// Modification des listeners existants
contractNebulaTestnet.on(
  contractNebulaTestnet.filters.ERC1155OrderFilled(),
  async (direction, maker, taker, nonce, erc20Token, erc20FillAmount, erc1155Token, erc1155TokenId, erc1155FillAmount, matcher) => {
    await updateOrderStatus(nonce, 'filled')
    await updateAssetVolume(
      CHAIN_IDS.NEBULA_TESTNET,
      erc1155Token,
      erc1155TokenId,
      'ERC1155',
      erc20FillAmount.toString(),
      erc1155FillAmount.toString()
    )
  }
)
```

### 1.3 API Endpoints
```typescript
// GET /orderbook/volume/:chainId/:nftToken/:assetId
// GET /orderbook/volume/trending/:chainId
// GET /orderbook/volume/history/:chainId/:nftToken/:assetId
```

## 2. WebSocket pour Temps Réel

### 2.1 Intégration avec Express
- Utiliser `ws` (plus léger que socket.io)
- Intégrer avec le serveur Express existant
- Réutiliser le système d'événements existant

### 2.2 Structure des Messages
```typescript
interface WebSocketMessage {
  type: 'ORDER_CREATED' | 'ORDER_FILLED' | 'ORDER_CANCELLED' | 'VOLUME_UPDATE';
  data: {
    chainId: string;
    nftToken: string;
    assetId: string;
    orderId: string;
    price?: string;
    volume?: number;
    timestamp: number;
  };
}
```

### 2.3 Souscriptions
```typescript
interface Subscription {
  chainId?: string;
  nftToken?: string;
  assetId?: string;
  types: string[];
}
```

## 3. Optimisations

### 3.1 Performance
- Utiliser les index existants dans Prisma
- Mise en cache des volumes avec Redis
- Agrégation des données en temps réel

### 3.2 Sécurité
- Réutiliser la validation existante
- Rate limiting sur les WebSocket
- Authentification via token (comme pour l'API)

## 4. Tests

### 4.1 Tests Unitaires
- Calcul de volume
- Gestion des événements
- Validation des données

### 4.2 Tests d'Intégration
- Flux complet d'ordres
- WebSocket
- Performance

## 5. Documentation

### 5.1 API
- Documentation des nouveaux endpoints
- Exemples d'utilisation
- Guide de migration

### 5.2 WebSocket
- Guide de connexion
- Format des messages
- Exemples de code client

## 6. Déploiement

### 6.1 Prérequis
- Redis pour le cache
- Configuration des variables d'environnement
- Migration de la base de données

### 6.2 Migration
- Script de migration Prisma
- Plan de rollback
- Monitoring

## Prochaines Étapes

1. Validation du plan
2. Création des tickets
3. Implémentation par phases
4. Tests et validation
5. Déploiement

## Questions à Considérer

1. Quelle est la fréquence de mise à jour souhaitée pour les volumes ?
2. Faut-il limiter l'historique des données ?
3. Quelles métriques de performance sont critiques ?
4. Quel niveau de redondance est nécessaire ? 