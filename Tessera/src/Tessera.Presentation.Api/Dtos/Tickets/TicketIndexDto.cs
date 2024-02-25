namespace Tessera.Presentation.Api.Dtos.Tickets
{
    public class TicketIndexDto<T>
    {
        public List<T> Data { get; set; }
        public int Page { get; set; }
        public int TotalPage { get; set; }
        public string Search { get; set; }
        public string Column { get; set; }
        public bool? Sort { get; set; }
        public int InProgress { get; set; }
        public int Cancelled { get; set; }
        public int Completed { get; set; }

    }
}
