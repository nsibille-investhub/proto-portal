'use client';
import { PageHeader } from '@/components/shared/PageHeader';
import { DocumentExplorer } from '@/components/widgets/DocumentExplorer';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import { documents } from '@/data/mock';
import { DOCUMENT_EXPLORER_CODE } from '@/lib/code-sources';

export default function DocumentsPage() {
  return (
    <div>
      <PageHeader title="Mes documents" />

      <WidgetWrapper title="DocumentExplorer" codeSource={DOCUMENT_EXPLORER_CODE}>
        <div style={{ paddingTop: 40 }}>
          <DocumentExplorer documents={documents} />
        </div>
      </WidgetWrapper>
    </div>
  );
}
