"use client";

import { updateProfile } from "@/server/actions/update-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertObjectToFormData } from "@utils/general";
import { EditIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type User } from "../../types";
import { Button } from "../Button";
import { CancelButton } from "../Button/CancelButton";
import { MembershipIcon } from "../MembershipIcon";
import ChangeAvatarModal from "./ChangeAvatarModal";
import {
  userProfileFormSchema,
  type UserProfileFormSchema,
} from "./formSchemas";

export type UserFormProps = {
  user: User;
  isAdmin?: boolean;
};

const UserProfileForm = ({ user, isAdmin }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { defaultValues, errors, isDirty },
  } = useForm<UserProfileFormSchema>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      mobile: user?.mobile ?? "",
      emergency: user?.emergency ?? "",
      email: user?.email,
      preferences: {
        units: user?.preferences?.units ?? "km",
      },
      role: user?.role ?? "USER",
      membershipId: user?.membershipId ?? "",
      membershipStatus: user?.membershipStatus ?? "NOT_MEMBER",
    },
  });
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showAvatarModalForm, setShowAvatarModalForm] = useState(false);

  const showAvatarModal = () => setShowAvatarModalForm(true);
  const hideAvatarModal = () => setShowAvatarModalForm(false);

  const onSubmit = async (data: UserProfileFormSchema) => {
    setIsPending(true);
    const formData = convertObjectToFormData(data);
    const result = await updateProfile(formData);

    if (result.success) {
      toast.success(result.message);
      router.back();
    } else {
      toast.error(result.message);
    }
    setIsPending(false);
  };

  return (
    <>
      <form
        className="relative w-full text-neutral-800"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="bg-primary flex w-full flex-row items-center justify-center p-2 font-bold tracking-wide text-white uppercase sm:rounded">
          Profile
        </div>

        <input type="hidden" id="user-id" name="id" value={user?.id} />

        <div className="grid grid-cols-1 gap-4 p-2">
          <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
            <label htmlFor="name" className="flex flex-col gap-1">
              Name *
              <input
                id="name"
                type="text"
                className="input"
                {...register("name")}
              />
              {errors.name && (
                <span className="font-normal text-red-500">
                  {errors.name?.message}
                </span>
              )}
            </label>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
            <label htmlFor="name" className="flex flex-col gap-1">
              Mobile *
              <input
                id="mobile"
                type="text"
                className="input"
                {...register("mobile")}
              />
              {errors.mobile && (
                <span className="font-normal text-red-500">
                  {errors.mobile?.message}
                </span>
              )}
            </label>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
            <label htmlFor="name" className="flex flex-col gap-1">
              Emergency Contact *
              <input
                id="emergency"
                type="text"
                className="input"
                {...register("emergency")}
              />
              {errors.emergency && (
                <span className="font-normal text-red-500">
                  {errors.emergency?.message}
                </span>
              )}
            </label>
          </div>
          <div className="grid w-full grid-cols-[auto_1fr] gap-4 md:gap-8">
            <div className="flex flex-col gap-1">Email</div>
            <div className="text-neutral-500">{defaultValues?.email}</div>
          </div>
          <div className="grid w-full grid-cols-[auto_auto_auto] items-center justify-start gap-4 md:gap-8">
            <div className="flex flex-col gap-1">Avatar</div>
            <div className="avatar">
              <div className="w-[40px] rounded-full">
                <Image
                  className="text-neutral-500"
                  src={user.image!}
                  width={40}
                  height={40}
                  alt="Avatar"
                />
              </div>
            </div>
            <Button accent onClick={showAvatarModal}>
              <EditIcon />
              CHANGE
            </Button>
          </div>

          {isAdmin && (
            <>
              <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
                <label htmlFor="role" className="flex flex-col">
                  Role
                  <select
                    id="role"
                    className="input"
                    defaultValue={defaultValues?.role ?? ""}
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
                    <MembershipIcon
                      membershipStatus={defaultValues?.membershipStatus}
                    />
                  </div>
                  <input
                    id="membershipId"
                    className="input"
                    placeholder="E.g. gm_r3nqcaa"
                    defaultValue={defaultValues?.membershipId ?? ""}
                    {...register("membershipId")}
                  />
                </label>
                <label htmlFor="membershipStatus" className="flex flex-col">
                  Membership Status
                  <select
                    id="membershipStatus"
                    className="input"
                    defaultValue={defaultValues?.membershipStatus ?? ""}
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
          )}
        </div>

        <div className="bg-primary mt-4 flex w-screen flex-row items-center justify-center p-2 font-bold tracking-wide text-white uppercase sm:rounded md:mx-0 md:w-full">
          Preferences
        </div>
        <div className="grid grid-cols-1 gap-4 p-2">
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <label className="w-full">
              <div className="label">Units</div>
              <select
                id="units"
                className="select select-bordered w-full"
                defaultValue={defaultValues?.preferences?.units}
                {...register("preferences.units")}
              >
                <option value="km">Kilometers</option>
                <option value="miles">Miles</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 md:flex md:gap-8">
            <Button
              primary
              type="submit"
              loading={isPending}
              disabled={!isDirty}
            >
              SAVE
            </Button>
            <CancelButton />
          </div>
        </div>
      </form>

      <ChangeAvatarModal
        open={showAvatarModalForm}
        onClose={hideAvatarModal}
        user={user}
      />
    </>
  );
};

export default UserProfileForm;
