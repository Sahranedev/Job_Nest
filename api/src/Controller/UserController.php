<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\UserRole;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;
use App\Event\RegistrationEvent;
use Psr\Log\LoggerInterface;


class UserController extends AbstractController
{
    private $userRepository;
    private $passwordHasher;
    private $logger;

    public function __construct(UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, LoggerInterface $logger)
    {
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
        $this->logger = $logger;
    }


    // Récupère l'utilsateur connecté
    #[Route('/api/user', name: 'api_user', methods: ['GET'])]
    public function getCurrentUser(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['error' => 'Requête non autorisée'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phoneNumber' => $user->getPhoneNumber(),
            'city' => $user->getCity(),
            'roles' => $user->getRoles(),
        ]);
    }
    #[Route('/users', name: 'api_users', methods: ['GET'])]
    public function getAllUsers(): JsonResponse
    {
        $users = $this->userRepository->findAll();

        $data = [];

        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'phoneNumber' => $user->getPhoneNumber(),
                'city' => $user->getCity(),
                'address' => $user->getAddress(),
                'age' => $user->getAge(),
                'role' => $user->getRole(),
                'createdAt' => $user->getCreatedAt(),
                'updatedAt' => $user->getUpdatedAt(),
            ];
        }

        return $this->json($data);
    }


    // RECUPERER UN UTILISATEUR PAR SON ID
    #[Route('/api/user/{id}', name: 'api_user_by_id', methods: ['GET'])]
    public function getUserById(int $id): JsonResponse
    {
        $user = $this->userRepository->findOneById($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur introuvable'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phoneNumber' => $user->getPhoneNumber(),
            'city' => $user->getCity(),
            'address' => $user->getAddress(),
            'age' => $user->getAge(),
            'role' => $user->getRole(),
            'createdAt' => $user->getCreatedAt(),
            'updatedAt' => $user->getUpdatedAt(),

        ]);
    }
    // ENREGISTRER UN UTILISATEUR
    #[Route('/register', name: 'user_register', methods: ['POST'])]
    public function register(Request $request, EventDispatcherInterface $eventDispatcher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        //requestToArray

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setPhoneNumber($data['phoneNumber']);
        $user->setCity(city: $data['city']);
        $user->setAddress($data['address']);
        $user->setAge($data['age']);
        $user->setRole(UserRole::from($data['role']));
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());

        $this->userRepository->save($user);

        $eventDispatcher->dispatch(new RegistrationEvent($user));


        return $this->json(['message' => 'Utilisateur créé avec succès'], Response::HTTP_CREATED);
    }

    // UPLOAD DU CV

    #[Route('/api/upload-cv', name: 'user_upload_cv', methods: ['POST'])]
    public function uploadCv(Request $request, UserRepository $userRepository): JsonResponse
    {
        $user = $this->getUser();
        $file = $request->files->get('cv');

        if (!$file) {
            $this->logger->error('Aucun fichier fourni');
            return $this->json(['error' => 'Aucun fichier fourni'], 400);
        }

        $this->logger->info('Fichier reçu', ['filename' => $file->getClientOriginalName()]);

        $user->setCvFile(cvFile: $file);



        $userRepository->save($user);

        if ($user->getCvPath() === null) {
            $this->logger->error('Le fichier n\'a pas été traité correctement');
            return $this->json(['error' => 'Le fichier n\'a pas été traité correctement'], Response::HTTP_BAD_REQUEST);
        }

        $this->logger->info('CV uploadé avec succès', ['cvPath' => $user->getCvPath()]);

        return $this->json(['message' => 'CV uploadé avec succès'], Response::HTTP_CREATED);
    }



}
