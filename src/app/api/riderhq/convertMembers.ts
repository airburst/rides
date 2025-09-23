import { type Member, type MemberData } from "./types";

export const transformMember = (data: MemberData): Member => ({
  memberId: data.id,
  userId: data.user?.id,
  handle: data.user?.handle,
  isUser: data.member_is_user_bool,
  firstnames: data.firstnames_txt,
  lastname: data.lastname_txt,
  email: data.email_eml,
  expires: data.expiry_day,
  isVerified: data.user?.verified_bool,
  isGuest: data.user?.guest_bool,
});

// Transform and filter out users with no userId
export const convertMembers = (members: MemberData[]): Member[] =>
  members.map(transformMember).filter(({ userId }) => userId);

/*
Example full payload
{
  "type": "member",
  "id": "gm_u6d2zkwq",
  "member_is_user_bool": true,
  "first_names_txt": "Cathy",
  "last_name_txt": "H",
  "firstnames_txt": "Cathy",
  "lastname_txt": "H",
  "email_eml": "********.com",
  "joined_day": "1959-06-06",
  "expiry_day": "2023-12-31",
  "last_modified_tstamp": "2023-03-06T16:52:20Z",
  "user": {
    "type": "user",
    "id": "u_r4qcrnb6",
    "firstnames_txt": "Cathy",
    "lastname_txt": "H",
    "first_names_txt": "Cathy",
    "last_name_txt": "H",
    "email_eml": "********.com",
    "verified_bool": true,
    "guest_bool": false,
    "deleteaccount_url": "https://www.riderhq.com/people/rider463080/deleteaccount",
    "link_url": "https://www.riderhq.com/people/rider463080",
    "handle": "rider463080"
  },
  "details_url": "https://www.riderhq.com/groupmembers/113907"
}
*/
