-- Custom SQL migration file, put your code below! --
create or replace function public.ping()
  returns text
  set search_path = ''
  as $$
begin
  return 'pong';
end;
$$
language plpgsql;