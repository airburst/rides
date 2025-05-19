SELECT * FROM (
  SELECT
      r.id,
      r.name,
      r.ride_group as group,
      r.distance,
      r.destination,
      r.ride_date as date,
      r.deleted,
      COALESCE(ur.cnt,0) as riders
    from bcc_rides r
    LEFT OUTER JOIN (
      SELECT ride_id, count(*) cnt
      FROM bcc_users_on_rides
      GROUP BY ride_id
    ) ur ON ur.ride_id = r.id

  UNION ALL

  SELECT
      ar.id,
      ar.name,
      ar.ride_group as group,
      ar.distance,
      ar.destination,
      ar.ride_date as date,
      ar.deleted,
      COALESCE(aur.cnt,0) as riders
    from bcc_archived_rides ar
    LEFT OUTER JOIN (
      SELECT ride_id, count(*) cnt
      FROM bcc_archived_users_on_rides
      GROUP BY ride_id
    ) aur ON aur.ride_id = ar.id
) combined_results
ORDER BY date DESC;