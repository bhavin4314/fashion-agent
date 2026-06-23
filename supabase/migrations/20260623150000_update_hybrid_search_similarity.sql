-- Drop the existing function
drop function if exists match_products_hybrid(text, extensions.vector, int, numeric);

-- Recreate function with similarity threshold check of >= 0.5 to prevent returning completely unrelated products
create or replace function match_products_hybrid(
  query_text text,
  query_embedding extensions.vector(1536),
  match_count int,
  max_price numeric default null
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
begin
  return query
  with semantic_search as (
    select 
      p.id,
      1 - (p.text_embedding <=> query_embedding) as similarity_score
    from products p
    where p.text_embedding is not null
  ),
  keyword_search as (
    select 
      p.id,
      ts_rank_cd(
        to_tsvector('english', 
          coalesce(p.title, '') || ' ' || 
          coalesce(p.description, '') || ' ' || 
          coalesce(array_to_string(p.materials, ' '), '') || ' ' || 
          coalesce(array_to_string(p.aesthetics, ' '), '')
        ), 
        plainto_tsquery('english', query_text)
      ) as keyword_score
    from products p
    where to_tsvector('english', 
      coalesce(p.title, '') || ' ' || 
      coalesce(p.description, '') || ' ' || 
      coalesce(array_to_string(p.materials, ' '), '') || ' ' || 
      coalesce(array_to_string(p.aesthetics, ' '), '')
    ) @@ plainto_tsquery('english', query_text)
  )
  select 
    p.id,
    p.title,
    p.description,
    p.price,
    p.stock_quantity,
    p.category,
    p.gender,
    p.image_urls,
    p.sizes,
    p.materials,
    p.aesthetics,
    p.occasions,
    p.season,
    p.fit,
    (coalesce(s.similarity_score, 0.0) + coalesce(k.keyword_score, 0.0))::float as similarity
  from products p
  left join semantic_search s on p.id = s.id
  left join keyword_search k on p.id = k.id
  where (s.id is not null or k.id is not null)
    and (max_price is null or p.price <= max_price)
    and (coalesce(s.similarity_score, 0.0) + coalesce(k.keyword_score, 0.0) >= 0.5)
  order by similarity desc
  limit match_count;
end;
$$;
