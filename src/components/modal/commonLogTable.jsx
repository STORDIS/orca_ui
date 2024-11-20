import React, { useEffect, useState } from "react";
import "./logModel.scss";
import Time from "react-time-format";

const CommonLogTable = ({ logData, showResponse, response }) => {
  const formattedRequestJson = logData?.request_json
    ? Object.entries(logData?.request_json)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n") // Double newlines for extra space between pairs
    : "waiting for process to complete";

  return (
    <table>
      <tbody>
        <tr>
          <td className="w-25">
            <b>State :</b>
          </td>
          <td className="w-75">
            {logData?.status.toUpperCase() === "SUCCESS" ? (
              <span className="success">{logData?.status.toUpperCase()}</span>
            ) : logData?.status.toUpperCase() === "REVOKED" ? (
              <span className="success">{logData?.status.toUpperCase()}</span>
            ) : logData?.status.toUpperCase() === "STARTED" ? (
              <span className="warning">{logData?.status.toUpperCase()}</span>
            ) : logData?.status.toUpperCase() === "PENDING" ? (
              <span className="gray">{logData?.status.toUpperCase()}</span>
            ) : (
              <span className="danger">{logData?.status.toUpperCase()}</span>
            )}
          </td>
        </tr>
        <tr>
          <td className="w-25">
            <b>HTTP Status:</b>
          </td>
          <td className="w-75">{logData?.status_code}</td>
        </tr>
        <tr>
          <td className="w-25">
            <b>HTTP method :</b>
          </td>
          <td className="w-75">{logData?.http_method}</td>
        </tr>

        <tr>
          <td className="w-25">
            <b>Request JSON :</b>
          </td>
          <td className="w-75">
            <pre>{formattedRequestJson}</pre>
          </td>
        </tr>
        {showResponse ? (
          <tr>
            <td className="w-25">
              <b>Response :</b>
            </td>
            <td className="w-75">
              <pre>{JSON.stringify(logData?.response, null, 2)}</pre>
            </td>
          </tr>
        ) : null}

        <tr>
          <td className="w-25">
            <b>Date Time :</b>
          </td>
          <td className="w-75">
            <Time value={logData?.timestamp} format="hh:mm:ss DD-MM-YYYY" />
          </td>
        </tr>
        <tr>
          <td className="w-25">
            <b>Processing Time :</b>
          </td>
          <td className="w-75">
            {parseFloat(logData?.processing_time).toFixed(4)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default CommonLogTable;
