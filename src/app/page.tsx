import { MainContent, RideGroup } from "@/components";
import { getRides } from "@/server/db/queries/getRides";
import { type Preferences, type Role } from "@/types";
import { formatDate, getQueryDateRange } from "@utils/dates";
import { groupRides } from "@utils/transformRideData";

export const dynamic = "force-dynamic"; // Always revalidate

const MOCK_USER = {
  "id": "e0f7a8ce-8f75-44f8-9bec-8864c8fe42b2",
  "name": "Mark Fairhurst",
  "email": "mark1@gmail.com",
  "image": "https://gravatar.com/avatar/c8776163654aa56a6819781cad028020?size=40",
  "mobile": "07770 123456",
  "emergency": "Partner 07770 987654",
  "role": "ADMIN" as Role,
  "preferences": { "units": "km" } as Preferences
}

const { start, end } = getQueryDateRange({});

export default async function HomePage() {
  const { rides, error } = await getRides(start, end);

  if (error) {
    return (
      <MainContent>
        <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
          <div className="flex h-full items-center p-8 pt-32 text-2xl">
            Error loading rides
          </div>
        </div>
      </MainContent>
    );
  }

  const groupedRides = groupRides(rides, undefined, MOCK_USER);
  const ridesFound = groupedRides.length > 0;

  return (
    <MainContent>
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        {ridesFound ? (
          <>
            {groupedRides.map((group) => (
              <RideGroup
                key={Object.keys(group)[0]}
                group={group}
                user={MOCK_USER}
              />
            ))}
          </>
        ) : (
          <div className="flex h-full items-center p-8 pt-32 text-2xl">
            No planned rides before {formatDate(end)}
          </div>
        )}
      </div>
    </MainContent>
  );
}

/*
      <Head>
        <title>{`${NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`}</title>
        <meta
          name="description"
          content={`${NEXT_PUBLIC_CLUB_LONG_NAME} Ride Planner`}
        />
      </Head>

      <Filters
        data={makeFilterData(data)}
        isShowing={showFilterMenu}
        closeHandler={closeFilters}
      />
    </>
  );
  */