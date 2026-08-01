import axiosInstance from "./axiosInstance";

const REPORT_ENDPOINTS = {
  revenue: "/reports/revenue/",
  sales: "/reports/sales/",
  customers: "/reports/customers/",
  lead_source: "/reports/lead-source/",
  employee_performance: "/reports/employee-performance/",
};

export const downloadReport = async (reportKey, format, filenameHint) => {
  const response = await axiosInstance.get(REPORT_ENDPOINTS[reportKey], {
    params: { format },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filenameHint}.${format === "xlsx" ? "xlsx" : format}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};