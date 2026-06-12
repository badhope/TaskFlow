from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, DateTime, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class Project(Base):
    """项目配置"""
    __tablename__ = "projects"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    git_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    local_path: Mapped[str] = mapped_column(String(500))
    config: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # 项目特定配置
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name='{self.name}')>"
