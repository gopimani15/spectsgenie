import random
import string

# Copied from catalog-service/app/services/catalog_service.py
def generate_sku(brand: str, model: str, product_type: str) -> str:
    # Clean inputs: remove spaces, take first 3 chars, uppercase
    b = "".join(e for e in brand if e.isalnum())[:3].upper()
    m = "".join(e for e in model if e.isalnum())[:3].upper()
    t = "".join(e for e in product_type if e.isalnum())[:3].upper()
    
    # Generate random suffix (using fixed seed for reproducibility in this demo if needed, but random is requested)
    # random.seed(42) 
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    
    return f"{b}-{m}-{t}-{suffix}"

products = [
    ("RayBan", "RB-3025", "FRAME"),
    ("Lenskart", "AirFlex-101", "FRAME"),
    ("Essilor", "Crizal Blue", "LENS"),
    ("Lenskart", "Lens Cleaner", "ACCESSORY"),
]

print(f"{'BRAND':<15} {'MODEL':<15} {'TYPE':<15} {'GENERATED SKU'}")
print("-" * 60)
for brand, model, ptype in products:
    sku = generate_sku(brand, model, ptype)
    print(f"{brand:<15} {model:<15} {ptype:<15} {sku}")
