export interface Application {
  id: number;
  userId: number;
  job_id: number;
  title: string;
  coverLetter?: string;
  resume_path?: string;
  createdAt: string;
  updatedAt?: string;
}
