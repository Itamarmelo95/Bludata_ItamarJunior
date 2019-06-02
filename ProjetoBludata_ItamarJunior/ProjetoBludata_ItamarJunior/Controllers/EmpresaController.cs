using ProjetoBludata_ItamarJunior.Models;
using ProjetoBludata_ItamarJunior.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProjetoBludata_ItamarJunior.Controllers
{
    public class EmpresaController : Controller
    {
        EmpresaRepository db = new EmpresaRepository();

        [ActionName("BuscarEmpresas")]
        [HttpGet]
        public JsonResult BuscarEmpresas()
        {
            try
            {
                return Json(db.BuscarEmpresas(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        [ActionName("BuscarEmpresaUID")]
        [HttpGet]
        public JsonResult BuscarEmpresaUID(string EmpresaUID)
        {
            try
            {
                Guid _EmpresaUID = new Guid(EmpresaUID);
                return Json(db.BuscarEmpresaUID(_EmpresaUID), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        [ActionName("SalvarEmpresa")]
        [HttpPost]
        public JsonResult SalvarPatrimonio(Empresa empresa)
        {
            try
            {
                if (empresa.EmpresaUID == Guid.Empty)
                    empresa.EmpresaUID = Guid.NewGuid();


                db.SalvarEmpresa(empresa);
                return Json("OK");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }
    }
}