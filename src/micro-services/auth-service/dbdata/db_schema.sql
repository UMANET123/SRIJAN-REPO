

-- Drop table

-- DROP TABLE public.subscriber_data_mask

CREATE TABLE public.subscriber_data_mask (
	id serial NOT NULL,
	uuid varchar NOT NULL,
	phone_no varchar NOT NULL,
	created timestamp DEFAULT now(),
	status int4 NULL,
  UNIQUE(uuid)
);

-- Drop table

-- DROP TABLE public.subscriber_otps

CREATE TABLE public.subscriber_otps (
	id serial NOT NULL,
	uuid varchar NULL,
	app_id varchar NULL,
	developer_id varchar NULL,
	otp varchar NULL,
	expiration timestamp NULL,
	status int4 NULL
);

ALTER table public.subscriber_otps
  add CONSTRAINT uuid_dm FOREIGN KEY (uuid)
  REFERENCES public.subscriber_data_mask (uuid);
-- Drop table

-- DROP TABLE public.transaction_data



-- Drop table

-- DROP TABLE public.flood_control

CREATE TABLE public.flood_control (
	id serial NOT NULL,
	uuid varchar NULL,
	app_id varchar NULL,
	created_at timestamp NULL DEFAULT now(),
	status int4 NULL DEFAULT 0,
	retry int4 NULL DEFAULT 0
);

ALTER table public.flood_control
  add CONSTRAINT uuid_fc_dm FOREIGN KEY (uuid)
  REFERENCES public.subscriber_data_mask (uuid);


CREATE TABLE public.transaction_data (
	id serial NOT NULL,
	transaction_id varchar NULL,
	subscriber_id varchar NULL,
	response_type varchar NULL,
	client_id varchar NULL,
	redirect_uri varchar NULL,
	scopes json NULL,
	state varchar NULL,
	app_id varchar NULL,
	developer_id varchar NULL,
	auth_state int4 NULL,
	created_at timestamp NULL DEFAULT now(),
	updated_at timestamp NULL,
	status int4 NULL
);

ALTER TABLE "subscriber_otps"
ADD "resend_at" timestamp NULL,
ADD "resend_count" int4 NOT NULL DEFAULT 0;
