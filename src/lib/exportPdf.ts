import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RSVP, EventSettings } from '../types/database';

export const exportToPdf = (rsvps: RSVP[], settings: EventSettings) => {
  // Create PDF document (A4 size, portrait)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const totalConfirmedGuests = rsvps
    .filter(r => r.attendance_status === 'confirmed')
    .reduce((acc, r) => acc + 1 + (r.companions_count || 0), 0);

  const totalMaybe = rsvps.filter(r => r.attendance_status === 'maybe').length;
  const totalDeclined = rsvps.filter(r => r.attendance_status === 'declined').length;

  // Header border / decorative frame in Sage Green
  doc.setDrawColor(143, 168, 155); // Sage Green #8FA89B
  doc.setLineWidth(1);
  doc.rect(7, 7, 196, 283); // Simple border on A4

  // Inside thin pink frame border
  doc.setDrawColor(241, 198, 209); // Light Pink #F1C6D1
  doc.setLineWidth(0.5);
  doc.rect(8.5, 8.5, 193, 280);

  // Top header text
  doc.setTextColor(74, 59, 50); // Branch Brown #4A3B32
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('CONVITE DIGITAL INFANTIL - BOSQUE ENCANTADO', 105, 18, { align: 'center' });

  // Main Event Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(230, 108, 134); // Pink #E66C86
  doc.text(`Aniversário de 1 Ano: ${settings.birthday_name}`, 105, 27, { align: 'center' });

  // Subtitle/Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(74, 59, 50);
  doc.text(`Data da Festa: ${settings.event_date} (${settings.weekday}) às ${settings.event_time}`, 105, 34, { align: 'center' });
  doc.text(`Local: ${settings.address}`, 105, 40, { align: 'center' });

  // Horizontal separator line
  doc.setDrawColor(143, 168, 155); // Sage Green
  doc.setLineWidth(0.5);
  doc.line(15, 45, 195, 45);

  // Statistics Summary Box
  doc.setFillColor(250, 246, 240); // Soft beige #FAF6F0
  doc.rect(15, 50, 180, 22, 'F');
  doc.rect(15, 50, 180, 22, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('RESUMO DE CONFIRMAÇÕES (RSVP)', 20, 56);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`• Confirmados: ${totalConfirmedGuests} pessoa(s) (incluindo acompanhantes)`, 20, 62);
  doc.text(`• Talvez compareçam: ${totalMaybe}`, 20, 68);
  doc.text(`• Não comparecerão: ${totalDeclined}`, 115, 62);
  doc.text(`• Total de RSVP respondidos: ${rsvps.length}`, 115, 68);

  // Build rows for the Table
  const tableHeaders = [
    'Convidado',
    'WhatsApp',
    'Status',
    'Acomp.?',
    'Qtd',
    'Nomes Acompanhantes',
    'Observações'
  ];

  const tableRows = rsvps.map(r => {
    let statusText = 'Confirmou';
    if (r.attendance_status === 'maybe') statusText = 'Talvez';
    if (r.attendance_status === 'declined') statusText = 'Não vai';

    return [
      r.guest_name,
      r.phone || 'Não informado',
      statusText,
      r.has_companions ? 'Sim' : 'Não',
      r.companions_count || 0,
      r.companions_names && r.companions_names.length > 0 
        ? r.companions_names.join(', ')
        : '-',
      r.notes || '-'
    ];
  });

  // Call AutoTable
  autoTable(doc, {
    head: [tableHeaders],
    body: tableRows,
    startY: 78,
    margin: { left: 15, right: 15 },
    theme: 'grid',
    styles: {
      fontSize: 9,
      textColor: [74, 59, 50], // #4A3B32
      lineColor: [241, 198, 209], // #F1C6D1
    },
    headStyles: {
      fillColor: [143, 168, 155], // Green #8FA89B
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [253, 248, 245], // soft pinkish peach
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35 },
      1: { cellWidth: 25 },
      2: { cellWidth: 20 },
      3: { cellWidth: 15 },
      4: { cellWidth: 10, halign: 'center' },
      5: { cellWidth: 45 },
      6: { cellWidth: 30 },
    }
  });

  // Footer note
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')} - Pág ${i} de ${pageCount}`, 105, 287, { align: 'center' });
  }

  // Save the PDF
  const filename = `RSVP_${settings.birthday_name.replace(/\s+/g, '_')}_1Aninho.pdf`;
  doc.save(filename);
};
