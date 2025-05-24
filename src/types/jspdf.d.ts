import 'jspdf';

// Extend jsPDF type definitions with AutoTable extensions
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number;
    };
    autoTable: (options: unknown) => jsPDF;
  }
}
