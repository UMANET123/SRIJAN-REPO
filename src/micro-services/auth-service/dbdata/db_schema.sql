
create table subscriber_data_mask (id serial, 
uuid varchar, 
phone_no varchar,
created date,
status int);

create table subscriber_otps (id serial, 
uuid varchar, 
app_id varchar,
developer_id varchar,
otp int,
expiration timestamp,
status int);

