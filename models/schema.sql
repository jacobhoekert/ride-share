create table if not exists "Authorization"
(
	driver_id integer not null
		constraint driver_id
			references "Driver",
	vehicle_id integer not null
		constraint vehicle_id
			references "Vehicle"
);

create table if not exists "Driver"
(
	id serial not null
		constraint driver_pk
			primary key,
	"firstName" varchar not null,
	"lastName" varchar not null,
	phone varchar not null,
	"licenseNumber" varchar not null
);

create table if not exists "Drivers"
(
	driver_id serial not null
		constraint driver_id
			references "Driver",
	ride_id serial not null
		constraint drivers_pk
			primary key
		constraint ride_id
			references "Ride"
);

create table if not exists "Location"
(
	id serial not null
		constraint location_pk
			primary key,
	name varchar not null,
	address varchar not null,
	city varchar not null,
	state varchar not null,
	"zipCode" varchar not null
);

create table if not exists "Passenger"
(
	id serial not null
		constraint passenger_pk
			primary key,
	"firstName" varchar not null,
	"lastName" varchar not null,
	phone varchar not null
);

create table if not exists "Passengers"
(
	passenger_id serial not null
		constraint passenger_id
			references "Passenger",
	ride_id serial not null
		constraint passengers_pk
			primary key
		constraint ride_id
			references "Ride"
);

create table if not exists "Ride"
(
	id serial not null
		constraint ride_pk
			primary key,
	date date not null,
	time varchar not null,
	distance double precision not null,
	"fuelPrice" double precision not null,
	fee double precision not null,
	vehicle_id integer not null
		constraint vehicle_id
			references "Vehicle",
	from_location_id integer not null
		constraint from_location_id
			references "Location",
	to_location_id integer not null
		constraint to_location_id
			references "Location"
);

create table if not exists "Vehicle"
(
	id serial not null
		constraint vehicle_pk
			primary key,
	make varchar not null,
	model varchar not null,
	color varchar not null,
	vehicle_type_id integer not null
		constraint vehicle_type_id
			references "Vehicle Type",
	capacity integer not null,
	mpg double precision not null,
	"licenseState" varchar not null,
	"licenseNumber" varchar not null
);

create table if not exists "VehicleType"
(
	id serial not null
		constraint "vehicle type_pk"
			primary key,
	type varchar not null
);





