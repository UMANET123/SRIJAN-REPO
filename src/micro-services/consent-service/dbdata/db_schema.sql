
create table subscriber_consent_mask (id serial, 
uuid varchar, 
phone_no numeric,
created date,
updated date,
status int);

create unique index uuid_index on subscriber_consent_mask (uuid);
create index phone_index on subscriber_consent_mask (phone_no);


create table subscriber_consent (
id serial, 
uuid varchar references subscriber_consent_mask (uuid) , 
app_id varchar,
scopes json,
access_token text,
created date,
updated date,
status int);

create index app_id_index on subscriber_consent (app_id);

create table subscriber_blocklist_apps (
id serial, 
uuid varchar references subscriber_consent_mask (uuid) , 
app_id varchar,
blocklist_status int,
created date,
updated date,
status int);

create index app_id_index2 on subscriber_blocklist_apps (app_id);
