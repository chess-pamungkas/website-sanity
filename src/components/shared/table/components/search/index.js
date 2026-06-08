import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useAsyncDebounce } from "react-table";
import { useTranslationWithVariables } from "../../../../../helpers/hooks/use-translation-with-vars";
import { SearchIcon } from "../../../icons/SearchIcon";

const TableSearch = ({ globalFilter, setGlobalFilter }) => {
  const { t } = useTranslationWithVariables();

  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <form className="table__searchbar search-bar">
      <SearchIcon className="table__searchbar-icon" />
      <input
        className={cn("search-bar__input")}
        placeholder={t("table-search-placeholder")}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        value={value || ""}
      />
      <button className="search-bar__submit" type="button">
        {t("search-submit-btn")}
      </button>
    </form>
  );
};

TableSearch.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};
export default TableSearch;
