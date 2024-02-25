namespace Tessera.Presentation.Api.Dtos.Tickets
{
    public class TicketDetailDto
    {
        public string Id { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Details { get; set; } = null!;
        public string CreatedBy { get; set; } = null!;
        public string AppointedTo { get; set; } = null!;
        public string Urgency { get; set; } = null!;
        public string DateLine { get; set; } = null!;
        public string WorkStatus { get; set; } = null!;
        public string? Description { get; set; }
        public string? CompletedDate { get; set; }
        public string? CompletedStatus { get; set;}
        public string? ReviewDate { get; set; }
    }
}
