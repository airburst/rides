-- Partition ride sign ups by day over time period
SELECT
  STR_TO_DATE(concat(Year,'-',Month,'-',Day), '%Y-%m-%d') as Date,
	Total
from (
	SELECT
		YEAR(created_at) as Year,
		MONTH(created_at) as Month,
		DAY(created_at) as Day,
		COUNT(*) as Total
	FROM bcc_users_on_rides
	GROUP BY
		YEAR(created_at),
		MONTH(created_at),
		DAY(created_at)
) as stats
order by Date;