export interface Application {
  id: number;
  userId: number;
  jobId: number;
  coverLetter?: string;
  resumePath?: string;
  createdAt: string;
  updatedAt?: string;
}
