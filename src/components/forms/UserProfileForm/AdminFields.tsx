import { MembershipIcon } from "@/components/MembershipIcon";
import { memo } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { UserProfileFormSchema } from "../formSchemas";

type AdminFieldsProps = {
  defaultRole?: string;
  defaultMembershipId?: string;
  defaultMembershipStatus?: string;
  register: UseFormRegister<UserProfileFormSchema>;
};

export const AdminFields = memo(
  ({
    defaultRole,
    defaultMembershipId,
    defaultMembershipStatus,
    register,
  }: AdminFieldsProps) => {
    return (
      <>
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
          <label htmlFor="role" className="flex flex-col">
            Role
            <select
              id="role"
              className="input"
              defaultValue={defaultRole ?? ""}
              {...register("role")}
            >
              <option value="USER">USER</option>
              <option value="LEADER">LEADER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[1fr_1fr] md:gap-8">
          <label htmlFor="membershipId" className="flex flex-col">
            <div className="flex flex-row">
              <span className="flex-1">RiderHQ Membership Id</span>
              <MembershipIcon membershipStatus={defaultMembershipStatus} />
            </div>
            <input
              id="membershipId"
              className="input"
              placeholder="E.g. gm_r3nqcaa"
              defaultValue={defaultMembershipId ?? ""}
              {...register("membershipId")}
            />
          </label>
          <label htmlFor="membershipStatus" className="flex flex-col">
            Membership Status
            <select
              id="membershipStatus"
              className="input"
              defaultValue={defaultMembershipStatus ?? ""}
              {...register("membershipStatus")}
            >
              <option value="MEMBER">MEMBER</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="NOT_MEMBER">NOT A MEMBER</option>
              <option value="OTHER_CLUB">MEMBER OF ANOTHER CLUB</option>
            </select>
          </label>
        </div>
      </>
    );
  },
);

AdminFields.displayName = "AdminFields";
