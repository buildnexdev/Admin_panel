import BrandLogo from './BrandLogo';

type BrandSpinnerProps = {
    /** full = splash screen; inline = page/route loader */
    variant?: 'full' | 'inline';
    message?: string;
    exiting?: boolean;
};

/** BuildNexDev branded loading spinner */
const BrandSpinner = ({
    variant = 'inline',
    message = 'Loading…',
    exiting = false,
}: BrandSpinnerProps) => {
    if (variant === 'full') {
        return (
            <div className={`bnx-spin-full${exiting ? ' bnx-spin-full--exit' : ''}`}>
                <div className="bnx-spin-full__bg">
                    <div className="bnx-spin-full__orb bnx-spin-full__orb--1" />
                    <div className="bnx-spin-full__orb bnx-spin-full__orb--2" />
                </div>
                <div className="bnx-spin-full__card">
                    <div className="bnx-spin-ring-wrap">
                        <div className="bnx-spin-ring" />
                        <div className="bnx-spin-ring-logo">
                            <BrandLogo height={48} />
                        </div>
                    </div>
                    <p className="bnx-spin-full__brand">
                        Build<span>Nex</span>Dev
                    </p>
                    <p className="bnx-spin-full__msg">{message}</p>
                    <div className="bnx-spin-bar">
                        <div className="bnx-spin-bar__fill" />
                    </div>
                </div>
                <style>{spinnerCss}</style>
            </div>
        );
    }

    return (
        <div className="bnx-spin-inline">
            <div className="bnx-spin-ring-wrap bnx-spin-ring-wrap--sm">
                <div className="bnx-spin-ring" />
                <div className="bnx-spin-ring-logo">
                    <BrandLogo height={28} />
                </div>
            </div>
            <p className="bnx-spin-inline__msg">{message}</p>
            <style>{spinnerCss}</style>
        </div>
    );
};

const spinnerCss = `
.bnx-spin-full {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #0A2214 0%, #0F2E1C 40%, var(--primary) 75%, #14603C 100%);
  background-size: 200% 200%;
  animation: bnxMeshMove 14s ease infinite;
  transition: opacity 0.7s ease, visibility 0.7s;
}
.bnx-spin-full--exit {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.bnx-spin-full__bg {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none;
}
.bnx-spin-full__orb {
  position: absolute; border-radius: 50%;
  filter: blur(4px);
}
.bnx-spin-full__orb--1 {
  width: 380px; height: 380px; top: -90px; right: -60px;
  background: radial-gradient(circle, rgba(110,231,183,0.4), transparent 70%);
  animation: bnxFloatUp 9s ease-in-out infinite;
}
.bnx-spin-full__orb--2 {
  width: 300px; height: 300px; bottom: -50px; left: -40px;
  background: radial-gradient(circle, rgba(27,122,78,0.45), transparent 70%);
  animation: bnxFloatUp 12s ease-in-out infinite reverse;
}
.bnx-spin-full__card {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 18px;
  padding: 2.25rem 2.5rem;
  min-width: min(320px, 90vw);
  text-align: center;
  box-shadow: 0 24px 48px rgba(0,0,0,0.35);
  animation: bnxSpinIn 0.5s ease both;
}
.bnx-spin-full__brand {
  margin: 1.1rem 0 0.35rem;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
  color: #0A2214;
  letter-spacing: -0.03em;
}
.bnx-spin-full__brand span {
  background: linear-gradient(90deg, var(--primary), #0E9F8E, #6EE7B7);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: bnxMeshMove 4s ease infinite;
}
.bnx-spin-full__msg {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}
.bnx-spin-bar {
  margin-top: 1.35rem;
  height: 3px;
  border-radius: 99px;
  background: var(--border);
  overflow: hidden;
}
.bnx-spin-bar__fill {
  height: 100%;
  width: 0;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--primary), #0E9F8E, #6EE7B7);
  animation: bnxBar 1.8s cubic-bezier(0.65,0,0.35,1) forwards;
}
.bnx-spin-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  width: 100%;
  min-height: 220px;
  padding: 2rem;
}
.bnx-spin-inline__msg {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}
.bnx-spin-ring-wrap {
  position: relative;
  width: 96px;
  height: 96px;
  margin: 0 auto;
}
.bnx-spin-ring-wrap--sm {
  width: 64px;
  height: 64px;
}
.bnx-spin-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid rgba(27, 122, 78, 0.15);
  border-top-color: var(--primary);
  border-right-color: #0E9F8E;
  border-bottom-color: #6EE7B7;
  animation: bnxSpin 0.85s linear infinite;
}
.bnx-spin-ring-wrap::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1px dashed rgba(27, 122, 78, 0.3);
  animation: bnxSpin 6s linear infinite reverse;
}
.bnx-spin-ring-logo {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
@keyframes bnxSpin {
  to { transform: rotate(360deg); }
}
@keyframes bnxBar {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes bnxSpinIn {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes bnxMeshMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@keyframes bnxFloatUp {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-18px); }
}
`;

export default BrandSpinner;
