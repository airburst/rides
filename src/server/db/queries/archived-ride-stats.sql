SELECT
    r.id,
    r.name,
    r.group,
    r.distance,
    r.destination,
    r.date,
    COALESCE(ur.cnt,0) as count
  from ArchivedRide r
  LEFT OUTER JOIN (
    SELECT rideId, CAST(count(*) as UNSIGNED) cnt
    FROM ArchivedUsersOnRides
    GROUP BY rideId
  ) ur ON ur.rideId = r.id
  where deleted = false
  order by r.date;