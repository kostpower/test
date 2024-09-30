from io import BufferedReader, FileIO

from quivr_api.modules.knowledge.dto.outputs import KnowledgeDTO
from quivr_api.modules.knowledge.entity.knowledge import KnowledgeDB
from quivr_api.modules.knowledge.repository.storage_interface import StorageInterface


class ErrorStorage(StorageInterface):
    async def upload_file_storage(
        self,
        knowledge: KnowledgeDB,
        knowledge_data: FileIO | BufferedReader | bytes,
        upsert: bool = False,
    ):
        raise SystemError

    def get_storage_path(
        self,
        knowledge: KnowledgeDB | KnowledgeDTO,
    ) -> str:
        if knowledge.id is None:
            raise ValueError("knowledge should have a valid id")
        return str(knowledge.id)

    async def remove_file(self, storage_path: str):
        raise SystemError

    async def download_file(self, knowledge: KnowledgeDB, **kwargs) -> bytes:
        raise NotImplementedError


class FakeStorage(StorageInterface):
    def __init__(self):
        self.storage = {}

    def get_storage_path(
        self,
        knowledge: KnowledgeDB | KnowledgeDTO,
    ) -> str:
        if knowledge.id is None:
            raise ValueError("knowledge should have a valid id")
        return str(knowledge.id)

    async def upload_file_storage(
        self,
        knowledge: KnowledgeDB,
        knowledge_data: FileIO | BufferedReader | bytes,
        upsert: bool = False,
    ):
        storage_path = f"{knowledge.id}"
        if not upsert and storage_path in self.storage:
            raise ValueError(f"File already exists at {storage_path}")
        if isinstance(knowledge_data, FileIO) or isinstance(
            knowledge_data, BufferedReader
        ):
            self.storage[storage_path] = knowledge_data.read()
        else:
            self.storage[storage_path] = knowledge_data

        return storage_path

    async def remove_file(self, storage_path: str):
        if storage_path not in self.storage:
            raise FileNotFoundError(f"File not found at {storage_path}")
        del self.storage[storage_path]

    # Additional helper methods for testing
    def get_file(self, storage_path: str) -> FileIO | BufferedReader | bytes:
        if storage_path not in self.storage:
            raise FileNotFoundError(f"File not found at {storage_path}")
        return self.storage[storage_path]

    def knowledge_exists(self, knowledge: KnowledgeDB | KnowledgeDTO) -> bool:
        return self.get_storage_path(knowledge) in self.storage

    def clear_storage(self):
        self.storage.clear()

    async def download_file(self, knowledge: KnowledgeDB, **kwargs) -> bytes:
        storage_path = self.get_storage_path(knowledge)
        return self.storage[storage_path]
