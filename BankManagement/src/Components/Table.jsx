import React from "react";
import PropTypes from "prop-types";
import { Table, Spin } from "antd";

/**
 * ReusableTable Component
 *
 * A flexible and reusable table component built with Ant Design's Table.
 * It supports dynamic columns, pagination, loading states, and custom row keys.
 *
 * @param {Array} columns - Defines the table's columns.
 * @param {Array} dataSource - Data to be displayed in the table.
 * @param {Boolean} loading - Controls the loading spinner state.
 * @param {Object} pagination - Defines pagination settings (default: 5 items per page).
 * @param {String} rowKey - Defines a unique key for each row (default: "id").
 */
const ReusableTable = ({
  columns,
  dataSource,
  loading = false,
  pagination = { pageSize: 5 },
  rowKey = "id",
}) => {
  return (
    <div style={{ overflowX: "auto" }}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={rowKey}
          pagination={pagination}
          bordered
        />
      )}
    </div>
  );
};

// ✅ PropTypes for type safety
ReusableTable.propTypes = {
  columns: PropTypes.array.isRequired, // Table column definitions
  dataSource: PropTypes.array.isRequired, // Table data
  loading: PropTypes.bool, // Loading state
  pagination: PropTypes.object, // Pagination options
  rowKey: PropTypes.string, // Unique key for each row
};

export default ReusableTable;
