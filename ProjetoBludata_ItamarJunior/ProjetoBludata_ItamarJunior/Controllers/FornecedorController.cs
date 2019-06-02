using Newtonsoft.Json;
using ProjetoBludata_ItamarJunior.Models;
using ProjetoBludata_ItamarJunior.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProjetoBludata_ItamarJunior.Controllers
{
    public class FornecedorController : Controller
    {
        FornecedorRepository db = new FornecedorRepository();

        public ActionResult ListagemFornecedor()
        {
            return View();
        }

        [ActionName("BuscarFornecedores")]
        [HttpGet]
        public JsonResult BuscarFornecedores()
        {
            try
            {
                return Json(db.BuscarFornecedores(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [ActionName("FiltroFornecedores")]
        [HttpGet]
        public JsonResult FiltroFornecedores(string CGC, string Nome, DateTime DataInicial, DateTime DataFinal)
        {
            try
            {
                return Json(db.FiltroFornecedores(CGC, Nome, DataInicial, DataFinal), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        [ActionName("SalvarFornecedor")]
        [HttpPost]
        public JsonResult SalvarFornecedor(Fornecedor fornecedor)
        {
            try
            {
                fornecedor.FornecedorUID = Guid.NewGuid();

                db.SalvarFornecedor(fornecedor);
                return Json("OK");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }
    }
}