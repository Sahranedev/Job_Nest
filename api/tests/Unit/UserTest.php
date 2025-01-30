<?php

namespace App\Tests\Unit;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class UserTest extends KernelTestCase
{
    public function testEntityIsValid(): void
    {
        self::bootKernel();

        $container = static::getContainer();

        $user = new User();
        $user->setFirstName(firstName: 'Sahrane');
        $user->setLastName(lastName: 'Guassemi');
        $user->setEmail(email: 'sahrane@test.com');
        $user->setCreatedAt(createdAt: new \DateTimeImmutable());
        $user->setUpdatedAt(updatedAt: new \DateTimeImmutable());
        $errors = $container->get('validator')->validate($user);

        $this->assertCOunt(0, $errors);


    }

    public function testInvalidName()
    {
        self::bootKernel();

        $container = static::getContainer();

        $user = new User();
        $user->setFirstName(firstName: 'Sa');

        $errors = $container->get('validator')->validate($user);
        $this->assertCount(1, $errors);


    }
}
