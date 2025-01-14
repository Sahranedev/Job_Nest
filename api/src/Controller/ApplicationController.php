<?php

namespace App\Controller;

use App\Entity\Application;
use App\Repository\ApplicationRepository;
use App\Repository\JobRepository;
use App\Repository\UserRepository;
use App\Service\MailerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ApplicationController extends AbstractController
{
    #[Route('/application', name: 'app_application')]
    public function index(): Response
    {
        return $this->render('application/index.html.twig', [
            'controller_name' => 'ApplicationController',
        ]);
    }

    #[Route('/user/{id}/applications', name: 'user_applications', methods: ['GET'])]
    public function getApplicationsByUser(ApplicationRepository $applicationRepository, int $id): JsonResponse
    {
        $applications = $applicationRepository->findApplicationsByUserId($id);
        return $this->json($applications);
    }

    #[Route('/job/{id}/applications', name: 'job_applications', methods: ['GET'])]
    public function getApplicationsByJob(ApplicationRepository $applicationRepository, int $id): JsonResponse
    {
        $applications = $applicationRepository->findApplicationsByJobId($id);
        return $this->json($applications);
    }

    #[Route('/applications', name: 'create_application', methods: ['POST'])]
    public function createApplication(
        Request $request,
        ApplicationRepository $applicationRepository,
        JobRepository $jobRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        MailerService $mailerService,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['job_id'], $data['user_id'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        try {
            $application = $applicationRepository->createApplication(
                $data,
                $jobRepository,
                $userRepository,
                $entityManager,
            );
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 404);
        }

        $mailerService->sendApplicationConfirmationToCandidate($application);
        $mailerService->sendNewApplicationNotificationToCompany($application);

        return new JsonResponse(['message' => 'Candidature créee avec succès !'], 201);
    }

    #[Route('/user/{id}/applications-details', name: 'user_applications_with_jobs', methods: ['GET'])]
    public function getApplicationDetailsByUser(
        int $id,
        ApplicationRepository $applicationRepository,
    ): JsonResponse {
        $applications = $applicationRepository->findApplicationsWithJobDetailsByUserId($id);
        return $this->json($applications);
    }

    #[Route('/user/{userId}/application/{applicationId}', name: 'delete_user_applications', methods: ['DELETE'])]
    public function deleteUserApplication(int $applicationId, int $userId, ApplicationRepository $applicationRepository): JsonResponse
    {
        $application = $applicationRepository->find($applicationId);

        if (!$application) {
            return new JsonResponse(['error' => 'Candidature non trouvée'], 404);
        }

        $applicationRepository->deleteUserApplicationById($userId, $applicationId);

        return new JsonResponse(['message' => 'Candidature supprimée avec succès']);
    }

    #[Route('/user/{userId}/application/{applicationId}', name: 'update_user_application', methods: ['PUT'])]
    public function updateUserApplication(int $applicationId, int $userId, Request $request, ApplicationRepository $applicationRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $application = $applicationRepository->find($applicationId);
        if (!$application) {
            return new JsonResponse(['error' => 'Candidature non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['cover_letter'])) {
            $application->setCoverLetter($data['cover_letter']);
        }

        $entityManager->persist($application);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Candidature mise à jour avec succès']);
    }
}
