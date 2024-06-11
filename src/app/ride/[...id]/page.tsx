import { BackButton, MainContent, RideDetails } from "@/components";
import { DEFAULT_PREFERENCES } from "@/constants";
import { type Preferences, type Role } from "@/types";

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

const MOCK_RIDE = {
  "id": "clvn65kcf001datn9cfj983ci",
  "name": "Sunday Ride",
  "group": "Double Espresso",
  "destination": null,
  "meetPoint": "Brunel Square",
  "route": null,
  "leader": "TBA",
  "notes": "What to expect on this ride: https://www.bathcc.net/ride/sunday-club-run",
  "limit": -1,
  "deleted": false,
  "cancelled": false,
  "scheduleId": "cll80uadp000gtl3qtmd1kgjl",
  "rideDate": "2024-06-16T08:30:00.000Z",
  "day": "Sunday 16 June",
  "time": "08:30",
  "distance": "110 km",
  "createdAt": "2024-05-04T09:00:00",
  "users": [
    {
      "id": "e0f7a8ce-8f75-44f8-9bec-8864c8fe42b2",
      "name": "Mark Fairhurst",
      "email": "m@m.com",
      "image": "https://gravatar.com/avatar/c8776163654aa56a6819781cad028020?size=40",
      "mobile": "07770 123456",
      "emergency": "Partner 07770 987654",
      "role": "ADMIN" as Role,
      "preferences": DEFAULT_PREFERENCES,
      "rideNotes": "I'll meet you on top of Bannerdown",
    }
  ]
}


export default async function RideDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  // const { rides, error } = await getRide(id);

  // if (loading) {
  //   return <RideDetailsSkeleton />;
  // }

  // if (error) {
  //   return <Error statusCode={500} />;
  // }

  if (!id) {
    return (
      <MainContent>
        <>
          <div className="flex h-64 w-full items-center justify-center text-2xl">
            This ride is no longer available
          </div>
          <div className="flex h-4 flex-row justify-between px-2 pt-8 sm:px-0">
            <BackButton />
          </div>
        </>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <RideDetails ride={MOCK_RIDE} user={MOCK_USER} role={MOCK_USER.role} />
    </MainContent>
  )
};

// <Head>
//   <title>{NEXT_PUBLIC_CLUB_SHORT_NAME} Ride Details</title>
//   <meta
//     name="description"
//     content={`${NEXT_PUBLIC_CLUB_LONG_NAME} Ride Details`}
//   />
// </Head>