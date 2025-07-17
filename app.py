from flask import Flask, render_template, jsonify, request
import json
import random
import time
from datetime import datetime

app = Flask(__name__)

class EdgeCachingSimulator:
    def __init__(self):
        self.reset_metrics()
    
    def reset_metrics(self):
        self.with_cache = {
            'requests': 0,
            'cache_hits': 0,
            'total_latency': 0,
            'total_bandwidth': 0,
            'total_energy': 0
        }
        self.without_cache = {
            'requests': 0,
            'cache_hits': 0,
            'total_latency': 0,
            'total_bandwidth': 0,
            'total_energy': 0
        }
    
    def simulate_request(self):
        # Simulate with cache (85% hit rate)
        cache_hit = random.random() < 0.85
        
        if cache_hit:
            latency_with = random.uniform(20, 60)  # Edge server latency
            bandwidth_with = random.uniform(0.1, 0.3)
            energy_with = random.uniform(0.05, 0.15)
            self.with_cache['cache_hits'] += 1
        else:
            latency_with = random.uniform(180, 250)  # Cloud latency
            bandwidth_with = random.uniform(0.8, 1.2)
            energy_with = random.uniform(0.4, 0.6)
        
        # Simulate without cache (always cloud)
        latency_without = random.uniform(400, 600)
        bandwidth_without = random.uniform(1.0, 1.5)
        energy_without = random.uniform(0.8, 1.2)
        
        # Update metrics
        self.with_cache['requests'] += 1
        self.with_cache['total_latency'] += latency_with
        self.with_cache['total_bandwidth'] += bandwidth_with
        self.with_cache['total_energy'] += energy_with
        
        self.without_cache['requests'] += 1
        self.without_cache['total_bandwidth'] += bandwidth_without
        self.without_cache['total_latency'] += latency_without
        self.without_cache['total_energy'] += energy_without
        
        return {
            'with_cache': {
                'latency': round(latency_with, 1),
                'bandwidth': round(bandwidth_with, 2),
                'energy': round(energy_with, 2),
                'cache_hit': cache_hit
            },
            'without_cache': {
                'latency': round(latency_without, 1),
                'bandwidth': round(bandwidth_without, 2),
                'energy': round(energy_without, 2),
                'cache_hit': False
            }
        }
    
    def get_metrics(self):
        with_cache_avg_latency = (self.with_cache['total_latency'] / 
                                 self.with_cache['requests']) if self.with_cache['requests'] > 0 else 0
        without_cache_avg_latency = (self.without_cache['total_latency'] / 
                                   self.without_cache['requests']) if self.without_cache['requests'] > 0 else 0
        
        cache_hit_rate = (self.with_cache['cache_hits'] / 
                         self.with_cache['requests']) if self.with_cache['requests'] > 0 else 0
        
        return {
            'with_cache': {
                'requests': self.with_cache['requests'],
                'cache_hit_rate': round(cache_hit_rate * 100, 1),
                'avg_latency': round(with_cache_avg_latency, 1),
                'total_bandwidth': round(self.with_cache['total_bandwidth'], 2),
                'total_energy': round(self.with_cache['total_energy'], 2)
            },
            'without_cache': {
                'requests': self.without_cache['requests'],
                'cache_hit_rate': 0,
                'avg_latency': round(without_cache_avg_latency, 1),
                'total_bandwidth': round(self.without_cache['total_bandwidth'], 2),
                'total_energy': round(self.without_cache['total_energy'], 2)
            }
        }

simulator = EdgeCachingSimulator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/simulate', methods=['POST'])
def simulate():
    result = simulator.simulate_request()
    return jsonify(result)

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    metrics = simulator.get_metrics()
    return jsonify(metrics)

@app.route('/api/reset', methods=['POST'])
def reset():
    simulator.reset_metrics()
    return jsonify({'status': 'reset'})

if __name__ == '__main__':
    app.run(debug=True)
