<?php
namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $user): void
    {
        $entityManager = $this->getEntityManager();
        $entityManager->persist($user);
        $entityManager->flush();
    }

    public function findOneById(int $id): ?User
    {
        return $this->find($id);
    }
}