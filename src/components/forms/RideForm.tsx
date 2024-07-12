/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { addRepeatingRide } from "@/server/actions/add-repeating-ride";
import { addRide } from "@/server/actions/add-ride";
import { generateRidesFromClient } from "@/server/actions/generate-rides-from-client";
import { updateRepeatingRide } from "@/server/actions/update-repeating-ride";
import { updateRide } from "@/server/actions/update-ride";
import { Switch } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { convertObjectToFormData, formatDate, getNow, makeRepeatingRide, makeRidesInPeriod, makeUtcDate, repeatingRideToDb } from "../../../shared/utils";
import { RIDER_LIMIT_OPTIONS } from "../../constants";
import { type Preferences } from "../../types";
import { Button } from "../Button";
import { CancelButton } from "../Button/CancelButton";
import { ConfirmWithContent } from "../ConfirmWithContent";
import { rideFormSchema, type RideFormSchema } from "./formSchemas";

const RepeatingRideForm = dynamic(() => import("./RepeatingRideForm"));

const Editor = dynamic(() => import("../Markdown/Editor"), { ssr: false });

const today = getNow().split("T")[0] ?? "";

export type RideFormProps = {
  isAdmin?: boolean;
  isRepeating?: boolean;
  defaultValues: RideFormSchema;
  preferences?: Preferences;
};

const RideForm = ({
  isAdmin,
  isRepeating,
  defaultValues: defaults,
  preferences,
}: RideFormProps) => {
  const { register,
    setValue,
    handleSubmit,
    watch,
    getValues,
    formState: { defaultValues, errors }
  } = useForm<RideFormSchema>({
    resolver: zodResolver(rideFormSchema),
    defaultValues: defaults,
  });
  const router = useRouter();
  const isNewRide = !defaultValues?.id;
  const [repeats, setRepeats] = useState<boolean>(isRepeating ?? false);
  const [isPending, setIsPending] = useState(false);
  const [rideDateList, setRideDateList] = useState<string[]>([]);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const showRepeatingSwitch = isAdmin && (isNewRide || isRepeating);
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const show = () => setShowCreate(true);
  const hide = () => {
    setShowCreate(false);
  };

  const switchClass = clsx(
    "relative inline-flex h-6 w-11 items-center rounded-full",
    repeats ? "bg-green-600" : "bg-gray-200"
  );
  const toggleClass = clsx(
    "inline-block h-4 w-4 transform rounded-full bg-white transition",
    repeats ? "translate-x-6" : "translate-x-1"
  );
  const handleRepeatsChange = () => setRepeats(!repeats);

  const handleNotesChange = (text: string) => {
    setValue("notes", text);
  }

  const createRide = async (data: RideFormSchema) => {
    setIsPending(true);
    const rideDate = makeUtcDate(data.rideDate, data.time)
    const formData = convertObjectToFormData({ ...data, rideDate });

    let result;
    if (data.id) {
      result = await updateRide(formData);
    } else {
      result = await addRide(formData);
    }

    setIsPending(false);
    if (result.success) {
      toast.success(result.message);
      router.back();
    } else {
      toast.error(result.message);
    }
  }

  const createRepeating = async (data: RideFormSchema) => {
    setIsPending(true);
    const formData = convertObjectToFormData(data);

    try {
      const payload = makeRepeatingRide(data);
      if (data.id) {
        const results = await updateRepeatingRide(formData);

        setIsPending(false);
        toast.success(results.message);
        router.back();
      } else {
        const results = await addRepeatingRide(formData);

        if (results?.id) {
          // Store schedule id to use in handleYes function
          setScheduleId(results.id);
          // Calculate rides list and ask to create them
          const rideList = makeRidesInPeriod(repeatingRideToDb(payload), data.startDate);
          const rideDates = rideList.rides.map(({ rideDate }) => formatDate(rideDate));
          if (rideDates.length > 0) {
            setRideDateList(rideDates);
            show();
          }
          setIsPending(false);
          toast.success(results.message);
          router.back();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNo = () => {
    hide();
    router.push("/");
  };

  const handleYes = async (cb: (flag: boolean) => void) => {
    hide();

    if (scheduleId) {
      const date = getValues("rideDate");
      const results = await generateRidesFromClient(scheduleId, date);
      if (results.success) {
        toast.success(results.message)
        router.push("/");
        cb(true);
      } else {
        cb(false);
      }
    }
  };

  return (
    <>
      <form
        className="form-control relative grid w-full grid-cols-1 gap-4 p-2 mb-4 text-neutral-800"
        onSubmit={repeats ? handleSubmit(createRepeating) : handleSubmit(createRide)}
      >
        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="name" className="flex flex-col gap-1">
            Ride name *
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

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 md:gap-8">
            <label htmlFor="rideGroup" className="flex flex-col gap-1">
              Group name
              <input
                id="rideGroup"
                type="text"
                className="input input-bordered"
                {...register("rideGroup")}
              />
            </label>
          </div>
          <div className="flex flex-col gap-4 md:gap-8">
            <label htmlFor="rideLimit" className="flex flex-col gap-1">
              Rider limit
              <select
                id="rideLimit"
                className="input input-bordered"
                {...register("rideLimit")}
              >
                <option value="-1">No limit</option>
                {RIDER_LIMIT_OPTIONS.map((val: number) => (
                  <option key={`limit-${val}`} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 md:gap-8">
            <label htmlFor="rideDate" className="flex flex-col gap-1">
              Date *
              <input
                id="rideDate"
                type="date"
                min={today}
                className="input input-bordered"
                {...register("rideDate")}
              />
              {errors.rideDate && (
                <span className="font-normal text-red-500">
                  {errors.rideDate?.message}
                </span>
              )}
            </label>
          </div>

          <div className="flex flex-col gap-4 md:gap-8">
            <label htmlFor="time" className="flex flex-col gap-1">
              Start time *
              <input
                id="time"
                type="time"
                className="input input-bordered"
                {...register("time")}
              />
              {errors.time && (
                <span className="font-normal text-red-500">
                  {errors.time?.message}
                </span>
              )}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="meetPoint" className="flex flex-col gap-1">
            Meeting point
            <input
              id="meetPoint"
              type="text"
              className="input input-bordered"
              {...register("meetPoint")}
            />
          </label>
        </div>

        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="distance" className="flex flex-col">
            Distance ({preferences?.units ?? "km"}) *
            <input
              id="distance"
              type="number"
              className="input input-bordered"
              {...register("distance")}
            />
            {errors.distance && (
              <span className="font-normal text-red-500">
                {errors.distance.message}
              </span>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="destination" className="flex flex-col">
            Destination
            <input
              id="destination"
              type="text"
              className="input input-bordered"
              {...register("destination")}
            />
          </label>
        </div>

        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="route" className="flex flex-col">
            Route Link
            <input
              id="route"
              type="text"
              className="input input-bordered"
              {...register("route")}
            />
          </label>
        </div>

        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="leader" className="flex flex-col">
            Leader
            <input
              id="leader"
              type="text"
              className="input input-bordered"
              {...register("leader")}
            />
          </label>
        </div>

        <div className="flex flex-col">
          <label className="flex flex-col">
            Notes
          </label>
          <Editor initialValue={defaultValues?.notes} onChange={handleNotesChange} />
          <input
            id="notes"
            type="hidden"
            aria-label="notes"
            {...register("notes")}
          />
        </div>

        {showRepeatingSwitch && (
          <>
            <div className="flex flex-row">
              <div className="pr-8">This ride repeats</div>
              <Switch
                checked={repeats}
                onChange={handleRepeatsChange}
                className={switchClass}
              >
                <span className="sr-only">Enable notifications</span>
                <span className={toggleClass} />
              </Switch>
            </div>
            <RepeatingRideForm
              defaultValues={defaults}
              register={register}
              errors={errors}
              repeats={repeats}
              watch={watch}
              setValue={setValue}
              isRepeating={isRepeating}
            />
          </>
        )}

        <div className="grid w-full grid-cols-2 gap-4 md:gap-8">
          <Button primary loading={isPending} type="submit">
            <div>SAVE</div>
          </Button>
          <CancelButton />
        </div>
      </form>

      <ConfirmWithContent
        open={showCreate}
        closeHandler={handleNo}
        heading="Do you want to create rides on the following dates using this schedule?"
        onYes={(callback) => handleYes(callback)}
      >
        <>
          {rideDateList.map((date) => (
            <div key={date}>{date}</div>
          ))}
        </>
      </ConfirmWithContent>
    </>
  );
};

export default RideForm;