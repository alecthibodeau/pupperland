interface SelectAgeContainerProps {
  label: string;
  options: string[];
  onUpdateMaximumAge: (maximumAge: string) => void;
  onUpdateMinimumAge: (minimumAge: string) => void;
}

export default SelectAgeContainerProps;
