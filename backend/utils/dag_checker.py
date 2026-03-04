from typing import List, Dict

def check_is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    Function to determine if the given nodes and edges form a 
    Directed Acyclic Graph (DAG) using Topological Sort.
    """
    
    # 1. Initialize adjacency list and in-degree map
    adj = {node['id']: [] for node in nodes}
    in_degree = {node['id']: 0 for node in nodes}
    
    # 2. Build the graph structure
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        
        # Checking if nodes exist in the graph to avoid KeyErrors
        if source in adj and target in in_degree:
            adj[source].append(target)
            in_degree[target] += 1
            
    # 3. Find all nodes with zero incoming edges
    # These are the starting points for our traversal
    queue = [node_id for node_id, degree in in_degree.items() if degree == 0]
    
    visited_count = 0
    
    # 4. Process the queue
    while queue:
        # Standard BFS approach for Kahn's Algorithm
        current = queue.pop(0)
        visited_count += 1
        
        for neighbor in adj[current]:
            in_degree[neighbor] -= 1
            
            # If in-degree becomes zero, add it to the queue
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    # 5. Result: If we visited all nodes, there are no cycles (it's a DAG)
    return visited_count == len(nodes)