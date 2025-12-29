'use client';

import { Copy, RefreshCw, ExternalLink, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import anime from 'animejs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ResultDisplay({ content, onReset }) {
    const [copied, setCopied] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        anime({
            targets: containerRef.current,
            opacity: [0, 1],
            scale: [0.95, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutElastic(1, .6)'
        });
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        // Simple text dump for now, stripping markdown could be an enhancement
        const splitText = doc.splitTextToSize(content, 180);
        doc.text(splitText, 10, 10);
        doc.save('ClarAI-Output.pdf');
    };

    return (
        <div ref={containerRef} className="glass-panel" style={{ padding: '0', overflow: 'hidden', marginTop: '40px', opacity: 0 }}>
            {/* Terminal Header */}
            <div style={{
                background: 'rgba(0, 243, 255, 0.1)',
                padding: '12px 20px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
                    <span style={{ marginLeft: '10px', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--primary-neon)', letterSpacing: '1px' }}>
                        OUTPUT_CONSOLE
                    </span>
                </div>

                <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleCopy} className="btn" style={{
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        color: copied ? '#28c840' : 'var(--text-main)',
                        fontSize: '0.75rem',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)'
                    }}>
                        {copied ? 'COPIED' : 'COPY'}
                    </button>
                    <button onClick={handleDownloadPDF} className="btn" style={{
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-main)',
                        fontSize: '0.75rem',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)'
                    }}>
                        PDF_EXPORT
                    </button>
                </div>
            </div>

            {/* Terminal Body - Markdown Content */}
            <div style={{ padding: '30px', background: 'rgba(5, 5, 10, 0.8)', minHeight: '300px' }}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
                                    <div style={{ background: '#1e1e1e', padding: '4px 12px', fontSize: '0.7rem', color: '#888', borderBottom: '1px solid #333' }}>
                                        {match[1].toUpperCase()}
                                    </div>
                                    <SyntaxHighlighter
                                        style={atomDark}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{ margin: 0, padding: '16px', background: 'transparent' }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            ) : (
                                <code className={className} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--secondary-neon)', fontFamily: 'monospace' }} {...props}>
                                    {children}
                                </code>
                            );
                        },
                        h1: ({ node, ...props }) => <h1 style={{ color: 'var(--primary-neon)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.8rem' }} {...props} />,
                        h2: ({ node, ...props }) => <h2 style={{ color: '#fff', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem' }} {...props} />,
                        h3: ({ node, ...props }) => <h3 style={{ color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.8rem', fontSize: '1.1rem' }} {...props} />,
                        p: ({ node, ...props }) => <p style={{ marginBottom: '1rem', color: '#d1d5db', lineHeight: '1.7' }} {...props} />,
                        ul: ({ node, ...props }) => <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem', listStyleType: 'disc', color: '#d1d5db' }} {...props} />,
                        ol: ({ node, ...props }) => <ol style={{ marginBottom: '1rem', paddingLeft: '1.5rem', listStyleType: 'decimal', color: '#d1d5db' }} {...props} />,
                        li: ({ node, ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: '4px solid var(--secondary-neon)', paddingLeft: '1rem', margin: '1.5rem 0', color: '#9ca3af', fontStyle: 'italic' }} {...props} />,
                        table: ({ node, ...props }) => <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid var(--glass-border)' }} {...props} /></div>,
                        th: ({ node, ...props }) => <th style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--primary-neon)', fontWeight: '600' }} {...props} />,
                        td: ({ node, ...props }) => <td style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#d1d5db' }} {...props} />,
                    }}
                >
                    {content}
                </ReactMarkdown>

                <span className="animate-pulse" style={{ display: 'inline-block', width: '8px', height: '15px', background: 'var(--primary-neon)', marginLeft: '5px', verticalAlign: 'middle' }}></span>
            </div>

            {/* Google Forms Feedback Section */}
            <div style={{ padding: '20px', background: 'rgba(10, 10, 20, 0.95)', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-dim)', marginBottom: '15px', fontSize: '0.9rem' }}>
                    DID THIS OUTPUT MEET PARAMETERS?
                </p>
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfTD6DI-_g2TMiDJXVQbdeIqFMtpYElSeNhqFbMGoqM6-GECA/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        padding: '10px 20px',
                        fontSize: '0.9rem'
                    }}
                >
                    <MessageSquare size={18} /> PROVIDE_FEEDBACK_DATA
                </a>
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '15px', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <button onClick={onReset} style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    margin: '0 auto'
                }}>
                    <RefreshCw className="w-4 h-4" /> REBOOT_SEQUENCE
                </button>
            </div>
        </div>
    );
}
