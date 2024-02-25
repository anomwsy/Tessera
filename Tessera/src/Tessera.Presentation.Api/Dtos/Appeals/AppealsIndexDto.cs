namespace Tessera.Presentation.Api;
public class AppealsIndexDto <T>
{
        public List<T> Data { get; set; }
        public int Page { get; set; }
        public int TotalPage { get; set; }
        public string Search { get; set; }
        public string Column { get; set; }
        public bool? Sort { get; set; }
}
