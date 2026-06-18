import * as XLSX from 'xlsx';
import { RSVP } from '../types/database';

export const exportToExcel = (rsvps: RSVP[], birthdayName: string) => {
  // Translate spreadsheet columns exactly to what is specified
  const rows = rsvps.map(r => {
    let statusText = 'Confirmou';
    if (r.attendance_status === 'maybe') statusText = 'Talvez';
    if (r.attendance_status === 'declined') statusText = 'Não vai';

    return {
      'Nome do convidado': r.guest_name,
      'WhatsApp': r.phone || 'Não informado',
      'Status': statusText,
      'Leva acompanhantes?': r.has_companions ? 'Sim' : 'Não',
      'Quantidade de acompanhantes': r.companions_count || 0,
      'Nomes dos acompanhantes': r.companions_names && r.companions_names.length > 0 
        ? r.companions_names.join(', ') 
        : '-',
      'Observações': r.notes || '-',
      'Data da confirmação': r.created_at 
        ? new Date(r.created_at).toLocaleDateString('pt-BR') + ' ' + new Date(r.created_at).toLocaleTimeString('pt-BR')
        : 'Histórico'
    };
  });

  // Create worksheet and workbook workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Confirmados');

  // Auto-fit column widths
  const maxCharacterWidths = [24, 16, 12, 16, 22, 35, 25, 20];
  worksheet['!cols'] = maxCharacterWidths.map(w => ({ wch: w }));

  // Write file
  const safeName = birthdayName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `RSVP_${safeName}_1Aninho.xlsx`;
  XLSX.writeFile(workbook, filename);
};
