import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';

/**
 * Generate a professional certificate PDF with QR code
 * @param {Object} certificateData - Certificate data including student, issuer, and certificate details
 * @returns {Promise<jsPDF>} - PDF document
 */
export const generateCertificatePDF = async (certificateData) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const { certificate, student, issuer } = certificateData;

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add decorative border
  doc.setLineWidth(3);
  doc.setDrawColor(102, 126, 234); // Primary color
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  doc.setLineWidth(1);
  doc.setDrawColor(118, 75, 162); // Secondary color
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Header
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('CERTIFICATE OF ACHIEVEMENT', pageWidth / 2, 35, { align: 'center' });

  // Decorative line
  doc.setLineWidth(0.5);
  doc.setDrawColor(102, 126, 234);
  doc.line(50, 42, pageWidth - 50, 42);

  // This certifies that
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('This is to certify that', pageWidth / 2, 55, { align: 'center' });

  // Student Name
  doc.setFontSize(28);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(student?.name || 'Student Name', pageWidth / 2, 68, { align: 'center' });

  // Decorative line under name
  const nameLineY = 72;
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(80, nameLineY, pageWidth - 80, nameLineY);

  // Has successfully completed
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('has successfully completed the course', pageWidth / 2, 85, { align: 'center' });

  // Course Name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(118, 75, 162);
  doc.text(certificate?.courseName || 'Course Name', pageWidth / 2, 98, { align: 'center' });

  // Grade Box
  if (certificate?.grade) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text(`Grade: ${certificate.grade}`, pageWidth / 2, 110, { align: 'center' });
  }

  // Certificate Details Section
  const detailsY = 125;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);

  // Left column - Issue details
  const leftX = 40;
  doc.text('Issue Date:', leftX, detailsY);
  doc.setFont('helvetica', 'bold');
  doc.text(
    certificate?.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 'N/A',
    leftX,
    detailsY + 5
  );

  doc.setFont('helvetica', 'normal');
  doc.text('Certificate ID:', leftX, detailsY + 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(certificate?.id?.substring(0, 24) || 'N/A', leftX, detailsY + 20);

  // Right column - Issuer details
  const rightX = pageWidth - 100;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Issued By:', rightX, detailsY);
  doc.setFont('helvetica', 'bold');
  doc.text(issuer?.name || 'Institution Name', rightX, detailsY + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(issuer?.email || '', rightX, detailsY + 10);

  // Blockchain verification section
  const blockchainY = 155;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('🔗 BLOCKCHAIN VERIFIED', pageWidth / 2, blockchainY, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  
  if (certificate?.transactionHash) {
    doc.text(`Transaction: ${certificate.transactionHash.substring(0, 40)}...`, pageWidth / 2, blockchainY + 5, { align: 'center' });
  }
  
  if (certificate?.certificateHash) {
    doc.text(`Certificate Hash: ${certificate.certificateHash.substring(0, 40)}...`, pageWidth / 2, blockchainY + 10, { align: 'center' });
  }

  // Generate QR Code for verification
  if (certificate?.id) {
    try {
      // Create verification URL - this will link to the verify page
      const verifyUrl = `${window.location.origin}/verify?id=${certificate.id}`;
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 256,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Add QR code to PDF (bottom left corner)
      const qrSize = 25;
      const qrX = 20;
      const qrY = pageHeight - 35;
      
      doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      
      // Add "Scan to verify" text
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text('Scan to verify', qrX + qrSize / 2, qrY + qrSize + 3, { align: 'center' });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  // Footer
  const footerY = pageHeight - 25;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('This certificate is cryptographically secured and can be verified on the blockchain', pageWidth / 2, footerY, { align: 'center' });
  doc.text('FARO Certificate Registry - Powered by Polygon Blockchain', pageWidth / 2, footerY + 4, { align: 'center' });

  return doc;
};

/**
 * View PDF in a new window/tab
 * @param {Object} certificateData - Certificate data
 */
export const viewCertificatePDF = async (certificateData) => {
  const doc = await generateCertificatePDF(certificateData);
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
  
  // Clean up after a delay
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
};

/**
 * Download PDF to user's computer
 * @param {Object} certificateData - Certificate data
 */
export const downloadCertificatePDF = async (certificateData) => {
  const doc = await generateCertificatePDF(certificateData);
  const fileName = `certificate-${certificateData.student?.name?.replace(/\s+/g, '-') || 'unknown'}-${Date.now()}.pdf`;
  doc.save(fileName);
};
