// Initialize map using MapMyIndia SDK
let map;
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map with a default center
    map = new MapmyIndia.Map('map', {
        center: [28.6139, 77.2090],  // Default to a location (e.g., New Delhi)
        zoomControl: true,
        search: false
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Vehicle Data
    let vehicles = {
        bike: [],
        truck: [],
        van: []
    };

    // Delivery Location Data
    let deliveryLocations = [];

    // Function to update vehicle count
    function updateVehicleCount() {
        document.getElementById("bike-count").textContent = `Bikes: ${vehicles.bike.length}`;
        document.getElementById("truck-count").textContent = `Trucks: ${vehicles.truck.length}`;
        document.getElementById("van-count").textContent = `Vans: ${vehicles.van.length}`;
    }

    // Add Vehicle Button
    document.getElementById("add-vehicle-btn").addEventListener("click", function() {
        const vehicleName = document.getElementById("vehicle-name").value;
        const vehicleType = document.getElementById("vehicle-type").value;
        const fuelCapacity = document.getElementById("fuel-capacity").value;
        const fuelEfficiency = document.getElementById("fuel-efficiency").value;
        const carryingCapacity = document.getElementById("carrying-capacity").value;

        if (vehicleName && vehicleType && fuelCapacity && fuelEfficiency && carryingCapacity) {
            vehicles[vehicleType].push({
                name: vehicleName,
                fuelCapacity,
                fuelEfficiency,
                carryingCapacity
            });
            alert(`${vehicleName} added to ${vehicleType}!`);
            updateVehicleCount();
        } else {
            alert("Please fill all vehicle details!");
        }
    });

    // Remove Last Vehicle Button
    document.getElementById("remove-vehicle-btn").addEventListener("click", function() {
        const vehicleType = document.getElementById("vehicle-type").value;
        if (vehicles[vehicleType].length > 0) {
            vehicles[vehicleType].pop();
            alert(`Last vehicle removed from ${vehicleType}!`);
            updateVehicleCount();
        } else {
            alert(`No vehicles to remove from ${vehicleType}`);
        }
    });

    // Add Delivery Location Button
    document.getElementById("add-location-btn").addEventListener("click", function() {
        const pincode = document.getElementById("pincode").value;
        const region = document.getElementById("region").value;
        const address = document.getElementById("address").value;
        const weight = document.getElementById("weight").value;
        const priority = document.getElementById("priority").value;

        if (pincode && region && address && weight && priority) {
            deliveryLocations.push({
                pincode,
                region,
                address,
                weight,
                priority
            });
            alert("Delivery location added!");
        } else {
            alert("Please fill all delivery location details!");
        }
    });

    // Remove Last Delivery Location Button
    document.getElementById("remove-location-btn").addEventListener("click", function() {
        if (deliveryLocations.length > 0) {
            deliveryLocations.pop();
            alert("Last delivery location removed!");
        } else {
            alert("No delivery locations to remove!");
        }
    });

    // Submit Button - Display Entered Data
    document.getElementById("submit-btn").addEventListener("click", function() {
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = '';

        // Display Warehouse Info
        const warehouseAddress = document.getElementById("warehouse-address").value;
        const warehousePincode = document.getElementById("warehouse-pincode").value;
        const warehouseState = document.getElementById("warehouse-state").value;
        const warehouseCity = document.getElementById("warehouse-city").value;

        outputDiv.innerHTML += `<h4>Warehouse Address:</h4>
        <p>Address: ${warehouseAddress}, Pincode: ${warehousePincode}, City: ${warehouseCity}, State: ${warehouseState}</p>`;

        // Display Delivery Locations
        outputDiv.innerHTML += `<h4>Delivery Locations:</h4>`;
        deliveryLocations.forEach((location, index) => {
            outputDiv.innerHTML += `<h5>Location ${index + 1}:</h5>
            <p>Pincode: ${location.pincode}</p>
            <p>Region: ${location.region}</p>
            <p>Address: ${location.address}</p>
            <p>Weight: ${location.weight} kg</p>
            <p>Priority: ${location.priority}</p>`;
        });

        // Display Vehicle Data
        outputDiv.innerHTML += `<h4>Vehicles:</h4>`;
        for (const [type, vehiclesArray] of Object.entries(vehicles)) {
            vehiclesArray.forEach(vehicle => {
                outputDiv.innerHTML += `<h5>${type.charAt(0).toUpperCase() + type.slice(1)}: ${vehicle.name}</h5>
                <p>Fuel Capacity: ${vehicle.fuelCapacity} L</p>
                <p>Fuel Efficiency: ${vehicle.fuelEfficiency} km/L</p>
                <p>Carrying Capacity: ${vehicle.carryingCapacity} kg</p>`;
            });
        }
    });

    // Vehicle Type Selection and Route Information
    document.getElementById('vehicle-type-dropdown').addEventListener('change', function() {
        const selectedType = this.value;
        const vehicleDropdown = document.getElementById('vehicle-dropdown');
        vehicleDropdown.innerHTML = ''; // Clear previous options

        if (vehicles[selectedType].length > 0) {
            vehicles[selectedType].forEach((vehicle, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = vehicle.name;
                vehicleDropdown.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '--No Vehicles Available--';
            vehicleDropdown.appendChild(option);
        }
    });

    // Fetch route on vehicle selection and display it on the map
    document.getElementById('vehicle-dropdown').addEventListener('change', function() {
        const selectedType = document.getElementById('vehicle-type-dropdown').value;
        const selectedVehicleIndex = this.value;

        if (selectedVehicleIndex !== '' && selectedType !== '') {
            // Fetch optimized route
            fetch('/optimize_route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ locations: deliveryLocations, starting_point: "warehouse" }) // Add correct parameters here
            })
            .then(response => response.json())
            .then(data => {
                // Assuming data.optimized_route is an array of latitude/longitude points
                const route = data.optimized_route;
                const coordinates = route.map(point => [point.lat, point.lng]);

                // Clear any previous layers on the map
                if (map.hasLayer('route')) {
                    map.removeLayer('route');
                }

                // Add the new route
                MapmyIndia.drawRoute({
                    map: map,
                    start: coordinates[0],
                    end: coordinates[coordinates.length - 1],
                    waypoints: coordinates.slice(1, -1),
                    fitbounds: true
                });

                document.getElementById('route-info').textContent = `Route details loaded.`;
            })
            .catch(error => console.error('Error fetching optimized route:', error));
        } else {
            document.getElementById('route-info').textContent = 'Select a vehicle to see the route';
        }
    });
});