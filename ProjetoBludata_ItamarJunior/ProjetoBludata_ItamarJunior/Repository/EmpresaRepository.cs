using Dapper;
using ProjetoBludata_ItamarJunior.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjetoBludata_ItamarJunior.Repository
{
    public class EmpresaRepository : FactoryConnection
    {
        public List<Empresa> BuscarEmpresas()
        {
            string query = @"SELECT * FROM Empresas";

            try
            {
                using (var cn = Connection)
                {
                    cn.Open();

                    List<Empresa> result = cn.Query<Empresa>(query).ToList();

                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Empresa BuscarEmpresaUID(Guid EmpresaUID)
        {
            string query = @"SELECT * FROM Empresas WHERE EmpresaUID = @EmpresaUID";

            try
            {
                using (var cn = Connection)
                {
                    cn.Open();

                    Empresa result = cn.Query<Empresa>(query, new { EmpresaUID }).FirstOrDefault();

                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<Empresa> BuscarEmpresaEmpresaUID(Guid empresaUID)
        {
            string query = @"SELECT * FROM Empresas WHERE EmpresaUID = @EmpresaUID";

            try
            {
                using (var cn = Connection)
                {
                    cn.Open();

                    List<Empresa> result = cn.Query<Empresa>(query, new { EmpresaUID = empresaUID }).ToList();

                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void SalvarEmpresa(Empresa empresa)
        {
            var query = @"INSERT INTO [Empresas]
                           ([EmpresaUID]
                           ,[NomeFantasia]
                           ,[CNPJ]
                           ,[UF])
                     VALUES
                           (@EmpresaUID
                           ,@NomeFantasia
                           ,@CNPJ
                           ,@UF)";

            using (var cn = Connection)
            {
                cn.Open();
                using (var tran = cn.BeginTransaction())
                {
                    try
                    {
                        cn.Query(query, new
                        {
                            empresa.EmpresaUID
                           ,
                            empresa.NomeFantasia
                           ,
                            empresa.CNPJ
                           ,
                            empresa.UF
                        }, tran);
                        tran.Commit();
                    }
                    catch (Exception)
                    {
                        tran.Rollback();
                        throw;
                    }

                }
            }
        }
    }
}