"use client";

import Snowfall from "react-snowfall";

export default function Snow() {
  return (
    <Snowfall snowflakeCount={100} color="white" style={{ zIndex: 1000 }} />
  );
}
