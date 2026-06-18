-- Alter profiles table to add shipping details
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS shipping_address text,
ADD COLUMN IF NOT EXISTS phone text;

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    shipping_address text NOT NULL,
    customer_name text NOT NULL,
    customer_email text,
    payment_status text DEFAULT 'unpaid'::text NOT NULL,
    stripe_session_id text UNIQUE,  
    total_amount numeric(10,2) NOT NULL,
    internal_note text
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    size text,
    price numeric(10,2) NOT NULL
);

-- Enable RLS (explicit enablement)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid collision
DROP POLICY IF EXISTS "Allow users to view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admins full access to orders" ON public.orders;

DROP POLICY IF EXISTS "Allow users to view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow users to insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow admins full access to order items" ON public.order_items;

-- Policies for orders
CREATE POLICY "Allow users to view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admins full access to orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

-- Policies for order_items
CREATE POLICY "Allow users to view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow users to insert their own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow admins full access to order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

-- Create triggers for updated_at on orders table
CREATE OR REPLACE TRIGGER "handle_orders_updated_at" 
BEFORE UPDATE ON public.orders 
FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');

-- Grant permissions (anon, authenticated, service_role)
GRANT ALL ON TABLE public.orders TO postgres;
GRANT ALL ON TABLE public.orders TO anon;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;

GRANT ALL ON TABLE public.order_items TO postgres;
GRANT ALL ON TABLE public.order_items TO anon;
GRANT ALL ON TABLE public.order_items TO authenticated;
GRANT ALL ON TABLE public.order_items TO service_role;
