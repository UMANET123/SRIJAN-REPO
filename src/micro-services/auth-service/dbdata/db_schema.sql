
create table subscriber_data_mask (id serial, 
uuid varchar, 
phone_no varchar,
created date,
status int);

create table subscriber_otps (id serial, 
uuid varchar, 
app_id varchar,
developer_id varchar,
otp varchar,
expiration timestamp,
status int);

create table flood_control (id serial, 
uuid varchar, 
app_id varchar,
created_at timestamp DEFAULT NOW(),
status int DEFAULT 0,
retry int DEFAULT 0);

