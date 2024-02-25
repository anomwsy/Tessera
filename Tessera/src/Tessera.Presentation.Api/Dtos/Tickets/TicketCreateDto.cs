namespace Tessera.Presentation.Api.Dtos.Tickets
{
    public class TicketCreateDto
    {
        public int AppealId { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public DateTime DueDate { get; set; }
        public string Urgency { get; set; }
        public string AppointedTo { get; set; }
        public string CreatedBy { get; set; }
    }
}
