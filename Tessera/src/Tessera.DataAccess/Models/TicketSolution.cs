using System;
using System.Collections.Generic;

namespace Tessera.DataAccess.Models;

public partial class TicketSolution
{
    public string Id { get; set; } = null!;

    public string Details { get; set; } = null!;

    public DateTime CompletedDate { get; set; }

    public string CompletionStatus { get; set; } = null!;

    public DateTime? SupervisorReviewDate { get; set; }

    public string Supervisor { get; set; } = null!;

    public virtual Ticket IdNavigation { get; set; } = null!;

    public virtual Employee SupervisorNavigation { get; set; } = null!;
}
