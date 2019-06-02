using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjetoBludata_ItamarJunior.Models
{
    public class Empresa
    {
        public Guid EmpresaUID { get; set; }

        public string NomeFantasia { get; set; }

        public string CNPJ { get; set; }

        public string UF { get; set; }
    }
}