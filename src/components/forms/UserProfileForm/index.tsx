import { Input } from "@/components/ui/input";
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
            ...(isAdmin && {
              role: data.role as "USER" | "LEADER" | "ADMIN",
              membershipId: data.membershipId,
              membershipStatus: data.membershipStatus,
            }),
          },
        },
        {
          onSuccess: () => {
            toast.success("Profile updated successfully");
            const isNewUser = !user.mobile && !user.emergency;
            if (isNewUser) {
              void router.navigate({ to: "/" });
            } else {
              router.history.back();
            }
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

        {/* Profile Section with Avatar */}
        <div className="p-2 lg:p-4">
          <div 
            className="grid gap-6 [grid-template-areas:'avatar'_'fields'] lg:[grid-template-areas:'fields_avatar'] lg:grid-cols-2"
          >
            {/* Avatar - appears first on mobile, right on desktop */}
            <div className="flex justify-center lg:justify-end [grid-area:avatar]">
              <AvatarSection
                imageUrl={user.imageLarge || user.image!}
                onChangeClick={showAvatarModal}
              />
            </div>

            {/* Form Fields - appears second on mobile, left on desktop */}
            <div className="flex flex-col gap-4 [grid-area:fields]">
              <label htmlFor="name" className="flex flex-col gap-1">
                Name *
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="font-normal text-red-500">
                    {errors.name?.message}
                  </span>
                )}
              </label>

              <label htmlFor="mobile" className="flex flex-col gap-1">
                Mobile *
                <Input
                  id="mobile"
                  type="text"
                  {...register("mobile")}
                />
                {errors.mobile && (
                  <span className="font-normal text-red-500">
                    {errors.mobile?.message}
                  </span>
                )}
              </label>

              <label htmlFor="emergency" className="flex flex-col gap-1">
                Emergency Contact *
                <Input
                  id="emergency"
                  type="text"
                  {...register("emergency")}
                />
                {errors.emergency && (
                  <span className="font-normal text-red-500">
                    {errors.emergency?.message}
                  </span>
                )}
              </label>

              <div className="flex flex-col gap-1">
                <span className="font-medium">Email</span>
                <div className="text-neutral-500">{defaultValues?.email}</div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="mt-6">
              <AdminFields
                defaultRole={defaultValues?.role}
                defaultMembershipId={defaultValues?.membershipId}
                defaultMembershipStatus={defaultValues?.membershipStatus}
                register={register}
              />
            </div>
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
