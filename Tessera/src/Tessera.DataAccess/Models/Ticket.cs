using System;
using System.Collections.Generic;

namespace Tessera.DataAccess.Models;

public partial class Ticket
{
    public string Id { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Details { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public DateTime DueDate { get; set; }

    public string Urgency { get; set; } = null!;

    public string WorkStatus { get; set; } = null!;

    public string CreatedBy { get; set; } = null!;

    public string AppointedTo { get; set; } = null!;

    public int AppealId { get; set; }

    public virtual Appeal Appeal { get; set; } = null!;

    public virtual Employee AppointedToNavigation { get; set; } = null!;

    public virtual Employee CreatedByNavigation { get; set; } = null!;

    public virtual TicketSolution? TicketSolution { get; set; }
}
