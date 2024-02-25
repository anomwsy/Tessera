using Tessera.Business.Interfaces;
using Tessera.Business.Repositories;
using Tessera.DataAccess.Models;
using Tessera.Presentation.Api.Dtos.Appeals;

namespace Tessera.Presentation.Api.Services
{
    public class AppealService
    {
        private readonly IAppealRepository _appealRepository;

        public AppealService(IAppealRepository appealRepository)
        {
            _appealRepository = appealRepository;
        }

        public AppealsIndexDto<AppealDto> GetAllAppeals(string reportsTo, string search, string column, bool? sort, int page = 1, int pageSize = 10)
        {
            var response = _appealRepository.GetAllAppeals(reportsTo, search, column, sort, page, pageSize)
                .Select(
                    e => new AppealDto
                    {
                        Id = e.Id,
                        Subject = e.Subject,
                        Description = e.Description,
                        Email = e.Email,
                        status = e.Tickets.Count() != 0,
                    }
                );

            return new AppealsIndexDto<AppealDto>
            {
                Data = response.ToList(),
                Search = search,
                Page = page,
                Column = column,
                Sort = sort,
                TotalPage = (int)Math.Ceiling((decimal)_appealRepository.TotalCountAppeals(search) / pageSize)
            };
        }

        public string InserAppeals(AppealInsertDto dto)
        {
            var newAppeal = new Appeal
            {
                Subject = dto.Subject,
                Description = dto.Description,
                Email = dto.Email
            };

            _appealRepository.InsertAppeal(newAppeal);
            return "Insert Success";

        }

        public AppealDetailDto GetAppeal(int id)
        {
            var appeal = _appealRepository.GetById(id);
            return new AppealDetailDto
            {
                Id = appeal.Id,
                Subject = appeal.Subject,
                Description = appeal.Description,
                Email = appeal.Email,
                status = appeal.Tickets.Count() != 0,
                TicketId = appeal.Tickets.Count() == 0 ? null : appeal.Tickets.ToList()[0].Id,
            };
        }

        public string RejectAppeal(int id)
        {

            _appealRepository.RejectAppeal(id);
            return "Appeal was deleted";
        }

    }
}
