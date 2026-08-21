// src/components/CourseCertificateModal.jsx — Official Verified Course Completion Certificate
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { AwardIcon, CheckCircleIcon, SparklesIcon, Share2Icon } from './Icons.jsx';

export default function CourseCertificateModal({ isOpen, onClose }) {
  const {
    user,
    totalCScoredMarks,
    totalCQuizMarksPossible,
    cOverallGradePct,
    completedQuizCount,
    isCCourseFullyCompleted,
  } = useAuth();
  const [studentName, setStudentName] = useState(user?.name || 'AlgoFlowX Scholar');
  const [isEditingName, setIsEditingName] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (user?.name) {
      setStudentName(user.name);
    }
  }, [user]);

  if (!isOpen) return null;

  // ── Eligibility Gate: Must have completed all 14 chapter quizzes ──
  if (!isCCourseFullyCompleted) {
    return (
      <div className="certificate-modal-overlay" onClick={onClose}>
        <div
          className="certificate-modal-content animate-pop-in"
          style={{ maxWidth: '560px', padding: '36px 32px', textAlign: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>
            Certificate of Completion Locked
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
            To be eligible for your verified <strong>C Master Academy Certificate</strong>, you must complete the 10-question examination for all 14 chapters.
          </p>

          {/* Progress Tracker */}
          <div style={{ background: '#070d1e', border: '1px solid #334155', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
              <span>Examinations Passed</span>
              <strong style={{ color: '#38bdf8' }}>{completedQuizCount || 0} of 14 Chapters ({Math.round(((completedQuizCount || 0) / 14) * 100)}%)</strong>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.round(((completedQuizCount || 0) / 14) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                }}
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
              Remaining: <strong>{Math.max(0, 14 - (completedQuizCount || 0))} Chapter Quizzes</strong> to unlock certificate.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-md btn-block"
            onClick={onClose}
          >
            Continue Course &amp; Take Quizzes &rarr;
          </button>
        </div>
      </div>
    );
  }

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const verificationId = `AFX-C-${Math.abs((studentName + issueDate).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).toUpperCase().padStart(8, '0')}`;

  const honorTitle = cOverallGradePct >= 90
    ? 'Distinction with Highest Honors'
    : cOverallGradePct >= 75
    ? 'Excellence & Mastery'
    : 'Successful Completion';

  // ── Render High-Resolution Certificate on Canvas & Download ──
  const handleDownloadPNG = () => {
    setDownloading(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;

    // Background gradient (Deep Academic Navy / Dark Slate)
    const bgGrad = ctx.createLinearGradient(0, 0, 1920, 1080);
    bgGrad.addColorStop(0, '#060d17');
    bgGrad.addColorStop(0.5, '#0b192c');
    bgGrad.addColorStop(1, '#050a12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1920, 1080);

    // Outer Gold Foil Guilloche Border
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, 1840, 1000);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 1810, 970);

    // Decorative corner diamonds
    const drawDiamond = (cx, cy, r, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r, cy);
      ctx.closePath();
      ctx.fill();
    };

    drawDiamond(55, 55, 12, '#eab308');
    drawDiamond(1865, 55, 12, '#eab308');
    drawDiamond(55, 1025, 12, '#eab308');
    drawDiamond(1865, 1025, 12, '#eab308');

    // Header Branding
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ALGOFLOWX ACADEMY • CERTIFICATE OF MASTERY', 960, 140);

    // Big Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 54px "Cinzel", Georgia, serif';
    ctx.fillText('CERTIFICATE OF COMPLETION', 960, 220);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText('This is to officially certify that', 960, 290);

    // Student Name (Highlight Gold)
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 64px "Cinzel", Georgia, serif';
    ctx.fillText(studentName.toUpperCase(), 960, 390);

    // Underline beneath name
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(600, 420);
    ctx.lineTo(1320, 420);
    ctx.stroke();

    // Course Description
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '26px Inter, sans-serif';
    ctx.fillText('has successfully mastered all 14 chapters and passed the comprehensive examinations for', 960, 480);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText('C Programming, Memory Architecture & Pointer Mastery', 960, 540);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px Inter, sans-serif';
    ctx.fillText(
      `Final Score: ${totalCScoredMarks} / ${totalCQuizMarksPossible || 140} Points (${cOverallGradePct || 100}%) — ${honorTitle}`,
      960,
      600
    );

    // Verification ID & Date Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(360, 660, 1200, 100);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(360, 660, 1200, 100);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`VERIFICATION ID : ${verificationId}`, 400, 715);

    ctx.textAlign = 'right';
    ctx.fillText(`DATE OF ISSUANCE : ${issueDate}`, 1520, 715);

    // Signatures
    ctx.textAlign = 'center';

    // Left Signature
    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(450, 890);
    ctx.lineTo(750, 890);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'italic bold 26px "Brush Script MT", cursive, Georgia';
    ctx.fillText('AlgoFlowX Director', 600, 875);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Academy Academic Dean', 600, 920);

    // Center Gold Seal
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(960, 870, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('VERIFIED', 960, 865);
    ctx.fillText('★ 2026 ★', 960, 885);

    // Right Signature
    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(1170, 890);
    ctx.lineTo(1470, 890);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'italic bold 26px "Brush Script MT", cursive, Georgia';
    ctx.fillText('DeepMind Standards', 1320, 875);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Curriculum Board', 1320, 920);

    // Trigger Download
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `AlgoFlowX-Certificate-${studentName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloading(false);
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const text = `I just earned my official Certificate in C Programming on AlgoFlowX! Score: ${cOverallGradePct}%. Verification ID: ${verificationId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="certificate-modal-overlay" onClick={onClose}>
      <div
        className="certificate-modal-content animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="cert-top-bar">
          <div className="cert-top-left">
            <span className="cert-badge-ribbon">
              <AwardIcon size={16} /> Official Certificate
            </span>
            <span className="cert-verification-tag font-mono">{verificationId}</span>
          </div>

          <div className="cert-actions-row">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopyLink}
            >
              <Share2Icon size={14} />
              <span>{copied ? '✓ Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handlePrint}
            >
              🖨️ Print
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleDownloadPNG}
              disabled={downloading}
            >
              📥 {downloading ? 'Generating...' : 'Download PNG'}
            </button>
            <button
              type="button"
              className="cert-close-btn"
              onClick={onClose}
              aria-label="Close certificate"
            >
              &times;
            </button>
          </div>
        </div>

        {/* ── Preview Certificate Card ── */}
        <div className="certificate-document-preview">
          <div className="cert-inner-frame">
            {/* Corner Embellishments */}
            <div className="cert-corner top-left">✦</div>
            <div className="cert-corner top-right">✦</div>
            <div className="cert-corner bottom-left">✦</div>
            <div className="cert-corner bottom-right">✦</div>

            {/* Header */}
            <div className="cert-header-section">
              <div className="cert-org-logo">
                <span className="logo-icon-chip">⚡</span>
                <span className="logo-title-text font-mono">ALGOFLOWX ACADEMY</span>
              </div>
              <h1 className="cert-main-title">Certificate of Completion</h1>
              <p className="cert-intro-text">This is proudly and officially awarded to</p>
            </div>

            {/* Student Name */}
            <div className="cert-name-section">
              {isEditingName ? (
                <div className="cert-name-input-group">
                  <input
                    type="text"
                    className="cert-name-input"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    autoFocus
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-xs"
                    onClick={() => setIsEditingName(false)}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="cert-name-display" onClick={() => setIsEditingName(true)}>
                  <span className="student-fullname">{studentName}</span>
                  <span className="name-edit-hint" title="Click to edit name">✎</span>
                </div>
              )}
              <div className="cert-name-line" />
            </div>

            {/* Course & Grade Details */}
            <div className="cert-body-section">
              <p className="cert-accomplish-text">
                for demonstrating exceptional proficiency and successfully completing all 14 comprehensive chapters and examinations in
              </p>
              <h2 className="cert-course-name">
                C Programming, Memory Architecture &amp; Low-Level Mastery
              </h2>
              <div className="cert-score-pill font-mono">
                <span>Final Score: <strong>{totalCScoredMarks} / {totalCQuizMarksPossible || 140} Marks</strong> ({cOverallGradePct || 100}%)</span>
                <span className="pill-dot">&bull;</span>
                <span className="text-accent"><strong>{honorTitle}</strong></span>
              </div>
            </div>

            {/* Footer Verification & Signatures */}
            <div className="cert-footer-section">
              <div className="cert-signature-block">
                <div className="cert-sign-script">AlgoFlowX Director</div>
                <div className="cert-sign-line" />
                <div className="cert-sign-title">Academic Board Dean</div>
              </div>

              <div className="cert-seal-badge">
                <div className="seal-outer-gold">
                  <div className="seal-inner">
                    <span className="seal-star">★</span>
                    <span className="seal-text">VERIFIED</span>
                    <span className="seal-year">2026</span>
                  </div>
                </div>
              </div>

              <div className="cert-signature-block">
                <div className="cert-sign-script">DeepMind Standards</div>
                <div className="cert-sign-line" />
                <div className="cert-sign-title">Curriculum Standards Director</div>
              </div>
            </div>

            <div className="cert-meta-bottom font-mono">
              <span>ISSUED: {issueDate}</span>
              <span>•</span>
              <span>VERIFY: {verificationId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
