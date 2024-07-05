export type MemberData = {
  id: string;
  handle: string;
  member_is_user_bool: boolean;
  firstnames_txt: string;
  lastname_txt: string;
  email_eml: string;
  expiry_day: string;
  user?: {
    id?: string;
    verified_bool?: boolean;
    guest_bool?: boolean;
    handle?: string;
  };
};

export type Member = {
  memberId: string;
  userId?: string;
  handle?: string;
  isUser: boolean;
  firstnames: string;
  lastname: string;
  email: string | null;
  expires: string;
  isVerified?: boolean;
  isGuest?: boolean;
};
