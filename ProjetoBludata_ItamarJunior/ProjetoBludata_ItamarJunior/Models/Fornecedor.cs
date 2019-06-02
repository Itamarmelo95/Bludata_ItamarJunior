using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjetoBludata_ItamarJunior.Models
{
    public class Fornecedor
    {
        public Guid FornecedorUID { get; set; }

        public Guid EmpresaUID { get; set; }

        public string Nome { get; set; }

        public string CGC { get; set; }

        public DateTime Data { get; set; }

        public TimeSpan Hora { get; set; }

        public List<TelefoneFornecedor> TelefonesFornecedor { get; set; }

        public Empresa Empresa { get; set; }

        public string RG { get; set; }

        public DateTime DataNascimento { get; set; }
        
    }
}