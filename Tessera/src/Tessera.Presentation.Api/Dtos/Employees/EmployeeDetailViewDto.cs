using Microsoft.AspNetCore.Mvc.Rendering;

namespace Tessera.Presentation.Api.Dtos.Employees
{
    public class EmployeeDetailViewDto
    {
        public List<SelectListItem> Roles { get; set; }
        public List<SelectListItem> Managers { get; set; }
    }
}
