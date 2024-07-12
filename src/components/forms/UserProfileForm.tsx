"use client";

import { updateProfile } from "@/server/actions/update-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertObjectToFormData } from "@utils/general";
import { ShieldCheck } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { type User } from "../../types";
import { Button } from "../Button";
import { CancelButton } from "../Button/CancelButton";
import { userProfileFormSchema, type UserProfileFormSchema } from "./formSchemas";

export type UserFormProps = {
  user: User;
  isAdmin?: boolean;
};

const UserProfileForm = ({
  user,
  isAdmin
}: UserFormProps) => {
  const { register,
    handleSubmit,
    formState: { defaultValues, errors, isDirty }
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
    },
  });
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

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
  }

  return (
    <form
      className="form-control relative w-full text-neutral-800"
      onSubmit={handleSubmit(onSubmit)}
      action={updateProfile}
    >
      <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded">
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
              className="input input-bordered"
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
              className="input input-bordered"
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
              className="input input-bordered"
              {...register("emergency")}
            />
            {errors.emergency && (
              <span className="font-normal text-red-500">
                {errors.emergency?.message}
              </span>
            )}
          </label>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
          <label htmlFor="name" className="flex flex-col gap-1">
            Email
            <input
              id="email"
              type="text"
              className="input input-bordered"
              {...register("email")}
              disabled
            />
          </label>
        </div>

        {isAdmin && (
          <>
            <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
              <label htmlFor="role" className="flex flex-col">
                Role
                <select
                  id="role"
                  className="input input-bordered"
                  defaultValue={defaultValues?.role ?? ""}
                  {...register("role")}
                >
                  <option value="USER">USER</option>
                  <option value="LEADER">LEADER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
              <label htmlFor="role" className="flex flex-col">
                <div className="flex flex-row">
                  <span className="flex-1">RiderHQ Membership Id</span>
                  {defaultValues?.membershipId && <ShieldCheck className="text-secondary w-6 h-6" />}
                </div>
                <input
                  id="membershipId"
                  className="input input-bordered"
                  defaultValue={defaultValues?.membershipId ?? ""}
                  {...register("membershipId")}
                />
              </label>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex w-screen flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded md:mx-0 md:w-full">
        Preferences
      </div>
      <div className="grid grid-cols-1 gap-4 p-2">
        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <label className="form-control w-full">
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

        <div className="grid grid-cols-2 gap-4 md:gap-8 md:flex">
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
  );
}

export default UserProfileForm;