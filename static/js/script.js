class EdgeCachingSimulation {
    constructor() {
        this.isAutoSimulating = false;
        this.autoSimulationInterval = null;
        this.requestCount = 0;
        this.initializeEventListeners();
        this.initializeAnimations();
    }

    initializeEventListeners() {
        // Button event listeners
        document.getElementById('simulate-btn').addEventListener('click', () => {
            this.simulateRequest();
        });

        document.getElementById('auto-simulate-btn').addEventListener('click', () => {
            this.toggleAutoSimulation();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetSimulation();
        });

        // Device hover effects
        document.querySelectorAll('.device').forEach(device => {
            device.addEventListener('mouseenter', () => {
                this.highlightDevice(device);
            });
            
            device.addEventListener('mouseleave', () => {
                this.unhighlightDevice(device);
            });
        });
    }

    initializeAnimations() {
        // Add entrance animations
        document.querySelectorAll('.scenario').forEach((scenario, index) => {
            setTimeout(() => {
                scenario.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
            }, index * 200);
        });

        document.querySelectorAll('.advantage-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 150);
        });
    }

    async simulateRequest() {
        try {
            this.setButtonLoading('simulate-btn', true);
            
            // Animate network activity
            this.animateDataFlow();
            
            // Make API call
            const response = await fetch('/api/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            // Update UI with results
            this.updateMetrics(data);
            this.updateHeaderStats();
            
            // Show success feedback
            this.showNotification('Request simulated successfully!', 'success');
            
        } catch (error) {
            console.error('Simulation error:', error);
            this.showNotification('Simulation failed. Please try again.', 'error');
        } finally {
            this.setButtonLoading('simulate-btn', false);
        }
    }

    animateDataFlow() {
        // Animate with cache scenario
        this.animateConnection('edge-connection', true);
        
        // Randomly decide if cache hit or miss for visual effect
        const cacheHit = Math.random() < 0.85;
        
        if (!cacheHit) {
            setTimeout(() => {
                this.animateConnection('cloud-connection', true);
            }, 500);
        }
        
        // Animate without cache scenario (always to cloud)
        setTimeout(() => {
            this.animateConnection('direct-connection', true);
        }, 200);
        
        // Reset animations
        setTimeout(() => {
            this.resetConnections();
        }, 2500);
    }

    animateConnection(connectionId, active) {
        const connection = document.getElementById(connectionId);
        if (connection) {
            if (active) {
                connection.classList.add('active');
                this.animateDataPacket(connectionId);
            } else {
                connection.classList.remove('active');
            }
        }
    }

    animateDataPacket(connectionId) {
        const packetId = connectionId.replace('connection', 'packet');
        const packet = document.getElementById(`data-${packetId}`);
        
        if (packet) {
            packet.classList.add('moving');
            setTimeout(() => {
                packet.classList.remove('moving');
            }, 2000);
        }
    }

    resetConnections() {
        document.querySelectorAll('.connection').forEach(conn => {
            conn.classList.remove('active');
        });
    }

    async updateMetrics(simulationData) {
        try {
            // Update individual request metrics
            this.updateRequestMetrics(simulationData);
            
            // Fetch and update overall metrics
            const metricsResponse = await fetch('/api/metrics');
            const metrics = await metricsResponse.json();
            
            this.updateOverallMetrics(metrics);
            
        } catch (error) {
            console.error('Error updating metrics:', error);
        }
    }

    updateRequestMetrics(data) {
        // Update with cache metrics
        const withCache = data.with_cache;
        const withoutCache = data.without_cache;
        
        // Add visual feedback for cache hit/miss
        const cacheStatus = document.getElementById('cache-status');
        if (withCache.cache_hit) {
            cacheStatus.style.background = '#27ae60';
            this.showNotification('Cache HIT! Fast response from edge server.', 'success');
        } else {
            cacheStatus.style.background = '#f39c12';
            this.showNotification('Cache MISS. Fetching from cloud server.', 'warning');
        }
    }

    updateOverallMetrics(metrics) {
        const withCache = metrics.with_cache;
        const withoutCache = metrics.without_cache;
        
        // Update with cache metrics
        document.getElementById('latency-with').textContent = `${withCache.avg_latency}ms`;
        document.getElementById('bandwidth-with').textContent = `${withCache.total_bandwidth}MB`;
        document.getElementById('energy-with').textContent = `${withCache.total_energy}J`;
        document.getElementById('cache-hits-with').textContent = `${withCache.cache_hit_rate}%`;
        
        // Update without cache metrics
        document.getElementById('latency-without').textContent = `${withoutCache.avg_latency}ms`;
        document.getElementById('bandwidth-without').textContent = `${withoutCache.total_bandwidth}MB`;
        document.getElementById('energy-without').textContent = `${withoutCache.total_energy}J`;
        document.getElementById('cache-hits-without').textContent = `${withoutCache.cache_hit_rate}%`;
        
        // Add visual indicators for performance
        this.updatePerformanceIndicators(withCache, withoutCache);
    }

    updatePerformanceIndicators(withCache, withoutCache) {
        // Add color coding based on performance
        const latencyImprovement = ((withoutCache.avg_latency - withCache.avg_latency) / withoutCache.avg_latency) * 100;
        const bandwidthSavings = ((withoutCache.total_bandwidth - withCache.total_bandwidth) / withoutCache.total_bandwidth) * 100;
        const energySavings = ((withoutCache.total_energy - withCache.total_energy) / withoutCache.total_energy) * 100;
        
        // Update metric cards with performance indicators
        this.addPerformanceIndicator('latency-with', latencyImprovement, '%');
        this.addPerformanceIndicator('bandwidth-with', bandwidthSavings, '%');
        this.addPerformanceIndicator('energy-with', energySavings, '%');
    }

    addPerformanceIndicator(elementId, improvement, unit) {
        const element = document.getElementById(elementId);
        const parent = element.closest('.metric-card');
        
        if (improvement > 0) {
            parent.style.borderLeftColor = '#27ae60';
            if (!parent.querySelector('.improvement-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'improvement-indicator';
                indicator.innerHTML = `<i class="fas fa-arrow-down"></i> ${improvement.toFixed(1)}${unit} better`;
                indicator.style.cssText = 'font-size: 0.8em; color: #27ae60; font-weight: bold; margin-top: 5px;';
                element.parentNode.appendChild(indicator);
            }
        }
    }

    updateHeaderStats() {
        this.requestCount++;
        document.getElementById('total-requests').textContent = this.requestCount;
        
        // Update cache hit rate in header
        fetch('/api/metrics')
            .then(response => response.json())
            .then(metrics => {
                document.getElementById('cache-hit-rate').textContent = `${metrics.with_cache.cache_hit_rate}%`;
            });
    }

    toggleAutoSimulation() {
        const button = document.getElementById('auto-simulate-btn');
        const icon = button.querySelector('i');
        
        if (this.isAutoSimulating) {
            // Stop auto simulation
            clearInterval(this.autoSimulationInterval);
            this.isAutoSimulating = false;
            button.innerHTML = '<i class="fas fa-sync"></i> Auto Simulate';
            button.classList.remove('btn-danger');
            button.classList.add('btn-secondary');
        } else {
            // Start auto simulation
            this.isAutoSimulating = true;
            button.innerHTML = '<i class="fas fa-stop"></i> Stop Auto';
            button.classList.remove('btn-secondary');
            button.classList.add('btn-danger');
            
            this.autoSimulationInterval = setInterval(() => {
                this.simulateRequest();
            }, 3000);
        }
    }

    async resetSimulation() {
        try {
            this.setButtonLoading('reset-btn', true);
            
            // Stop auto simulation if running
            if (this.isAutoSimulating) {
                this.toggleAutoSimulation();
            }
            
            // Reset backend
            await fetch('/api/reset', { method: 'POST' });
            
            // Reset UI
            this.requestCount = 0;
            document.getElementById('total-requests').textContent = '0';
            document.getElementById('cache-hit-rate').textContent = '0%';
            
            // Reset all metrics
            document.querySelectorAll('.metric-value').forEach(element => {
                if (element.id.includes('latency')) {
                    element.textContent = '0ms';
                } else if (element.id.includes('bandwidth')) {
                    element.textContent = '0MB';
                } else if (element.id.includes('energy')) {
                    element.textContent = '0J';
                } else if (element.id.includes('cache-hits')) {
                    element.textContent = '0%';
                }
            });
            
            // Remove performance indicators
            document.querySelectorAll('.improvement-indicator').forEach(indicator => {
                indicator.remove();
            });
            
            // Reset visual states
            this.resetConnections();
            document.getElementById('cache-status').style.background = '#95a5a6';
            
            this.showNotification('Simulation reset successfully!', 'success');
            
        } catch (error) {
            console.error('Reset error:', error);
            this.showNotification('Reset failed. Please try again.', 'error');
        } finally {
            this.setButtonLoading('reset-btn', false);
        }
    }

    highlightDevice(device) {
        device.style.transform = 'translateY(-10px) scale(1.05)';
        device.style.zIndex = '10';
    }

    unhighlightDevice(device) {
        if (device.classList.contains('iot-device')) {
            device.style.transform = '';
        } else if (device.classList.contains('edge-server')) {
            device.style.transform = 'translateX(-50%)';
        } else {
            device.style.transform = '';
        }
        device.style.zIndex = '';
    }

    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-spinner fa-spin';
            }
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            const icon = button.querySelector('i');
            if (icon && buttonId === 'simulate-btn') {
                icon.className = 'fas fa-play';
            } else if (icon && buttonId === 'reset-btn') {
                icon.className = 'fas fa-redo';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 300px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease-out;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EdgeCachingSimulation();
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);
