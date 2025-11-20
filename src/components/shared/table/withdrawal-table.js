import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useRtlDirection } from "../../../helpers/hooks/use-rtl-direction";
import WithdrawalTableMobile from "../../pages-content/funding-page-content/withdrawal-table-mobile";

const WithdrawalTableComponent = ({
  className,
  data,
  columns,
  isMobile = false,
  isDeposit = true,
}) => {
  const isRTL = useRtlDirection();

  // Mobile Card Layout - Use new mobile component
  if (isMobile) {
    return <WithdrawalTableMobile data={data} isDeposit={isDeposit} />;
  }

  // Desktop Table Layout - Use spreads-table structure
  return (
    <div
      className={cn("withdrawal-table", className, {
        "withdrawal-table--rtl": isRTL,
      })}
    >
      <div className="withdrawal-table-container">
        <table className="withdrawal-table-main">
          {/* Header Section */}
          <thead className="table-header-section">
            {/* Main Header Row */}
            <tr className="table-main-header">
              {columns.map((column, index) => (
                <th key={index} className="table-header-column">
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>
        </table>

        {/* Body Section with Scroll */}
        <div className="table-body-scroll-container">
          <table className="withdrawal-table-body">
            <tbody className="table-body-section">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="table-row">
                  {columns.map((column, colIndex) => {
                    const cellData = row[column.accessor];
                    return (
                      <td key={colIndex} className="table-cell">
                        {cellData}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

WithdrawalTableComponent.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  isMobile: PropTypes.bool,
  isDeposit: PropTypes.bool,
};

export default WithdrawalTableComponent;
