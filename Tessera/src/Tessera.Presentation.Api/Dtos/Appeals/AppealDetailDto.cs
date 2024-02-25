namespace Tessera.Presentation.Api.Dtos.Appeals
{
    public class AppealDetailDto
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public bool status { get; set; }
        public string? TicketId { get; set; }
    }
}
