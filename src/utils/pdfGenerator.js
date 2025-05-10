// src/utils/pdfGenerator.js

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF file with tabular data
 * @param {string} filePath - Path where the PDF will be saved
 * @param {Object} options - PDF generation options
 * @param {string} options.title - Title for the PDF
 * @param {Array} options.headers - Array of column headers
 * @param {Array} options.data - Array of data rows
 * @param {Object} options.metadata - PDF metadata
 * @returns {Promise<string>} - Path to the generated PDF
 */
const generateTablePDF = (filePath, options) => {
  return new Promise((resolve, reject) => {
    try {
      const { title, headers, data, metadata = {} } = options;
      
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: metadata.title || title,
          Author: metadata.author || 'Akwa Ibom State Health Data System',
          Subject: metadata.subject || 'Health Data Report',
          Keywords: metadata.keywords || 'health data, report',
          CreationDate: new Date(),
          ...metadata
        }
      });
      
      // Pipe the PDF to the file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      
      // Add title
      doc.fontSize(20).text(title, { align: 'center' });
      doc.moveDown();
      
      // Add timestamp
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);
      
      // Calculate column widths
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const columnWidth = pageWidth / headers.length;
      
      // Add table headers
      doc.fontSize(12);
      let x = doc.page.margins.left;
      let y = doc.y;
      
      // Draw header background
      doc.fillColor('#e0e0e0')
         .rect(x, y, pageWidth, 30)
         .fill();
      
      // Draw header text
      doc.fillColor('#000000');
      headers.forEach((header, i) => {
        doc.text(
          header,
          x + i * columnWidth + 5,
          y + 10,
          { width: columnWidth - 10 }
        );
      });
      
      // Move down after headers
      doc.moveDown();
      y = doc.y;
      
      // Add table rows
      data.forEach((row, rowIndex) => {
        // Check if we need a new page
        if (doc.y + 30 > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
          y = doc.page.margins.top;
          doc.y = y;
        } else {
          y = doc.y;
        }
        
        // Draw row background (alternating)
        if (rowIndex % 2 === 0) {
          doc.fillColor('#f5f5f5')
             .rect(x, y, pageWidth, 30)
             .fill();
        }
        
        // Draw row data
        doc.fillColor('#000000');
        headers.forEach((header, colIndex) => {
          // Get the corresponding property from the row
          // Use the header text to lookup the property (lowercase, spaces to underscores)
          const prop = header.toLowerCase().replace(/\s+/g, '_');
          const cellContent = row[prop] || '';
          
          doc.text(
            String(cellContent),
            x + colIndex * columnWidth + 5,
            y + 10,
            { width: columnWidth - 10 }
          );
        });
        
        // Move down after row
        doc.moveDown();
      });
      
      // Add page numbers
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fontSize(8)
           .text(
             `Page ${i + 1} of ${totalPages}`,
             doc.page.margins.left,
             doc.page.height - doc.page.margins.bottom - 20,
             { align: 'center' }
           );
      }
      
      // Finalize the PDF
      doc.end();
      
      // Handle stream events
      stream.on('finish', () => {
        resolve(filePath);
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate a PDF report with sections
 * @param {string} filePath - Path where the PDF will be saved
 * @param {Object} options - PDF generation options
 * @param {string} options.title - Title for the PDF
 * @param {Array} options.sections - Array of report sections
 * @param {Object} options.metadata - PDF metadata
 * @returns {Promise<string>} - Path to the generated PDF
 */
const generateReportPDF = (filePath, options) => {
  return new Promise((resolve, reject) => {
    try {
      const { title, sections, metadata = {} } = options;
      
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: metadata.title || title,
          Author: metadata.author || 'Akwa Ibom State Health Data System',
          Subject: metadata.subject || 'Health Data Report',
          Keywords: metadata.keywords || 'health data, report',
          CreationDate: new Date(),
          ...metadata
        }
      });
      
      // Pipe the PDF to the file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      
      // Add title
      doc.fontSize(24).text(title, { align: 'center' });
      doc.moveDown();
      
      // Add timestamp
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);
      
      // Add sections
      sections.forEach((section, index) => {
        // Add section title
        doc.fontSize(16).text(section.title);
        doc.moveDown();
        
        // Add section content
        if (section.text) {
          doc.fontSize(12).text(section.text);
          doc.moveDown();
        }
        
        // Add table if present
        if (section.table) {
          const { headers, data } = section.table;
          
          // Calculate column widths
          const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
          const columnWidth = pageWidth / headers.length;
          
          // Add table headers
          doc.fontSize(12);
          let x = doc.page.margins.left;
          let y = doc.y;
          
          // Draw header background
          doc.fillColor('#e0e0e0')
             .rect(x, y, pageWidth, 25)
             .fill();
          
          // Draw header text
          doc.fillColor('#000000');
          headers.forEach((header, i) => {
            doc.text(
              header,
              x + i * columnWidth + 5,
              y + 8,
              { width: columnWidth - 10 }
            );
          });
          
          // Move down after headers
          doc.moveDown();
          y = doc.y;
          
          // Add table rows
          data.forEach((row, rowIndex) => {
            // Check if we need a new page
            if (doc.y + 25 > doc.page.height - doc.page.margins.bottom) {
              doc.addPage();
              y = doc.page.margins.top;
              doc.y = y;
            } else {
              y = doc.y;
            }
            
            // Draw row background (alternating)
            if (rowIndex % 2 === 0) {
              doc.fillColor('#f5f5f5')
                 .rect(x, y, pageWidth, 25)
                 .fill();
            }
            
            // Draw row data
            doc.fillColor('#000000');
            headers.forEach((header, colIndex) => {
              // Get the corresponding property from the row
              const prop = header.toLowerCase().replace(/\s+/g, '_');
              const cellContent = row[prop] || '';
              
              doc.text(
                String(cellContent),
                x + colIndex * columnWidth + 5,
                y + 8,
                { width: columnWidth - 10 }
              );
            });
            
            // Move down after row
            doc.moveDown();
          });
        }
        
        // Add chart image if present
        if (section.chartPath) {
          doc.image(section.chartPath, {
            fit: [500, 300],
            align: 'center',
            valign: 'center'
          });
          doc.moveDown();
        }
        
        // Add page break between sections (except the last one)
        if (index < sections.length - 1) {
          doc.addPage();
        }
      });
      
      // Add page numbers
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fontSize(8)
           .text(
             `Page ${i + 1} of ${totalPages}`,
             doc.page.margins.left,
             doc.page.height - doc.page.margins.bottom - 20,
             { align: 'center' }
           );
      }
      
      // Finalize the PDF
      doc.end();
      
      // Handle stream events
      stream.on('finish', () => {
        resolve(filePath);
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateTablePDF,
  generateReportPDF
};