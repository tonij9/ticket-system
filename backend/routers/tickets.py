from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Ticket, User, TicketStatus, TicketPriority
from routers.auth import get_current_user

router = APIRouter()

class TicketCreate(BaseModel):
    subject: str
    description: str | None = None
    priority: TicketPriority = TicketPriority.MEDIUM

class TicketUpdate(BaseModel):
    subject: str | None = None
    description: str | None = None
    status: TicketStatus | None = None
    priority: TicketPriority | None = None
    assignee_id: int | None = None

class TicketResponse(BaseModel):
    id: int
    ticket_number: str
    subject: str
    description: str | None
    status: TicketStatus
    priority: TicketPriority
    requester_id: int
    assignee_id: int | None
    created_at: datetime
    updated_at: datetime
    review_date: datetime | None
    requester: dict
    assignee: dict | None

    class Config:
        from_attributes = True

def generate_ticket_number(db: Session) -> str:
    """Generate a unique ticket number"""
    last_ticket = db.query(Ticket).order_by(Ticket.id.desc()).first()
    if last_ticket:
        last_number = int(last_ticket.ticket_number.replace("#", ""))
        new_number = last_number + 1
    else:
        new_number = 933000
    return f"#{new_number}"

@router.post("/", response_model=TicketResponse)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket_number = generate_ticket_number(db)
    new_ticket = Ticket(
        ticket_number=ticket_number,
        subject=ticket_data.subject,
        description=ticket_data.description,
        priority=ticket_data.priority,
        requester_id=current_user.id
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return {
        **new_ticket.__dict__,
        "requester": {
            "id": new_ticket.requester.id,
            "username": new_ticket.requester.username,
            "email": new_ticket.requester.email,
            "full_name": new_ticket.requester.full_name
        },
        "assignee": None
    }

@router.get("/", response_model=List[TicketResponse])
def get_tickets(
    skip: int = 0,
    limit: int = 100,
    status: Optional[TicketStatus] = None,
    view: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Ticket)

    # Apply view filters
    if view == "my_inbox":
        query = query.filter(Ticket.assignee_id == current_user.id)
    elif view == "unsolved":
        query = query.filter(Ticket.status.in_([TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.PENDING]))
    elif view == "pending":
        query = query.filter(Ticket.status == TicketStatus.PENDING)

    # Apply status filter
    if status:
        query = query.filter(Ticket.status == status)

    tickets = query.order_by(Ticket.created_at.desc()).offset(skip).limit(limit).all()

    return [
        {
            **ticket.__dict__,
            "requester": {
                "id": ticket.requester.id,
                "username": ticket.requester.username,
                "email": ticket.requester.email,
                "full_name": ticket.requester.full_name
            },
            "assignee": {
                "id": ticket.assignee.id,
                "username": ticket.assignee.username,
                "email": ticket.assignee.email,
                "full_name": ticket.assignee.full_name
            } if ticket.assignee else None
        }
        for ticket in tickets
    ]

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return {
        **ticket.__dict__,
        "requester": {
            "id": ticket.requester.id,
            "username": ticket.requester.username,
            "full_name": ticket.requester.full_name
        },
        "assignee": {
            "id": ticket.assignee.id,
            "username": ticket.assignee.username,
            "full_name": ticket.assignee.full_name
        } if ticket.assignee else None
    }

@router.patch("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Update fields
    if ticket_data.subject is not None:
        ticket.subject = ticket_data.subject
    if ticket_data.description is not None:
        ticket.description = ticket_data.description
    if ticket_data.status is not None:
        ticket.status = ticket_data.status
    if ticket_data.priority is not None:
        ticket.priority = ticket_data.priority
    if ticket_data.assignee_id is not None:
        ticket.assignee_id = ticket_data.assignee_id

    ticket.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(ticket)

    return {
        **ticket.__dict__,
        "requester": {
            "id": ticket.requester.id,
            "username": ticket.requester.username,
            "full_name": ticket.requester.full_name
        },
        "assignee": {
            "id": ticket.assignee.id,
            "username": ticket.assignee.username,
            "full_name": ticket.assignee.full_name
        } if ticket.assignee else None
    }

@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Only allow admin or ticket creator to delete
    if not current_user.is_admin and ticket.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this ticket")

    db.delete(ticket)
    db.commit()
    return {"message": "Ticket deleted successfully"}

@router.get("/stats/counts")
def get_ticket_counts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get ticket counts for different views"""
    total = db.query(Ticket).count()
    my_inbox = db.query(Ticket).filter(Ticket.assignee_id == current_user.id).count()
    open_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.OPEN).count()
    unsolved = db.query(Ticket).filter(
        Ticket.status.in_([TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.PENDING])
    ).count()

    return {
        "total": total,
        "my_inbox": my_inbox,
        "open": open_tickets,
        "unsolved": unsolved
    }
