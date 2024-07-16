export type RideWithGpsMapProps = {
  url?: string | null
  units?: "km" | "miles";
};

const RideWithGpsMap = ({ url, units = "km" }: RideWithGpsMapProps) => {
  const isRideWithGps = url?.includes("ridewithgps.com");

  if (!url || !isRideWithGps) {
    return null;
  }

  const routeId = url.split("/").pop();
  console.log("🚀 ~ RideWithGpsMap ~ routeId:", routeId)
  const isMetric = units === "km";

  const mapSource = `https://ridewithgps.com/embeds?type=route&id=${routeId}&metricUnits=${isMetric}&sampleGraph=true`;

  return (
    <iframe
      className="h-96 md:h-[700px] rounded-lg shadow-md"
      title="route"
      src={mapSource}
    />
  );
}

export default RideWithGpsMap;