import { getRides } from "@/server/actions/get-rides";
import { getServerAuthSession } from "@/server/auth";
import { getQueryDateRange } from "@utils/dates";
import { FilteredRides } from "./FilteredRides";

type Props = {
  date?: string;
}

export const RidesList = async ({ date }: Props) => {
  const session = await getServerAuthSession();
  const user = session?.user;
  // Get date range for supplied date, or all rides from today
  const { start, end } = getQueryDateRange({ start: date, end: date });
  const { rides, error } = await getRides(start, end);

  if (error) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center p-8 pt-32 text-2xl">
          Error loading rides
        </div>
      </div>
    );
  }

  return (
    <FilteredRides rides={rides} user={user} />
  );
}


// TODO: Investigate infinite scroll
/*
import InfiniteScroll from "react-infinite-scroll-component";

<InfiniteScroll
  dataLength={this.state.items.length}
  next={this.fetchMoreData}
  hasMore={true}
  loader={<h4>Loading...</h4>}
>
  {this.state.items.map((i, index) => (
    <div style={style} key={index}>
      div - #{index}
    </div>
  ))}
</InfiniteScroll>
*/