-- Drop the original signature (which had the similarity_threshold numeric parameter)
drop function if exists match_products_hybrid(text, extensions.vector, int, numeric);

-- Recreate with all structured filters (including filter_color) and refined hybrid matching logic
create or replace function match_products_hybrid(
  query_text text,
  query_embedding extensions.vector(1536),
  match_count int,
  filter_category text default null,
  filter_product_type text default null,
  filter_gender text default null,
  filter_occasions text[] default null,
  filter_materials text[] default null,
  filter_aesthetics text[] default null,
  filter_seasons text[] default null,
  filter_fit text default null,
  max_price numeric default null,
  filter_color text default null
)
returns table (
  id uuid,
  title text,
  description text,
  price numeric,
  stock_quantity int,
  category text,
  gender text,
  image_urls text[],
  sizes text[],
  materials text[],
  aesthetics text[],
  occasions text[],
  season text[],
  fit text,
  similarity float
)
language plpgsql
set search_path = public, extensions
as $$
declare
  or_query tsquery;
begin
  -- Convert query_text into an OR-based tsquery (e.g., 'comfort' | 'summer' | 'shirt')
  or_query := to_tsquery('english', regexp_replace(cast(plainto_tsquery('english', query_text) as text), ' & ', ' | ', 'g'));

  return query
  with filtered_products as (
    select *
    from products p
    where (filter_category is null or lower(p.category) = lower(filter_category))
      and (filter_gender is null or lower(p.gender) = lower(filter_gender))
      and (filter_fit is null or lower(p.fit) = lower(filter_fit))
      and (max_price is null or p.price <= max_price)
      and (filter_occasions is null or exists (
        select 1 from unnest(p.occasions) o join unnest(filter_occasions) fo on lower(o) like '%' || lower(fo) || '%' or lower(fo) like '%' || lower(o) || '%'
      ))
      and (filter_materials is null or exists (
        select 1 from unnest(p.materials) m join unnest(filter_materials) fm on lower(m) like '%' || lower(fm) || '%' or lower(fm) like '%' || lower(m) || '%'
      ))
      and (filter_aesthetics is null or exists (
        select 1 from unnest(p.aesthetics) a join unnest(filter_aesthetics) fa on lower(a) like '%' || lower(fa) || '%' or lower(fa) like '%' || lower(a) || '%'
      ))
      and (filter_seasons is null or exists (
        select 1 from unnest(p.season) s join unnest(filter_seasons) fs on lower(s) like '%' || lower(fs) || '%' or lower(fs) like '%' || lower(s) || '%'
      ))
      and (filter_product_type is null or 
           (lower(filter_product_type) = 'shirt' and p.category = 'apparel' and (p.title ilike '%shirt%' or p.title ilike '%kurta%' or p.title ilike '%top%' or p.title ilike '%tee%')) or
           (lower(filter_product_type) in ('shoes', 'footwear', 'sneakers') and p.category = 'footwear' and (p.title ilike '%shoe%' or p.title ilike '%sneaker%' or p.title ilike '%boot%' or p.title ilike '%loafer%' or p.title ilike '%sandal%')) or
           (lower(filter_product_type) in ('watch', 'watches') and p.category = 'accessories' and p.title ilike '%watch%') or
           (lower(filter_product_type) in ('bag', 'bags', 'purse', 'satchel') and p.category = 'accessories' and (p.title ilike '%bag%' or p.title ilike '%satchel%' or p.title ilike '%purse%' or p.title ilike '%tote%')) or
           (lower(filter_product_type) in ('jeans', 'trousers', 'pants') and p.category = 'apparel' and (p.title ilike '%jean%' or p.title ilike '%trouser%' or p.title ilike '%pant%' or p.title ilike '%short%')) or
           (lower(filter_product_type) in ('jacket', 'coat', 'outerwear') and p.category = 'apparel' and (p.title ilike '%jacket%' or p.title ilike '%coat%' or p.title ilike '%hoodie%' or p.title ilike '%cardigan%')) or
           -- Fallback to standard substring match if it's not a known category
           (lower(filter_product_type) not in ('shirt', 'shoes', 'footwear', 'sneakers', 'watch', 'watches', 'bag', 'bags', 'purse', 'satchel', 'jeans', 'trousers', 'pants', 'jacket', 'coat', 'outerwear') 
            and (p.title ilike '%' || filter_product_type || '%' or p.description ilike '%' || filter_product_type || '%'))
          )
      and (filter_color is null or (
        -- If filter_color is 'red', match red, crimson, maroon, burgundy, scarlet
        (lower(filter_color) = 'red' and (
          p.title ~* '\y(red|crimson|maroon|burgundy|scarlet)\y' or 
          p.description ~* '\y(red|crimson|maroon|burgundy|scarlet)\y'
        )) or
        -- If filter_color is 'blue', match blue, cerulean, azure, navy, teal, indigo
        (lower(filter_color) = 'blue' and (
          p.title ~* '\y(blue|cerulean|azure|navy|teal|indigo)\y' or 
          p.description ~* '\y(blue|cerulean|azure|navy|teal|indigo)\y'
        )) or
        -- If filter_color is 'gold', match gold, rose gold, golden
        (lower(filter_color) = 'gold' and (
          p.title ~* '\y(gold|golden)\y' or 
          p.description ~* '\y(gold|golden)\y'
        )) or
        -- If filter_color is 'brown' or 'tan', match brown, tan, beige, khaki, camel
        (lower(filter_color) in ('brown', 'tan') and (
          p.title ~* '\y(brown|tan|beige|khaki|camel)\y' or 
          p.description ~* '\y(brown|tan|beige|khaki|camel)\y'
        )) or
        -- If filter_color is 'green', match green, olive, emerald, mint
        (lower(filter_color) = 'green' and (
          p.title ~* '\y(green|olive|emerald|mint)\y' or 
          p.description ~* '\y(green|olive|emerald|mint)\y'
        )) or
        -- Default fallback to case-insensitive whole-word regex match for the input color
        (lower(filter_color) not in ('red', 'blue', 'gold', 'brown', 'tan', 'green') and (
          p.title ~* ('\y' || filter_color || '\y') or 
          p.description ~* ('\y' || filter_color || '\y')
        ))
      ))
  ),
  semantic_search as (
    select 
      fp.id,
      1 - (fp.text_embedding <=> query_embedding) as similarity_score
    from filtered_products fp
    where fp.text_embedding is not null
  ),
  keyword_search as (
    select 
      fp.id,
      ts_rank_cd(
        to_tsvector('english', 
          coalesce(fp.title, '') || ' ' || 
          coalesce(fp.description, '')
        ), 
        or_query
      ) as keyword_score
    from filtered_products fp
  ),
  scored_products as (
    select 
      fp.id,
      fp.title,
      fp.description,
      fp.price,
      fp.stock_quantity,
      fp.category,
      fp.gender,
      fp.image_urls,
      fp.sizes,
      fp.materials,
      fp.aesthetics,
      fp.occasions,
      fp.season,
      fp.fit,
      (coalesce(s.similarity_score, 0.0) + coalesce(k.keyword_score, 0.0))::float as similarity,
      coalesce(k.keyword_score, 0.0) as keyword_score
    from filtered_products fp
    left join semantic_search s on fp.id = s.id
    left join keyword_search k on fp.id = k.id
  ),
  max_score as (
    select max(sp.similarity) as max_sim from scored_products sp
  )
  select 
    sp.id,
    sp.title,
    sp.description,
    sp.price,
    sp.stock_quantity,
    sp.category,
    sp.gender,
    sp.image_urls,
    sp.sizes,
    sp.materials,
    sp.aesthetics,
    sp.occasions,
    sp.season,
    sp.fit,
    sp.similarity
  from scored_products sp, max_score ms
  where sp.similarity >= 0.5
    and (
      sp.similarity >= (ms.max_sim - 0.05)
      or sp.keyword_score > 0
    )
  order by similarity desc
  limit match_count;
end;
$$;
