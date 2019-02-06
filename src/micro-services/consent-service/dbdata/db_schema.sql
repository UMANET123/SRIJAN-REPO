
create table subscriber_consent (
id serial, 
uuid varchar,
app_id varchar,
developer_id varchar,
scopes json,
access_token text,
created date,
updated date,
status int);

create index app_id_index on subscriber_consent(app_id, developer_id);

create table subscriber_blocklist_apps (
id serial, 
uuid varchar,
app_id varchar,
developer_id varchar,
blocklist_status int,
created date,
updated date,
status int);

create index app_id_index2 on subscriber_blocklist_apps (app_id,developer_id);

create table apps_metadata(
   id serial, 
   app_id varchar,
   developer_id varchar, 
   created date,
   updated date
);