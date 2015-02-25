-- CREATE A TABLE
CREATE TABLE TEST_NOTIFY (
   ID INT PRIMARY KEY NOT NULL,
   NAME       CHAR(50) NOT NULL,
   MESSAGE    TEXT NOT NULL
);

-- CREATE A FUNCTION TRIGGER
CREATE OR REPLACE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('watchers', 
    '{' ||
      '"table":"'    || TG_TABLE_NAME || '",' ||
      '"operation":"'|| TG_OP         || '",' ||
      '"row":'       || (select row_to_json(row)::varchar from (SELECT NEW.*) row) ||
    '}'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE A TRIGGER
CREATE TRIGGER watched_table_trigger AFTER INSERT OR UPDATE OR DELETE ON TRUNCATE 
  -- TABLE
  TEST_NOTIFY
FOR EACH ROW EXECUTE PROCEDURE notify_trigger();