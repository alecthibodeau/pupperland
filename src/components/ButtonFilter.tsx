/* Interfaces */
import ButtonFilterProps from '../interfaces/ButtonFilterProps';

/* Constants */
import stringValues from '../constants/string-values';
import svgPaths from '../constants/svg-paths';

function ButtonFilter(props: ButtonFilterProps): React.JSX.Element {
  const { hexColors: { colorApplicationLight } } = stringValues;
  return (
    <button
      onClick={() => props.onClickButton(props.label)}
      className="button-filter"
    >
      <label>
        {props.label}
      </label>
      <svg
        aria-labelledby="closing x icon"
        width="10"
        height="10"
        viewBox="0 0 420 420"
        xmlns="http://www.w3.org/2000/svg"
        fill={colorApplicationLight}
      >
        <polygon points={svgPaths.closingX} />
      </svg>
    </button>
  );
}

export default ButtonFilter;
