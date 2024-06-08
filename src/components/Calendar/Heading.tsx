type Props = {
  day: string;
};

export const Heading = ({ day }: Props) => (
  <div className="items-self-center flex w-full bg-primary p-2 font-bold tracking-wider text-primary-content">
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
