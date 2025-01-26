<?php

namespace App\Service;

use App\Entity\Application;
use Symfony\Component\Workflow\WorkflowInterface;

class ApplicationWorkflowService
{
    private WorkflowInterface $workflow;

    public function __construct(WorkflowInterface $applicationWorkflow)
    {
        $this->workflow = $applicationWorkflow;
    }

    public function applyTransition(Application $application, string $transition): void
    {
        if (!$this->workflow->can($application, $transition)) {
            throw new \LogicException(sprintf(
                "Le changement de status '%s' ne peut pas être appliqué dans l'état '%s'.",
                $transition,
                $application->getStatus(),
            ));
        }

        $this->workflow->apply($application, $transition);
    }
}
