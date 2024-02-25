using System;
using System.Collections.Generic;

namespace Tessera.DataAccess.Models;

public partial class Appeal
{
    public int Id { get; set; }

    public string Subject { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Email { get; set; } = null!;

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
