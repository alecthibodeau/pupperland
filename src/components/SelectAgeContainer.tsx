/* Interfaces */
import SelectAgeContainerProps from '../interfaces/SelectAgeContainerProps';

/* Helpers */
import formatText from '../helpers/format-text';

/* Constants */
import stringValues from '../constants/string-values';

function SelectAgeContainer(props: SelectAgeContainerProps): React.JSX.Element {
  const { formatLettersAndNumbers } = formatText;
  const { texts: { textMaximum, textMinimum } } = stringValues;

  function renderSelectOption(optionLabel: string, index: number): React.JSX.Element {
    return (
      <option
        key={`${index}Option${formatLettersAndNumbers(optionLabel)}`}
        value={optionLabel}>
        {optionLabel}
      </option>
    );
  }

  function onChangeAge(age: string, parameter: string): void {
    if (parameter === textMinimum) {
      props.onUpdateMinimumAge(age);
    } else if (parameter === textMaximum) {
      props.onUpdateMaximumAge(age);
    }
  }

  function handleChangeOption(event: React.ChangeEvent<HTMLSelectElement>): void {
    if (event.target.value) onChangeAge(event.target.value, props.label);
  }

  return (
    <div className="select-age-container">
      <select
        id={`${props.label}AgeSelect`}
        onChange={handleChangeOption}
        className="search-select age-select"
      >
        <option value=""></option>
        {props.options.map(renderSelectOption)}
      </select>
      <label htmlFor={`${props.label}AgeSelect`}>
        <span>{props.label}</span> <span>age in years</span>
      </label>
    </div>
  );
}

export default SelectAgeContainer;
