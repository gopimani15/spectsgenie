import random
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database connection details
DATABASE_URL = "postgresql://postgres:Mani%40789@localhost:5432/pos?options=-csearch_path%3Dpos"

def generate_ean13(product_id):
    """Generates a pseudo-random EAN-13 barcode based on product ID."""
    # Prefix for our store (e.g., 200 for internal use)
    prefix = "200"
    # Pad product_id to 9 digits
    body = str(product_id).zfill(9)
    # Combine prefix and body (12 digits)
    barcode_12 = prefix + body
    
    # Calculate checksum digit
    evensum = sum(int(barcode_12[i]) for i in range(1, 12, 2))
    oddsum = sum(int(barcode_12[i]) for i in range(0, 12, 2))
    total = evensum * 3 + oddsum
    checksum = (10 - (total % 10)) % 10
    
    return barcode_12 + str(checksum)

def populate_barcodes():
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()

        # Check if barcode column exists
        check_col = session.execute(text(
            "SELECT column_name FROM information_schema.columns WHERE table_name='product' AND column_name='barcode'"
        )).fetchone()
        
        if not check_col:
            print("Error: 'barcode' column does not exist in 'product' table.")
            print("Please run the migration script first: migrations/add_barcode_column.sql")
            return

        # Fetch products without barcodes
        products = session.execute(text("SELECT product_id, sku FROM product WHERE barcode IS NULL")).fetchall()
        
        if not products:
            print("No products found without barcodes.")
            return

        print(f"Found {len(products)} products without barcodes. Populating...")

        for row in products:
            product_id = row[0]
            sku = row[1]
            barcode = generate_ean13(product_id)
            
            session.execute(
                text("UPDATE product SET barcode = :barcode WHERE product_id = :id"),
                {"barcode": barcode, "id": product_id}
            )
            print(f"Updated Product ID: {product_id} (SKU: {sku}) -> Barcode: {barcode}")

        session.commit()
        print("\nSuccessfully populated barcodes for all products.")
        session.close()

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    populate_barcodes()
