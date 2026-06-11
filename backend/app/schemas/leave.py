from datetime import date, datetime, timedelta

from pydantic import BaseModel, Field, model_validator

from app.models.leave import LeaveType


class LeaveCreate(BaseModel):
    start_date: date
    end_date: date
    leave_type: LeaveType = LeaveType.SANADLE
    reason: str = Field(min_length=3, max_length=500)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date <= self.start_date:
            raise ValueError("End date must be greater than start date")
        # Start date should not be in the past
        today = date.today()
        if self.start_date < today:
            raise ValueError("Start date cannot be in the past")
        # End date must be within 30 days from today
        max_allowed = today + timedelta(days=30)
        if self.end_date > max_allowed:
            raise ValueError("End date cannot be more than 30 days from today")
        # Start date also should not be beyond the 30-day window
        if self.start_date > max_allowed:
            raise ValueError("Start date cannot be more than 30 days from today")
        return self


class LeaveUpdate(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    leave_type: LeaveType | None = None
    reason: str | None = Field(default=None, min_length=3, max_length=500)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValueError("End date must be greater than start date")
        # If provided, start_date should not be in the past
        today = date.today()
        if self.start_date and self.start_date < today:
            raise ValueError("Start date cannot be in the past")
        return self


class LeaveResponse(BaseModel):
    id: int
    user_id: int
    user_name: str | None = None
    employee_id: str | None = None
    department: str | None = None
    start_date: date
    end_date: date
    leave_type: str
    reason: str
    status: str
    approved_by: int | None = None
    approver_name: str | None = None
    duration_days: int
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_employees: int
    total_leaves: int
    pending_leaves: int
    approved_leaves: int
    rejected_leaves: int
