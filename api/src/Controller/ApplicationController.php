<?php

namespace App\Controller;

use App\Entity\Application;
use App\Repository\ApplicationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use App\Service\DateFormatterService;
use App\Event\ApplicationCreatedEvent;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;
use Psr\Log\LoggerInterface;




class ApplicationController extends AbstractController
{

    private DateFormatterService $dateFormatter;
    private LoggerInterface $logger;

    public function __construct(DateFormatterService $dateFormatter, LoggerInterface $logger)
    {
        $this->dateFormatter = $dateFormatter;
        $this->logger = $logger;
    }



    #[Route('api/user/{id}/applications', name: 'user_applications', methods: ['GET'])]
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

    #[Route('/api/applications', name: 'create_application', methods: ['POST'])]
    public function createApplication(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager,
        EventDispatcherInterface $eventDispatcher,
    ): JsonResponse {
        try {
            $application = $serializer->deserialize($request->getContent(), Application::class, 'json');

            $entityManager->persist($application);
            $entityManager->flush();

        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        $eventDispatcher->dispatch(new ApplicationCreatedEvent($application));
        $this->logger->info('ApplicationCreatedEvent dispatché');

        return $this->json(['message' => 'Candidature créée avec succès !'], Response::HTTP_CREATED);
    }


    #[Route('/api/user/{id}/applications-details', name: 'user_applications_with_jobs', methods: ['GET'])]
    public function getApplicationDetailsByUser(
        int $id,
        ApplicationRepository $applicationRepository,
    ): JsonResponse {
        $applications = $applicationRepository->findApplicationsWithJobDetailsByUserId($id);

        foreach ($applications as &$application) {
            $application['createdAt'] = $this->dateFormatter->formatDate($application['createdAt']);
        }

        return $this->json($applications);
    }



    #[Route('/user/{userId}/application/{applicationId}', name: 'delete_user_applications', methods: ['DELETE'])]
    public function deleteUserApplication(int $applicationId, int $userId, ApplicationRepository $applicationRepository): JsonResponse
    {
        $application = $applicationRepository->find($applicationId);

        if (!$application) {
            return $this->json(['error' => 'Candidature non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $applicationRepository->deleteUserApplicationById($userId, $applicationId);

        return $this->json(['message' => 'Candidature supprimée avec succès']);
    }

    #[Route('/user/{userId}/application/{applicationId}', name: 'update_user_application', methods: ['PUT'])]
    public function updateUserApplication(int $applicationId, int $userId, Request $request, ApplicationRepository $applicationRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $application = $applicationRepository->find($applicationId);
        if (!$application) {
            return $this->json(['error' => 'Candidature non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['cover_letter'])) {
            $application->setCoverLetter($data['cover_letter']);
        }

        $entityManager->persist($application);
        $entityManager->flush();

        return $this->json(['message' => 'Candidature mise à jour avec succès'], Response::HTTP_OK);
    }
}
