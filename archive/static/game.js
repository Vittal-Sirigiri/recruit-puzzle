class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.startButton = document.getElementById('startButton');
        this.resetButton = document.getElementById('resetButton');
        this.timerDisplay = document.getElementById('timer');
        this.statusDisplay = document.getElementById('status');
        
        this.graph = null;
        this.optimalPath = null;
        this.winThreshold = null;
        this.currentPath = [];
        this.gameStarted = false;
        this.startTime = null;
        this.timerInterval = null;
        
        // Add canvas scaling factor
        this.scaleX = this.canvas.width / this.canvas.offsetWidth;
        this.scaleY = this.canvas.height / this.canvas.offsetHeight;
        
        this.initialize();
    }
    
    async initialize() {
        try {
            const response = await fetch('/api/graph');
            this.graph = await response.json();
            
            const pathResponse = await fetch('/api/optimal-path');
            const pathData = await pathResponse.json();
            this.optimalPath = pathData.path;
            this.winThreshold = pathData.win_threshold;
            
            this.drawGraph();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing game:', error);
            this.statusDisplay.textContent = 'Error loading game data';
        }
    }
    
    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    }
    
    drawGraph() {
        console.log('Drawing graph. Current path:', this.currentPath);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw edges first
        this.ctx.strokeStyle = '#666666';
        this.ctx.lineWidth = 2;
        this.graph.edges.forEach(edge => {
            const source = this.graph.nodes.find(n => n.id === edge.source);
            const target = this.graph.nodes.find(n => n.id === edge.target);
            this.ctx.beginPath();
            this.ctx.moveTo(source.x, source.y);
            this.ctx.lineTo(target.x, target.y);
            this.ctx.stroke();
        });
        
        // Draw current path with golden highlight
        if (this.currentPath.length > 0) {
            console.log('Drawing golden path with nodes:', this.currentPath);
            this.ctx.strokeStyle = '#f0c674';
            this.ctx.lineWidth = 4;
            for (let i = 0; i < this.currentPath.length - 1; i++) {
                const source = this.graph.nodes.find(n => n.id === this.currentPath[i]);
                const target = this.graph.nodes.find(n => n.id === this.currentPath[i + 1]);
                console.log(`Drawing line from ${this.currentPath[i]} to ${this.currentPath[i + 1]}`);
                if (source && target) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(source.x, source.y);
                    this.ctx.lineTo(target.x, target.y);
                    this.ctx.stroke();
                } else {
                    console.log('Missing source or target node:', { source, target });
                }
            }
        }
        
        // Draw nodes last (so they appear on top)
        this.graph.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
            this.ctx.fillStyle = node.id === this.graph.start ? '#00ff00' : 
                                node.id === this.graph.end ? '#ff0000' : '#ffffff';
            this.ctx.fill();
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
    
    handleCanvasClick(e) {
        if (!this.gameStarted) {
            console.log('Game not started yet');
            return;
        }
        
        // Get canvas position and scale
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * this.scaleX;
        const y = (e.clientY - rect.top) * this.scaleY;
        
        console.log('Click coordinates:', x, y);
        
        // Find clicked node with increased hit radius
        const clickedNode = this.graph.nodes.find(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            console.log(`Checking node ${node.id} at (${node.x}, ${node.y}), distance: ${distance}`);
            return distance < 15;
        });
        
        if (clickedNode) {
            console.log('Clicked node:', clickedNode.id);
            console.log('Current path before update:', this.currentPath);
            console.log('End node:', this.graph.end);
            
            if (this.currentPath.length > 0) {
                const lastNode = this.currentPath[this.currentPath.length - 1];
                console.log('Last node in path:', lastNode);
                
                // Check for valid connection
                const edge = this.graph.edges.find(e => 
                    (e.source === lastNode && e.target === clickedNode.id) ||
                    (e.source === clickedNode.id && e.target === lastNode)
                );
                
                if (edge) {
                    console.log('Found valid edge:', edge);
                    if (!this.currentPath.includes(clickedNode.id)) {
                        this.currentPath = [...this.currentPath, clickedNode.id];
                        console.log('New path after update:', this.currentPath);
                        
                        if (clickedNode.id === this.graph.end) {
                            console.log('Reached destination! Final path:', this.currentPath);
                            this.endGame();
                        }
                    } else {
                        console.log('Node already in path');
                        this.statusDisplay.textContent = 'You already visited this intersection!';
                    }
                } else {
                    console.log('No valid edge found');
                    this.statusDisplay.textContent = 'Invalid move! Must follow streets.';
                }
            }
            console.log('Calling drawGraph with path:', this.currentPath);
            this.drawGraph();
        } else {
            console.log('No node clicked');
        }
    }
    
    startGame() {
        this.gameStarted = true;
        this.startTime = Date.now();
        this.startButton.disabled = true;
        this.resetButton.disabled = false;
        this.currentPath = [this.graph.start];  // Automatically include start node
        this.statusDisplay.textContent = 'Game started! Navigate to the destination!';
        
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
        
        this.drawGraph();
    }
    
    endGame() {
        console.log('Ending game...');
        console.log('Current path:', this.currentPath);
        console.log('End node:', this.graph.end);
        
        this.gameStarted = false;
        clearInterval(this.timerInterval);
        this.startButton.disabled = false;
        
        const totalTime = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        console.log('Game ended. Time:', totalTime, 'Threshold:', this.winThreshold);
        
        if (totalTime <= this.winThreshold) {
            this.statusDisplay.textContent = `You won! Time: ${totalTime.toFixed(2)} minutes (Threshold: ${this.winThreshold.toFixed(2)} minutes)\nYou seem like a great player. Want to be part of a great team? Send your resume to hiring@locus.sh`;
        } else {
            this.statusDisplay.textContent = `You lost! Time: ${totalTime.toFixed(2)} minutes (Threshold: ${this.winThreshold.toFixed(2)} minutes)`;
        }
    }
    
    resetGame() {
        this.gameStarted = false;
        clearInterval(this.timerInterval);
        this.startButton.disabled = false;
        this.resetButton.disabled = true;
        this.timerDisplay.textContent = '0:00';
        this.statusDisplay.textContent = 'Click START to begin!';
        this.currentPath = [];
        this.drawGraph();
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 