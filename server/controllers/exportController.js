import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import Sale from "../models/Sale.js";
import { buildSaleFilter, asyncHandler } from "../utils/buildFilter.js";

const fetchRows = (req) =>
  Sale.find(buildSaleFilter(req.query, req.user))
    .populate("branch", "name")
    .sort({ date: -1 })
    .limit(5000)
    .lean();

const fmtDate = (d) => new Date(d).toISOString().slice(0, 10);
const stamp = () => new Date().toISOString().slice(0, 10);

// GET /api/export/excel
export const exportExcel = asyncHandler(async (req, res) => {
  const rows = await fetchRows(req);
  const wb = new ExcelJS.Workbook();
  wb.creator = "Admin Dashboard";
  const ws = wb.addWorksheet("Sales Report");

  ws.columns = [
    { header: "Invoice", key: "invoiceNo", width: 18 },
    { header: "Date", key: "date", width: 12 },
    { header: "Branch", key: "branch", width: 16 },
    { header: "Customer", key: "customer", width: 20 },
    { header: "Product", key: "product", width: 22 },
    { header: "Category", key: "category", width: 14 },
    { header: "Qty", key: "quantity", width: 8 },
    { header: "Unit Price", key: "unitPrice", width: 12 },
    { header: "Total", key: "total", width: 14 },
    { header: "Payment", key: "paymentMethod", width: 10 },
    { header: "Status", key: "status", width: 11 },
  ];

  rows.forEach((r) =>
    ws.addRow({ ...r, date: fmtDate(r.date), branch: r.branch?.name || "-" })
  );

  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2A78D6" } };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ["unitPrice", "total"].forEach((k) => (ws.getColumn(k).numFmt = "#,##0.00"));

  const last = ws.rowCount;
  const totalRow = ws.addRow({ customer: "TOTAL", total: { formula: `SUM(I2:I${last})` } });
  totalRow.font = { bold: true };

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="sales-report-${stamp()}.xlsx"`);
  await wb.xlsx.write(res);
  res.end();
});

// GET /api/export/pdf
export const exportPdf = asyncHandler(async (req, res) => {
  const rows = await fetchRows(req);
  const doc = new PDFDocument({ margin: 36, size: "A4", layout: "landscape" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="sales-report-${stamp()}.pdf"`);
  doc.pipe(res);

  const { from, to } = req.query;
  doc.fontSize(18).text("Sales Report", { align: "left" });
  doc.fontSize(10).fillColor("#52514e")
    .text(`Period: ${from || "All"} to ${to || "All"}   |   Generated: ${stamp()}   |   Rows: ${rows.length}`);
  doc.moveDown();

  const cols = [
    ["Invoice", 95], ["Date", 65], ["Branch", 85], ["Customer", 110],
    ["Product", 130], ["Qty", 40], ["Total", 80], ["Payment", 60], ["Status", 65],
  ];
  const startX = doc.page.margins.left;
  let y = doc.y;

  const drawHeader = () => {
    doc.rect(startX, y, cols.reduce((s, c) => s + c[1], 0), 20).fill("#2a78d6");
    let x = startX;
    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
    cols.forEach(([h, w]) => { doc.text(h, x + 4, y + 6, { width: w - 8 }); x += w; });
    y += 20;
    doc.font("Helvetica").fillColor("#0b0b0b");
  };
  drawHeader();

  let grand = 0;
  rows.forEach((r, i) => {
    if (y > doc.page.height - 60) { doc.addPage(); y = doc.page.margins.top; drawHeader(); }
    if (i % 2 === 0) doc.rect(startX, y, 730, 18).fill("#f3f3f1").fillColor("#0b0b0b");
    const vals = [
      r.invoiceNo, fmtDate(r.date), r.branch?.name || "-", r.customer, r.product,
      String(r.quantity), r.total.toLocaleString("en-US"), r.paymentMethod, r.status,
    ];
    let x = startX;
    doc.fontSize(8.5);
    vals.forEach((v, j) => { doc.text(v, x + 4, y + 5, { width: cols[j][1] - 8, ellipsis: true, lineBreak: false }); x += cols[j][1]; });
    if (r.status !== "Refunded") grand += r.total;
    y += 18;
  });

  doc.moveDown(2).font("Helvetica-Bold").fontSize(11)
    .text(`Grand Total (excl. refunds): ${grand.toLocaleString("en-US")} BDT`, startX, y + 10);
  doc.end();
});
