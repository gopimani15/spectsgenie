from fastapi import APIRouter, Request, Depends
import httpx
from app.core.security import verify_token

router = APIRouter()
ORDER_SERVICE_URL = "http://order-service:8000"

@router.get("/", tags=["Orders"])
async def list_orders(token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ORDER_SERVICE_URL}/orders/")
        orders = resp.json() if resp.status_code == 200 else []
        results = []
        for order in orders:
            # Fetch customer details
            customer = None
            try:
                cust_resp = await client.get(f"http://customer-service:8000/customers/{order['customer_id']}")
                if cust_resp.status_code == 200:
                    customer = cust_resp.json()
            except Exception:
                customer = None
            # Fetch store details
            store = None
            try:
                store_resp = await client.get(f"http://store-service:8000/stores/{order['store_id']}")
                if store_resp.status_code == 200:
                    store = store_resp.json()
            except Exception:
                store = None
            # Fetch order items
            items = []
            try:
                items_resp = await client.get(f"{ORDER_SERVICE_URL}/orders/{order['order_id']}/items")
                if items_resp.status_code == 200:
                    items = items_resp.json()
            except Exception:
                items = []
            results.append({
                "order_id": order.get("order_id"),
                "store_id": order.get("store_id"),
                "customer_id": order.get("customer_id"),
                "order_status": order.get("order_status"),
                "total_amount": order.get("total_amount"),
                "customer": customer,
                "store": store,
                "items": items
            })
        return results

@router.post("/", tags=["Orders"])
async def create_order(request: Request, token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{ORDER_SERVICE_URL}/orders",
            json=await request.json()
        )
    return resp.json()

@router.get("/{order_id}", tags=["Orders"])
async def get_order(order_id: int, token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        # Get order core details
        order_resp = await client.get(f"{ORDER_SERVICE_URL}/orders/{order_id}")
        if order_resp.status_code != 200:
            return order_resp.json()
        order = order_resp.json()

        # Fetch customer details
        customer = None
        try:
            cust_resp = await client.get(f"http://customer-service:8000/customers/{order['customer_id']}")
            if cust_resp.status_code == 200:
                customer = cust_resp.json()
        except Exception:
            customer = None

        # Fetch store details
        store = None
        try:
            store_resp = await client.get(f"http://store-service:8000/stores/{order['store_id']}")
            if store_resp.status_code == 200:
                store = store_resp.json()
        except Exception:
            store = None

        # Fetch order items
        items = []
        try:
            items_resp = await client.get(f"{ORDER_SERVICE_URL}/orders/{order_id}/items")
            if items_resp.status_code == 200:
                items = items_resp.json()
        except Exception:
            items = []

        # Aggregate response
        return {
            "order_id": order.get("order_id"),
            "store_id": order.get("store_id"),
            "customer_id": order.get("customer_id"),
            "order_status": order.get("order_status"),
            "total_amount": order.get("total_amount"),
            "customer": customer,
            "store": store,
            "items": items
        }

@router.put("/{order_id}/pay", tags=["Orders"])
async def pay_order(order_id: int, token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.put(
            f"{ORDER_SERVICE_URL}/orders/{order_id}/pay"
        )
    return resp.json()

