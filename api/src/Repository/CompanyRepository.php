<?php

namespace App\Repository;

use App\Entity\Company;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\UserRepository;
use App\Entity\User;

/**
 * @extends ServiceEntityRepository<Company>
 */
class CompanyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Company::class);
    }

    public function getCompanies(): array
    {
        return $this->createQueryBuilder('company')
            ->select('company.id, company.name, company.description, company.website')
            ->getQuery()
            ->getResult();
    }

    public function createOneCompany(array $data, UserRepository $userRepository, EntityManagerInterface $entityManager): Company
    {
        if (!isset($data['name'], $data['description'], $data['website'], $data['user_id'])) {
            throw new \InvalidArgumentException('Données manquantes');
        }

        $user = $userRepository->find($data['user_id']);
        if (!$user) {
            throw new \Exception('Utilsateur non trouvé');
        }

        $company = new Company();
        $company->setUser($user);
        $company->setName($data['name']);
        $company->setDescription($data['description']);
        $company->setWebsite($data['website']);
        $company->setCreatedAt(new \DateTimeImmutable());
        $company->setUpdatedAt(new \DateTimeImmutable());

        $entityManager->persist($company);
        $entityManager->flush();

        return $company;
    }
}