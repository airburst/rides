SELECT
  r.*,
  array_agg(uor."userId") as riders
FROM "Ride" r
LEFT JOIN "UsersOnRides" uor ON r.id = uor."rideId"
GROUP BY r.id, uor."userId"
order by r.date, r.name, r.distance desc;