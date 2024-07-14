select
  role,
  count(*) as total
from User
group by role;