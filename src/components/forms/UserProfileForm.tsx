"use client";

import { updateProfile } from "@/server/actions/updateProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type User } from "../../types";
import { Button } from "../Button";
import { CancelButton } from "../Button/CancelButton";
import { userProfileFormSchema, type UserProfileFormSchema } from "./formSchemas";

type UserFormProps = {
  user: User;
};

export const UserProfileForm = ({
  user,
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
    },
  })

  const onSubmit = async (data: UserProfileFormSchema) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
    // Convert form data to FormData
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("mobile", data.mobile);
    formData.append("emergency", data.emergency);
    formData.append("email", data.email);
    formData.append("preferences", JSON.stringify(data.preferences));
    // Object.entries(data).forEach(([key, value]) => {
    //   formData.append(key, value);
    // });
    const result = await updateProfile(formData);

    console.log("🚀 ~ onSubmit ~ result", result);
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
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
          <label htmlFor="name" className="flex flex-col gap-1">
            Email
            <input
              id="email"
              type="text"
              className="input"
              {...register("email")}
              disabled
            />
          </label>
        </div>
      </div>

      <div className="mx-[-8px] flex w-screen flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded md:mx-0 md:w-full">
        Preferences
      </div>
      <div className="grid grid-cols-1 gap-4 p-2">
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
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

        <div className="grid w-full grid-cols-2 gap-4 md:gap-8">
          <Button
            primary
            type="submit"
            // loading={isPending}
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
