<?php

namespace App\Repository;

use App\Entity\Job;
use App\Enum\JobStatus;
use App\Enum\JobType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\CompanyRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @extends ServiceEntityRepository<Job>
 */
class JobRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Job::class);
    }

    public function getJobs(): array
    {
        return $this->createQueryBuilder('job')
            ->innerJoin('job.company', 'company')
            ->select('job.id, job.title, job.description, job.location, job.type, job.status, company.name AS company_name', 'company.id AS company_id', )
            ->getQuery()
            ->getResult();
    }

    public function getJobById(int $id): ?array
    {
        return $this->createQueryBuilder('job')
            ->innerJoin('job.company', 'company')
            ->select('job.id, job.title, job.description, job.location, job.type, job.status, company.name AS company_name', 'company.id AS company_id')
            ->andWhere('job.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function createJob(array $data, CompanyRepository $companyRepository, EntityManagerInterface $entityManager): Job
    {
        $company = $companyRepository->find($data['company_id']);

        if (!$company) {
            throw new \Exception('Company not found');
        }

        $job = new Job();
        $job->setTitle($data['title']);
        $job->setDescription($data['description']);
        $job->setLocation($data['location']);
        $job->setType(JobType::from($data['type']));
        $job->setStatus(JobStatus::DRAFT);
        $job->setCompany(company: $company);
        $job->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($job);
        $entityManager->flush();

        return $job;
    }
}
