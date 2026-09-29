export type JobStatus = 'queued' | 'processing' | 'done' | 'failed' | 'dead'

export type JobRow = {
  job_id: string
  document_id: string
  filename: string
  source_kind: 'pdf_text' | 'pdf_scanned' | 'photo'
  status: JobStatus
  attempts: number
  last_error: string | null
  created_at: string
  finished_at: string | null
  purchase_doc_id: string | null
  observations: number
  warnings: boolean
  doc_number: string | null
}

export type JobsOverview = {
  counts: Record<JobStatus, number>
  jobs: JobRow[]
}

export type Submitted = { document_id: string; job_id: string | null; duplicate: boolean }

export type UploadItem = {
  name: string
  state: 'uploading' | 'queued' | 'duplicate' | 'error'
  message?: string
}
