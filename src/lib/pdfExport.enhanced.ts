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
        startY: 40,
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
const addAbilityDetails = (doc: jsPDF, ability: Ability, isSecondAbility = false) => {
    if (!isSecondAbility) {
        doc.addPage();

        // Add a vertical separator line in the middle of the page
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.3);
        doc.line(doc.internal.pageSize.width / 2, 5, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5);
    }

    // Calculate all positioning parameters
    const pageWidth = doc.internal.pageSize.width;
    const halfWidth = pageWidth / 2;
    const margin = 5;
    const padding = 9;

    // Coordinates for the left or right side of the page
    const leftX = margin;
    const rightX = halfWidth + margin;
    const contentWidth = halfWidth - (margin * 2);

    // Select the appropriate side based on isSecondAbility
    const borderX = isSecondAbility ? rightX : leftX;
    const contentX = isSecondAbility ? rightX + padding : leftX + padding;
    const labelX = contentX;
    const valueX = contentX + 36; // Fixed distance between label and value

    // Add a fancy border to the ability area
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);
    doc.rect(borderX, margin, contentWidth, doc.internal.pageSize.height - (margin * 2));

    // Title with background
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(ability.abilityName || 'Ability', contentX, 20);

    // Underline
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(contentX, 22, borderX + contentWidth - padding, 22);

    // Level and discipline
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${ability.abilityLevel} - ${ability.abilityDiscipline}`, contentX, 30);

    // Details section
    const detailsY = 40;
    const lineHeight = 6;
    const boxX = borderX + margin;
    const boxWidth = contentWidth - (margin * 2);

    // Add details background box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.setLineWidth(0.3);
    doc.roundedRect(boxX, 35, boxWidth, lineHeight * 4.5, 3, 3, 'FD');

    // Draw all the ability attributes
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('CP Cost:', labelX, detailsY);
    doc.setFont('helvetica', 'normal');
    doc.text(String(ability.abilityCp || ''), valueX, detailsY);

    doc.setFont('helvetica', 'bold');
    doc.text('Type:', labelX, detailsY + lineHeight);
    doc.setFont('helvetica', 'normal');
    doc.text(String(ability.abilityType || ''), valueX, detailsY + lineHeight);

    // Description section
    doc.setFont('helvetica', 'bold');
    doc.text('Description:', labelX, detailsY + lineHeight * 3);
    doc.setFont('helvetica', 'normal');

    // Add a light background to the description
    const maxDescWidth = boxWidth - (margin * 2);
    const splitDescription = doc.splitTextToSize(String(ability.abilityDescription || ''), maxDescWidth);
    const descriptionHeight = splitDescription.length * 5;

    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(boxX, detailsY + lineHeight * 3.5, boxWidth, descriptionHeight + 5, 2, 2, 'FD');

    doc.text(splitDescription, labelX, detailsY + lineHeight * 4);
};

// Export all filtered abilities to PDF
export const exportAbilitiesToPDF = (abilities: Ability[]) => {
    if (!abilities.length) return;

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    // Add a header with title
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(0, 30, doc.internal.pageSize.width, 30);

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('SAGA Abilities', 14, 20);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total: ${abilities.length} abilities`, 14, 40);

    // Add the current date
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${today}`, doc.internal.pageSize.width - 60, 40);

    // Summary table
    formatAbilitiesTable(doc, abilities);

    // Create table of contents
    doc.addPage();

    // Add TOC header
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(0, 30, doc.internal.pageSize.width, 30);

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Table of Contents', 14, 20);

    // Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Create TOC entries
    let yPos = 40;
    const lineHeight = 7;

    // Add header row
    doc.setFont('helvetica', 'bold');
    doc.text('Ability Name', 14, yPos);
    doc.text('Level', 100, yPos);
    doc.text('Discipline', 140, yPos);
    doc.text('Page', doc.internal.pageSize.width - 25, yPos);

    // Add a line under headers
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(14, yPos + 2, doc.internal.pageSize.width - 14, yPos + 2);

    // Reset to normal text
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight * 2;

    // Create alternating row colors
    let isAlternateRow = false;

    abilities.forEach((ability, index) => {
        // Add a new page if needed
        if (yPos > doc.internal.pageSize.height - 20) {
            doc.addPage();

            // Add continuation header
            doc.setFillColor(240, 240, 240);
            doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');

            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(0, 30, doc.internal.pageSize.width, 30);

            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(60, 60, 60);
            doc.text('Table of Contents (continued)', 14, 20);

            // Reset position and styling
            yPos = 40;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            // Add header row
            doc.setFont('helvetica', 'bold');
            doc.text('Ability Name', 14, yPos);
            doc.text('Level', 100, yPos);
            doc.text('Discipline', 140, yPos);
            doc.text('Page', doc.internal.pageSize.width - 25, yPos);

            // Add a line under headers
            doc.setDrawColor(180, 180, 180);
            doc.setLineWidth(0.3);
            doc.line(14, yPos + 2, doc.internal.pageSize.width - 14, yPos + 2);

            // Reset to normal text
            doc.setFont('helvetica', 'normal');
            yPos += lineHeight * 2;
            isAlternateRow = false;
        }

        // Add alternating row background
        if (isAlternateRow) {
            doc.setFillColor(245, 245, 245);
            doc.rect(14, yPos - 5, doc.internal.pageSize.width - 28, lineHeight, 'F');
        }
        isAlternateRow = !isAlternateRow;

        // Calculate the page number based on two abilities per page
        const pageNum = Math.floor(index / 2) + 3; // Summary page + TOC + index, with 2 abilities per page

        // Ability name
        doc.text(ability.abilityName, 14, yPos);

        // Ability level and discipline
        doc.text(ability.abilityLevel, 100, yPos);
        doc.text(ability.abilityDiscipline, 140, yPos);

        // Page number
        doc.text(String(pageNum), doc.internal.pageSize.width - 25, yPos);

        yPos += lineHeight;
    });

    // Detailed ability descriptions - two abilities per page
    for (let i = 0; i < abilities.length; i += 2) {
        if (i + 1 < abilities.length) {
            // Add two abilities per page when possible
            addAbilityDetails(doc, abilities[i], false);
            addAbilityDetails(doc, abilities[i + 1], true);
        } else {
            // Add single ability if we have an odd number
            addAbilityDetails(doc, abilities[i], false);
        }
    }

    // Add page numbers to all pages
    const pageCount = doc.internal.pages.length;

    // Loop through each page to add headers and footers
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Header
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('SAGA Abilities', 14, 10);

        // Footer
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);

        // Current date in footer
        doc.text(today, 14, doc.internal.pageSize.height - 10);
    }

    // Save the PDF
    doc.save('saga-abilities.pdf');
};

// Add a cover page for the AbilityManual
const addAbilityManualCoverPage = (doc: jsPDF, abilityManual: AbilityManual) => {
    // Center point
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Add a decorative border
    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.7);
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

    // Add inner border
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.3);
    doc.rect(25, 25, pageWidth - 50, pageHeight - 50);

    // Add a header line
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(1);
    doc.line(30, 45, pageWidth - 30, 45);

    // Add a footer line
    doc.line(30, pageHeight - 45, pageWidth - 30, pageHeight - 45);

    // Title
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    const titleWidth = doc.getTextWidth(abilityManual.name);
    doc.text(abilityManual.name, (pageWidth - titleWidth) / 2, 80);

    // Subtitle - Character
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    const characterText = `Character: ${abilityManual.character}`;
    const characterWidth = doc.getTextWidth(characterText);
    doc.text(characterText, (pageWidth - characterWidth) / 2, 100);

    // Description with fancy box
    if (abilityManual.description) {
        // Calculate description box size
        doc.setFontSize(12);
        const splitDescription = doc.splitTextToSize(abilityManual.description, 160);
        const descriptionHeight = splitDescription.length * 5 + 10;

        // Draw description box
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(248, 248, 248);
        doc.roundedRect(
            (pageWidth - 170) / 2,
            110,
            170,
            descriptionHeight,
            3,
            3,
            'FD'
        );

        // Add description text
        doc.text(splitDescription, (pageWidth - 160) / 2, 120);
    }

    // Ability count
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const abilityCountText = `Contains ${abilityManual.abilities.length} abilities`;
    const abilityCountWidth = doc.getTextWidth(abilityCountText);

    // Draw a badge for ability count
    const badgeWidth = abilityCountWidth + 20;
    const badgeHeight = 10;
    const badgeX = (pageWidth - badgeWidth) / 2;
    const badgeY = 160;

    doc.setFillColor(240, 240, 240);
    doc.setDrawColor(180, 180, 180);
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 5, 5, 'FD');

    doc.text(abilityCountText, (pageWidth - abilityCountWidth) / 2, badgeY + 7);

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const dateText = `Generated on ${new Date().toLocaleDateString()}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, (pageWidth - dateWidth) / 2, pageHeight - 30);
};

// Create a table of contents for the AbilityManual
const addTableOfContents = (doc: jsPDF, abilities: Ability[]) => {
    doc.addPage();

    // Add a header with title
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(0, 30, doc.internal.pageSize.width, 30);

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Table of Contents', 14, 20);

    // Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Create TOC entries
    let yPos = 40;
    const lineHeight = 7;

    // Add header row
    doc.setFont('helvetica', 'bold');
    doc.text('Ability Name', 14, yPos);
    doc.text('Level', 100, yPos);
    doc.text('Discipline', 140, yPos);
    doc.text('Page', doc.internal.pageSize.width - 25, yPos);

    // Add a line under headers
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(14, yPos + 2, doc.internal.pageSize.width - 14, yPos + 2);

    // Reset to normal text
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight * 2;

    // Create alternating row colors
    let isAlternateRow = false;

    abilities.forEach((ability, index) => {
        // Add a new page if needed
        if (yPos > doc.internal.pageSize.height - 20) {
            doc.addPage();

            // Add continuation header
            doc.setFillColor(240, 240, 240);
            doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');

            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(0, 30, doc.internal.pageSize.width, 30);

            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(60, 60, 60);
            doc.text('Table of Contents (continued)', 14, 20);

            // Reset position and styling
            yPos = 40;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            // Add header row
            doc.setFont('helvetica', 'bold');
            doc.text('Ability Name', 14, yPos);
            doc.text('Level', 100, yPos);
            doc.text('Discipline', 140, yPos);
            doc.text('Page', doc.internal.pageSize.width - 25, yPos);

            // Add a line under headers
            doc.setDrawColor(180, 180, 180);
            doc.setLineWidth(0.3);
            doc.line(14, yPos + 2, doc.internal.pageSize.width - 14, yPos + 2);

            // Reset to normal text
            doc.setFont('helvetica', 'normal');
            yPos += lineHeight * 2;
            isAlternateRow = false;
        }

        // Add alternating row background
        if (isAlternateRow) {
            doc.setFillColor(245, 245, 245);
            doc.rect(14, yPos - 5, doc.internal.pageSize.width - 28, lineHeight, 'F');
        }
        isAlternateRow = !isAlternateRow;

        // Calculate the page number based on two abilities per page
        const pageNum = Math.floor(index / 2) + 3; // Cover page + TOC + index, with 2 abilities per page

        // Ability name
        doc.text(ability.abilityName, 14, yPos);

        // Ability level and discipline
        doc.text(ability.abilityLevel, 100, yPos);
        doc.text(ability.abilityDiscipline, 140, yPos);

        // Page number
        doc.text(String(pageNum), doc.internal.pageSize.width - 25, yPos);

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

    // Add a header with title
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(0, 30, doc.internal.pageSize.width, 30);

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Abilities Summary', 14, 20);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total: ${abilityManual.abilities.length} abilities`, 14, 40);

    // Summary table
    formatAbilitiesTable(doc, abilityManual.abilities);

    // Detailed ability descriptions - two abilities per page
    for (let i = 0; i < abilityManual.abilities.length; i += 2) {
        if (i + 1 < abilityManual.abilities.length) {
            // Add two abilities per page when possible
            addAbilityDetails(doc, abilityManual.abilities[i], false);
            addAbilityDetails(doc, abilityManual.abilities[i + 1], true);
        } else {
            // Add single ability if we have an odd number
            addAbilityDetails(doc, abilityManual.abilities[i], false);
        }
    }

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
        doc.text(`Page ${i - 1} of ${pageCount - 1}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);

        // Current date
        const today = new Date().toLocaleDateString();
        doc.text(today, 14, doc.internal.pageSize.height - 10);
    }    // Save the PDF
    const filename = `${abilityManual.name ? abilityManual.name.toLowerCase().replace(/\s+/g, '-') : 'ability-manual'}.pdf`;
    doc.save(filename);

    return filename;
};
