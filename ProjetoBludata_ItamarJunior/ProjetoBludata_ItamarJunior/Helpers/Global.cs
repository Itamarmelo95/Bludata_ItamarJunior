using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjetoBludata_ItamarJunior.Helpers
{
    public class Global
    {
        public const string StringConnection = @"Data Source=(LocalDB)\MSSQLLocalDB;Initial Catalog=ProjetoBludata;Integrated Security=True;Pooling=False";
        public const string ReportConnectionStringManager = @"Data Source=(LocalDB)\MSSQLLocalDB;Initial Catalog=ProjetoBludata;Trusted_Connection=False; MultipleActiveResultSets=True";
        public const string UrlAPI = @"http://localhost:60435/api/";
    }
}