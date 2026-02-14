import { useUpdateUser } from "@/hooks/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type User } from "../../../types";
import ChangeAvatarModal from "../ChangeAvatarModal";
import {
  userProfileFormSchema,
  type UserProfileFormSchema,
} from "../formSchemas";
import { AdminFields } from "./AdminFields";
import { AvatarSection } from "./AvatarSection";
import { PreferencesSection } from "./PreferencesSection";

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
  const updateMutation = useUpdateUser();
  const [showAvatarModalForm, setShowAvatarModalForm] = useState(false);

  const showAvatarModal = useCallback(() => setShowAvatarModalForm(true), []);
  const hideAvatarModal = useCallback(() => setShowAvatarModalForm(false), []);

  const onSubmit = useCallback(
    (data: UserProfileFormSchema) => {
      updateMutation.mutate(
        {
          id: data.id,
          data: {
            name: data.name,
            mobile: data.mobile,
            emergency: data.emergency,
            preferences: data.preferences,
            role: data.role as "USER" | "LEADER" | "ADMIN",
            membershipId: data.membershipId,
            membershipStatus: data.membershipStatus,
          },
        },
        {
          onSuccess: () => {
            toast.success("Profile updated successfully");
            router.history.back();
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update profile");
          },
        },
      );
    },
    [updateMutation, router],
  );

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
          <AvatarSection
            imageUrl={user.imageLarge || user.image!}
            onChangeClick={showAvatarModal}
          />

          {isAdmin && (
            <AdminFields
              defaultRole={defaultValues?.role}
              defaultMembershipId={defaultValues?.membershipId}
              defaultMembershipStatus={defaultValues?.membershipStatus}
              register={register}
            />
          )}
        </div>

        <PreferencesSection
          defaultUnits={defaultValues?.preferences?.units}
          register={register}
          isPending={updateMutation.isPending}
          isDirty={isDirty}
        />
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
