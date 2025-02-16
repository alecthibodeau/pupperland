/* Interfaces */
import FilterButtonProps from '../interfaces/FilterButton';

/* Constants */
import svgPaths from '../constants/svg-paths';

function FilterButton(props: FilterButtonProps): React.JSX.Element {
  return (
    <button
      onClick={() => props.onClickButton(props.label)}
      className="button-filter"
    >
      <label>
        {props.label}
      </label>
      <svg
        aria-labelledby="click to remove filter"
        width="10"
        height="10"
        viewBox="0 0 420 420"
        xmlns="http://www.w3.org/2000/svg"
        fill="#f5f5f5"
      >
        <polygon points={svgPaths.closingX} />
      </svg>
    </button>
  );
}

export default FilterButton;
