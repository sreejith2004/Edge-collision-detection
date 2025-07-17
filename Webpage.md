Based on the IoT edge caching project analysis, I'll create a simple web-based simulation that demonstrates the core concepts of edge caching in IoT networks. This will provide an interactive visual presentation showing the performance differences between systems with and without edge caching.

## Project Analysis

The project focuses on **edge caching** in IoT networks, which stores frequently accessed data closer to users to reduce latency, conserve bandwidth, and improve energy efficiency[^1]. The simulation compares scenarios with and without edge caching, measuring key performance metrics like latency and bandwidth usage[^1].

## Web-Based Simulation Code

Here's a complete HTML/CSS/JavaScript implementation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IoT Edge Caching Simulation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(45deg, #2c3e50, #3498db);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .simulation-container {
            display: flex;
            padding: 30px;
            gap: 30px;
        }

        .scenario {
            flex: 1;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            border: 2px solid #e9ecef;
        }

        .scenario h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.5em;
            text-align: center;
        }

        .network-diagram {
            height: 300px;
            position: relative;
            margin: 20px 0;
            background: #fff;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }

        .device {
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 12px;
            text-align: center;
        }

        .iot-device {
            background: #e74c3c;
            bottom: 20px;
            left: 20px;
        }

        .edge-server {
            background: #f39c12;
            bottom: 20px;
            right: 120px;
        }

        .cloud-server {
            background: #3498db;
            top: 20px;
            right: 20px;
        }

        .connection {
            position: absolute;
            height: 3px;
            background: #95a5a6;
            border-radius: 2px;
        }

        .active-connection {
            background: #27ae60;
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .metrics {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }

        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
        }

        .metric-value {
            font-weight: bold;
            font-size: 1.2em;
        }

        .high-latency { color: #e74c3c; }
        .low-latency { color: #27ae60; }
        .medium-bandwidth { color: #f39c12; }
        .low-bandwidth { color: #27ae60; }

        .controls {
            text-align: center;
            padding: 30px;
            background: #f8f9fa;
        }

        .btn {
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.1em;
            cursor: pointer;
            margin: 0 10px;
            transition: all 0.3s ease;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .advantages {
            padding: 30px;
            background: #e8f5e8;
        }

        .advantages h3 {
            color: #27ae60;
            margin-bottom: 20px;
            font-size: 1.5em;
        }

        .advantage-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .advantage-item {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #27ae60;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>IoT Edge Caching Simulation</h1>
            <p>Demonstrating Performance Improvements in IoT Networks</p>
        </div>

        <div class="simulation-container">
            <div class="scenario">
                <h3>Without Edge Caching</h3>
                <div class="network-diagram" id="without-cache">
                    <div class="device iot-device">IoT Device</div>
                    <div class="device cloud-server">Cloud Server</div>
                    <div class="connection" id="direct-connection"></div>
                </div>
                <div class="metrics">
                    <div class="metric">
                        <span>Latency:</span>
                        <span class="metric-value high-latency" id="latency-without">High (500ms)</span>
                    </div>
                    <div class="metric">
                        <span>Bandwidth Usage:</span>
                        <span class="metric-value medium-bandwidth" id="bandwidth-without">High (100%)</span>
                    </div>
                    <div class="metric">
                        <span>Cache Hits:</span>
                        <span class="metric-value" id="cache-without">0%</span>
                    </div>
                </div>
            </div>

            <div class="scenario">
                <h3>With Edge Caching</h3>
                <div class="network-diagram" id="with-cache">
                    <div class="device iot-device">IoT Device</div>
                    <div class="device edge-server">Edge Server</div>
                    <div class="device cloud-server">Cloud Server</div>
                    <div class="connection" id="edge-connection"></div>
                    <div class="connection" id="cloud-connection"></div>
                </div>
                <div class="metrics">
                    <div class="metric">
                        <span>Latency:</span>
                        <span class="metric-value low-latency" id="latency-with">Low (50ms)</span>
                    </div>
                    <div class="metric">
                        <span>Bandwidth Usage:</span>
                        <span class="metric-value low-bandwidth" id="bandwidth-with">Low (30%)</span>
                    </div>
                    <div class="metric">
                        <span>Cache Hits:</span>
                        <span class="metric-value low-latency" id="cache-with">85%</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="controls">
            <button class="btn" onclick="simulateRequest()">Simulate Data Request</button>
            <button class="btn" onclick="resetSimulation()">Reset Simulation</button>
        </div>

        <div class="advantages">
            <h3>Major Advantages of Edge Caching</h3>
            <div class="advantage-list">
                <div class="advantage-item">
                    <h4>Reduced Latency</h4>
                    <p>Data retrieval times decrease significantly when content is cached closer to IoT devices.</p>
                </div>
                <div class="advantage-item">
                    <h4>Conserved Bandwidth</h4>
                    <p>Network traffic is reduced by serving frequently accessed data from edge servers.</p>
                </div>
                <div class="advantage-item">
                    <h4>Improved Energy Efficiency</h4>
                    <p>Less data transmission means lower energy consumption for IoT devices.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        let requestCount = 0;
        let cacheHits = 0;

        function simulateRequest() {
            requestCount++;
            
            // Simulate cache hit probability (85% for edge caching)
            const cacheHit = Math.random() < 0.85;
            
            if (cacheHit) {
                cacheHits++;
            }

            // Animate connections
            animateWithoutCache();
            animateWithCache(cacheHit);
            
            // Update metrics
            updateMetrics(cacheHit);
        }

        function animateWithoutCache() {
            const connection = document.getElementById('direct-connection');
            connection.style.width = '300px';
            connection.style.left = '80px';
            connection.style.bottom = '50px';
            connection.style.transform = 'rotate(-45deg)';
            connection.classList.add('active-connection');
            
            setTimeout(() => {
                connection.classList.remove('active-connection');
            }, 2000);
        }

        function animateWithCache(cacheHit) {
            const edgeConnection = document.getElementById('edge-connection');
            const cloudConnection = document.getElementById('cloud-connection');
            
            // Always animate edge connection
            edgeConnection.style.width = '150px';
            edgeConnection.style.left = '80px';
            edgeConnection.style.bottom = '50px';
            edgeConnection.classList.add('active-connection');
            
            if (!cacheHit) {
                // Cache miss - also animate cloud connection
                cloudConnection.style.width = '200px';
                cloudConnection.style.right = '80px';
                cloudConnection.style.top = '80px';
                cloudConnection.style.transform = 'rotate(45deg)';
                cloudConnection.classList.add('active-connection');
            }
            
            setTimeout(() => {
                edgeConnection.classList.remove('active-connection');
                cloudConnection.classList.remove('active-connection');
            }, 2000);
        }

        function updateMetrics(cacheHit) {
            const cacheHitRate = requestCount > 0 ? (cacheHits / requestCount * 100).toFixed(1) : 0;
            
            // Update cache hit display
            document.getElementById('cache-with').textContent = `${cacheHitRate}%`;
            
            // Update latency based on cache performance
            const avgLatency = cacheHit ? 50 : 200;
            document.getElementById('latency-with').textContent = `${avgLatency}ms`;
            
            // Update bandwidth usage
            const bandwidthUsage = Math.max(30, 100 - (cacheHitRate * 0.8));
            document.getElementById('bandwidth-with').textContent = `${bandwidthUsage.toFixed(0)}%`;
        }

        function resetSimulation() {
            requestCount = 0;
            cacheHits = 0;
            
            // Reset metrics
            document.getElementById('latency-with').textContent = 'Low (50ms)';
            document.getElementById('bandwidth-with').textContent = 'Low (30%)';
            document.getElementById('cache-with').textContent = '85%';
            
            // Remove active animations
            document.querySelectorAll('.connection').forEach(conn => {
                conn.classList.remove('active-connection');
            });
        }

        // Initialize connection positions
        window.onload = function() {
            const directConn = document.getElementById('direct-connection');
            directConn.style.width = '300px';
            directConn.style.left = '80px';
            directConn.style.bottom = '50px';
            directConn.style.transform = 'rotate(-45deg)';
            
            const edgeConn = document.getElementById('edge-connection');
            edgeConn.style.width = '150px';
            edgeConn.style.left = '80px';
            edgeConn.style.bottom = '50px';
            
            const cloudConn = document.getElementById('cloud-connection');
            cloudConn.style.width = '200px';
            cloudConn.style.right = '80px';
            cloudConn.style.top = '80px';
            cloudConn.style.transform = 'rotate(45deg)';
        };
    </script>
</body>
</html>
```


## Code Pipeline Structure

The simulation follows this **architectural pipeline**:

**Frontend Layer**: HTML/CSS for visual presentation with responsive design
**Simulation Engine**: JavaScript handles request simulation and performance calculations
**Animation System**: CSS animations demonstrate data flow between network components
**Metrics Calculator**: Real-time performance comparison between caching scenarios

## Key Features

**Interactive Simulation**: Click "Simulate Data Request" to see real-time performance differences
**Visual Network Topology**: Shows IoT devices, edge servers, and cloud infrastructure
**Performance Metrics**: Displays latency, bandwidth usage, and cache hit rates
**Comparative Analysis**: Side-by-side comparison of scenarios with and without edge caching

This web-based simulation effectively demonstrates the three major advantages identified in your project: reduced latency, conserved bandwidth, and improved energy efficiency[^1]. The interactive nature makes it perfect for presentations, allowing you to show real-time performance improvements as requests are processed through the edge caching system.

<div style="text-align: center">⁂</div>

[^1]: Cn-abstract-1.pdf

