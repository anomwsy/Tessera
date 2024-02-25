using System;
using System.Collections.Generic;

namespace Tessera.DataAccess.Models;

public partial class Employee
{
    public string Id { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string? LastName { get; set; }

    public string Email { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public DateTime BirthDate { get; set; }

    public DateTime HireDate { get; set; }

    public string JobTitle { get; set; } = null!;

    public string? ReportsTo { get; set; }

    public DateTime? DeletedDate { get; set; }

    public virtual ICollection<Employee> InverseReportsToNavigation { get; set; } = new List<Employee>();

    public virtual Employee? ReportsToNavigation { get; set; }

    public virtual ICollection<Ticket> TicketAppointedToNavigations { get; set; } = new List<Ticket>();

    public virtual ICollection<Ticket> TicketCreatedByNavigations { get; set; } = new List<Ticket>();

    public virtual ICollection<TicketSolution> TicketSolutions { get; set; } = new List<TicketSolution>();

    public virtual User? User { get; set; }
}
