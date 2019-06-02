using System.Web;
using System.Web.Mvc;

namespace ProjetoBludata_ItamarJunior
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
