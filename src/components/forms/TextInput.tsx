type Props = {
  id: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  error?: boolean;
  mandatory?: boolean;
  disabled?: boolean;
};

export const TextInput = ({ id, label, placeholder, defaultValue, error, mandatory, disabled }: Props) => (
  <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
    <label htmlFor="name" className="flex flex-col gap-1">
      {label} {mandatory && "*"}
      <input
        id={id}
        type="text"
        className="input"
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && (
        <span className="font-normal text-red-500">
          Rider name is required
        </span>
      )}
    </label>
  </div>
)