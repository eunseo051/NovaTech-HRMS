'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { POLICY_DOCS } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Upload, Download, FileText } from 'lucide-react'

const catStyle: Record<string, string> = {
  '인사규정': 'bg-primary/12 text-primary',
  '복리후생': 'bg-success/12 text-success',
  '근태규정': 'bg-warning/15 text-warning',
  '보안규정': 'bg-destructive/12 text-destructive',
}

export function PolicyUpload() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Upload className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">사규 업로드</p>
              <p className="text-xs text-muted-foreground">PDF, DOCX 파일을 업로드할 수 있습니다.</p>
            </div>
          </div>
          <Button size="sm">파일 선택</Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">사규 목록</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">제목</TableHead>
                <TableHead>분류</TableHead>
                <TableHead>버전</TableHead>
                <TableHead>업로드일</TableHead>
                <TableHead>파일크기</TableHead>
                <TableHead className="text-center">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {POLICY_DOCS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn('inline-flex rounded-md px-1.5 py-0.5 text-xs font-medium', catStyle[p.category])}>
                      {p.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.version}</TableCell>
                  <TableCell className="text-muted-foreground">{p.uploadDate}</TableCell>
                  <TableCell className="text-muted-foreground">{p.size}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button size="xs" variant="outline">
                        <Download className="size-3" />
                      </Button>
                      <Button size="xs" variant="ghost" className="text-destructive">삭제</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
