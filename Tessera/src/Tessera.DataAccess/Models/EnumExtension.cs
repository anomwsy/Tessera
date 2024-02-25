using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tessera.DataAccess.Models
{
    public static class EnumExtension
    {
        private static Dictionary<Role, string> _roleLabels = new Dictionary<Role, string>
        {
            {Role.Admin, "Administrator"},
            {Role.TechSupport, "Tech Support"},
            {Role.Manager, "Manager"}
        };

        public static string GetLabel(this Role role)
        {
            return _roleLabels[role];
        }
    }
}
