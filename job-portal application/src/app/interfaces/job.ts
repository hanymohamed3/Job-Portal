export interface Job {
    job_id: string;
    job_title: string;
    company_name: string;
    location: string;
    country: string;
    job_type: string;
    job_description: string;
    education: string;
    experience: string;
    created_on: Date;
    applied_users: string[];
    applied_count: number;
    how_to_apply: string;
    company_id: string;
    puased:boolean;
}
