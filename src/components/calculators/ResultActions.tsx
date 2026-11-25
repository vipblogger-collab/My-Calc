import { useState } from 'react';
import { Check, Copy, Download, Printer, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.tsx';

interface ResultActionsProps {
  copyText: string;
  onReset?: () => void;
  csvData?: { filename: string; headers: string[]; rows: (string | number)[][] };
}

export function ResultActions({ copyText, onReset, csvData }: ResultActionsProps) {
  const { ui } = useAppContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCsvDownload = () => {
    if (!csvData) return;
    const escapeCell = (val: string | number) => {
      const s = String(val);
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };
    const content = [
      csvData.headers.map(escapeCell).join(','),
      ...csvData.rows.map((r) => r.map(escapeCell).join(',')),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = csvData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-medium text-[#1E293B] transition-colors whitespace-nowrap shrink-0"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-[#16A34A]" />
            <span className="text-[#16A34A]">{ui.actions.copied}</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{ui.actions.copyResults}</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-medium text-[#1E293B] transition-colors whitespace-nowrap shrink-0"
      >
        <Printer className="w-3.5 h-3.5 text-[#64748B]" />
        <span>{ui.actions.printPdf}</span>
      </button>

      {csvData && csvData.rows.length > 0 && (
        <button
          type="button"
          onClick={handleCsvDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-medium text-[#1E293B] transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-[#64748B]" />
          <span>{ui.actions.downloadCsv}</span>
        </button>
      )}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{ui.actions.reset}</span>
        </button>
      )}
    </div>
  );
}
