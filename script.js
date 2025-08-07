// Coinflip Game - Comprehensive JavaScript Implementation

class CoinflipGame {
    constructor() {
        // Game state
        this.currentPrediction = null;
        this.isFlipping = false;
        this.gameStats = {
            totalFlips: 0,
            correctPredictions: 0,
            headsCount: 0,
            tailsCount: 0,
            currentStreak: 0,
            bestStreak: 0,
            history: []
        };
        
        // DOM elements
        this.elements = {};
        this.initializeElements();
        this.bindEvents();
        this.loadGameData();
        this.updateDisplay();
    }

    // Initialize DOM element references
    initializeElements() {
        this.elements = {
            coin: document.getElementById('coin'),
            flipBtn: document.getElementById('flip-btn'),
            flipLoader: document.getElementById('flip-loader'),
            predictHeads: document.getElementById('predict-heads'),
            predictTails: document.getElementById('predict-tails'),
            currentPrediction: document.getElementById('current-prediction'),
            resultSection: document.getElementById('result-section'),
            resultMessage: document.getElementById('result-message'),
            resultOutcome: document.getElementById('result-outcome'),
            
            // Stats elements
            totalFlips: document.getElementById('total-flips'),
            correctPredictions: document.getElementById('correct-predictions'),
            accuracyRate: document.getElementById('accuracy-rate'),
            headsCount: document.getElementById('heads-count'),
            tailsCount: document.getElementById('tails-count'),
            currentStreak: document.getElementById('current-streak'),
            
            // History elements
            historyList: document.getElementById('history-list'),
            clearHistory: document.getElementById('clear-history'),
            resetStats: document.getElementById('reset-stats')
        };
    }

    // Bind event listeners
    bindEvents() {
        // Prediction buttons
        this.elements.predictHeads.addEventListener('click', () => this.makePrediction('heads'));
        this.elements.predictTails.addEventListener('click', () => this.makePrediction('tails'));
        
        // Flip button
        this.elements.flipBtn.addEventListener('click', () => this.flipCoin());
        
        // History controls
        this.elements.clearHistory.addEventListener('click', () => this.clearHistory());
        this.elements.resetStats.addEventListener('click', () => this.resetAllStats());
        
        // Coin click for additional interaction
        this.elements.coin.addEventListener('click', () => {
            if (!this.isFlipping && this.currentPrediction) {
                this.flipCoin();
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Save game data before page unload
        window.addEventListener('beforeunload', () => this.saveGameData());
    }

    // Handle keyboard controls
    handleKeyPress(event) {
        if (this.isFlipping) return;
        
        switch(event.key.toLowerCase()) {
            case 'h':
                this.makePrediction('heads');
                break;
            case 't':
                this.makePrediction('tails');
                break;
            case ' ':
            case 'enter':
                event.preventDefault();
                if (this.currentPrediction) {
                    this.flipCoin();
                }
                break;
            case 'r':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.resetAllStats();
                }
                break;
        }
    }

    // Make a prediction
    makePrediction(prediction) {
        if (this.isFlipping) return;
        
        this.currentPrediction = prediction;
        
        // Update button states
        this.elements.predictHeads.classList.toggle('selected', prediction === 'heads');
        this.elements.predictTails.classList.toggle('selected', prediction === 'tails');
        
        // Update prediction display
        const icon = prediction === 'heads' ? '👑' : '🦅';
        const text = prediction.charAt(0).toUpperCase() + prediction.slice(1);
        this.elements.currentPrediction.innerHTML = `${icon} ${text}`;
        this.elements.currentPrediction.classList.add('has-prediction');
        
        // Enable flip button
        this.elements.flipBtn.disabled = false;
        
        // Add visual feedback
        this.addButtonFeedback(prediction === 'heads' ? this.elements.predictHeads : this.elements.predictTails);
    }

    // Add visual feedback to buttons
    addButtonFeedback(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    // Main coin flip function
    async flipCoin() {
        if (this.isFlipping || !this.currentPrediction) return;
        
        this.isFlipping = true;
        this.setFlippingState(true);
        
        // Generate random result
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        
        // Start coin animation
        this.startCoinAnimation();
        
        // Wait for animation to complete
        await this.delay(2000);
        
        // Show result
        this.showResult(result);
        
        // Update game state
        this.updateGameState(result);
        
        // Reset for next flip
        this.resetForNextFlip();
    }

    // Set flipping state UI
    setFlippingState(isFlipping) {
        this.elements.flipBtn.classList.toggle('flipping', isFlipping);
        this.elements.flipBtn.disabled = isFlipping;
        this.elements.predictHeads.disabled = isFlipping;
        this.elements.predictTails.disabled = isFlipping;
        
        if (isFlipping) {
            this.elements.resultSection.style.opacity = '0.5';
        }
    }

    // Start coin flip animation
    startCoinAnimation() {
        this.elements.coin.classList.remove('show-heads', 'show-tails');
        this.elements.coin.classList.add('flipping');
    }

    // Show the result of the coin flip
    showResult(result) {
        // Remove flipping animation
        this.elements.coin.classList.remove('flipping');
        
        // Show correct side of coin
        this.elements.coin.classList.add(`show-${result}`);
        
        // Determine if prediction was correct
        const isCorrect = this.currentPrediction === result;
        
        // Update result display
        const resultIcon = result === 'heads' ? '👑' : '🦅';
        const resultText = result.charAt(0).toUpperCase() + result.slice(1);
        
        this.elements.resultOutcome.innerHTML = `Result: ${resultIcon} ${resultText}`;
        
        if (isCorrect) {
            this.elements.resultMessage.innerHTML = '🎉 Correct! You won!';
            this.elements.resultMessage.className = 'result-message win';
        } else {
            this.elements.resultMessage.innerHTML = '❌ Wrong! Better luck next time!';
            this.elements.resultMessage.className = 'result-message lose';
        }
        
        this.elements.resultSection.style.opacity = '1';
        
        // Add celebration effect for wins
        if (isCorrect) {
            this.addCelebrationEffect();
        }
    }

    // Add celebration effect for correct predictions
    addCelebrationEffect() {
        // Create temporary celebration element
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉';
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            z-index: 1000;
            pointer-events: none;
            animation: celebrationPop 1s ease-out forwards;
        `;
        
        // Add animation keyframe
        if (!document.querySelector('#celebration-style')) {
            const style = document.createElement('style');
            style.id = 'celebration-style';
            style.textContent = `
                @keyframes celebrationPop {
                    0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(0) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(celebration);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(celebration);
        }, 1000);
    }

    // Update game state after flip
    updateGameState(result) {
        const isCorrect = this.currentPrediction === result;
        
        // Update basic stats
        this.gameStats.totalFlips++;
        this.gameStats[`${result}Count`]++;
        
        if (isCorrect) {
            this.gameStats.correctPredictions++;
            this.gameStats.currentStreak++;
            this.gameStats.bestStreak = Math.max(this.gameStats.bestStreak, this.gameStats.currentStreak);
        } else {
            this.gameStats.currentStreak = 0;
        }
        
        // Add to history
        this.addToHistory(result, isCorrect);
        
        // Update display
        this.updateDisplay();
        
        // Save data
        this.saveGameData();
    }

    // Add flip to history
    addToHistory(result, isCorrect) {
        const historyItem = {
            id: Date.now(),
            result: result,
            prediction: this.currentPrediction,
            correct: isCorrect,
            timestamp: new Date().toLocaleString()
        };
        
        // Add to beginning of history array
        this.gameStats.history.unshift(historyItem);
        
        // Limit history to last 50 items
        if (this.gameStats.history.length > 50) {
            this.gameStats.history = this.gameStats.history.slice(0, 50);
        }
        
        this.updateHistoryDisplay();
    }

    // Update history display
    updateHistoryDisplay() {
        if (this.gameStats.history.length === 0) {
            this.elements.historyList.innerHTML = '<div class="history-empty">No flips yet. Start playing!</div>';
            return;
        }
        
        const historyHTML = this.gameStats.history.map(item => {
            const resultIcon = item.result === 'heads' ? '👑' : '🦅';
            const predictionIcon = item.prediction === 'heads' ? '👑' : '🦅';
            const statusClass = item.correct ? 'correct' : 'incorrect';
            const statusText = item.correct ? 'Correct' : 'Wrong';
            
            return `
                <div class="history-item ${statusClass}">
                    <div class="history-details">
                        <div class="history-result">
                            Result: ${resultIcon} ${item.result.charAt(0).toUpperCase() + item.result.slice(1)}
                        </div>
                        <div class="history-prediction">
                            Predicted: ${predictionIcon} ${item.prediction.charAt(0).toUpperCase() + item.prediction.slice(1)}
                        </div>
                        <div class="history-time">${item.timestamp}</div>
                    </div>
                    <div class="history-status ${statusClass}">${statusText}</div>
                </div>
            `;
        }).join('');
        
        this.elements.historyList.innerHTML = historyHTML;
    }

    // Reset for next flip
    resetForNextFlip() {
        this.isFlipping = false;
        this.currentPrediction = null;
        
        // Reset UI
        this.setFlippingState(false);
        this.elements.predictHeads.classList.remove('selected');
        this.elements.predictTails.classList.remove('selected');
        this.elements.currentPrediction.innerHTML = 'Select your prediction';
        this.elements.currentPrediction.classList.remove('has-prediction');
        this.elements.flipBtn.disabled = true;
    }

    // Update all display elements
    updateDisplay() {
        this.updateStatsDisplay();
        this.updateHistoryDisplay();
    }

    // Update statistics display
    updateStatsDisplay() {
        const stats = this.gameStats;
        const accuracyRate = stats.totalFlips > 0 ? 
            Math.round((stats.correctPredictions / stats.totalFlips) * 100) : 0;
        
        this.elements.totalFlips.textContent = stats.totalFlips;
        this.elements.correctPredictions.textContent = stats.correctPredictions;
        this.elements.accuracyRate.textContent = `${accuracyRate}%`;
        this.elements.headsCount.textContent = stats.headsCount;
        this.elements.tailsCount.textContent = stats.tailsCount;
        this.elements.currentStreak.textContent = stats.currentStreak;
        
        // Add visual feedback for good performance
        if (accuracyRate >= 70 && stats.totalFlips >= 10) {
            this.elements.accuracyRate.parentElement.style.background = 
                'linear-gradient(135deg, #43a047, #66bb6a)';
        } else if (accuracyRate >= 50 && stats.totalFlips >= 10) {
            this.elements.accuracyRate.parentElement.style.background = 
                'linear-gradient(135deg, #ffa726, #ff9800)';
        } else {
            this.elements.accuracyRate.parentElement.style.background = 
                'linear-gradient(135deg, #667eea, #764ba2)';
        }
        
        // Highlight current streak if it's noteworthy
        if (stats.currentStreak >= 5) {
            this.elements.currentStreak.parentElement.style.background = 
                'linear-gradient(135deg, #43a047, #66bb6a)';
        } else if (stats.currentStreak >= 3) {
            this.elements.currentStreak.parentElement.style.background = 
                'linear-gradient(135deg, #ffa726, #ff9800)';
        } else {
            this.elements.currentStreak.parentElement.style.background = 
                'linear-gradient(135deg, #667eea, #764ba2)';
        }
    }

    // Clear history
    clearHistory() {
        if (this.gameStats.history.length === 0) return;
        
        if (confirm('Are you sure you want to clear the flip history? This cannot be undone.')) {
            this.gameStats.history = [];
            this.updateHistoryDisplay();
            this.saveGameData();
            this.showNotification('History cleared successfully!');
        }
    }

    // Reset all statistics
    resetAllStats() {
        if (this.gameStats.totalFlips === 0) return;
        
        if (confirm('Are you sure you want to reset all statistics and history? This cannot be undone.')) {
            this.gameStats = {
                totalFlips: 0,
                correctPredictions: 0,
                headsCount: 0,
                tailsCount: 0,
                currentStreak: 0,
                bestStreak: 0,
                history: []
            };
            
            this.updateDisplay();
            this.saveGameData();
            this.showNotification('All statistics have been reset!');
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #43a047, #66bb6a);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(67, 160, 71, 0.4);
            z-index: 1000;
            font-weight: 600;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Save game data to localStorage
    saveGameData() {
        try {
            const gameData = {
                stats: this.gameStats,
                version: '1.0'
            };
            localStorage.setItem('coinflip-game-data', JSON.stringify(gameData));
        } catch (error) {
            console.warn('Could not save game data:', error);
        }
    }

    // Load game data from localStorage
    loadGameData() {
        try {
            const savedData = localStorage.getItem('coinflip-game-data');
            if (savedData) {
                const gameData = JSON.parse(savedData);
                if (gameData.stats) {
                    // Merge saved stats with default stats to handle new properties
                    this.gameStats = {
                        totalFlips: 0,
                        correctPredictions: 0,
                        headsCount: 0,
                        tailsCount: 0,
                        currentStreak: 0,
                        bestStreak: 0,
                        history: [],
                        ...gameData.stats
                    };
                }
            }
        } catch (error) {
            console.warn('Could not load game data:', error);
            // Reset to default stats if loading fails
            this.gameStats = {
                totalFlips: 0,
                correctPredictions: 0,
                headsCount: 0,
                tailsCount: 0,
                currentStreak: 0,
                bestStreak: 0,
                history: []
            };
        }
    }

    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get game statistics (for potential future features)
    getGameStats() {
        return {
            ...this.gameStats,
            accuracyRate: this.gameStats.totalFlips > 0 ? 
                Math.round((this.gameStats.correctPredictions / this.gameStats.totalFlips) * 100) : 0,
            headsPercentage: this.gameStats.totalFlips > 0 ? 
                Math.round((this.gameStats.headsCount / this.gameStats.totalFlips) * 100) : 0,
            tailsPercentage: this.gameStats.totalFlips > 0 ? 
                Math.round((this.gameStats.tailsCount / this.gameStats.totalFlips) * 100) : 0
        };
    }

    // Export statistics as text (for sharing)
    exportStats() {
        const stats = this.getGameStats();
        const exportText = `
Coinflip Game Statistics
========================
Total Flips: ${stats.totalFlips}
Correct Predictions: ${stats.correctPredictions}
Accuracy Rate: ${stats.accuracyRate}%
Heads Count: ${stats.headsCount} (${stats.headsPercentage}%)
Tails Count: ${stats.tailsCount} (${stats.tailsPercentage}%)
Current Streak: ${stats.currentStreak}
Best Streak: ${stats.bestStreak}

Generated on: ${new Date().toLocaleString()}
        `.trim();
        
        return exportText;
    }

    // Advanced statistics calculation
    calculateAdvancedStats() {
        const history = this.gameStats.history;
        if (history.length === 0) return null;
        
        // Calculate streaks
        let streaks = [];
        let currentStreak = 0;
        let streakType = null;
        
        for (let i = history.length - 1; i >= 0; i--) {
            const item = history[i];
            if (item.correct) {
                if (streakType === 'correct') {
                    currentStreak++;
                } else {
                    if (currentStreak > 0) {
                        streaks.push({ type: streakType, length: currentStreak });
                    }
                    currentStreak = 1;
                    streakType = 'correct';
                }
            } else {
                if (streakType === 'incorrect') {
                    currentStreak++;
                } else {
                    if (currentStreak > 0) {
                        streaks.push({ type: streakType, length: currentStreak });
                    }
                    currentStreak = 1;
                    streakType = 'incorrect';
                }
            }
        }
        
        if (currentStreak > 0) {
            streaks.push({ type: streakType, length: currentStreak });
        }
        
        // Calculate patterns
        const recentFlips = history.slice(0, 10).map(item => item.result);
        const patterns = this.findPatterns(recentFlips);
        
        return {
            streaks: streaks,
            longestCorrectStreak: Math.max(...streaks.filter(s => s.type === 'correct').map(s => s.length), 0),
            longestIncorrectStreak: Math.max(...streaks.filter(s => s.type === 'incorrect').map(s => s.length), 0),
            recentPatterns: patterns
        };
    }

    // Find patterns in recent flips
    findPatterns(flips) {
        const patterns = {};
        
        // Look for sequences of 2-4 flips
        for (let length = 2; length <= Math.min(4, flips.length); length++) {
            for (let i = 0; i <= flips.length - length; i++) {
                const pattern = flips.slice(i, i + length).join('');
                patterns[pattern] = (patterns[pattern] || 0) + 1;
            }
        }
        
        return patterns;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.coinflipGame = new CoinflipGame();
    
    // Add some helpful keyboard shortcuts info
    console.log('Coinflip Game Controls:');
    console.log('H - Predict Heads');
    console.log('T - Predict Tails');
    console.log('Space/Enter - Flip Coin');
    console.log('Ctrl+R - Reset Stats');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoinflipGame;
}