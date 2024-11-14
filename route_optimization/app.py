from flask import Flask, request, jsonify, render_template
from utils.mapmyindia import MapMyIndiaAPI
from utils.route_optimization import optimize_routes

app = Flask(__name__)

mapmyindia_api = MapMyIndiaAPI('9181d425fb9b822df96370d7901865b4')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch-location', methods=['POST'])
def fetch_location():
    data = request.json
    pincode = data.get('pincode')
    
    if not pincode:
        return jsonify({"error": "Pincode is required"}), 400
    
    location = mapmyindia_api.get_location_by_pincode(pincode)
    
    if location:
        return jsonify(location), 200
    else:
        return jsonify({"error": "Location not found"}), 404

@app.route('/optimize_route', methods=['POST'])
def get_optimized_route():
    data = request.get_json()
    locations = data.get("locations", [])
    starting_point = data.get("starting_point", "unknown")
    
    # Optimize route
    optimized_route = optimize_routes(locations, starting_point)
    
    route_details = []
    for i in range(len(optimized_route) - 1):
        start_lat, start_lng = optimized_route[i]['lat'], optimized_route[i]['lng']
        end_lat, end_lng = optimized_route[i + 1]['lat'], optimized_route[i + 1]['lng']
        route = mapmyindia_api.get_route(start_lat, start_lng, end_lat, end_lng)
        if route:
            route_details.append(route)

    return jsonify({"optimized_route": route_details}), 200

if __name__ == '__main__':
    app.run(debug=True)
