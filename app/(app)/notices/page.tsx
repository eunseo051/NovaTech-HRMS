import { PageHeader } from '@/components/shared/page-header'
import { NoticeList } from '@/components/notices/notice-list'

export default function NoticesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="공지사항"
        description="전사 공지 및 인사/복지/시스템 안내를 확인합니다."
      />
      <NoticeList />
    </div>
  )
}
