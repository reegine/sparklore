import requests

class RajaOngkirService:
    API_KEY = "AoOw06w55e33564243a602b7KA7bs16i"

    BASE_URL = "https://rajaongkir.komerce.id/api/v1"

    HEADERS = {
        "accept": "application/json",
        "key": API_KEY,
        "content-type": "application/json"
    }

    @classmethod
    def search_destination(cls, keyword):
        url = f"{cls.BASE_URL}/destination/domestic-destination"
        params = {"search": keyword, "limit": 1}
        response = requests.get(url, headers={"accept": "application/json", "key": cls.API_KEY}, params=params)
        response.raise_for_status()
        data = response.json()
        if data and data.get("data"):
            return data["data"][0]["id"]
        else:
            raise ValueError("Lokasi tidak ditemukan")

    @classmethod
    def calculate_shipping_cost(cls, origin_keyword, destination_keyword, weight, courier="jne:sicepat:jnt", price="lowest"):
        origin_id = cls.search_destination(origin_keyword)
        destination_id = cls.search_destination(destination_keyword)

        payload = {
            "origin": origin_id,
            "destination": destination_id,
            "weight": int(weight),
            "courier": courier,
            "price": price
        }

        url = f"{cls.BASE_URL}/calculate/domestic-cost"
        response = requests.post(url, headers=cls.HEADERS, json=payload)
        response.raise_for_status()
        return response.json()

    @classmethod
    def track_waybill(cls, awb, courier_code):
        url = f"{cls.BASE_URL}/track/waybill"
        payload = {
            "awb": awb,
            "courier": courier_code
        }
        response = requests.post(url, headers=cls.HEADERS, json=payload)
        response.raise_for_status()
        return response.json()