import requests

class MapMyIndiaAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://apis.mapmyindia.com/advancedmaps/v1"

    def get_location(self, latitude, longitude):
        url = f"{self.base_url}/{self.api_key}/rev_geocode"
        params = {'lat': latitude, 'lng': longitude}
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and data['results']:
                return data['results'][0]  # Returns the first result for the given coordinates
            else:
                return None
        else:
            raise Exception(f"Error fetching data from MapMyIndia: {response.status_code}, {response.text}")

def get_route(self, start_lat, start_lng, end_lat, end_lng):
    url = f"{self.base_url}/{self.api_key}/route_adv/driving/{start_lng},{start_lat};{end_lng},{end_lat}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'routes' in data:
            return data['routes'][0]  # Assuming the first route is optimal
        else:
            return None
    else:
        raise Exception(f"Error fetching route from MapMyIndia: {response.status_code}, {response.text}")

