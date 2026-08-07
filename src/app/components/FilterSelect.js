"use client";
import Select from "react-select";

export default function FilterSelect({
  filter,
  options,
  value,
  onChange,
  error,
  ...props
}) {
  const selectOptions = options.map((item) =>
    typeof item === "object"
      ? { value: item.value, label: item.label }
      : { value: item, label: item },
  );

  return (
    <>
      {error && (
        <span className="text-[10px] font-bold text-red-500 mt-1 animate-pulse">
          * {error}
        </span>
      )}
      <label className="w-full text-black">Pilih {filter} : </label>
      <Select
        options={selectOptions}
        onChange={(e) => onChange(e.value)}
        placeholder={`Pilih ${filter}...`}
        isSearchable
        className="w-full "
        value={selectOptions.find((opt) => opt.value == value) || null}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#E3F2FD" : "#fff", // orange-50
            borderColor: error
              ? "#2196F3"
              : state.isFocused
                ? "#2196F3"
                : "#d1d5db", 
            borderWidth: "2px",
            borderRadius: "0.5rem",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#2196F3", // orange-600
            },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#2196F3" // orange-400
              : state.isFocused
                ? "#E3F2FD" // orange-50
                : "#fff",
            color: state.isSelected ? "#fff" : "#001f3d", // white / gray-900
            cursor: "pointer",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#9ca3af", // gray-400
          }),
        }}
      />
    </>
  );
}
