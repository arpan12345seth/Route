# route_optimization.py

def optimize_routes(locations, starting_point):
    """
    Optimizes route given a list of locations and a starting point.
    
    Args:
        locations (list): A list of locations to visit.
        starting_point (str): The starting location.
        
    Returns:
        dict: A dictionary with optimized route details.
    """
    # Example logic for route optimization (this is a placeholder; you can add real logic here)
    optimized_route = [starting_point] + sorted(locations)

    # Example data structure for the response
    route_details = {
        "starting_point": starting_point,
        "optimized_route": optimized_route,
        "total_distance": len(optimized_route) * 10  # placeholder for distance calculation
    }
    
    return route_details
