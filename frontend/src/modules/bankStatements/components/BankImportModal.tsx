import { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadBankStatement } from '../services/bankStatementService';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { ParsedTransactionDto } from '../types/bankStatements';
import ReviewParsedTransactionsModal from './ReviewParsedTransactionsModal';
import Sparebank1Logo from '@/assets/Images/Sparebank1Logo.png';


interface BankImportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BankImportModal({ open, onClose }: BankImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransactionDto[] | null>(null);
  const [showReview, setShowReview] = useState(false);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.filter((item): item is TextItem => 'str' in item);
      const visualLines = groupByVisualLines(strings);
      text += visualLines.join('\n') + '\n';
    }

    return text;
  };

  function groupByVisualLines(items: TextItem[]): string[] {
    const linesMap: Map<number, TextItem[]> = new Map();

    for (const item of items) {
      const y = Math.round(item.transform[5] * 10); // rounded y position

      if (!linesMap.has(y)) {
        linesMap.set(y, []);
      }

      linesMap.get(y)!.push(item);
    }

    // Sort Y values (higher Y = higher on page, so reverse)
    const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);

    const lines: string[] = [];

    for (const y of sortedY) {
      const lineItems = linesMap.get(y)!;

      // Sort line items by X (left to right)
      lineItems.sort((a, b) => a.transform[4] - b.transform[4]);

      lines.push(lineItems.map((i) => i.str).join(' '));
    }

    return lines;
  }


  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a PDF file.');
      return;
    }

    try {
        setLoading(true);
        const extractedText = await extractTextFromPdf(file);
        const parsed = await uploadBankStatement(extractedText, 'sparebank1');
        setParsedTransactions(parsed);
        setShowReview(true);
        toast.success('File parsed successfully!');
    } catch (error) {
        toast.error('Upload failed.');
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md flex flex-col space-y-4">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-xl font-bold">Import Bank Statement</h2>
            <p className="text-sm text-base-content/70">
              Upload a PDF file to automatically parse your transactions.
            </p>
          </div>

          {/* File input */}
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input w-full"
          />

          {/* Supported bank visual */}
          <div className="flex items-center justify-center gap-2 border border-base-300 rounded-md p-2 bg-base-200 text-xs text-base-content/70">
            <img
              src={Sparebank1Logo}
              alt="SpareBank 1 Logo"
              className="h-5 w-auto opacity-80"
            />
            <span>SpareBank 1 supported</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn btn-sm btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleUpload} disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

      {showReview && parsedTransactions && (
        <ReviewParsedTransactionsModal
          transactions={parsedTransactions}
          onClose={() => {
            setShowReview(false);
            setParsedTransactions(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
