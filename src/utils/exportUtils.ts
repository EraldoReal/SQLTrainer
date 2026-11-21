import type { QueryResult, SqlCellValue } from '@/types/sql';

function formatCellValue(value: SqlCellValue): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Uint8Array) {
    return `[BLOB ${value.byteLength} bytes]`;
  }
  return String(value);
}

function escapeCsvField(field: string): string {
  if (/[",\r\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Formats a QueryResult as an RFC-4180 CSV string with a UTF-8 BOM for Excel.
 */
export function formatResultAsCsv(result: QueryResult): string {
  const headerLine = result.columns.map((col) => escapeCsvField(col)).join(',');
  const dataLines = result.values.map((row) =>
    row.map((cell) => escapeCsvField(formatCellValue(cell))).join(',')
  );
  return `\uFEFF${[headerLine, ...dataLines].join('\r\n')}`;
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports a QueryResult to an RFC-4180 CSV file with UTF-8 BOM for Excel.
 */
export function exportToCsv(result: QueryResult, filename = 'query-result.csv'): void {
  const csv = formatResultAsCsv(result);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerBlobDownload(blob, filename);
}

/**
 * Renders a QueryResult as an engineering-style PNG table on an offscreen canvas
 * and copies it to the clipboard, falling back to a file download if clipboard
 * write is unavailable.
 */
export async function captureResultPng(
  result: QueryResult,
  filename = 'query-result.png'
): Promise<'clipboard' | 'download'> {
  const MAX_ROWS = 100;
  const rows = result.values.slice(0, MAX_ROWS);
  const truncated = result.values.length > MAX_ROWS;

  const paddingX = 14;
  const rowHeight = 30;
  const headerHeight = 36;
  const footerHeight = 28;
  const outerMargin = 16;

  const fontHeader = '600 13px Inter, system-ui, -apple-system, sans-serif';
  const fontCell = '13px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
  const fontFooter = '11px Inter, system-ui, -apple-system, sans-serif';

  const measureCanvas = document.createElement('canvas');
  const mCtx = measureCanvas.getContext('2d');
  if (!mCtx) {
    throw new Error('Canvas 2D context is not available.');
  }

  const colWidths = result.columns.map((col, colIdx) => {
    mCtx.font = fontHeader;
    let maxW = mCtx.measureText(col).width;
    mCtx.font = fontCell;
    for (const row of rows) {
      const val = row[colIdx];
      const text = val === null || val === undefined ? 'NULL' : formatCellValue(val);
      const w = mCtx.measureText(text).width;
      if (w > maxW) maxW = w;
    }
    return Math.min(Math.max(Math.ceil(maxW + paddingX * 2), 80), 360);
  });

  const tableWidth = Math.max(
    colWidths.reduce((sum, w) => sum + w, 0),
    280
  );
  const tableHeight = headerHeight + rows.length * rowHeight;
  const totalWidth = tableWidth + outerMargin * 2;
  const totalHeight = tableHeight + footerHeight + outerMargin * 2;

  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const canvas = document.createElement('canvas');
  canvas.width = totalWidth * dpr;
  canvas.height = totalHeight * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not available.');
  }
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  const startX = outerMargin;
  const startY = outerMargin;

  // Header background
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(startX, startY, tableWidth, headerHeight);

  // Header text
  ctx.font = fontHeader;
  ctx.fillStyle = '#f8fafc';
  ctx.textBaseline = 'middle';
  let curX = startX;
  for (let c = 0; c < result.columns.length; c++) {
    ctx.fillText(result.columns[c], curX + paddingX, startY + headerHeight / 2, colWidths[c] - paddingX * 2);
    curX += colWidths[c];
  }

  // Rows
  ctx.font = fontCell;
  for (let r = 0; r < rows.length; r++) {
    const rowY = startY + headerHeight + r * rowHeight;
    ctx.fillStyle = r % 2 === 0 ? '#0f172a' : '#131c31';
    ctx.fillRect(startX, rowY, tableWidth, rowHeight);

    curX = startX;
    for (let c = 0; c < result.columns.length; c++) {
      const val = rows[r][c];
      const isNull = val === null || val === undefined;
      const text = isNull ? 'NULL' : formatCellValue(val);
      ctx.fillStyle = isNull ? '#64748b' : '#e2e8f0';
      ctx.fillText(text, curX + paddingX, rowY + rowHeight / 2, colWidths[c] - paddingX * 2);
      curX += colWidths[c];
    }
  }

  // Grid borders
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(startX, startY, tableWidth, tableHeight);

  curX = startX;
  for (let c = 0; c < colWidths.length - 1; c++) {
    curX += colWidths[c];
    ctx.beginPath();
    ctx.moveTo(curX, startY);
    ctx.lineTo(curX, startY + tableHeight);
    ctx.stroke();
  }

  for (let r = 0; r <= rows.length; r++) {
    const lineY = startY + headerHeight + r * rowHeight;
    ctx.beginPath();
    ctx.moveTo(startX, lineY);
    ctx.lineTo(startX + tableWidth, lineY);
    ctx.stroke();
  }

  // Footer metadata
  ctx.font = fontFooter;
  ctx.fillStyle = '#94a3b8';
  const footerText = truncated
    ? `Showing ${MAX_ROWS} of ${result.rowCount} rows · ${result.executionTimeMs.toFixed(1)} ms`
    : `${result.rowCount} rows · ${result.executionTimeMs.toFixed(1)} ms`;
  ctx.fillText(footerText, startX, startY + tableHeight + footerHeight / 2 + 2);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Failed to encode PNG blob.'));
    }, 'image/png');
  });

  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.write === 'function' &&
    typeof ClipboardItem !== 'undefined'
  ) {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return 'clipboard';
    } catch {
      // Fall through to download
    }
  }

  triggerBlobDownload(blob, filename);
  return 'download';
}
