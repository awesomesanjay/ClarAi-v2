import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import anime from 'animejs';

const ClarAIForm = ({ onResult }) => {
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        primaryRequest: '',
        outputType: 'Text',
        audience: 'General',
        tone: 'Professional',
        length: 'Medium',
        context: ''
    });

    useEffect(() => {
        anime({
            targets: formRef.current.querySelectorAll('.anim-group'),
            translateY: [20, 0],
            opacity: [0, 1],
            delay: anime.stagger(100, { start: 500 }), // Stagger starting after 500ms
            easing: 'easeOutQuad'
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.primaryRequest.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                onResult(data.data);
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.primaryRequest.length >= 10;

    const inputStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: 'rgba(5, 5, 10, 0.6)',
        border: '1px solid var(--glass-border)',
        borderRadius: '4px',
        color: 'var(--text-main)',
        fontFamily: 'var(--font-body)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s ease'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        color: 'var(--primary-neon)',
        fontFamily: 'var(--font-heading)',
        fontSize: '0.85rem',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="glass-panel" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            {/* Holographic Border Effect */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--primary-neon), transparent)',
                opacity: 0.5
            }} />

            <div className="anim-group" style={{ marginBottom: '24px', opacity: 0 }}>
                <label htmlFor="primaryRequest" style={labelStyle}>PRIMARY INPUT_STREAM</label>
                <textarea
                    id="primaryRequest"
                    name="primaryRequest"
                    value={formData.primaryRequest}
                    onChange={handleChange}
                    placeholder="INITIALIZE REQUEST SEQUENCE..."
                    rows={4}
                    style={{ ...inputStyle, minHeight: '120px', border: '1px solid rgba(0, 243, 255, 0.3)' }}
                    required
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                    <small style={{ color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                        Minimum 10 chars required.
                    </small>
                    <small style={{ color: isFormValid ? 'var(--primary-neon)' : 'var(--text-dim)' }}>
                        STATUS: {isFormValid ? 'READY' : 'WAITING'}
                    </small>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="anim-group" style={{ opacity: 0 }}>
                    <label htmlFor="outputType" style={labelStyle}>FORMAT</label>
                    <select id="outputType" name="outputType" value={formData.outputType} onChange={handleChange} style={inputStyle}>
                        {['Text', 'Email', 'Code', 'Table', 'Bullet Points', 'Summary'].map(opt => (
                            <option key={opt} style={{ background: '#000' }}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div className="anim-group" style={{ opacity: 0 }}>
                    <label htmlFor="tone" style={labelStyle}>TONE_MODULATION</label>
                    <select id="tone" name="tone" value={formData.tone} onChange={handleChange} style={inputStyle}>
                        {['Professional', 'Casual', 'Witty', 'Cyberpunk', 'Enthusiastic'].map(opt => (
                            <option key={opt} style={{ background: '#000' }}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div className="anim-group" style={{ opacity: 0 }}>
                    <label htmlFor="length" style={labelStyle}>LENGTH</label>
                    <select id="length" name="length" value={formData.length} onChange={handleChange} style={inputStyle}>
                        {['Short', 'Medium', 'Long', 'Detailed'].map(opt => (
                            <option key={opt} style={{ background: '#000' }}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div className="anim-group" style={{ opacity: 0 }}>
                    <label htmlFor="audience" style={labelStyle}>TARGET_NODE</label>
                    <input
                        type="text"
                        id="audience"
                        name="audience"
                        value={formData.audience}
                        onChange={handleChange}
                        placeholder="e.g. Developers"
                        style={inputStyle}
                    />
                </div>
            </div>

            <div className="anim-group" style={{ marginBottom: '30px', opacity: 0 }}>
                <label htmlFor="context" style={labelStyle}>ADDITIONAL_CONTEXT_DATA</label>
                <textarea
                    id="context"
                    name="context"
                    value={formData.context}
                    onChange={handleChange}
                    placeholder="Inject additional parameters..."
                    rows={2}
                    style={inputStyle}
                />
            </div>

            <button
                type="submit"
                className="anim-group btn-primary"
                disabled={!isFormValid || loading}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', opacity: 0 }}
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" /> PROCESSING...
                    </>
                ) : (
                    <>
                        <Send size={18} /> EXECUTE GENERATION
                    </>
                )}
            </button>
        </form>
    );
};
export default ClarAIForm;
