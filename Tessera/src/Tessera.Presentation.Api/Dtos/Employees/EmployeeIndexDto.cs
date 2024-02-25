namespace Tessera.Presentation.Api.Dtos.Employees
{
    public class EmployeeIndexDto<T>
    {
        public List<T> Employees { get; set; }
        public int Page { get; set; }
        public int TotalPage { get; set; }
        public string Search { get; set; }
        public string Column { get; set; }
        public bool? Sort { get; set; }
    }
}
