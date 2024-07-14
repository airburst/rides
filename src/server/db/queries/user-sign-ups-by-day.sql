-- Partition User sign ups by day over time period
SELECT
  STR_TO_DATE(concat(Year,'-',Month,'-',Day), '%Y-%m-%d') as Date,
  Admins,
	Leaders,
	Users,
	Total
from (
	SELECT
		YEAR(createdAt) as Year,
		MONTH(createdAt) as Month,
		DAY(createdAt) as Day,
		COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as Admins,
		COUNT(CASE WHEN role = 'LEADER' THEN 1 END) as Leaders,
		COUNT(CASE WHEN role = 'USER' THEN 1 END) as Users,
		COUNT(*) as Total
	FROM User
	GROUP BY
		YEAR(createdAt),
		MONTH(createdAt),
		DAY(createdAt)
) as stats
order by Date;
--     HOUR(createdAt),
--     FLOOR(MINUTE(createdAt)/15);