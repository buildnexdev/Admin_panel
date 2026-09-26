import PageShell, { EmptyState } from '../../components/PageShell';

/** Placeholder for modules without a real backend yet — no fake metrics. */
export default function ComingSoon({ title = 'This module' }: { title?: string }) {
    return (
        <PageShell title={title} subtitle="Coming soon">
            <EmptyState
                title={`${title} is not available yet`}
                message="This module will be enabled once the backend APIs are ready. No sample data is shown."
            />
        </PageShell>
    );
}
