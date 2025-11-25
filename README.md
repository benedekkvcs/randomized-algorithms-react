# Karger Min-Cut Visualizer (Randomized Algorithms Playground)

This project is an interactive visualization tool for **Karger’s randomized minimum cut algorithm**.  
It is currently **under active development**, and serves both as a learning frontend engineering project.

The goal of the application is to let users:

- generate random graphs  
- manually edit graphs (move nodes, add edges, etc.)  
- visualize each contraction step of Karger’s algorithm  
- understand how randomness affects the output  
- observe the probability of finding the true minimum cut  

---

## Features (Current State)

### Interactive Graph Canvas
- Nodes can be freely **dragged** with smooth, D3-powered motion.
- Touch support and pointer-events click detection.
- Edges are displayed using curved paths and update dynamically as nodes move.
- Real-time redraw of edges during drag (smooth UI).

### Build Graphs Manually
- **Click–click edge creation** (select two nodes).
- Support for **multi-edges** (multigraphs), required for correct Karger behavior.
- Nodes generated in a circular layout for clarity.

### ✔ Random Graph Generation
- Users can choose:
  - number of nodes  
  - edge probability  
- The graph is laid out automatically.

### ✔ Karger Algorithm Framework (Work in Progress)
- Runs a *step-by-step* version of the Karger contraction algorithm.
- Stores intermediate states.
- Nodes merge visually during contraction.
- UI buttons exist to:
  - generate a new random graph  
  - run Karger once  
  - walk through the algorithm step-by-step  

## Under Development

This project is **not yet complete**.  
Current work focuses on:

- improving the node-merging visualization  
- running multiple trials to estimate minimum cut probability  
- highlighting the resulting min-cut edges  
- UI/UX improvements (better controls, animations, labels)  
- code cleanup and modularization  

---

## About Karger’s Algorithm

Karger’s algorithm is a classic example of a **randomized algorithm** for finding the minimum cut of an undirected graph.

The algorithm repeatedly:
1. selects a random edge  
2. contracts the two endpoints into a single node  
3. removes self-loops  
4. repeats until only 2 nodes remain  

The remaining parallel edges between the final two nodes represent a cut.  
Due to randomness, the algorithm:
- does **not always** find the true minimum cut,  
- but succeeds with probability at least `2 / (n*(n–1))`.  

Running the algorithm multiple times increases the probability of success.

This project visualizes every contraction step, making the algorithm easier to understand.

---

## Tech Stack

- **React + TypeScript**
- **D3.js** (dragging, layout helpers, rendering)
- Custom SVG rendering logic
- Modern pointer events (smooth drag + mobile support)

---

## Roadmap

### Short-Term
- Visual differentiation of contracted nodes
- Highlighting selected nodes when adding edges
- UI panel: show current number of edges, nodes, steps

### Mid-Term
- Run Karger *R* times and track the best result
- Probability distribution visualization
- Ability to save/load custom graphs

### Long-Term
- Add other randomized algorithms (e.g., Karger–Stein)
- Add animations and transitions for node merges
- Full algorithm introspection mode (explain each step)

---
