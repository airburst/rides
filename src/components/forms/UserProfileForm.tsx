import { type User } from "../../types";
import { Button } from "../Button";
import { CancelButton } from "../Button/CancelButton";
import { TextInput } from "./TextInput";

export type UserFormProps = {
  user: User;
};

export const UserProfileForm = ({
  user
}: UserFormProps) => (
  <form className="form-control relative w-full text-neutral-800">
    <div className="flex w-full flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded">
      Profile
    </div>
    <div className="grid grid-cols-1 gap-4 p-2">
      <TextInput
        id="name"
        label="Name"
        defaultValue={user?.name}
        mandatory />
      <TextInput
        id="mobile"
        label="Mobile"
        defaultValue={user?.mobile}
        mandatory />
      <TextInput
        id="emergency"
        label="Emergency Contact"
        defaultValue={user?.emergency}
        placeholder="Name and contact number"
        mandatory />
      <TextInput
        id="email"
        label="Email"
        defaultValue={user?.email}
        disabled />

    </div>

    <div className="mx-[-8px] flex w-screen flex-row items-center justify-center bg-primary p-2 font-bold uppercase tracking-wide text-white sm:rounded md:mx-0 md:w-full">
      Preferences
    </div>
    <div className="grid grid-cols-1 gap-4 p-2">
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <label className="form-control w-full">
          <div className="label">Units</div>
          <select id="units" className="select select-bordered w-full" defaultValue={user?.preferences?.units ?? ""}>
            <option value="km">Kilometers</option>
            <option value="miles">Miles</option>
          </select>
        </label>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 md:gap-8">
        <Button primary loading={false} type="submit" disabled={!false}>
          SAVE
        </Button>
        <CancelButton />
      </div>
    </div>

  </form>
);
