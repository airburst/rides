type Props = {
  day: string;
};

export const Heading = ({ day }: Props) => (
  <div className="justify-center flex w-full bg-white p-2 md:tracking-wider text-neutral-700">
    {day}
  </div>
);

export const HeadingGroup = () => (
  <>
    <Heading day="SUN" />
    <Heading day="MON" />
    <Heading day="TUE" />
    <Heading day="WED" />
    <Heading day="THU" />
    <Heading day="FRI" />
    <Heading day="SAT" />
  </>
);
