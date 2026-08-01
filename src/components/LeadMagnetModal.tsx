import React, { useState } from 'react';
import { EbookItem } from '../types/config';
import { FiX as X, FiBookOpen as BookOpen, FiDownload as Download, FiCheck as Check, FiFileText as FileText, FiExternalLink as ExternalLink } from 'react-icons/fi';
import { HiSparkles as Sparkles } from 'react-icons/hi2';
import confetti from 'canvas-confetti';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  ebooks?: EbookItem[];
}

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber,
  ebooks = []
}) => {
  const [userName, setUserName] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const defaultEbooks: EbookItem[] = ebooks.length > 0 ? ebooks : [
    {
      id: "ebook-sweet-recipes",
      title: "E-book 20 Doces Proteicos & Fit",
      description: "20 sobremesas anabólicas com tabela de macros (Brigadeiro de Whey, Mousse de Limão, Sorvete de Banana, Petit Gâteau e mais).",
      pdfUrl: "",
      badge: "⭐ 20 DOCES FIT",
      authorCredit: "Consultor Gabriel Lucas"
    },
    {
      id: "ebook-20-recipes",
      title: "E-book 20 Receitas Salgadas & Anabólicas",
      description: "20 receitas exclusivas com tabela de macros detalhada (Panqueca de Whey, Crepioca, Strogonoff Leve e mais).",
      pdfUrl: "",
      badge: "⭐ 20 RECEITAS FIT",
      authorCredit: "Consultor Gabriel Lucas"
    }
  ];

  const handleDownloadEbook = async (ebook: EbookItem) => {
    setDownloadingId(ebook.id);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {
      // fallback
    }

    // If direct custom PDF URL is provided by user (e.g. Google Drive, S3, Dropbox link)
    if (ebook.pdfUrl && ebook.pdfUrl.trim().length > 0) {
      window.open(ebook.pdfUrl, '_blank');
      setDownloadingId(null);
      return;
    }

    // Generate native vector PDF using @react-pdf/renderer (NO html2pdf)
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const documentProps = { userName: userName || 'Atleta VIP' };
      let docElement: React.ReactElement;

      if (ebook.id === 'ebook-sweet-recipes' || ebook.title.toLowerCase().includes('doce')) {
        const { SweetRecipesPDFDocument } = await import('./SweetRecipesPDFDocument');
        docElement = <SweetRecipesPDFDocument {...documentProps} />;
      } else if (ebook.id === 'ebook-3' || ebook.title.toLowerCase().includes('hipertrofia')) {
        const { EbookPDFDocument } = await import('./EbookPDFDocument');
        docElement = <EbookPDFDocument {...documentProps} />;
      } else {
        const { RecipesPDFDocument } = await import('./RecipesPDFDocument');
        docElement = <RecipesPDFDocument {...documentProps} />;
      }

      const blob = await pdf(docElement).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ebook.title.replace(/\s+/g, '_')}-Consultor-Gabriel.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.warn("Erro ao gerar PDF via @react-pdf/renderer:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <BookOpen color="var(--color-purple)" size={24} />
            <span>Biblioteca de E-books & PDFs Grátis</span>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Selecione o E-book que deseja baixar gratuitamente para alavancar seus treinos e nutrição.
          </p>

          {/* User Name input optional */}
          <div className="form-group">
            <label className="form-label">Seu Nome (Para personalizar o PDF)</label>
            <input
              type="text"
              placeholder="Ex: Gabriel Silva"
              className="form-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* List of PDF Ebooks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
            {defaultEbooks.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  position: 'relative'
                }}
              >
                {item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    background: 'var(--color-purple)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase'
                  }}>
                    {item.badge}
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    color: 'var(--color-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={22} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.35 }}>
                      {item.description}
                    </p>
                    {item.authorCredit && (
                      <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--color-purple)', marginTop: '4px', fontWeight: 600 }}>
                        📌 Créditos: {item.authorCredit}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => handleDownloadEbook(item)}
                  disabled={downloadingId === item.id}
                  style={{
                    background: 'var(--color-purple)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    padding: '10px 14px',
                    marginTop: '2px'
                  }}
                >
                  <Download size={16} />
                  <span>
                    {downloadingId === item.id
                      ? 'Baixando PDF...'
                      : item.pdfUrl
                        ? 'Abrir / Baixar PDF'
                        : 'Baixar E-book em PDF'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
