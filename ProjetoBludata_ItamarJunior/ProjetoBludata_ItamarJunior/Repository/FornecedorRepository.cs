using Dapper;
using ProjetoBludata_ItamarJunior.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjetoBludata_ItamarJunior.Repository
{
    public class FornecedorRepository : FactoryConnection
    {
        public List<Fornecedor> BuscarFornecedores()
        {
            string queryFornecedor = @"SELECT * FROM Fornecedores";

            string queryTelefonesFornecedor = @"SELECT * FROM Telefones_Fornecedor WHERE FornecedorUID = @FornecedorUID";

            string queryEmpresaFornecedor = @"SELECT * FROM Empresas WHERE EmpresaUID = @EmpresaUID";

            try
            {
                using (var cn = Connection)
                {
                    cn.Open();

                    List<Fornecedor> fornecedores = cn.Query<Fornecedor>(queryFornecedor).ToList();

                    foreach (Fornecedor fornecedor in fornecedores)
                    {
                        fornecedor.TelefonesFornecedor = cn.Query<TelefoneFornecedor>(queryTelefonesFornecedor, new { FornecedorUID = fornecedor.FornecedorUID }).ToList();

                        fornecedor.Empresa = cn.Query<Empresa>(queryEmpresaFornecedor, new { EmpresaUID = fornecedor.EmpresaUID }).FirstOrDefault();

                    }

                    return fornecedores;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<Fornecedor> FiltroFornecedores(string CGC, string Nome, DateTime DataInicial, DateTime DataFinal)
        {

            string queryFornecedor = @"SELECT * FROM Fornecedores";

            string queryEmpresa = @"SELECT * FROM Empresas WHERE EmpresaUID = @EmpresaUID";


            if (!string.IsNullOrEmpty(CGC))
            {
                if (queryFornecedor.Contains("WHERE"))
                {
                    queryFornecedor += " AND CGC LIKE '%"+ CGC +"%'";
                }
                else
                {
                    queryFornecedor += " WHERE CGC LIKE '%"+ CGC +"%'";
                }

            }

            if (!string.IsNullOrEmpty(Nome))
            {
                if (queryFornecedor.Contains("WHERE"))
                {
                    queryFornecedor += " AND Nome LIKE '%" + Nome + "%'";
                }
                else
                {
                    queryFornecedor += " WHERE Nome LIKE '%" + Nome + "%'";
                }
            }

            if (DataInicial != null && DataFinal != null)
            {
                if (queryFornecedor.Contains("WHERE"))
                {
                    queryFornecedor += " AND Data BETWEEN '" + DataInicial.ToShortDateString() + "' AND '" + DataFinal.ToShortDateString()+"'";
                }
                else
                {
                    queryFornecedor += " WHERE Data BETWEEN '" + DataInicial.ToShortDateString() + "' AND '" + DataFinal.ToShortDateString()+"'";
                }

            }

            try
            {
                using (var cn = Connection)
                {
                    cn.Open();

                    List<Fornecedor> fornecedores = cn.Query<Fornecedor>(queryFornecedor, new { CGC, Nome, DataInicial, DataFinal }).ToList();

                    foreach (Fornecedor fornecedor in fornecedores)
                    {

                        fornecedor.Empresa = cn.Query<Empresa>(queryEmpresa, new { EmpresaUID = fornecedor.EmpresaUID }).FirstOrDefault();

                    }

                    return fornecedores;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void SalvarFornecedor(Fornecedor fornecedor)
            {
            var queryFornecedor = @"INSERT INTO [Fornecedores]
                                     ([FornecedorUID]
                                     ,[EmpresaUID]
                                     ,[Nome]
                                     ,[CGC]
                                     ,[Data]
                                     ,[Hora]
                                     ,[RG]
                                     ,[DataNascimento])
                                    VALUES
                                     (@FornecedorUID
                                     ,@EmpresaUID
                                     ,@Nome
                                     ,@CGC
                                     ,@Data
                                     ,@Hora
                                     ,@RG
                                     ,@DataNascimento)";

            var queryTelefonesFornecedor = @"INSERT INTO [Telefones_Fornecedor]
                                               ([FornecedorUID]
                                               ,[Telefone])
                                             VALUES
                                               (@FornecedorUID
                                               ,@Telefone)";

            using (var cn = Connection)
            {
                cn.Open();
                using (var tran = cn.BeginTransaction())
                {
                    try
                    {
                        cn.Query(queryFornecedor, new
                        {
                            fornecedor.FornecedorUID
                            ,
                            fornecedor.EmpresaUID
                            ,
                            fornecedor.Nome
                            ,
                            fornecedor.CGC
                            ,
                            fornecedor.RG
                            ,
                            fornecedor.DataNascimento
                            ,
                            Data = DateTime.Now
                            ,
                            Hora = DateTime.Now
                        }, tran);
                        if (fornecedor.TelefonesFornecedor != null)
                        {
                            foreach (TelefoneFornecedor telefoneFornecedor in fornecedor.TelefonesFornecedor)
                            {
                                cn.Query(queryTelefonesFornecedor, new
                                {
                                    fornecedor.FornecedorUID
                                    ,
                                    telefoneFornecedor.Telefone

                                }, tran);
                            }
                        }
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