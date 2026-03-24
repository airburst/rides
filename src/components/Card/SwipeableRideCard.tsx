import { useJoinRide, useLeaveRide } from "@/hooks/rides";
import { type RideList, type User } from "@/types";
import { Link } from "@tanstack/react-router";
import { UserMinus, UserPlus } from "lucide-react";
import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { RideCard } from "./RideCard";

// Threshold: how far left (as fraction of card width) to trigger on release
const TRIGGER_FRACTION = 0.25;

// Clean snap — used after triggering an action
const SNAP = { type: "spring" as const, stiffness: 500, damping: 50 };
// Momentum spring — carries drag velocity through (open/close)
const SPRING = { type: "spring" as const, stiffness: 400, damping: 40 };

type Props = {
  ride: RideList;
  user?: User;
};

export const SwipeableRideCard = ({ ride, user }: Props) => {
  const { mutate: joinRide } = useJoinRide();
  const { mutate: leaveRide } = useLeaveRide();

  const x = useMotionValue(0);
  const hasDragged = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftConstraint, setLeftConstraint] = useState(-300);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setLeftConstraint(-(containerRef.current.offsetWidth * 0.65));
    }
  }, []);

  const riderIds = ride.users?.map((u) => u.userId) ?? [];
  const isGoing = user ? riderIds.includes(user.id) : false;

  const isCancelled = ride.cancelled ?? false;
  const riderCount = ride.users?.length ?? 0;
  const isFull =
    !isGoing &&
    !!ride.rideLimit &&
    ride.rideLimit > -1 &&
    riderCount >= ride.rideLimit;

  const canSwipe = !!user && !isCancelled && !isFull;

  // Non-swipeable: anonymous users, cancelled rides, full rides (not going)
  if (!canSwipe) {
    return (
      <Link
        to="/ride/$id"
        params={{ id: ride.id! }}
        id={ride.id}
        className="w-full scroll-mt-32 md:scroll-mt-36"
      >
        <RideCard ride={ride} user={user} />
      </Link>
    );
  }

  const doAction = () => {
    if (isGoing) {
      leaveRide({ rideId: ride.id! });
    } else {
      joinRide({ rideId: ride.id! });
    }
    void animate(x, 0, SNAP);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const cardWidth = containerRef.current?.offsetWidth ?? 300;
    const threshold = cardWidth * TRIGGER_FRACTION;
    const currentX = x.get();

    if (currentX < -threshold) {
      // Released past 25% — trigger action and snap back
      doAction();
    } else {
      // Released before threshold — snap back, no action
      void animate(x, 0, { ...SPRING, velocity: info.velocity.x });
    }

    setTimeout(() => {
      hasDragged.current = false;
    }, 50);
  };

  return (
    // bg-white kills halo on small devices; shadow-md on the container (not BasicCard)
    // since overflow-hidden clips children's shadows but not the element's own.
    <div
      ref={containerRef}
      id={ride.id}
      className="relative w-full overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg scroll-mt-32 md:scroll-mt-36"
    >
      {/* Action background — right-anchored, width = max drag extent */}
      <div
        className={`absolute inset-y-0 right-0 flex items-center justify-end rounded-l-lg pr-6 ${
          isGoing ? "bg-green-700" : "bg-red-700"
        }`}
        style={{ width: -leftConstraint }}
      >
        <div className="flex flex-col items-center gap-1">
          {isGoing ? (
            <UserMinus className="text-white" size={22} />
          ) : (
            <UserPlus className="text-white" size={22} />
          )}
          <span className="text-xs font-bold uppercase tracking-wide text-white">
            {isGoing ? "Leave" : "Join"}
          </span>
        </div>
      </div>

      {/* Draggable card — slides left to reveal action behind it */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: leftConstraint, right: 0 }}
        dragElastic={{ left: 0.1, right: 0.05 }}
        dragMomentum={false}
        onDragStart={() => {
          hasDragged.current = true;
        }}
        onDragEnd={handleDragEnd}
        className="w-full"
      >
        <Link
          to="/ride/$id"
          params={{ id: ride.id! }}
          className="w-full scroll-mt-32 md:scroll-mt-36"
          onClick={(e) => {
            if (hasDragged.current) {
              e.preventDefault();
            }
          }}
        >
          <RideCard ride={ride} user={user} />
        </Link>
      </motion.div>
    </div>
  );
};
