<?php
namespace App\Repository;

use App\Entity\Application;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\JobRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class ApplicationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, entityClass: Application::class);
    }

    public function findJobsByUserId(int $userId): array
    {
        return $this->createQueryBuilder('app')
            ->innerJoin('app.job', 'job')
            ->andWhere('app.user = :userId')
            ->setParameter('userId', $userId)
            ->select('job.id, job.title, job.description, job.location, job.type, job.status')
            ->getQuery()
            ->getResult();
    }

    public function findApplicationsByUserId(int $userId): array
    {
        return $this->createQueryBuilder('app')
            ->innerJoin('app.job', 'job')
            ->andWhere('app.user = :userId')
            ->setParameter('userId', $userId)
            ->select('app.id, app.cover_letter, app.createdAt, job.title')
            ->getQuery()
            ->getResult();
    }

    public function findApplicationsByJobId(int $jobId): array
    {
        return $this->createQueryBuilder('app')
            ->innerJoin('app.user', 'user')
            ->andWhere('app.job = :jobId')
            ->setParameter('jobId', $jobId)
            ->select('app.id, app.cover_letter, app.createdAt, user.firstName, user.lastName')
            ->getQuery()
            ->getResult();
    }

    public function findApplicationsWithJobDetailsByUserId(int $userId): array
    {
        return $this->createQueryBuilder('app')
            ->innerJoin('app.job', 'job') // Jointure avec l'entité Job
            ->andWhere('app.user = :userId') // Condition pour filtrer les candidatures de l'utilisateur
            ->setParameter('userId', $userId) // Paramètre utilisateur
            ->select('app.id, app.cover_letter, app.createdAt, job.id AS job_id, job.title, job.location, job.type, job.status, app.resume_path')
            ->orderBy('app.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function deleteUserApplicationById(int $userId, int $id): void
    {
        $this->createQueryBuilder('app')
            ->delete()
            ->where('app.user = :userId')
            ->andWhere('app.id = :id')
            ->setParameter('userId', $userId)
            ->setParameter('id', $id)
            ->getQuery()
            ->execute();
    }

    public function modifyUserApplicationById(int $userId, int $applicationId): void
    {
        $this->createQueryBuilder('app')
            ->update()
            ->where('app.user = :userId')
            ->andWhere('app.id = :applicationId')
            ->setParameter('userId', $userId)
            ->setParameter('applicationId', $applicationId)
            ->getQuery()
            ->execute();
    }

    public function createApplication(array $data, JobRepository $jobRepository, UserRepository $userRepository, EntityManagerInterface $entityManager): Application
    {
        $job = $jobRepository->find($data['job_id']);
        $user = $userRepository->find($data['user_id']);

        if (!$job || !$user) {
            throw new \Exception('Job or User not found');
        }

        $application = new Application();
        $application->setJob($job);
        $application->setUser($user);
        if (isset($data['cover_letter'])) {
            $application->setCoverLetter($data['cover_letter']);
        }
        if (isset($data['resume_path'])) {
            $application->setResumePath($data['resume_path']);
        }
        $application->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($application);
        $entityManager->flush();

        return $application;
    }
}
