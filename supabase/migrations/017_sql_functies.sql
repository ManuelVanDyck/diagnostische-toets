-- 017: exec_sql + query_sql functies voor programmatische SQL-toegang
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS JSONB SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE result INT;
BEGIN EXECUTE sql_query; GET DIAGNOSTICS result = ROW_COUNT;
RETURN jsonb_build_object('status','ok','rows_affected',result);
EXCEPTION WHEN OTHERS THEN RETURN jsonb_build_object('error',SQLERRM,'detail',SQLSTATE,'received',left(sql_query,100));
END; $$;

CREATE OR REPLACE FUNCTION query_sql(sql_query TEXT)
RETURNS SETOF JSONB SECURITY DEFINER LANGUAGE plpgsql AS $$
DECLARE row_data JSONB;
BEGIN FOR row_data IN EXECUTE 'SELECT row_to_json(t) FROM (' || sql_query || ') t' LOOP RETURN NEXT row_data; END LOOP; RETURN;
EXCEPTION WHEN OTHERS THEN RETURN NEXT jsonb_build_object('error',SQLERRM); END; $$;
