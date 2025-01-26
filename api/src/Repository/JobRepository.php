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
            ->select('job.id, job.title, job.description, job.location, job.type, job.status, company.name AS company_name', 'company.id AS company_id, job.createdAt')
            ->andWhere('job.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }



    public function searchJobs(?string $title, ?string $location): array
    {
        $qb = $this->createQueryBuilder('job')
            ->innerJoin('job.company', 'company')
            ->select('job.id, job.title, job.description, job.location, job.type, job.status, company.name AS company_name', 'company.id AS company_id');

        if ($title) {
            $qb->andWhere('job.title LIKE :title')
                ->setParameter('title', '%' . $title . '%');
        }

        if ($location) {
            $qb->andWhere('job.location LIKE :location')
                ->setParameter('location', '%' . $location . '%');
        }

        error_log('Requête SQL : ' . $qb->getQuery()->getSQL());
        error_log('Paramètres : ' . json_encode($qb->getParameters()));

        return $qb->getQuery()->getResult();
    }

}
