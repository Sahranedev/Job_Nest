<?php

namespace App\DataFixtures;

use App\Enum\UserRole;
use App\Enum\JobType;
use App\Enum\JobStatus; // Assurez-vous d’avoir cette enum créée si vous l’utilisez.
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use App\Entity\Company;
use App\Entity\Job;
use App\Entity\Application;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    const NB_USERS = 30;
    const NB_COMPANIES = 5;
    const NB_JOBS = 15;
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $users = [];
        for ($i = 0; $i < self::NB_USERS; $i++) {
            $user = new User();
            $user->setEmail($faker->unique()->email());
            $hashedPassword = $this->hasher->hashPassword($user, 'password');
            $user->setPassword($hashedPassword);
            $user->setCity($faker->unique()->city());
            $user->setAddress($faker->address());
            $user->setFirstName($faker->firstName());
            $user->setLastName($faker->lastName());
            $user->setPhoneNumber($faker->unique()->phoneNumber());
            $user->setAge($faker->numberBetween(18, 60));
            $user->setCreatedAt(new \DateTimeImmutable());
            $user->setUpdatedAt(new \DateTimeImmutable());
            $user->setRole($faker->randomElement(UserRole::cases()));

            $manager->persist($user);
            $users[] = $user;
        }


        $companies = [];
        foreach ($users as $user) {
            if ($user->getRole() === UserRole::RECRUITER) {
                $company = new Company();
                $company->setName($faker->company);
                $company->setDescription($faker->paragraph);
                $company->setWebsite($faker->url);
                $company->setUser($user);
                $company->setCreatedAt(new \DateTimeImmutable());
                $company->setUpdatedAt(new \DateTimeImmutable());

                $manager->persist($company);
                $companies[] = $company;
            }
        }

        // Création des Jobs
        $jobs = [];
        foreach ($companies as $company) {
            for ($j = 0; $j < mt_rand(1, self::NB_COMPANIES); $j++) {
                $job = new Job();
                $job->setTitle($faker->jobTitle());
                $job->setDescription($faker->paragraph());
                $job->setLocation($faker->city());
                $job->setType($faker->randomElement(JobType::cases()));

                $job->setStatus($faker->randomElement(JobStatus::cases()));

                $job->setCompany($company);
                $job->setCreatedAt(new \DateTimeImmutable());
                $job->setUpdatedAt(new \DateTimeImmutable());

                $manager->persist($job);
                $jobs[] = $job;
            }
        }

        foreach ($users as $user) {
            if ($user->getRole() === UserRole::CANDIDATE) {
                $randomJobs = $faker->randomElements($jobs, mt_rand(1, self::NB_JOBS));
                foreach ($randomJobs as $rJob) {
                    $application = new Application();
                    $application->setUser($user);
                    $application->setJob($rJob);
                    $application->setCoverLetter($faker->paragraph());
                    $application->setResumePath('path/to/resume.pdf');
                    $application->setCreatedAt(new \DateTimeImmutable());
                    $application->setUpdatedAt(new \DateTimeImmutable());

                    $manager->persist($application);
                }
            }
        }

        $manager->flush();
    }
}
