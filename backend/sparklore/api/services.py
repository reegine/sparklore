# services/rajaongkir.py
import requests

class RajaOngkirService:
    BASE_URL = "https://api-sandbox.collaborator.komerce.id"
    API_KEY = "AoOw06w55e33564243a602b7KA7bs16i"

    @classmethod
    def check_shipping_cost(cls, shipper_id, receiver_id, weight, item_value=0, cod=False, origin_pin_point=None, destination_pin_point=None):
        url = f"{cls.BASE_URL}/tariff/api/v1/calculate"
        params = {
            "shipper_destination_id": shipper_id,
            "receiver_destination_id": receiver_id,
            "weight": weight,
            "item_value": item_value,
            "cod": "yes" if cod else "no",
        }
        if origin_pin_point:
            params["origin_pin_point"] = origin_pin_point
        if destination_pin_point:
            params["destination_pin_point"] = destination_pin_point

        headers = {
            "accept": "application/json",
            "x-api-key": cls.API_KEY
        }

        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
