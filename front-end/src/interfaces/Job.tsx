export interface Job {
  id: number;
  company_id: number;
  company_name: string;
  title: string;
  description: string;
  location: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  applications: string[];
  job_id: number;
}
