using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ProjetoBludata_ItamarJunior.Repository
{
    public class FactoryConnection
    {
        public static IDbConnection Connection
        {
            get
            {
                return new SqlConnection(Helpers.Global.StringConnection);
            }
        }
    }
}