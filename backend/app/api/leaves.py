from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.leave import DashboardStats, LeaveCreate, LeaveResponse, LeaveUpdate
from app.services import leave_service

router = APIRouter(prefix="/leaves", tags=["Leaves"])


@router.post("", response_model=LeaveResponse)
def create_leave(
    data: LeaveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return leave_service.create_leave(db, current_user, data)


@router.get("/my", response_model=list[LeaveResponse])
def my_leaves(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return leave_service.get_my_leaves(db, current_user)


@router.get("/all", response_model=list[LeaveResponse])
def all_leaves(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN.value, UserRole.MANAGER.value)
    ),
):
    return leave_service.get_all_leaves(db, current_user)


@router.get("/stats", response_model=DashboardStats)
def dashboard_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN.value)),
):
    return leave_service.get_dashboard_stats(db)


@router.put("/{leave_id}", response_model=LeaveResponse)
def update_leave(
    leave_id: int,
    data: LeaveUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return leave_service.update_leave(db, current_user, leave_id, data)


@router.delete("/{leave_id}")
def delete_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    leave_service.delete_leave(db, current_user, leave_id)
    return {"message": "Leave deleted successfully"}


@router.put("/{leave_id}/approve", response_model=LeaveResponse)
def approve_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN.value, UserRole.MANAGER.value)
    ),
):
    return leave_service.approve_leave(db, current_user, leave_id)


@router.put("/{leave_id}/reject", response_model=LeaveResponse)
def reject_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN.value, UserRole.MANAGER.value)
    ),
):
    return leave_service.reject_leave(db, current_user, leave_id)
