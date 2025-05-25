import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Ability } from '../models/abilities.zod';
import { AbilityManual } from '../context/AbilityManualsContext.tsx';

// Helper function to create a formatted ability table for PDF
const formatAbilitiesTable = (doc: jsPDF, abilities: Ability[]) => {
  const tableColumns = [
    { header: 'Name', dataKey: 'abilityName' },
    { header: 'CP', dataKey: 'abilityCp' },
    { header: 'Discipline', dataKey: 'abilityDiscipline' },
    { header: 'Level', dataKey: 'abilityLevel' },
    { header: 'Type', dataKey: 'abilityType' },
  ];

  const tableRows = abilities.map(ability => ({
    abilityName: ability.abilityName || '',
    abilityCp: ability.abilityCp || '',
    abilityDiscipline: ability.abilityDiscipline || '',
    abilityLevel: ability.abilityLevel || '',
    abilityType: ability.abilityType || '',
  }));

  autoTable(doc, {
    columns: tableColumns,
    body: tableRows,
    startY: doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : 40,
    margin: { top: 10 },
    styles: { cellPadding: 2, fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 20 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 },
      4: { cellWidth: 60 },
    },
  });
};

// Function to add ability details to PDF
const addAbilityDetails = (doc: jsPDF, ability: Ability) => {
  doc.addPage();

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(ability.abilityName || 'Ability', 14, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${ability.abilityLevel} - ${ability.abilityDiscipline}`, 14, 30);

  const detailsY = 40;
  const lineHeight = 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CP Cost:', 14, detailsY);
  doc.setFont('helvetica', 'normal');
  doc.text(String(ability.abilityCp || ''), 50, detailsY);

  doc.setFont('helvetica', 'bold');
  doc.text('Type:', 14, detailsY + lineHeight);
  doc.setFont('helvetica', 'normal');
  doc.text(String(ability.abilityType || ''), 50, detailsY + lineHeight);

  // Description with text wrapping
  doc.setFont('helvetica', 'bold');
  doc.text('Description:', 14, detailsY + lineHeight * 3);
  doc.setFont('helvetica', 'normal');

  const splitDescription = doc.splitTextToSize(String(ability.abilityDescription || ''), 180);
  doc.text(splitDescription, 14, detailsY + lineHeight * 4);
};

// Export all filtered abilities to PDF
export const exportAbilitiesToPDF = (abilities: Ability[]) => {
  if (!abilities.length) return;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SAGA Abilities', 14, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total: ${abilities.length} abilities`, 14, 30);

  // Summary table
  formatAbilitiesTable(doc, abilities);

  // Detailed ability descriptions on separate pages
  abilities.forEach((ability, index) => {
    addAbilityDetails(doc, ability);

    // Add page number at the bottom of each detail page
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${index + 2} of ${abilities.length + 1}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);

    // Add ability name as header
    doc.text('SAGA Abilities', 14, 10);
  });

  // Save the PDF
  doc.save('saga-abilities.pdf');
};

// Add page header and footer
// Helper function for adding headers and footers to PDF pages (currently unused but kept for future use)
// @ts-expect-error - This function is not currently used but kept for future use
const addHeaderAndFooter = (doc: jsPDF, pageInfo: { pageNumber: number, pageCount: number }, title: string) => {
  // Header
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(title, 14, 10);

  // Footer with page numbers
  doc.setFontSize(8);
  doc.text(`Page ${pageInfo.pageNumber} of ${pageInfo.pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);

  // Current date
  const today = new Date();
  const dateStr = today.toLocaleDateString();
  doc.text(dateStr, 14, doc.internal.pageSize.height - 10);
};

// Add a cover page for the AbilityManual
const addAbilityManualCoverPage = (doc: jsPDF, abilityManual: AbilityManual) => {
  // Center point
  const pageWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  const titleWidth = doc.getTextWidth(abilityManual.name);
  doc.text(abilityManual.name, (pageWidth - titleWidth) / 2, 80);

  // Subtitle - Character
  doc.setFontSize(20);
  doc.setFont('helvetica', 'normal');
  const characterText = `Character: ${abilityManual.character}`;
  const characterWidth = doc.getTextWidth(characterText);
  doc.text(characterText, (pageWidth - characterWidth) / 2, 100);

  // Description
  if (abilityManual.description) {
    doc.setFontSize(12);
    const splitDescription = doc.splitTextToSize(abilityManual.description, 160);
    doc.text(splitDescription, (pageWidth - 160) / 2, 120);
  }

  // Ability count
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const abilityCountText = `Contains ${abilityManual.abilities.length} abilities`;
  const abilityCountWidth = doc.getTextWidth(abilityCountText);
  doc.text(abilityCountText, (pageWidth - abilityCountWidth) / 2, 160);

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  const dateText = `Generated on ${new Date().toLocaleDateString()}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, (pageWidth - dateWidth) / 2, 180);
};

// Create a table of contents for the AbilityManual
const addTableOfContents = (doc: jsPDF, abilities: Ability[]) => {
  doc.addPage();

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Create TOC entries
  let yPos = 40;
  const lineHeight = 7;

  abilities.forEach((ability, index) => {
    // Add a new page if needed
    if (yPos > doc.internal.pageSize.height - 20) {
      doc.addPage();
      yPos = 20;
    }

    const pageNum = index + 3; // Cover page + TOC + index
    doc.text(ability.abilityName, 14, yPos);

    // Add dots between name and page number
    const nameWidth = doc.getTextWidth(ability.abilityName);
    const pageNumWidth = doc.getTextWidth(String(pageNum));
    const dotsWidth = doc.internal.pageSize.width - 20 - nameWidth - pageNumWidth;

    let dots = '';
    const dotWidth = doc.getTextWidth('.');
    const numDots = Math.floor(dotsWidth / dotWidth);
    for (let i = 0; i < numDots; i++) {
      dots += '.';
    }

    doc.text(dots, 14 + nameWidth, yPos);
    doc.text(String(pageNum), doc.internal.pageSize.width - 14 - pageNumWidth, yPos);

    yPos += lineHeight;
  });

  return doc;
};

// Export a AbilityManual to PDF
export const exportAbilityManualToPDF = (abilityManual: AbilityManual) => {
  if (!abilityManual) return;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Add cover page
  addAbilityManualCoverPage(doc, abilityManual);

  // Add table of contents
  addTableOfContents(doc, abilityManual.abilities);

  // Add summary page
  doc.addPage();

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Abilities Summary', 14, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total: ${abilityManual.abilities.length} abilities`, 14, 30);

  // Summary table
  formatAbilitiesTable(doc, abilityManual.abilities);
  // Detailed ability descriptions on separate pages
  abilityManual.abilities.forEach((ability: Ability) => {
    addAbilityDetails(doc, ability);
  });

  // Add page numbers to all pages (except cover)
  const pageCount = doc.internal.pages.length - 1;

  // Loop through each page to add headers and footers
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);

    // Header
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(abilityManual.name, 14, 10);

    // Footer
    doc.setFontSize(8);
    doc.text(`Page ${i - 1} of ${pageCount - 1}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);

    // Current date
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    doc.text(dateStr, 14, doc.internal.pageSize.height - 10);
  }
  // Save the PDF
  doc.save(`${abilityManual.name ? abilityManual.name.toLowerCase().replace(/\s+/g, '-') : 'ability-manual'}.pdf`);
};
