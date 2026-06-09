from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.leave import Leave, LeaveStatus
from app.models.user import User, UserRole
from app.schemas.leave import DashboardStats, LeaveCreate, LeaveResponse, LeaveUpdate


def _to_response(leave: Leave) -> LeaveResponse:
    return LeaveResponse(
        id=leave.id,
        user_id=leave.user_id,
        user_name=leave.user.name if leave.user else None,
        employee_id=leave.user.employee_id if leave.user else None,
        department=leave.user.department if leave.user else None,
        start_date=leave.start_date,
        end_date=leave.end_date,
        leave_type=leave.leave_type.value,
        reason=leave.reason,
        status=leave.status.value,
        approved_by=leave.approved_by,
        approver_name=leave.approver.name if leave.approver else None,
        duration_days=leave.duration_days,
        created_at=leave.created_at,
    )


def create_leave(db: Session, user: User, data: LeaveCreate) -> LeaveResponse:
    leave = Leave(
        user_id=user.id,
        start_date=data.start_date,
        end_date=data.end_date,
        leave_type=data.leave_type,
        reason=data.reason,
        status=LeaveStatus.PENDING,
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    leave = (
        db.query(Leave)
        .options(joinedload(Leave.user), joinedload(Leave.approver))
        .filter(Leave.id == leave.id)
        .first()
    )
    return _to_response(leave)


def get_my_leaves(db: Session, user: User) -> list[LeaveResponse]:
    leaves = (
        db.query(Leave)
        .options(joinedload(Leave.user), joinedload(Leave.approver))
        .filter(Leave.user_id == user.id)
        .order_by(Leave.created_at.desc())
        .all()
    )
    return [_to_response(l) for l in leaves]


def get_all_leaves(db: Session, user: User) -> list[LeaveResponse]:
    query = db.query(Leave).options(
        joinedload(Leave.user), joinedload(Leave.approver)
    )

    if user.role == UserRole.ADMIN:
        leaves = query.order_by(Leave.created_at.desc()).all()
    elif user.role == UserRole.MANAGER:
        leaves = (
            query.filter(Leave.status == LeaveStatus.PENDING)
            .order_by(Leave.created_at.desc())
            .all()
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    return [_to_response(l) for l in leaves]


def update_leave(
    db: Session, user: User, leave_id: int, data: LeaveUpdate
) -> LeaveResponse:
    leave = (
        db.query(Leave)
        .options(joinedload(Leave.user), joinedload(Leave.approver))
        .filter(Leave.id == leave_id, Leave.user_id == user.id)
        .first()
    )
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave not found",
        )
    if leave.status != LeaveStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending leaves can be edited",
        )

    if data.start_date is not None:
        leave.start_date = data.start_date
    if data.end_date is not None:
        leave.end_date = data.end_date
    if data.leave_type is not None:
        leave.leave_type = data.leave_type
    if data.reason is not None:
        leave.reason = data.reason

    if leave.end_date <= leave.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be greater than start date",
        )

    db.commit()
    db.refresh(leave)
    return _to_response(leave)


def delete_leave(db: Session, user: User, leave_id: int) -> None:
    leave = (
        db.query(Leave)
        .filter(Leave.id == leave_id, Leave.user_id == user.id)
        .first()
    )
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave not found",
        )
    if leave.status != LeaveStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending leaves can be deleted",
        )
    db.delete(leave)
    db.commit()


def approve_leave(db: Session, manager: User, leave_id: int) -> LeaveResponse:
    leave = (
        db.query(Leave)
        .options(joinedload(Leave.user), joinedload(Leave.approver))
        .filter(Leave.id == leave_id)
        .first()
    )
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave not found",
        )
    if leave.user_id == manager.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Manager cannot approve own request",
        )
    if leave.status != LeaveStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending leaves can be approved",
        )

    leave.status = LeaveStatus.APPROVED
    leave.approved_by = manager.id
    db.commit()
    db.refresh(leave)
    return _to_response(leave)


def reject_leave(db: Session, manager: User, leave_id: int) -> LeaveResponse:
    leave = (
        db.query(Leave)
        .options(joinedload(Leave.user), joinedload(Leave.approver))
        .filter(Leave.id == leave_id)
        .first()
    )
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave not found",
        )
    if leave.user_id == manager.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Manager cannot reject own request",
        )
    if leave.status != LeaveStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending leaves can be rejected",
        )

    leave.status = LeaveStatus.REJECTED
    leave.approved_by = manager.id
    db.commit()
    db.refresh(leave)
    return _to_response(leave)


def get_dashboard_stats(db: Session) -> DashboardStats:
    total_employees = db.query(User).count()
    total_leaves = db.query(Leave).count()
    pending = db.query(Leave).filter(Leave.status == LeaveStatus.PENDING).count()
    approved = db.query(Leave).filter(Leave.status == LeaveStatus.APPROVED).count()
    rejected = db.query(Leave).filter(Leave.status == LeaveStatus.REJECTED).count()

    return DashboardStats(
        total_employees=total_employees,
        total_leaves=total_leaves,
        pending_leaves=pending,
        approved_leaves=approved,
        rejected_leaves=rejected,
    )
