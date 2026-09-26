import brandLogo from '../assets/buildnexdevLogo.png';

type BrandLogoProps = {
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    /** White plate behind logo (for dark backgrounds) */
    onDark?: boolean;
    /** Show BuildNexDev wordmark beside the icon (text is no longer in the PNG) */
    showWordmark?: boolean;
    showTagline?: boolean;
    alt?: string;
};

/** Official BuildNexDev icon mark (text removed from PNG) */
const BrandLogo = ({
    height = 48,
    className,
    style,
    onDark = false,
    showWordmark = false,
    showTagline = false,
    alt = 'BuildNexDev',
}: BrandLogoProps) => {
    const icon = (
        <img
            src={brandLogo}
            alt={alt}
            style={{ height, width: 'auto', objectFit: 'contain', display: 'block' }}
        />
    );

    const wordmarkSize = Math.max(14, Math.round(height * 0.38));

    const content = (
        <span
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: showTagline ? 'flex-start' : 'center',
                gap: showWordmark ? '0.65rem' : 0,
                ...style,
            }}
        >
            {onDark ? (
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#fff',
                        borderRadius: 10,
                        padding: '0.3rem 0.45rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.14)',
                    }}
                >
                    {icon}
                </span>
            ) : (
                icon
            )}
            {(showWordmark || showTagline) && (
                <span style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
                    {showWordmark && (
                        <span
                            style={{
                                fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
                                fontWeight: 800,
                                fontSize: wordmarkSize,
                                letterSpacing: '-0.03em',
                                color: onDark ? 'var(--background)' : 'var(--brand-navy)',
                                lineHeight: 1.1,
                            }}
                        >
                            Build<span style={{ color: onDark ? '#A78BFA' : 'var(--brand-cobalt)' }}>Nex</span>Dev
                        </span>
                    )}
                    {showTagline && (
                        <span
                            style={{
                                fontSize: Math.max(10, Math.round(height * 0.18)),
                                fontWeight: 500,
                                letterSpacing: '0.04em',
                                color: onDark ? 'rgba(226,232,240,0.7)' : 'var(--text-muted)',
                            }}
                        >
                            Building Digital Growth
                        </span>
                    )}
                </span>
            )}
        </span>
    );

    return content;
};

export const BrandWordmark = ({ size = '1.25rem', light = false }: { size?: string; light?: boolean }) => (
    <span
        style={{
            fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: size,
            letterSpacing: '-0.03em',
            color: light ? 'var(--background)' : 'var(--brand-navy)',
            lineHeight: 1,
        }}
    >
        Build<span style={{ color: light ? '#A78BFA' : 'var(--brand-cobalt)' }}>Nex</span>Dev
    </span>
);

export const BrandTagline = ({ light = false }: { light?: boolean }) => (
    <span
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: light ? 'rgba(226,232,240,0.75)' : 'var(--text-muted)',
        }}
    >
        <span style={{ flex: 1, height: 1, background: light ? 'rgba(148,163,184,0.45)' : 'var(--border-strong)', minWidth: 24 }} />
        Building Digital Growth
        <span style={{ flex: 1, height: 1, background: light ? 'rgba(148,163,184,0.45)' : 'var(--border-strong)', minWidth: 24 }} />
    </span>
);

export default BrandLogo;
