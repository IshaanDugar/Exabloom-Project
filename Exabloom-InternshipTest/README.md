# React Flow Workflow Builder

This repository contains my solution for the React Flow Frontend Technical Test. The project is a simple, interactive workflow builder built with React and React Flow. It demonstrates basic workflow functionality with default Start and End nodes, and the ability to add editable Action Nodes between them. When nodes are deleted, the flow automatically reconnects (for example, if you remove an Action Node between Start and End, the workflow returns to Start → End).

## Table of Contents

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Setup Instructions](#setup-instructions)
- [Assumptions](#assumptions)
- [Design Decisions](#design-decisions)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Presentation Notes](#presentation-notes)

## Overview

This project implements a basic workflow builder with the following features:

- **Default Nodes:**  
  The workflow starts with two non-editable default nodes: **Start** and **End**.

- **Action Nodes:**  
  Users can insert editable Action Nodes between Start and End by clicking the **+** button on the connecting edges. These nodes can be renamed via a side-panel form.

- **Dynamic Flow:**  
  When an Action Node is deleted, the workflow automatically reconnects to restore the linear setup (e.g., Start → Action Node → End becomes Start → End).

## System Requirements

- **Node.js:** v14.x or later
- **npm:** Comes with Node.js
- **React:** v18.x or later
- **React Flow:** Latest version (using [@xyflow/react](https://www.npmjs.com/package/@xyflow/react))
- **Browser:** A modern browser with JavaScript enabled

## Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/IshaanDugar/Exabloom-Project/tree/main/Exabloom-InternshipTest
   cd Exabloom-InternshipTest
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Application:**

   ```bash
   npm start
   ```

   This will start the development server. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Assumptions

- The project focuses on demonstrating core workflow functionality.
- Only Action Nodes (editable) are implemented for now, along with default non-editable Start and End nodes.
- The design is kept minimal to facilitate easy explanation and future improvements if needed.

## Design Decisions

- **Default Nodes:**  
  Start and End nodes are provided by default and are non-editable to maintain a consistent workflow structure.

- **Node Addition:**  
  A **+** button on the edges allows users to add new nodes. Currently, the default behavior is to add an Action Node, which is inserted into the main flow and automatically connected.

- **Editing Functionality:**  
  The side-panel (implemented in `NodeForm.tsx`) allows users to rename Action Nodes. This component is designed to be simple and beginner-friendly.

- **State Management:**  
  React’s hooks and React Flow’s state hooks (`useNodesState` and `useEdgesState`) are used to manage nodes, edges, and their order efficiently.

## Usage

- **Adding Nodes:**  
  Click the **+** button on an edge to add a new Action Node. The node is inserted between the connected nodes, and the edge connections update automatically.

- **Editing Nodes:**  
  Click the **Edit** button on an Action Node (not available for Start and End nodes) to open the side-panel form. You can change the node’s label here.

- **Deleting Nodes:**  
  When you delete an Action Node, the workflow automatically reconnects so that the flow remains linear (e.g., if you remove an Action Node between Start and End, they reconnect directly).

## File Structure

- **src/App.tsx:**  
  Contains the main workflow logic, node/edge state management, and side-panel editing functionality.

- **src/ActionNode.tsx:**  
  Renders an editable Action Node.

- **src/customEdge.tsx:**  
  A custom edge component that displays the **+** button for adding nodes.

- **src/NodeForm.tsx:**  
  A form component for editing Action Nodes.

- **src/main.tsx:**  
  Entry point for the React application.


## References
- ReactFlow Documentation:
  https://reactflow.dev/learn 
  https://www.youtube.com/watch?v=CbqLRofyRMo 
- Tutorial: https://www.youtube.com/watch?v=CbqLRofyRMo 