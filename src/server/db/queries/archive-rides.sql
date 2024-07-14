-- ------------------------------------------------
-- IMPORTANT!
-- Change cutoff date in all queries before running
-- ------------------------------------------------

-- '2023-01-01 00:00'

-- Copy users on rides to Archive
insert into ArchivedUsersOnRides
(rideId, userId, createdAt, notes)
select rideId, userId, createdAt, notes
from UsersOnRides where rideId in (
 select id from Ride
 where date < '2023-01-01 00:00'
);

-- Delete archived records from UsersOnRides table
delete from UsersOnRides where rideId IN (
 select id from Ride where date < '2023-01-01 00:00'
);

-- Copy rides to Archive if before cutoff and h
insert into ArchivedRide
(id, name, `group`, date, destination, distance, meetPoint, route, leader, notes, speed, deleted, cancelled, createdAt)
select id, name, `group`, date, destination, distance, meetPoint, route, leader, notes, speed, deleted, cancelled, createdAt
from Ride
where date < '2023-01-01 00:00';

-- Delete archived records from Ride table
delete from Ride
where date < '2023-01-01 00:00';