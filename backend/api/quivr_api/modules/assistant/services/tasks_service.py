from typing import Sequence
from uuid import UUID

from quivr_api.modules.dependencies import BaseService
from quivr_api.modules.assistant.dto.inputs import CreateTask
from quivr_api.modules.assistant.entity.task_entity import Task
from quivr_api.modules.assistant.repository.tasks import TasksRepository


class TasksService(BaseService[TasksRepository]):
    repository_cls = TasksRepository

    def __init__(self, repository: TasksRepository):
        self.repository = repository
        
    async def create_task(self, task: CreateTask, user_id: UUID) -> Task:
        return await self.repository.create_task(task, user_id)
    
    async def get_task_by_id(self, task_id: UUID) -> Task:
        return await self.repository.get_task_by_id(task_id)
    
    async def get_tasks_by_user_id(self, user_id: UUID) -> Sequence[Task]:
        return await self.repository.get_tasks_by_user_id(user_id)
    
    async def delete_task(self, task_id: int, user_id: UUID) -> None:
        return await self.repository.delete_task(task_id, user_id)