-- Create a secure RPC function to decrement product stock quantity
-- This function runs with SECURITY DEFINER to bypass Row Level Security (RLS) policies
-- and allows authenticated users to decrement stock during checkout
-- without granting them general update access to the products table.
CREATE OR REPLACE FUNCTION public.decrement_product_stock(product_id uuid, quantity_to_decrement integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = GREATEST(0, stock_quantity - quantity_to_decrement)
  WHERE id = product_id;
END;
$$;

-- Grant execution permission to authenticated users and service_role only
GRANT EXECUTE ON FUNCTION public.decrement_product_stock(uuid, integer) TO authenticated, service_role;

-- Create a secure RPC function to increment product stock quantity (e.g. on order cancellation)
-- This function runs with SECURITY DEFINER to bypass Row Level Security (RLS) policies
CREATE OR REPLACE FUNCTION public.increment_product_stock(product_id uuid, quantity_to_increment integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = stock_quantity + quantity_to_increment
  WHERE id = product_id;
END;
$$;

-- Grant execution permission to authenticated users and service_role only
GRANT EXECUTE ON FUNCTION public.increment_product_stock(uuid, integer) TO authenticated, service_role;
