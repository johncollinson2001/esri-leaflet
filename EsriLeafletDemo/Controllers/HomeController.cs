using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EsriDemo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetPluginDescriptions()
        {
            return Json(new { 
                plugins = new List<object>() { 
                    // Panel controls only so far..
                    new { 
                        name = "Layer Control",
                        basePath = "/Plugins/LayerControl",
                        script = "/Scripts/layerControl.js",
                        css = "/Css/layerControl.css",
                        template = "/LayerControl.html"
                    },
                    new { 
                        name = "Editor",
                        basePath = "/Plugins/Editor",
                        script = "/Scripts/editor.js",
                        css = "/Css/editor.css",
                        template = "/Editor.html"
                    }
                    // Base map picker etc..? do we need toolbar control plugins??
                }
            }, JsonRequestBehavior.AllowGet);
        }
    }
}