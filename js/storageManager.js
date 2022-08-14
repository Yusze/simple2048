function StorageManager () {
    this.bestScoreKey = "bestScore";
    this.gemaStateKey = "gameState";

    this.storage = window.localStorage;
}

StorageManager.prototype.getBestScore = function () {
    return this.storage.getItem(this.bestScoreKey) || 0;
}

StorageManager.prototype.setBestScore = function (score) {
    this.storage.setItem(this.bestScoreKey, score);
}

StorageManager.prototype.getGameState = function () {
    let stateJson = this.storage.getItem(this.gemaStateKey);
    return stateJson ? JSON.parse(stateJson) : null;
}

StorageManager.prototype.setGameState = function (gameState) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
}

StorageManager.prototype.clearGameState = function () {
    this.storage.removeItem(this.gameStateKey);
}