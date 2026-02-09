import {
  useCreateRepeatingRide,
  useGenerateRides,
  useUpdateRepeatingRide,
} from "@/hooks/repeating-rides";
import { useCreateRide, useUpdateRide } from "@/hooks/useRides";
import { useRouter } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { lazy, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  formatDate,
  getNow,
  makeRepeatingRide,
  makeRidesInPeriod,
  makeUtcDate,
  repeatingRideToDb,
} from "../../../shared/utils";
import { RIDER_LIMIT_OPTIONS } from "../../constants";
import { type Preferences } from "../../types";
import { Button } from "../Button";
import { CancelButton } from "../Button/CancelButton";
import { ConfirmWithContent } from "../ConfirmWithContent";
import Editor from "../Markdown/Editor";
import { rideFormSchema, type RideFormSchema } from "./formSchemas";

const RepeatingRideForm = lazy(() => import("./RepeatingRideForm"));

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
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    getValues,
    formState: { defaultValues, errors },
  } = useForm<RideFormSchema>({
    resolver: zodResolver(rideFormSchema),
    defaultValues: defaults,
  });
  const router = useRouter();
  const isNewRide = !defaultValues?.id;
  const [repeats, setRepeats] = useState<boolean>(isRepeating ?? false);

  // Mutations for single rides
  const createMutation = useCreateRide();
  const updateMutation = useUpdateRide();

  // Mutations for repeating rides
  const createRepeatingMutation = useCreateRepeatingRide();
  const updateRepeatingMutation = useUpdateRepeatingRide();
  const generateMutation = useGenerateRides();

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    createRepeatingMutation.isPending ||
    updateRepeatingMutation.isPending ||
    generateMutation.isPending;
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
    repeats ? "bg-green-600" : "bg-gray-200",
  );
  const toggleClass = clsx(
    "inline-block h-4 w-4 transform rounded-full bg-white transition",
    repeats ? "translate-x-6" : "translate-x-1",
  );
  const handleRepeatsChange = () => setRepeats(!repeats);

  const handleNotesChange = (text: string) => {
    setValue("notes", text);
  };

  const createRide = (data: RideFormSchema) => {
    const rideDate = makeUtcDate(data.rideDate, data.time);

    const rideData = {
      name: data.name,
      rideDate,
      distance: Number(data.distance),
      rideGroup: data.rideGroup || undefined,
      destination: data.destination || undefined,
      meetPoint: data.meetPoint || undefined,
      route: data.route || undefined,
      leader: data.leader || undefined,
      notes: data.notes || undefined,
      rideLimit: data.rideLimit ? Number(data.rideLimit) : -1,
    };

    if (data.id) {
      updateMutation.mutate(
        { id: data.id, data: rideData },
        {
          onSuccess: () => {
            toast.success("Ride updated successfully");
            router.history.back();
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update ride");
          },
        },
      );
    } else {
      createMutation.mutate(rideData, {
        onSuccess: () => {
          toast.success("Ride created successfully");
          router.history.back();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create ride");
        },
      });
    }
  };

  const createRepeating = (data: RideFormSchema) => {
    const payload = makeRepeatingRide(data);

    if (data.id) {
      // Update existing repeating ride
      updateRepeatingMutation.mutate(
        { ...payload, id: data.id },
        {
          onSuccess: () => {
            toast.success("Repeating ride updated successfully");
            router.history.back();
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update repeating ride");
          },
        },
      );
    } else {
      // Create new repeating ride
      createRepeatingMutation.mutate(payload, {
        onSuccess: (results) => {
          // Store schedule id to use in handleYes function
          setScheduleId(results.id);
          // Calculate rides list and ask to create them
          const rideList = makeRidesInPeriod(
            repeatingRideToDb(payload),
            data.startDate,
          );
          const rideDates = rideList.rides.map(({ rideDate }) =>
            formatDate(rideDate),
          );
          if (rideDates.length > 0) {
            setRideDateList(rideDates);
            show();
          }
          toast.success("Repeating ride created successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create repeating ride");
        },
      });
    }
  };

  const handleNo = () => {
    hide();
    void router.navigate({ to: "/" });
  };

  const handleYes = (cb: (flag: boolean) => void) => {
    hide();

    if (scheduleId) {
      const date = getValues("rideDate");
      generateMutation.mutate(
        { scheduleId, date },
        {
          onSuccess: (results) => {
            const count = results.results?.[0]?.count ?? 0;
            toast.success(`Generated ${count} rides`);
            void router.navigate({ to: "/" });
            cb(true);
          },
          onError: () => {
            toast.error("Failed to generate rides");
            cb(false);
          },
        },
      );
    }
  };

  return (
    <>
      <form
        className="relative mb-4 grid w-full grid-cols-1 gap-4 p-2 text-neutral-800"
        onSubmit={
          repeats ? handleSubmit(createRepeating) : handleSubmit(createRide)
        }
      >
        <div className="flex flex-col gap-4 md:gap-8">
          <label htmlFor="name" className="flex flex-col gap-1">
            Ride name *
            <input
              id="name"
              type="text"
              className="input w-full"
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
                className="input w-full"
                {...register("rideGroup")}
              />
            </label>
          </div>
          <div className="flex flex-col gap-4 md:gap-8">
            <label htmlFor="rideLimit" className="flex flex-col gap-1">
              Rider limit
              <select
                id="rideLimit"
                className="input w-full"
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
                className="input w-full"
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
                className="input w-full"
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
              className="input w-full"
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
              className="input w-full"
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
              className="input w-full"
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
              className="input w-full"
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
              className="input w-full"
              {...register("leader")}
            />
          </label>
        </div>

        <div className="flex flex-col">
          <label className="flex flex-col">Notes</label>
          <Editor
            initialValue={defaultValues?.notes}
            onChange={handleNotesChange}
          />
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
              <button
                type="button"
                role="switch"
                aria-checked={repeats}
                onClick={handleRepeatsChange}
                className={switchClass}
              >
                <span className="sr-only">Toggle repeating</span>
                <span className={toggleClass} />
              </button>
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
