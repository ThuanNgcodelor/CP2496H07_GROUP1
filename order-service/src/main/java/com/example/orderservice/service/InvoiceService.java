package com.example.orderservice.service;

import com.example.orderservice.model.PayoutBatch;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class InvoiceService {

    public byte[] generatePayoutInvoice(PayoutBatch payout) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Invoice");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 14);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Create Title
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("PAYOUT INVOICE");
            titleCell.setCellStyle(headerStyle);
            sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 1));

            // Data Style
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);

            int rowIdx = 2;

            // Transaction ID
            createRow(sheet, rowIdx++, "Transaction Ref:", payout.getTransactionRef(), dataStyle);

            // Date
            String dateStr = payout.getCreatedAt() != null
                    ? payout.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                    : "N/A";
            createRow(sheet, rowIdx++, "Date:", dateStr, dataStyle);

            // Amount
            createRow(sheet, rowIdx++, "Amount:", payout.getAmount().toString() + " VND", dataStyle);

            // Status
            createRow(sheet, rowIdx++, "Status:", payout.getStatus().toString(), dataStyle);

            // Bank Info
            createRow(sheet, rowIdx++, "Bank Name:", payout.getBankName(), dataStyle);
            createRow(sheet, rowIdx++, "Account Number:", payout.getBankAccountNumber(), dataStyle);
            createRow(sheet, rowIdx++, "Account Holder:", payout.getAccountHolderName(), dataStyle);

            // Description
            createRow(sheet, rowIdx++, "Description:", payout.getDescription() != null ? payout.getDescription() : "",
                    dataStyle);

            // Auto-size columns
            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] generatePayoutHistoryReport(java.util.List<PayoutBatch> payouts) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Payout History");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setBorderBottom(BorderStyle.MEDIUM);

            // Create Header Row
            Row headerRow = sheet.createRow(0);
            String[] columns = { "Date", "Transaction Ref", "Amount", "Status", "Bank", "Account Number",
                    "Description" };
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data Style
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);

            int rowIdx = 1;

            for (PayoutBatch payout : payouts) {
                Row row = sheet.createRow(rowIdx++);

                // Date
                String dateStr = payout.getCreatedAt() != null
                        ? payout.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                        : "";
                row.createCell(0).setCellValue(dateStr);

                // Ref
                row.createCell(1).setCellValue(payout.getTransactionRef());

                // Amount
                row.createCell(2).setCellValue(payout.getAmount().doubleValue());

                // Status
                row.createCell(3).setCellValue(payout.getStatus().name());

                // Bank
                row.createCell(4).setCellValue(payout.getBankName());

                // Account
                row.createCell(5).setCellValue(payout.getBankAccountNumber());

                // Description
                row.createCell(6).setCellValue(payout.getDescription() != null ? payout.getDescription() : "");
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void createRow(Sheet sheet, int rowIdx, String label, String value, CellStyle style) {
        Row row = sheet.createRow(rowIdx);
        Cell cellLabel = row.createCell(0);
        cellLabel.setCellValue(label);
        cellLabel.setCellStyle(style);

        Cell cellValue = row.createCell(1);
        cellValue.setCellValue(value);
        cellValue.setCellStyle(style);
    }
}
